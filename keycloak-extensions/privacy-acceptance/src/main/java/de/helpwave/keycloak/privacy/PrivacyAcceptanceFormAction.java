package de.helpwave.keycloak.privacy;

import jakarta.ws.rs.core.MultivaluedMap;
import org.keycloak.authentication.FormAction;
import org.keycloak.authentication.FormContext;
import org.keycloak.authentication.ValidationContext;
import org.keycloak.events.Errors;
import org.keycloak.models.AuthenticatorConfigModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.utils.FormMessage;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Enforces acceptance of the helpwave privacy policy during registration and stores the
 * acceptance metadata as user attributes:
 * <ul>
 *   <li>{@code privacy_policy_accepted} = "true"</li>
 *   <li>{@code privacy_policy_accepted_at} = ISO-8601 timestamp</li>
 *   <li>{@code privacy_policy_version} = configured policy version (e.g. "2024-01")</li>
 * </ul>
 */
public class PrivacyAcceptanceFormAction implements FormAction {

    private static final String FORM_FIELD = "privacy-accepted";

    static final String CFG_VERSION = "privacy.policy.version";
    static final String CFG_URL = "privacy.policy.url";

    public static final String ATTR_ACCEPTED = "privacy_policy_accepted";
    public static final String ATTR_ACCEPTED_AT = "privacy_policy_accepted_at";
    public static final String ATTR_VERSION = "privacy_policy_version";

    @Override
    public void buildPage(FormContext context, org.keycloak.forms.login.LoginFormsProvider form) {
        String url = getConfig(context, CFG_URL);
        if (url != null && !url.isBlank()) {
            form.setAttribute("privacyPolicyUrl", url);
        }
    }

    @Override
    public void validate(ValidationContext context) {
        MultivaluedMap<String, String> form = context.getHttpRequest().getDecodedFormParameters();
        String accepted = form.getFirst(FORM_FIELD);
        if (!"true".equalsIgnoreCase(accepted) && !"on".equalsIgnoreCase(accepted)) {
            context.getEvent().error(Errors.INVALID_REGISTRATION);
            List<FormMessage> errors = new ArrayList<>();
            errors.add(new FormMessage(FORM_FIELD, "privacyRequired"));
            context.validationError(form, errors);
            return;
        }
        context.success();
    }

    @Override
    public void success(FormContext context) {
        UserModel user = context.getUser();
        if (user == null) return;
        user.setSingleAttribute(ATTR_ACCEPTED, "true");
        user.setSingleAttribute(ATTR_ACCEPTED_AT, Instant.now().toString());
        String version = getConfig(context, CFG_VERSION);
        if (version != null && !version.isBlank()) {
            user.setSingleAttribute(ATTR_VERSION, version);
        }
    }

    private static String getConfig(FormContext ctx, String key) {
        AuthenticatorConfigModel cfg = ctx.getAuthenticatorConfig();
        if (cfg == null) return null;
        return cfg.getConfig().get(key);
    }

    @Override
    public boolean requiresUser() { return false; }

    @Override
    public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) { return true; }

    @Override
    public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) { }

    @Override
    public void close() { }
}
