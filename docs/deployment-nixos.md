# NixOS deployment (with sops-nix)

This guide shows how to deploy `id.helpwave.de` on a NixOS host using
`services.keycloak`, pulling the theme and SPI jars from a GitHub release and injecting
secrets with [sops-nix].

[sops-nix]: https://github.com/Mic92/sops-nix

## 1. Jars per release

Every release attaches the following artifacts to the GitHub release:

| File                                       | Source folder (`keycloak-extensions/`) | What it is                                                |
|--------------------------------------------|----------------------------------------|-----------------------------------------------------------|
| `keycloak-theme-for-kc-26.2-and-above.jar` | (root, built by Keycloakify)           | Login + account theme `helpwave-id`.                      |
| `helpwave-captcha-<VER>.jar`               | `captcha/`                             | `FormAction` SPI: Cloudflare Turnstile CAPTCHA on signup. |
| `helpwave-policy-acceptance-<VER>.jar`     | `policy-acceptance/`                   | `RequiredAction` SPI: versioned policy consents (privacy + future forms). |
| `helpwave-picture-<VER>.jar`               | `picture/`                             | `RealmResourceProvider` SPI: avatar upload to S3 / R2.    |

`<VER>` is the SPI Maven version (`keycloak-extensions/pom.xml`, currently `0.3.0`),
which is independent from the theme/npm version in `package.json`. All four jars go into
Keycloak's `providers/` directory — `services.keycloak.plugins` does that for you.

## 2. Full NixOS module example

```nix
{ pkgs, config, ... }:
let
  domain = "id.helpwave.de";

  themeVersion = "0.6.0";   # ⇄ package.json version → release tag v0.6.0
  spiVersion   = "0.3.0";   # ⇄ keycloak-extensions/pom.xml

  release = file: sha:
    pkgs.fetchurl {
      name = file;
      url = "https://github.com/helpwave/id.helpwave.de/releases/download/v${themeVersion}/${file}";
      sha256 = sha;
    };

  themePlugin   = release "keycloak-theme-for-kc-26.2-and-above.jar"
                    "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  captchaPlugin = release "helpwave-captcha-${spiVersion}.jar"
                    "sha256-BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=";
  policyPlugin  = release "helpwave-policy-acceptance-${spiVersion}.jar"
                    "sha256-CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC=";
  picturePlugin = release "helpwave-picture-${spiVersion}.jar"
                    "sha256-DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD=";
in
{
  # ── sops-nix secrets ──────────────────────────────────────────────────────
  # See https://github.com/Mic92/sops-nix#1-add-a-secret on how to populate
  # secrets/keycloak.yaml. Each secret is decrypted at activation time and
  # written to /run/secrets/<name> with the configured owner & mode.

  sops.secrets."keycloak/r2-access-key"     = { owner = "keycloak"; mode = "0400"; };
  sops.secrets."keycloak/r2-secret-key"     = { owner = "keycloak"; mode = "0400"; };
  sops.secrets."keycloak/turnstile-secret"  = { owner = "keycloak"; mode = "0400"; };

  # An EnvironmentFile-friendly bundle used by the systemd unit below.
  sops.templates."keycloak.env".owner = "keycloak";
  sops.templates."keycloak.env".content = ''
    TURNSTILE_SECRET=${config.sops.placeholder."keycloak/turnstile-secret"}
  '';

  # ── keycloak service ──────────────────────────────────────────────────────
  services.keycloak = {
    enable = true;
    database.type = "postgresql";
    # database.passwordFile, hostname, sslCertificate etc. as you already have

    plugins = [
      themePlugin
      captchaPlugin
      policyPlugin
      picturePlugin
    ];

    settings = {
      hostname = domain;

      # ── Profile picture SPI ── (Cloudflare R2 example) ─────────────────────
      # SPI name "realm-restapi-extension" + provider id "helpwave-picture" →
      # this long key prefix is what Keycloak actually expects.
      "spi-realm-restapi-extension-helpwave-picture-endpoint" =
        "https://<account-id>.r2.cloudflarestorage.com";
      "spi-realm-restapi-extension-helpwave-picture-region" = "auto";
      "spi-realm-restapi-extension-helpwave-picture-bucket" = "helpwave-id-avatars";
      "spi-realm-restapi-extension-helpwave-picture-public-base-url" =
        "https://cdn.helpwave.de/avatars";

      # `_secret = "<path>"` is the standard NixOS keycloak module idiom; it
      # reads the file content at activation time and writes it into
      # keycloak.conf without ever placing the value in the Nix store.
      "spi-realm-restapi-extension-helpwave-picture-access-key" = {
        _secret = config.sops.secrets."keycloak/r2-access-key".path;
      };
      "spi-realm-restapi-extension-helpwave-picture-secret-key" = {
        _secret = config.sops.secrets."keycloak/r2-secret-key".path;
      };
    };
  };

  # ── Theme env vars ───────────────────────────────────────────────────────
  # Keycloakify reads KC_<NAME> at boot and exposes the value as
  # kcContext.properties.<NAME>. These can't go in services.keycloak.settings
  # (that only writes keycloak.conf), so we layer them via systemd:
  systemd.services.keycloak.serviceConfig = {
    EnvironmentFile = config.sops.templates."keycloak.env".path;
    Environment = [
      "KC_TURNSTILE_SITE_KEY=0x4AAAAAAAxxxxxxxxxxxxxxxx"        # public, OK in /nix/store
      "KC_PROFILE_PICTURE_API_URL=https://${domain}/realms/customer/helpwave-picture"
    ];
  };
}
```

