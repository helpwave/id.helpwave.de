package de.helpwave.keycloak.picture;

/**
 * Configuration for the profile-picture storage backend. All values are read from
 * Keycloak's SPI configuration ({@code spi-helpwave-picture-default-*}) or environment
 * variables, whichever is set first.
 *
 * <p>Example for Cloudflare R2:
 * <pre>
 * KC_SPI_HELPWAVE_PICTURE_DEFAULT_ENDPOINT=https://&lt;account&gt;.r2.cloudflarestorage.com
 * KC_SPI_HELPWAVE_PICTURE_DEFAULT_REGION=auto
 * KC_SPI_HELPWAVE_PICTURE_DEFAULT_BUCKET=helpwave-id-avatars
 * KC_SPI_HELPWAVE_PICTURE_DEFAULT_ACCESS_KEY=...
 * KC_SPI_HELPWAVE_PICTURE_DEFAULT_SECRET_KEY=...
 * KC_SPI_HELPWAVE_PICTURE_DEFAULT_PUBLIC_BASE_URL=https://cdn.helpwave.de/avatars
 * </pre>
 */
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
