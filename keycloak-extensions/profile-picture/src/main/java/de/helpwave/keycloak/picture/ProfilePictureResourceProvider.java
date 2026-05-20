package de.helpwave.keycloak.picture;

import org.keycloak.models.KeycloakSession;
import org.keycloak.services.resource.RealmResourceProvider;

public class ProfilePictureResourceProvider implements RealmResourceProvider {

    private final KeycloakSession session;
    private final PictureConfig config;
    private final S3Storage storage;

    public ProfilePictureResourceProvider(KeycloakSession session, PictureConfig config, S3Storage storage) {
        this.session = session;
        this.config = config;
        this.storage = storage;
    }

    @Override
    public Object getResource() {
        return new ProfilePictureResource(session, config, storage);
    }

    @Override
    public void close() { }
}