> **Computing the sha256 placeholders**
>
> ```sh
> nix-prefetch-url --type sha256 \
>   "https://github.com/helpwave/id.helpwave.de/releases/download/v0.5.0/helpwave-picture-0.2.0.jar"
> ```
>
> Or just run `nixos-rebuild switch` once with all four `sha256-AAA…` placeholders, copy
> each `got: sha256-…` line out of the error message, and paste it back.

## 3. Wiring the auth flow (Turnstile + policy consents)

### Turnstile (registration FormAction)

Turnstile plugs into the *registration form* flow as a `FormAction`. Its config is **not**
read from `keycloak.conf` — it's per-flow so different realms can have different keys.

### Policy acceptance (RequiredAction)

The privacy consent (and any future policy form) is a `RequiredAction`, not a registration
form field. The provider auto-evaluates on every login: if the user's stored policy
version is missing or differs from the version configured on the realm, the user is
prompted to re-accept before the login completes. Bumping a policy version is therefore a
one-line realm-attribute change — no migration, no flow surgery.

User attributes the provider writes on success:

```
<id>_policy_accepted     = "true"
<id>_policy_accepted_at  = ISO-8601 timestamp
<id>_policy_version      = the version the user accepted
```

…where `<id>` is the policy id (`privacy` for now).

### Option A — Realm export (preferred, declarative)

Ship the flow + required-action enablement as part of a realm JSON and load it via
`services.keycloak.realmFiles = [ ./customer-realm.json ];`. The interesting bits:

```json
{
  "authenticationFlows": [
    {
      "alias": "registration-helpwave",
      "providerId": "basic-flow",
      "topLevel": true,
      "authenticationExecutions": [
        {
          "authenticator": "registration-page-form",
          "requirement": "REQUIRED",
          "flowAlias": "registration form helpwave",
          "autheticatorFlow": true
        }
      ]
    },
    {
      "alias": "registration form helpwave",
      "providerId": "form-flow",
      "topLevel": false,
      "authenticationExecutions": [
        { "authenticator": "registration-user-creation", "requirement": "REQUIRED" },
        { "authenticator": "registration-password-action", "requirement": "REQUIRED" },
        { "authenticator": "helpwave-turnstile",       "requirement": "REQUIRED",
          "authenticatorConfig": "turnstile-config" }
      ]
    }
  ],
  "authenticatorConfig": [
    {
      "alias": "turnstile-config",
      "config": {
        "turnstile.site.key": "0x4AAAAAAAxxxxxxxxxxxxxxxx",
        "turnstile.secret":   "$${env.TURNSTILE_SECRET}"
      }
    }
  ],
  "requiredActions": [
    {
      "alias":         "helpwave-privacy-acceptance",
      "name":          "Privacy Policy Acceptance (helpwave)",
      "providerId":    "helpwave-privacy-acceptance",
      "enabled":       true,
      "defaultAction": false
    }
  ],
  "attributes": {
    "helpwave.policy.privacy.url":     "https://helpwave.de/privacy",
    "helpwave.policy.privacy.version": "2024-01"
  },
  "registrationFlow": "registration-helpwave"
}
```

The `$${env.TURNSTILE_SECRET}` placeholder is resolved by Keycloak at import time from
the `EnvironmentFile` we mounted via sops-nix above — the secret value never sits on
disk in cleartext or in the Nix store.

### Option B — Click through the admin console

1. `Authentication → Required actions →` enable **Privacy Policy Acceptance (helpwave)**.
2. `Realm settings → General → Attributes` (or via the admin API): set
   `helpwave.policy.privacy.url` and `helpwave.policy.privacy.version`.

See also the manual setup section in [README.md](../README.md#1-enable-the-cloudflare-turnstile-and-privacy-form-actions).

## 4. Example `.env` (for local dev with `docker compose`)

A flat env file matching the same variables works for the docker-compose local stack
(`docker-compose.yml` in the repo root). Copy `.env.example` to `.env`, fill it in, then
`docker compose --env-file .env up`.

See [`.env.example`](../.env.example) at the repo root.

## 5. CORS / cookie note for the picture endpoint

The Account Console talks to `/realms/<realm>/helpwave-picture` from
`https://<domain>/realms/<realm>/account` — same origin, no extra CORS config needed. If
you host the account console under a different origin, add `POST`, `DELETE`,
`Authorization`, `credentials: include` to your reverse proxy's allow-list.

## 6. Updating

1. Bump `themeVersion` (and `spiVersion` if it changed — check release notes).
2. Replace the four `sha256-…` placeholders with the new digests.
3. `nixos-rebuild switch`. Keycloak restarts automatically because
   `services.keycloak.plugins` changed.
4. If the SPI's config keys changed, update `services.keycloak.settings` accordingly.

## 7. Smoke test

```sh
DOMAIN=id.helpwave.de

# Theme served?
curl -sf "https://${DOMAIN}/realms/customer/login-actions/registration" | grep -q "helpwave id"

# Turnstile widget rendered?
curl -sf "https://${DOMAIN}/realms/customer/login-actions/registration" | grep -q "cf-turnstile"

# Picture endpoint mounted? (expect 401 unauthenticated)
curl -sw '%{http_code}\n' -o /dev/null -X POST \
  "https://${DOMAIN}/realms/customer/helpwave-picture"
# → 401
```
