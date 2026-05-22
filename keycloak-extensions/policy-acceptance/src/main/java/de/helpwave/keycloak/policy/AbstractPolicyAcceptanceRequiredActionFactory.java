package de.helpwave.keycloak.policy;

import org.keycloak.Config;
import org.keycloak.authentication.RequiredActionFactory;
import org.keycloak.authentication.RequiredActionProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;

/**
 * Base factory for a single concrete policy. Add a new consent by extending this class,
 * defining a {@link PolicyDefinition} constant, and registering the subclass in
 * {@code META-INF/services/org.keycloak.authentication.RequiredActionFactory}.
 */
public abstract class AbstractPolicyAcceptanceRequiredActionFactory implements RequiredActionFactory {

    protected abstract PolicyDefinition policy();

    @Override
    public RequiredActionProvider create(KeycloakSession session) {
        return new PolicyAcceptanceRequiredAction(policy());
    }

    @Override
    public String getId() {
        return policy().providerId();
    }

    @Override
    public String getDisplayText() {
        return policy().displayText();
    }

    @Override
    public boolean isOneTimeAction() {
        return false;
    }

    @Override
    public void init(Config.Scope config) { }

    @Override
    public void postInit(KeycloakSessionFactory factory) { }

    @Override
    public void close() { }
}
