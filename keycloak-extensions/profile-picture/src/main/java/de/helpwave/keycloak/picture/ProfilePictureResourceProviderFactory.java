package de.helpwave.keycloak.picture;

import org.jboss.logging.Logger;
import org.keycloak.Config;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.services.resource.RealmResourceProvider;
import org.keycloak.services.resource.RealmResourceProviderFactory;

public class ProfilePictureResourceProviderFactory implements RealmResourceProviderFactory {

    public static final String ID = "helpwave-picture";
    private static final Logger log = Logger.getLogger(ProfilePictureResourceProviderFactory.class);

    private PictureConfig config;
    private S3Storage storage;

    @Override
    public RealmResourceProvider create(KeycloakSession session) {
        return new ProfilePictureResourceProvider(session, config, storage);
    }

    @Override
    public void init(Config.Scope scope) {
        this.config = PictureConfig.fromEnv(scope);
        if (!config.isValid()) {
            log.warn("helpwave-picture: storage config is incomplete; uploads will return 503");
            return;
        }
        this.storage = new S3Storage(config);
        log.infof("helpwave-picture initialized (bucket=%s, region=%s)", config.bucket(), config.region());
    }

    @Override
    public void postInit(KeycloakSessionFactory factory) { }

    @Override
    public void close() {
        if (storage != null) storage.close();
    }

    @Override
    public String getId() { return ID; }
}
