{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_20
    nodePackages.npm
    docker
    docker-compose
  ];

  shellHook = ''
    echo "helpwave-id keycloak theme development environment"
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo ""
    echo "To start services:"
    echo "  docker compose up"
    echo ""
    echo "Note: The theme jar should be built first with 'npm run build-keycloak-theme'"
    echo "      or fetched from a GitHub release."
  '';
}