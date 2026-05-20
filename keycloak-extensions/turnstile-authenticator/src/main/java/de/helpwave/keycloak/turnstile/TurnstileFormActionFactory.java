package de.helpwave.keycloak.turnstile;

import org.keycloak.Config;
import org.keycloak.authentication.FormAction;
import org.keycloak.authentication.FormActionFactory;
import org.keycloak.models.AuthenticationExecutionModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;

import java.util.List;

public class TurnstileFormActionFactory implements FormActionFactory {

    public static final String PROVIDER_ID = "helpwave-turnstile";

    private static final AuthenticationExecutionModel.Requirement[] REQUIREMENTS = {
            AuthenticationExecutionModel.Requirement.REQUIRED,
            AuthenticationExecutionModel.Requirement.DISABLED
    };

    private static final List<ProviderConfigProperty> CONFIG;
    static {
        ProviderConfigProperty siteKey = new ProviderConfigProperty();
        siteKey.setName(TurnstileFormAction.CFG_SITE_KEY);
        siteKey.setLabel("Turnstile site key");
        siteKey.setType(ProviderConfigProperty.STRING_TYPE);
        siteKey.setHelpText("Public Cloudflare Turnstile site key, rendered in the registration form.");

        ProviderConfigProperty secret = new ProviderConfigProperty();
        secret.setName(TurnstileFormAction.CFG_SECRET);
        secret.setLabel("Turnstile secret");
        secret.setType(ProviderConfigProperty.PASSWORD);
        secret.setHelpText("Private Cloudflare Turnstile secret used for server-side verification.");

        CONFIG = List.of(siteKey, secret);
    }

    @Override
    public String getDisplayType() { return "Cloudflare Turnstile (helpwave)"; }

    @Override
    public String getReferenceCategory() { return "captcha"; }

    @Override
    public boolean isConfigurable() { return true; }

    @Override
    public AuthenticationExecutionModel.Requirement[] getRequirementChoices() { return REQUIREMENTS; }

    @Override
    public boolean isUserSetupAllowed() { return false; }

    @Override
    public String getHelpText() {
        return "Validates Cloudflare Turnstile CAPTCHA during registration.";
    }

    @Override
    public List<ProviderConfigProperty> getConfigProperties() { return CONFIG; }

    @Override
    public FormAction create(KeycloakSession session) { return new TurnstileFormAction(); }

    @Override
    public void init(Config.Scope config) { }

    @Override
    public void postInit(KeycloakSessionFactory factory) { }

    @Override
    public void close() { }

    @Override
    public String getId() { return PROVIDER_ID; }
}
