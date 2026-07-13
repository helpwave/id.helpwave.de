# [id.helpwave.de](https://id.helpwave.de)

Keycloak login theme using helpwave hightide components, plus the Keycloak SPI
extensions that power the registration flow (Cloudflare Turnstile + privacy
acceptance) and the profile picture upload.

## Contents

- [Features](#features)
- [Development](#development)
  - [Quick start](#quick-start)
  - [Building the theme](#building-the-theme)
  - [Building the Keycloak SPIs](#building-the-keycloak-spis)
  - [Local development with Docker](#local-development-with-docker)
  - [NixOS development](#nixos-development)
- [Deployment](#deployment)
  - [1. Install the plugins](#1-install-the-plugins)
  - [2. Enable the Cloudflare Turnstile form action](#2-enable-the-cloudflare-turnstile-form-action)
  - [3. Enable the policy-acceptance required actions](#3-enable-the-policy-acceptance-required-actions)
  - [4. Configure the profile picture storage](#4-configure-the-profile-picture-storage)
  - [5. Wire the theme to the SPIs](#5-wire-the-theme-to-the-spis)
- [Releases & version pinning](#releases--version-pinning)

## Features

- hightide component integration
- Realm indicator chip with deterministic color mapping
- Custom login, register, and forgot password pages
- Field-level validation matching hightide patterns
- **Cloudflare Turnstile** CAPTCHA on signup (`helpwave-turnstile` FormAction SPI)
- **Versioned policy consents** (privacy + future forms) via a reusable RequiredAction
  SPI (`helpwave-policy-acceptance`). Bumping the version on the realm re-prompts every
  user on next login; acceptance metadata is persisted on the user account.
- **Profile picture upload** with server-side scaling to multiple sizes and storage in any
  S3-compatible bucket (`helpwave-picture` Realm Resource SPI)

## Development

### Quick start

```bash
npm ci
npm run lint
npm run typecheck
```

### Building the theme

```bash
npm run build-keycloak-theme
```

This will generate the theme jar files in `dist_keycloak/`.

Note: You need [Maven](https://maven.apache.org/) installed to build the theme (Maven >= 3.1.1, Java >= 17).

- On macOS: `brew install maven`
- On Debian/Ubuntu: `sudo apt-get install maven`
- On Windows: `choco install openjdk` and `choco install maven`

### Building the Keycloak SPIs

The Java extensions live under `keycloak-extensions/` and are built with Maven:

```bash
cd keycloak-extensions
mvn -DskipTests package
```

This produces three jars (each plugin lives in its own folder so it can be built / shipped
independently):

- `captcha/target/helpwave-captcha-<v>.jar`
- `policy-acceptance/target/helpwave-policy-acceptance-<v>.jar`
- `picture/target/helpwave-picture-<v>.jar` (shaded with AWS SDK + Thumbnailator)

Drop all three (alongside the theme jar) into Keycloak's `providers/` directory and run
`kc.sh build`.

### Local development with Docker

Start keycloak and postgres services:

```bash
docker compose up
```

This will:

- Start postgres database
- Start keycloak on port 8080
- Import realms from `keycloak/import/`
- Mount the theme jar from `dist_keycloak/`

Default admin credentials:

- Username: `admin`
- Password: `admin`

For SPI configuration, copy [`.env.example`](.env.example) to `.env` and fill it in, then
`docker compose --env-file .env up`.

After starting the services, you can access:

- Customer realm login: http://localhost:8080/realms/customer/protocol/openid-connect/auth?client_id=account-console&redirect_uri=http://localhost:8080/realms/customer/account/&response_type=code&scope=openid
- Team realm login: http://localhost:8080/realms/team/protocol/openid-connect/auth?client_id=account-console&redirect_uri=http://localhost:8080/realms/team/account/&response_type=code&scope=openid
- Keycloak admin console: http://localhost:8080/admin

### NixOS development

For nixos users, see [docs/nixos.md](docs/nixos.md) for nix-shell setup instructions.

## Deployment

### 1. Install the plugins

Every release publishes the following jars (see
[Releases & version pinning](#releases--version-pinning) for how releases are cut):

| Jar                                              | Purpose                                          |
|--------------------------------------------------|--------------------------------------------------|
| `keycloak-theme-for-kc-26.2-and-above.jar`       | The login/account theme                          |
| `helpwave-captcha-<v>.jar`                       | Cloudflare Turnstile registration form action    |
| `helpwave-policy-acceptance-<v>.jar`             | Versioned policy consents (privacy + future)     |
| `helpwave-picture-<v>.jar`                       | Profile picture REST endpoint + R2/S3 upload     |

Copy all jars into Keycloak's `providers/` directory (or mount them into the container)
and run `kc.sh build` to rebuild the runtime, then start Keycloak normally.

**On NixOS**, don't do any of this by hand: a complete `services.keycloak` example —
including an auto-updated, hash-pinned plugin block and [sops-nix] secret handling —
lives in [docs/deployment-nixos.md](docs/deployment-nixos.md).

[sops-nix]: https://github.com/Mic92/sops-nix

### 2. Enable the Cloudflare Turnstile form action

1. Open the Keycloak admin console.
2. Go to **Authentication** → **Flows** and duplicate the built-in **registration** flow.
3. In your new copy, add an execution to the *registration form*:
   - `Cloudflare Turnstile (helpwave)` — set to **Required**
4. Click the gear on the execution to configure it:
   - **Turnstile**: set the `Turnstile site key` (public) and `Turnstile secret` (private).
     Get these from <https://dash.cloudflare.com/?to=/:account/turnstile>.
5. Set this flow as the realm's **Registration flow** binding.

### 3. Enable the policy-acceptance required actions

1. **Authentication** → **Required actions** → enable
   **Privacy Policy Acceptance (helpwave)**.
2. **Realm settings** → **General** → **Attributes**: set
   - `helpwave.policy.privacy.url` (defaults to `https://helpwave.de/privacy`)
   - `helpwave.policy.privacy.version` (defaults to `2024-01`)
3. On first login after registration, users are prompted to accept the policy. Their
   acceptance is stored on the user as `privacy_policy_accepted`,
   `privacy_policy_accepted_at` and `privacy_policy_version`. Bumping the realm version
   re-prompts every user on their next login.

Add more consent forms (e.g. terms of service, data-processing agreement) by adding a new
`AbstractPolicyAcceptanceRequiredActionFactory` subclass to
`keycloak-extensions/policy-acceptance/` and registering it in the `META-INF/services/`
file. The React `Terms.tsx` page renders the policy variant automatically when a
`policyId` attribute is set.

### 4. Configure the profile picture storage

The profile picture SPI accepts standard AWS S3 or Cloudflare R2 (any S3-compatible
backend). It exposes itself at:

```
/realms/{realm}/helpwave-picture
```

`POST` the raw image bytes (`Content-Type: image/jpeg|png|webp`, or `multipart/form-data`
from a `<input type="file">`) with a Bearer access token. The endpoint scales the image to
512/256/128/64 px JPEGs and writes them to the bucket. The primary URL is stored on the
user as the standard OpenID Connect `picture` attribute; thumbnail URLs as
`picture_thumb_64|128|256`. `DELETE` removes both the bucket objects and the attributes.

Configuration is read from Keycloak SPI settings (preferred — see
[docs/deployment-nixos.md](docs/deployment-nixos.md) for `_secret` integration) or
environment variables as a fallback:

| SPI key (`keycloak.conf` / NixOS `services.keycloak.settings`)            | Env var fallback                       | Required |
|---------------------------------------------------------------------------|----------------------------------------|----------|
| `spi-realm-restapi-extension-helpwave-picture-endpoint`                   | `HELPWAVE_PICTURE_ENDPOINT`            | R2 only  |
| `spi-realm-restapi-extension-helpwave-picture-region` (def `auto`)        | `HELPWAVE_PICTURE_REGION`              | no       |
| `spi-realm-restapi-extension-helpwave-picture-bucket`                     | `HELPWAVE_PICTURE_BUCKET`              | yes      |
| `spi-realm-restapi-extension-helpwave-picture-access-key`                 | `HELPWAVE_PICTURE_ACCESS_KEY`          | yes      |
| `spi-realm-restapi-extension-helpwave-picture-secret-key`                 | `HELPWAVE_PICTURE_SECRET_KEY`          | yes      |
| `spi-realm-restapi-extension-helpwave-picture-public-base-url`            | `HELPWAVE_PICTURE_PUBLIC_BASE_URL`     | yes      |
| `spi-realm-restapi-extension-helpwave-picture-max-bytes` (def 5 MiB)      | `HELPWAVE_PICTURE_MAX_BYTES`           | no       |

#### Example: Cloudflare R2 (raw env vars)

```bash
KC_SPI_REALM_RESTAPI_EXTENSION_HELPWAVE_PICTURE_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
KC_SPI_REALM_RESTAPI_EXTENSION_HELPWAVE_PICTURE_REGION=auto
KC_SPI_REALM_RESTAPI_EXTENSION_HELPWAVE_PICTURE_BUCKET=helpwave-id-avatars
KC_SPI_REALM_RESTAPI_EXTENSION_HELPWAVE_PICTURE_ACCESS_KEY=...
KC_SPI_REALM_RESTAPI_EXTENSION_HELPWAVE_PICTURE_SECRET_KEY=...
KC_SPI_REALM_RESTAPI_EXTENSION_HELPWAVE_PICTURE_PUBLIC_BASE_URL=https://cdn.helpwave.de/avatars
```

#### Example: AWS S3 (raw env vars)

```bash
KC_SPI_REALM_RESTAPI_EXTENSION_HELPWAVE_PICTURE_REGION=eu-central-1
KC_SPI_REALM_RESTAPI_EXTENSION_HELPWAVE_PICTURE_BUCKET=helpwave-id-avatars
KC_SPI_REALM_RESTAPI_EXTENSION_HELPWAVE_PICTURE_ACCESS_KEY=...
KC_SPI_REALM_RESTAPI_EXTENSION_HELPWAVE_PICTURE_SECRET_KEY=...
KC_SPI_REALM_RESTAPI_EXTENSION_HELPWAVE_PICTURE_PUBLIC_BASE_URL=https://avatars.helpwave.de
```

### 5. Wire the theme to the SPIs

Two Keycloakify env vars expose the SPI to the theme at render time:

| Env var                  | Purpose                                                                     |
|--------------------------|-----------------------------------------------------------------------------|
| `TURNSTILE_SITE_KEY`     | Optional fallback when the Turnstile authenticator config is not yet bound  |
| `PROFILE_PICTURE_API_URL`| Full URL to `/realms/<realm>/helpwave-picture`                              |

Set them in the Keycloak container, e.g.:

```bash
KC_TURNSTILE_SITE_KEY=0x4AAAAAAA...
KC_PROFILE_PICTURE_API_URL=https://id.helpwave.de/realms/customer/helpwave-picture
```

(Keycloakify reads `KC_<NAME>` and exposes it as `kcContext.properties.<NAME>`.)

## Releases & version pinning

Cutting and consuming a release is a single repeatable motion:

1. **Bump** `version` in `package.json` on `main` (and the Maven version in
   `keycloak-extensions/pom.xml` + module poms if the SPIs changed).
2. **CI releases**: the workflow builds the theme + SPIs and publishes a GitHub release
   `v<version>` with all jars attached.
3. **CI re-pins the docs**: the `update_nixos_plugin_pins` job then updates the
   `themeVersion` / `spiVersion` / `sha256` pins in
   [docs/deployment-nixos.md](docs/deployment-nixos.md) from the release assets' digests
   and commits the result to `main` — the checked-in NixOS snippet always matches the
   latest release. Because `main` only accepts pull requests, the pushing identity needs
   a ruleset bypass: either allow the workflow's `GITHUB_TOKEN` through, or set the
   Actions secret `NIX_PINS_DEPLOY_KEY` to a write-enabled deploy key and put
   **Deploy keys** on the bypass list — the job pushes over SSH when the secret is set.
4. **Deploy**: copy the refreshed pin block into your NixOS config and
   `nixos-rebuild switch`.

To re-pin the docs manually (e.g. against a specific release):

```bash
npm run update-nix-pins                  # latest release
npm run update-nix-pins -- --tag v0.6.0  # specific release
npm run update-nix-pins -- --check       # verify pins are current
```
