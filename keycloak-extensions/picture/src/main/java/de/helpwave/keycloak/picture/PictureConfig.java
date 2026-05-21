package de.helpwave.keycloak.picture;

import jakarta.enterprise.inject.Vetoed;

/**
 * Configuration for the profile-picture storage backend. Read from Keycloak's SPI
 * configuration ({@code spi-realm-restapi-extension-helpwave-picture-*}) or env vars.
 * See README + docs/deployment-nixos.md for the full key list.
 */
@Vetoed
public record PictureConfig(
        String endpoint,
        String region,
        String bucket,
        String accessKey,
        String secretKey,
        String publicBaseUrl,
        int maxBytes
) {
    public static PictureConfig fromEnv(org.keycloak.Config.Scope scope) {
        return new PictureConfig(
                read(scope, "endpoint", "HELPWAVE_PICTURE_ENDPOINT"),
                orDefault(read(scope, "region", "HELPWAVE_PICTURE_REGION"), "auto"),
                read(scope, "bucket", "HELPWAVE_PICTURE_BUCKET"),
                read(scope, "accessKey", "HELPWAVE_PICTURE_ACCESS_KEY"),
                read(scope, "secretKey", "HELPWAVE_PICTURE_SECRET_KEY"),
                orDefault(read(scope, "publicBaseUrl", "HELPWAVE_PICTURE_PUBLIC_BASE_URL"), ""),
                Integer.parseInt(orDefault(read(scope, "maxBytes", "HELPWAVE_PICTURE_MAX_BYTES"), "5242880"))
        );
    }

    public boolean isValid() {
        return bucket != null && !bucket.isBlank()
                && accessKey != null && !accessKey.isBlank()
                && secretKey != null && !secretKey.isBlank()
                && publicBaseUrl != null && !publicBaseUrl.isBlank();
    }

    private static String read(org.keycloak.Config.Scope scope, String key, String env) {
        if (scope != null) {
            String v = scope.get(key);
            if (v != null && !v.isBlank()) return v;
        }
        return System.getenv(env);
    }

    private static String orDefault(String v, String def) {
        return (v == null || v.isBlank()) ? def : v;
    }
}
