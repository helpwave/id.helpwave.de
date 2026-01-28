# [id.helpwave.de](https://id.helpwave.de)

Keycloak login theme using helpwave hightide components.

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

Note: You need [Maven](https://maven.apache.org/) installed to build the theme (Maven >= 3.1.1, Java >= 7).

- On macOS: `brew install maven`
- On Debian/Ubuntu: `sudo apt-get install maven`
- On Windows: `choco install openjdk` and `choco install maven`

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
