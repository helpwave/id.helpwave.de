# NixOS deployment

This guide shows how to deploy `id.helpwave.de` on a NixOS host using
`services.keycloak`, fetching the theme and SPI jars from a GitHub release and wiring
credentials via the standard `_secret` pattern.

## 1. Jars published per release

Every release of this repository attaches the following artifacts to its GitHub release
(see CI workflow `.github/workflows/ci.yaml`):

| File                                              | Source module                 | Purpose                                                       |
|---------------------------------------------------|-------------------------------|---------------------------------------------------------------|
| `keycloak-theme-for-kc-26.2-and-above.jar`        | Keycloakify build             | Login + account theme (`helpwave-id`).                        |
| `helpwave-turnstile-authenticator-<VER>.jar`      | `turnstile-authenticator`     | `FormAction` SPI: Cloudflare Turnstile CAPTCHA on signup.     |
| `helpwave-privacy-acceptance-<VER>.jar`           | `privacy-acceptance`          | `FormAction` SPI: privacy checkbox + acceptance attributes.   |
| `helpwave-profile-picture-<VER>.jar`              | `profile-picture`             | `RealmResourceProvider` SPI: avatar upload to S3 / R2.        |

`<VER>` is the SPI Maven version (`keycloak-extensions/pom.xml`, currently `0.1.0`) — it
is independent from the npm/theme version in `package.json`.

All four jars are dropped into Keycloak's `providers/` directory. The
[`services.keycloak.plugins`][nixopts] option does exactly that for you.

[nixopts]: https://search.nixos.org/options?channel=25.11&query=services.keycloak.plugins

## 2. Full NixOS module example

```nix
{ pkgs, config, ... }:
let
  domain = "id.helpwave.de";

  themeVersion = "0.2.0";       # package.json version → release tag v0.2.0
  spiVersion = "0.1.0";         # keycloak-extensions/pom.xml version

  release = ver: file: sha:
    pkgs.fetchurl {
      name = file;
      url = "https://github.com/helpwave/id.helpwave.de/releases/download/v${ver}/${file}";
      sha256 = sha;
    };

  themePlugin   = release themeVersion "keycloak-theme-for-kc-26.2-and-above.jar"
                  "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

  turnstileSPI  = release themeVersion "helpwave-turnstile-authenticator-${spiVersion}.jar"
                  "sha256-BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=";

  privacySPI    = release themeVersion "helpwave-privacy-acceptance-${spiVersion}.jar"
                  "sha256-CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC=";

  pictureSPI    = release themeVersion "helpwave-profile-picture-${spiVersion}.jar"
                  "sha256-DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD=";
in
{
  services.keycloak = {
    enable = true;
    database.type = "postgresql";
    # ... database, hostname, tls etc. as you already have it

    plugins = [
      themePlugin
      turnstileSPI
      privacySPI
      pictureSPI
    ];

    settings = {
      hostname = domain;

      # ---- Profile picture SPI (Cloudflare R2 example) -----------------------
      #
      # The SPI name for RealmResourceProvider is "realm-restapi-extension".
      # Provider id is "helpwave-picture" (matches RealmResourceProviderFactory.getId()).
      # Hence the long key prefix below.

      "spi-realm-restapi-extension-helpwave-picture-endpoint" =
        "https://<account-id>.r2.cloudflarestorage.com";
      "spi-realm-restapi-extension-helpwave-picture-region" = "auto";
      "spi-realm-restapi-extension-helpwave-picture-bucket" = "helpwave-id-avatars";
      "spi-realm-restapi-extension-helpwave-picture-public-base-url" =
        "https://cdn.helpwave.de/avatars";

      # Secrets — file content is read at activation time, NOT committed to the Nix store
      "spi-realm-restapi-extension-helpwave-picture-access-key" = {
        _secret = "/run/keys/helpwave-r2-access-key";
      };
      "spi-realm-restapi-extension-helpwave-picture-secret-key" = {
        _secret = "/run/keys/helpwave-r2-secret-key";
      };
    };
  };

  # ---- Theme env vars (rendered into the React page via kcContext.properties) ----
  # services.keycloak.settings can only produce keys for keycloak.conf, so the
  # KC_<NAME>=<value> variables must be supplied via the systemd unit:
  systemd.services.keycloak.serviceConfig = {
    Environment = [
      "KC_TURNSTILE_SITE_KEY=0x4AAAAAAAxxxxxxxxxxxxxxxx"
      "KC_PROFILE_PICTURE_API_URL=https://${domain}/realms/customer/helpwave-picture"
    ];
    # Cloudflare Turnstile secret + R2 credentials are loaded via the secret
    # files referenced above; nothing further needed here.
  };

  # ---- Secrets provisioning (example using NixOS systemd tmpfiles) ----------
  # In production use agenix / sops-nix / deploy-rs vaults. The keycloak.service
  # only reads these at start; rotate by writing new content + systemctl restart.
  environment.etc."keycloak-secrets/.keep".text = "";
}
```

