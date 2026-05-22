package de.helpwave.keycloak.policy;

/**
 * Immutable description of a policy that users must accept. Each policy gets its own
 * provider id, set of user attributes and pair of realm attributes for runtime config
 * (URL + version). Add a new policy by constructing another {@code PolicyDefinition}
 * and exposing it through a dedicated {@link AbstractPolicyAcceptanceRequiredActionFactory}.
 */
public final class PolicyDefinition {

    private final String id;
    private final String providerId;
    private final String displayText;
    private final String defaultUrl;
    private final String defaultVersion;
    private final String acceptanceLabelMessageKey;
    private final String linkLabelMessageKey;
    private final String requiredErrorMessageKey;

    public PolicyDefinition(
            String id,
            String providerId,
            String displayText,
            String defaultUrl,
            String defaultVersion,
            String acceptanceLabelMessageKey,
            String linkLabelMessageKey,
            String requiredErrorMessageKey
    ) {
        this.id = id;
        this.providerId = providerId;
        this.displayText = displayText;
        this.defaultUrl = defaultUrl;
        this.defaultVersion = defaultVersion;
        this.acceptanceLabelMessageKey = acceptanceLabelMessageKey;
        this.linkLabelMessageKey = linkLabelMessageKey;
        this.requiredErrorMessageKey = requiredErrorMessageKey;
    }

    /** Short, code-friendly identifier, e.g. {@code "privacy"}. Used as attribute prefix. */
    public String id() { return id; }

    /** Keycloak required-action provider id, e.g. {@code "helpwave-privacy-acceptance"}. */
    public String providerId() { return providerId; }

    /** Label shown to admins in Keycloak's required-action list. */
    public String displayText() { return displayText; }

    public String defaultUrl() { return defaultUrl; }

    public String defaultVersion() { return defaultVersion; }

    /** i18n key for the checkbox label, e.g. {@code "acceptPrivacy"}. */
    public String acceptanceLabelMessageKey() { return acceptanceLabelMessageKey; }

    /** i18n key for the link text next to the checkbox, e.g. {@code "privacyPolicy"}. */
    public String linkLabelMessageKey() { return linkLabelMessageKey; }

    /** i18n key for the validation error when the checkbox is not ticked. */
    public String requiredErrorMessageKey() { return requiredErrorMessageKey; }

    /** User attribute that flags acceptance. */
    public String attrAccepted() { return id + "_policy_accepted"; }

    /** User attribute that stores the ISO-8601 acceptance timestamp. */
    public String attrAcceptedAt() { return id + "_policy_accepted_at"; }

    /** User attribute that stores the policy version that was accepted. */
    public String attrVersion() { return id + "_policy_version"; }

    /** Realm attribute that overrides {@link #defaultUrl()}. */
    public String realmAttrUrl() { return "helpwave.policy." + id + ".url"; }

    /** Realm attribute that overrides {@link #defaultVersion()}. */
    public String realmAttrVersion() { return "helpwave.policy." + id + ".version"; }
}
