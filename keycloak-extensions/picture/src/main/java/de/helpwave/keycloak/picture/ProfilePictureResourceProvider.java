package de.helpwave.keycloak.picture;

import org.keycloak.services.resource.RealmResourceProvider;

public class ProfilePictureResourceProvider implements RealmResourceProvider {

    @Override
    public Object getResource() {
        return new ProfilePictureResource();
    }

    @Override
    public void close() { }
}