> **Computing the sha256 placeholders**
>
> ```sh
> nix-prefetch-url \
>   --type sha256 \
>   "https://github.com/helpwave/id.helpwave.de/releases/download/v0.2.0/keycloak-theme-for-kc-26.2-and-above.jar"
> ```
>
> Or, easier, run `nix build` once with the placeholder and copy the `got:` line from the
> error message into the expression.

## 3. Bootstrapping the authentication flow

Two of the SPIs (`Cloudflare Turnstile (helpwave)` and `Privacy Policy Acceptance
(helpwave)`) plug into the **registration flow** as `FormAction`s. Their config (Turnstile
site key + secret, privacy policy URL + version) is **not** read from `keycloak.conf` —
it is set per execution in the admin console so different realms can have different
keys. Two options:

### 3a. One-time admin console setup

1. Open `https://<domain>/admin`.
2. Pick your realm → **Authentication** → **Flows** → duplicate `registration`.
3. In the *registration form* sub-flow add two new executions and set both to
   **Required**:
   - `Cloudflare Turnstile (helpwave)`
   - `Privacy Policy Acceptance (helpwave)`
4. Click the gear ⚙️ on each, enter:
   - Turnstile: site key (public) + secret (private) from
     <https://dash.cloudflare.com/?to=/:account/turnstile>.
   - Privacy: URL (defaults to `https://helpwave.de/privacy`), version string
     (e.g. `2024-01`), both stored on every new user as
     `privacy_policy_accepted_at` + `privacy_policy_version` user attributes.
5. **Action** menu on the flow → *Bind* → *Registration flow*.

### 3b. Declarative realm export (preferred for NixOS)

Add `services.keycloak.realmFiles = [ ./helpwave-id-realm.json ];` and ship the
configured flow as part of the JSON export. Snippet of the relevant part of the export:

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
          "userSetupAllowed": false,
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
        { "authenticator": "helpwave-turnstile", "requirement": "REQUIRED",
          "authenticatorConfig": "turnstile-config" },
        { "authenticator": "helpwave-privacy-acceptance", "requirement": "REQUIRED",
          "authenticatorConfig": "privacy-config" }
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
    },
    {
      "alias": "privacy-config",
      "config": {
        "privacy.policy.url": "https://helpwave.de/privacy",
        "privacy.policy.version": "2024-01"
      }
    }
  ],
  "registrationFlow": "registration-helpwave"
}
```

Keycloak resolves `$${env.VAR}` placeholders at import time, so the Turnstile *secret*
can be injected through the systemd unit:

```nix
systemd.services.keycloak.serviceConfig.EnvironmentFile =
  "/run/keys/helpwave-turnstile-env";   # file containing TURNSTILE_SECRET=...
```

Use `agenix` / `sops-nix` to render that file with mode `0400` owned by `keycloak`.

## 4. CORS / cookie notes for the profile picture endpoint

The Account Console talks to `/realms/<realm>/helpwave-picture` from
`https://<domain>/realms/<realm>/account`. Same origin → no CORS or extra cookie config
needed. If you host the account console under a different origin, add the SPI's path to
your reverse proxy CORS allow-list (`POST`, `DELETE`, `Authorization` header,
`credentials: include`).

## 5. Updating

When a new release lands:

1. Bump `themeVersion` (and `spiVersion` if it changed — check the release notes).
2. Replace the four `sha256-…` placeholders with the new digests.
3. `nixos-rebuild switch` — Keycloak will be restarted automatically because
   `services.keycloak.plugins` changed.
4. If the SPI's config keys changed, update `services.keycloak.settings` accordingly.

## 6. Smoke test after deployment

```sh
# Theme served?
curl -sf "https://${DOMAIN}/realms/customer/login-actions/registration" | grep -q "helpwave id"

# Turnstile widget rendered?
curl -sf "https://${DOMAIN}/realms/customer/login-actions/registration" | grep -q "cf-turnstile"

# Picture endpoint mounted? (expect 401 unauthenticated)
curl -sw '%{http_code}\n' -o /dev/null -X POST \
  "https://${DOMAIN}/realms/customer/helpwave-picture"
# → 401
```
