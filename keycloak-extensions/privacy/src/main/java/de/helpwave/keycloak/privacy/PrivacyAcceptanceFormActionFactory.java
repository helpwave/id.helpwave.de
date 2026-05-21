package de.helpwave.keycloak.privacy;

import org.keycloak.Config;
import org.keycloak.authentication.FormAction;
import org.keycloak.authentication.FormActionFactory;
import org.keycloak.models.AuthenticationExecutionModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;

import java.util.List;

public class PrivacyAcceptanceFormActionFactory implements FormActionFactory {

    public static final String PROVIDER_ID = "helpwave-privacy-acceptance";

    private static final AuthenticationExecutionModel.Requirement[] REQUIREMENTS = {
            AuthenticationExecutionModel.Requirement.REQUIRED,
            AuthenticationExecutionModel.Requirement.DISABLED
    };

    private static final List<ProviderConfigProperty> CONFIG;
    static {
        ProviderConfigProperty url = new ProviderConfigProperty();
        url.setName(PrivacyAcceptanceFormAction.CFG_URL);
        url.setLabel("Privacy policy URL");
        url.setType(ProviderConfigProperty.STRING_TYPE);
        url.setDefaultValue("https://helpwave.de/privacy");
        url.setHelpText("URL of the privacy policy that the user accepts.");

        ProviderConfigProperty version = new ProviderConfigProperty();
        version.setName(PrivacyAcceptanceFormAction.CFG_VERSION);
        version.setLabel("Privacy policy version");
        version.setType(ProviderConfigProperty.STRING_TYPE);
        version.setHelpText("Optional version identifier stored on the user account, e.g. '2024-01'.");

        CONFIG = List.of(url, version);
    }

    @Override
    public String getDisplayType() { return "Privacy Policy Acceptance (helpwave)"; }

    @Override
    public String getReferenceCategory() { return "terms"; }

    @Override
    public boolean isConfigurable() { return true; }

    @Override
    public AuthenticationExecutionModel.Requirement[] getRequirementChoices() { return REQUIREMENTS; }

    @Override
    public boolean isUserSetupAllowed() { return false; }

    @Override
    public String getHelpText() {
        return "Requires the user to accept the privacy policy and stores acceptance metadata on the user account.";
    }

    @Override
    public List<ProviderConfigProperty> getConfigProperties() { return CONFIG; }

    @Override
    public FormAction create(KeycloakSession session) { return new PrivacyAcceptanceFormAction(); }

    @Override
    public void init(Config.Scope config) { }

    @Override
    public void postInit(KeycloakSessionFactory factory) { }

    @Override
    public void close() { }

    @Override
    public String getId() { return PROVIDER_ID; }
}
