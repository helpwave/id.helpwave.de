# [id.helpwave.de](https://id.helpwave.de)

Keycloak login theme using helpwave hightide components, plus the Keycloak SPI
extensions that power the registration flow (Cloudflare Turnstile + privacy
acceptance) and the profile picture upload.

## Quick start

```bash
npm ci
```

## Development

### Linting and type checking

```bash
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
- `privacy/target/helpwave-privacy-<v>.jar`
- `picture/target/helpwave-picture-<v>.jar` (shaded with AWS SDK + Thumbnailator)

Drop all three (alongside the theme jar) into Keycloak's `providers/` directory and run
`kc.sh build`.

## Local development with Docker

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

### Verification URLs

After starting the services, you can access:

- Customer realm login: http://localhost:8080/realms/customer/protocol/openid-connect/auth?client_id=account-console&redirect_uri=http://localhost:8080/realms/customer/account/&response_type=code&scope=openid
- Team realm login: http://localhost:8080/realms/team/protocol/openid-connect/auth?client_id=account-console&redirect_uri=http://localhost:8080/realms/team/account/&response_type=code&scope=openid
- Keycloak admin console: http://localhost:8080/admin

## NixOS development

For nixos users, see [docs/nixos.md](docs/nixos.md) for nix-shell setup instructions.

## Features

- hightide component integration
- Realm indicator chip with deterministic color mapping
- Custom login, register, and forgot password pages
- Field-level validation matching hightide patterns
- **Cloudflare Turnstile** CAPTCHA on signup (`helpwave-turnstile` FormAction SPI)
- **Privacy policy** checkbox on signup with acceptance metadata stored on the user
  (`helpwave-privacy` FormAction SPI)
- **Profile picture upload** with server-side scaling to multiple sizes and storage in any
  S3-compatible bucket (`helpwave-picture` Realm Resource SPI)

---

## Deployment

The release workflow publishes the following jars on every version bump in `package.json`:

| Jar                                              | Purpose                                          |
|--------------------------------------------------|--------------------------------------------------|
| `keycloak-theme-for-kc-26.2-and-above.jar`       | The login/account theme                          |
| `helpwave-captcha-<v>.jar`                       | Cloudflare Turnstile registration form action    |
| `helpwave-privacy-<v>.jar`                       | Privacy acceptance form action + attribute store |
| `helpwave-picture-<v>.jar`                       | Profile picture REST endpoint + R2/S3 upload     |

Copy all jars into Keycloak's `providers/` directory (or mount them into the container)
and run `kc.sh build` to rebuild the runtime, then start Keycloak normally.

### 1. Enable the Cloudflare Turnstile and Privacy form actions

1. Open the Keycloak admin console.
2. Go to **Authentication** → **Flows** and duplicate the built-in **registration** flow.
3. In your new copy, add two executions to the *registration form*:
   - `Cloudflare Turnstile (helpwave)` — set to **Required**
   - `Privacy Policy Acceptance (helpwave)` — set to **Required**
4. Click the gear on each execution to configure it:
   - **Turnstile**: set the `Turnstile site key` (public) and `Turnstile secret` (private).
     Get these from <https://dash.cloudflare.com/?to=/:account/turnstile>.
   - **Privacy**: set the `Privacy policy URL` (defaults to `https://helpwave.de/privacy`)
     and an optional `Privacy policy version` string. Both are persisted on the user as
     `privacy_policy_accepted_at` and `privacy_policy_version` attributes.
5. Set this flow as the realm's **Registration flow** binding.

### 2. Configure the profile picture storage

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

### 3. Wire the theme to the SPIs

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

### 4. NixOS deployment

A complete `services.keycloak` example with [sops-nix] secret handling and the matching
admin-console steps lives in [docs/deployment-nixos.md](docs/deployment-nixos.md). For
local development with `docker compose`, copy [`.env.example`](.env.example) to `.env`
and fill in the values.

[sops-nix]: https://github.com/Mic92/sops-nix

### 5. Releases

Bump `version` in `package.json` on `main`. The CI workflow builds the theme + SPIs and
publishes a GitHub release with all four jars attached.
