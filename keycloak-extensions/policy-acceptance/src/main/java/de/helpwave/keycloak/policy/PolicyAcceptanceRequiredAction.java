package de.helpwave.keycloak.policy;

import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.keycloak.authentication.RequiredActionContext;
import org.keycloak.authentication.RequiredActionProvider;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import java.time.Instant;

/**
 * Renders a single-checkbox consent page for the configured {@link PolicyDefinition} and
 * stores the resulting acceptance metadata on the {@link UserModel}.
 *
 * <p>Triggering logic: {@link #evaluateTriggers(RequiredActionContext)} adds the action to
 * the user whenever the stored version differs from the version configured on the realm
 * (or no version is stored yet). This means rolling out a new policy version is a one-line
 * change to a realm attribute &mdash; every user gets re-prompted on their next login.
 *
 * <p>The challenge form reuses Keycloak's {@code terms.ftl} template. The React Terms page
 * picks up the {@code policyId}, {@code policyUrl}, etc. attributes and renders the
 * policy-specific UI instead of the built-in terms text.
 */
public class PolicyAcceptanceRequiredAction implements RequiredActionProvider {

    static final String FORM_FIELD = "policy-accepted";

    private static final String ATTR_POLICY_ID = "policyId";
    private static final String ATTR_POLICY_URL = "policyUrl";
    private static final String ATTR_POLICY_VERSION = "policyVersion";
    private static final String ATTR_POLICY_LABEL_KEY = "policyAcceptanceLabelKey";
    private static final String ATTR_POLICY_LINK_KEY = "policyLinkLabelKey";
    private static final String ATTR_POLICY_REQUIRED_ERROR_KEY = "policyRequiredErrorKey";

    private final PolicyDefinition policy;

    public PolicyAcceptanceRequiredAction(PolicyDefinition policy) {
        this.policy = policy;
    }

    @Override
    public void evaluateTriggers(RequiredActionContext context) {
        UserModel user = context.getUser();
        if (user == null) return;
        String currentVersion = currentVersion(context.getRealm());
        String acceptedVersion = user.getFirstAttribute(policy.attrVersion());
        boolean accepted = "true".equalsIgnoreCase(user.getFirstAttribute(policy.attrAccepted()));
        if (!accepted || acceptedVersion == null || !acceptedVersion.equals(currentVersion)) {
            user.addRequiredAction(policy.providerId());
        }
    }

    @Override
    public void requiredActionChallenge(RequiredActionContext context) {
        RealmModel realm = context.getRealm();
        LoginFormsProvider form = context.form()
                .setAttribute(ATTR_POLICY_ID, policy.id())
                .setAttribute(ATTR_POLICY_URL, currentUrl(realm))
                .setAttribute(ATTR_POLICY_VERSION, currentVersion(realm))
                .setAttribute(ATTR_POLICY_LABEL_KEY, policy.acceptanceLabelMessageKey())
                .setAttribute(ATTR_POLICY_LINK_KEY, policy.linkLabelMessageKey())
                .setAttribute(ATTR_POLICY_REQUIRED_ERROR_KEY, policy.requiredErrorMessageKey());
        Response challenge = form.createForm("terms.ftl");
        context.challenge(challenge);
    }

    @Override
    public void processAction(RequiredActionContext context) {
        MultivaluedMap<String, String> formParams = context.getHttpRequest().getDecodedFormParameters();
        String accepted = formParams.getFirst(FORM_FIELD);
        if (!"true".equalsIgnoreCase(accepted) && !"on".equalsIgnoreCase(accepted)) {
            // Render the form again with an error flag so the React component can surface it.
            RealmModel realm = context.getRealm();
            Response challenge = context.form()
                    .setAttribute(ATTR_POLICY_ID, policy.id())
                    .setAttribute(ATTR_POLICY_URL, currentUrl(realm))
                    .setAttribute(ATTR_POLICY_VERSION, currentVersion(realm))
                    .setAttribute(ATTR_POLICY_LABEL_KEY, policy.acceptanceLabelMessageKey())
                    .setAttribute(ATTR_POLICY_LINK_KEY, policy.linkLabelMessageKey())
                    .setAttribute(ATTR_POLICY_REQUIRED_ERROR_KEY, policy.requiredErrorMessageKey())
                    .setAttribute("policyRequiredError", true)
                    .setError(policy.requiredErrorMessageKey())
                    .createForm("terms.ftl");
            context.challenge(challenge);
            return;
        }

        UserModel user = context.getUser();
        user.setSingleAttribute(policy.attrAccepted(), "true");
        user.setSingleAttribute(policy.attrAcceptedAt(), Instant.now().toString());
        user.setSingleAttribute(policy.attrVersion(), currentVersion(context.getRealm()));
        user.removeRequiredAction(policy.providerId());
        context.success();
    }

    @Override
    public void close() { }

    private String currentUrl(RealmModel realm) {
        String override = realm.getAttribute(policy.realmAttrUrl());
        if (override != null && !override.isBlank()) return override;
        return policy.defaultUrl();
    }

    private String currentVersion(RealmModel realm) {
        String override = realm.getAttribute(policy.realmAttrVersion());
        if (override != null && !override.isBlank()) return override;
        return policy.defaultVersion();
    }
}
