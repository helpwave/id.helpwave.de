package de.helpwave.keycloak.picture;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.OPTIONS;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import org.keycloak.http.HttpRequest;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.UserModel;
import org.keycloak.services.managers.AppAuthManager;
import org.keycloak.services.managers.AuthenticationManager.AuthResult;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * REST endpoint exposed at {@code /realms/{realm}/helpwave-picture}. The browser sends the
 * raw image bytes as the request body with the corresponding {@code Content-Type} header
 * (no multipart wrapper needed). Authentication is the standard Keycloak bearer token.
 */
@Path("/")
public class ProfilePictureResource {

    private static final Logger log = Logger.getLogger(ProfilePictureResource.class);
    public static final String ATTR_PICTURE_URL = "picture";

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final KeycloakSession session;
    private final PictureConfig config;
    private final S3Storage storage;

    public ProfilePictureResource(KeycloakSession session, PictureConfig config, S3Storage storage) {
        this.session = session;
        this.config = config;
        this.storage = storage;
    }

    @OPTIONS
    public Response preflight() {
        return Response.ok().build();
    }

    @POST
    @Consumes({"image/jpeg", "image/png", "image/webp", MediaType.APPLICATION_OCTET_STREAM, MediaType.MULTIPART_FORM_DATA})
    @Produces(MediaType.APPLICATION_JSON)
    public Response upload(@HeaderParam(HttpHeaders.CONTENT_TYPE) String contentType, InputStream body) {
        if (storage == null) {
            return Response.status(Response.Status.SERVICE_UNAVAILABLE)
                    .entity(Map.of("error", "storage not configured")).build();
        }
        UserModel user = authenticate();
        if (user == null) return unauthorized();

        byte[] bytes;
        try {
            bytes = body.readAllBytes();
        } catch (IOException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(Map.of("error", "read failed")).build();
        }

        // If sent as multipart, extract the first file part.
        if (contentType != null && contentType.toLowerCase().startsWith("multipart/")) {
            byte[] extracted = MultipartParser.extractFirstFile(bytes, contentType);
            if (extracted != null) bytes = extracted;
        }

        if (bytes.length > config.maxBytes()) {
            return Response.status(Response.Status.REQUEST_ENTITY_TOO_LARGE)
                    .entity(Map.of("error", "file too large")).build();
        }

        BufferedImage source;
        try {
            source = ImageProcessor.decode(bytes);
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(Map.of("error", "invalid image")).build();
        }

        String userId = user.getId();
        String version = UUID.randomUUID().toString().substring(0, 8);
        String primaryUrl = null;
        Map<String, String> generated = new HashMap<>();
        try {
            for (Map.Entry<String, Integer> entry : ImageProcessor.SIZES.entrySet()) {
                String label = entry.getKey();
                byte[] scaled = ImageProcessor.toSquareJpeg(source, entry.getValue());
                String key = "users/" + userId + "/" + version + "/" + label + ".jpg";
                String url = storage.put(key, scaled, ImageProcessor.OUTPUT_CONTENT_TYPE);
                generated.put(label, url);
                if ("original".equals(label)) primaryUrl = url;
            }
        } catch (Exception e) {
            log.error("Profile picture upload failed", e);
            return Response.serverError().entity(Map.of("error", "upload failed")).build();
        }

        String previous = user.getFirstAttribute(ATTR_PICTURE_URL);
        user.setSingleAttribute(ATTR_PICTURE_URL, primaryUrl);
        user.setSingleAttribute("picture_thumb_64", generated.get("64"));
        user.setSingleAttribute("picture_thumb_128", generated.get("128"));
        user.setSingleAttribute("picture_thumb_256", generated.get("256"));

        if (previous != null) tryDeletePrevious(previous);

        return Response.ok(Map.of("url", primaryUrl, "variants", generated)).build();
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete() {
        UserModel user = authenticate();
        if (user == null) return unauthorized();

        String previous = user.getFirstAttribute(ATTR_PICTURE_URL);
        user.removeAttribute(ATTR_PICTURE_URL);
        user.removeAttribute("picture_thumb_64");
        user.removeAttribute("picture_thumb_128");
        user.removeAttribute("picture_thumb_256");
        if (previous != null) tryDeletePrevious(previous);
        return Response.ok(Map.of("status", "removed")).build();
    }

    private void tryDeletePrevious(String url) {
        try {
            String prefix = config.publicBaseUrl().replaceAll("/+$", "") + "/";
            if (!url.startsWith(prefix)) return;
            String relative = url.substring(prefix.length());
            int folder = relative.lastIndexOf('/');
            if (folder < 0) return;
            String base = relative.substring(0, folder);
            for (String label : ImageProcessor.SIZES.keySet()) {
                storage.delete(base + "/" + label + ".jpg");
            }
        } catch (Exception e) {
            log.debugf("Failed to delete previous picture: %s", e.getMessage());
        }
    }

    private UserModel authenticate() {
        HttpRequest req = session.getContext().getHttpRequest();
        AuthResult auth = new AppAuthManager.BearerTokenAuthenticator(session)
                .setRealm(session.getContext().getRealm())
                .setUriInfo(session.getContext().getUri())
                .setConnection(session.getContext().getConnection())
                .setHeaders(req.getHttpHeaders())
                .authenticate();
        return auth == null ? null : auth.getUser();
    }

    private Response unauthorized() {
        return Response.status(Response.Status.UNAUTHORIZED).entity(Map.of("error", "unauthorized")).build();
    }
}
