package de.helpwave.keycloak.policy.privacy;

import de.helpwave.keycloak.policy.AbstractPolicyAcceptanceRequiredActionFactory;
import de.helpwave.keycloak.policy.PolicyDefinition;

public class PrivacyPolicyRequiredActionFactory extends AbstractPolicyAcceptanceRequiredActionFactory {

    public static final PolicyDefinition POLICY = new PolicyDefinition(
            "privacy",
            "helpwave-privacy-acceptance",
            "Privacy Policy Acceptance (helpwave)",
            "https://helpwave.de/privacy",
            "2024-01",
            "acceptPrivacy",
            "privacyPolicy",
            "privacyRequired"
    );

    @Override
    protected PolicyDefinition policy() {
        return POLICY;
    }
}
