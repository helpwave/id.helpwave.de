package de.helpwave.keycloak.turnstile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import org.keycloak.authentication.FormAction;
import org.keycloak.authentication.FormContext;
import org.keycloak.authentication.ValidationContext;
import org.keycloak.events.Errors;
import org.keycloak.models.AuthenticatorConfigModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.utils.FormMessage;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * Server-side Cloudflare Turnstile verification. Runs as part of the registration form flow.
 * Reads the token from form field {@code cf-turnstile-response} and validates it against
 * Cloudflare's siteverify endpoint using the configured secret.
 */
public class TurnstileFormAction implements FormAction {

    private static final Logger log = Logger.getLogger(TurnstileFormAction.class);
    private static final String FORM_FIELD = "cf-turnstile-response";
    private static final String VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    static final String CFG_SITE_KEY = "turnstile.site.key";
    static final String CFG_SECRET = "turnstile.secret";

    private static final HttpClient HTTP = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public void buildPage(FormContext context, org.keycloak.forms.login.LoginFormsProvider form) {
        String siteKey = getConfig(context, CFG_SITE_KEY);
        if (siteKey != null && !siteKey.isBlank()) {
            form.setAttribute("turnstileSiteKey", siteKey);
        }
    }

    @Override
    public void validate(ValidationContext context) {
        String secret = getConfig(context, CFG_SECRET);
        if (secret == null || secret.isBlank()) {
            // Misconfigured. Fail closed in production; here we log and skip to avoid lockouts.
            log.warn("Turnstile secret not configured; skipping verification");
            context.success();
            return;
        }

        MultivaluedMap<String, String> form = context.getHttpRequest().getDecodedFormParameters();
        String token = form.getFirst(FORM_FIELD);
        if (token == null || token.isBlank()) {
            failed(context, "captchaFailed");
            return;
        }

        try {
            String remoteIp = context.getConnection() != null ? context.getConnection().getRemoteAddr() : null;
            String body = "secret=" + url(secret)
                    + "&response=" + url(token)
                    + (remoteIp != null ? "&remoteip=" + url(remoteIp) : "");
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(VERIFY_URL))
                    .timeout(Duration.ofSeconds(5))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();
            HttpResponse<String> res = HTTP.send(req, HttpResponse.BodyHandlers.ofString());
            JsonNode root = MAPPER.readTree(res.body());
            if (root.path("success").asBoolean(false)) {
                context.success();
            } else {
                log.debugf("Turnstile verification failed: %s", res.body());
                failed(context, "captchaFailed");
            }
        } catch (Exception e) {
            log.warn("Turnstile verification call failed", e);
            failed(context, "captchaFailed");
        }
    }

    private static String url(String v) {
        return java.net.URLEncoder.encode(v, StandardCharsets.UTF_8);
    }

    private void failed(ValidationContext context, String messageKey) {
        context.getEvent().error(Errors.INVALID_REGISTRATION);
        List<FormMessage> errors = new ArrayList<>();
        errors.add(new FormMessage(FORM_FIELD, messageKey));
        MultivaluedMap<String, String> formData = context.getHttpRequest().getDecodedFormParameters();
        context.validationError(formData, errors);
    }

    private static String getConfig(FormContext ctx, String key) {
        AuthenticatorConfigModel cfg = ctx.getAuthenticatorConfig();
        if (cfg == null) return null;
        return cfg.getConfig().get(key);
    }

    @Override
    public void success(FormContext context) {
        // nothing to do
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
