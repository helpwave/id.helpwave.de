# NixOS Development Setup

This document describes how to use the nix-shell environment for local development.

## Entering the Shell

To enter the nix-shell environment:

```bash
nix-shell nix/shell.nix
```

This will provide:
- Node.js and npm for building the theme
- Docker and docker-compose for running services

## Starting Services

Once inside the nix-shell, start the keycloak and postgres services:

```bash
docker compose up
```

The services will:
- Start postgres on the default port
- Start keycloak on port 8080
- Import realms from `keycloak/import/`
- Mount the theme jar from `dist_keycloak/`

## Building the Theme

To build the theme jar locally:

```bash
npm ci
npm run build-keycloak-theme
```

This will generate the jar files in `dist_keycloak/`.

## Using a Pre-built Jar from GitHub

If you want to use a jar from a GitHub release instead of building locally, you can:

1. Download the jar from the GitHub release
2. Place it in `dist_keycloak/` as `keycloak-theme-for-kc-all-other-versions.jar`
3. Update `docker-compose.yml` if the jar name differs

Alternatively, you can modify `nix/shell.nix` to fetch the jar automatically using `pkgs.fetchurl`:

```nix
themeJar = pkgs.fetchurl {
  url = "https://github.com/helpwave/id.helpwave.de/releases/download/v0.1.0/keycloak-theme-for-kc-all-other-versions.jar";
  sha256 = "0000000000000000000000000000000000000000000000000000000000000000";
};
```

Replace the `sha256` with the actual hash of the jar file.

## Updating the Jar Reference

To update the jar reference for a new release:

1. Update the `url` in the `fetchurl` call to point to the new release
2. Update the `sha256` hash to match the new jar file
3. Rebuild the nix-shell environment

You can get the SHA256 hash using:

```bash
nix-prefetch-url <jar-url>
```