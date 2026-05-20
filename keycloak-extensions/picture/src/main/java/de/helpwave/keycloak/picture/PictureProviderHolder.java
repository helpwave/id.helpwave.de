package de.helpwave.keycloak.picture;

import jakarta.enterprise.inject.Vetoed;

/**
 * Static holder for the profile-picture storage configuration and S3 client. Initialized
 * once by {@link ProfilePictureResourceProviderFactory#init} and accessed by the JAX-RS
 * resource at request time. Using a holder lets the resource class stay free of
 * constructor parameters so Quarkus' Arc CDI scanner does not try to inject them.
 */
@Vetoed
public final class PictureProviderHolder {

    private static volatile PictureConfig config;
    private static volatile S3Storage storage;

    private PictureProviderHolder() {}

    public static void set(PictureConfig cfg, S3Storage st) {
        config = cfg;
        storage = st;
    }

    public static PictureConfig config() { return config; }

    public static S3Storage storage() { return storage; }

    public static boolean isReady() { return storage != null && config != null; }
}
