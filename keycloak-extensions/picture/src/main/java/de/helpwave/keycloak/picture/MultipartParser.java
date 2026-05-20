package de.helpwave.keycloak.picture;

import jakarta.enterprise.inject.Vetoed;

import java.nio.charset.StandardCharsets;

/**
 * Minimal RFC 2046 multipart/form-data parser used to extract the first file part out of
 * the request body. We do not depend on RESTEasy's MultipartFormDataInput because the type
 * is not on Keycloak's classpath in 26.x.
 */
@Vetoed
final class MultipartParser {

    private MultipartParser() {}

    static byte[] extractFirstFile(byte[] body, String contentType) {
        String boundary = boundaryOf(contentType);
        if (boundary == null) return null;
        byte[] sep = ("--" + boundary).getBytes(StandardCharsets.US_ASCII);
        byte[] crlfCrlf = {0x0D, 0x0A, 0x0D, 0x0A};

        int idx = indexOf(body, sep, 0);
        while (idx >= 0) {
            int partStart = idx + sep.length;
            // Skip CRLF after boundary or "--" end marker
            if (partStart + 2 <= body.length && body[partStart] == '-' && body[partStart + 1] == '-') break;
            if (partStart + 2 <= body.length && body[partStart] == 0x0D && body[partStart + 1] == 0x0A) {
                partStart += 2;
            }
            int headersEnd = indexOf(body, crlfCrlf, partStart);
            if (headersEnd < 0) return null;
            int contentStart = headersEnd + crlfCrlf.length;
            int nextBoundary = indexOf(body, sep, contentStart);
            if (nextBoundary < 0) return null;
            // Trim trailing CRLF before boundary
            int contentEnd = nextBoundary;
            if (contentEnd >= 2 && body[contentEnd - 2] == 0x0D && body[contentEnd - 1] == 0x0A) {
                contentEnd -= 2;
            }
            String headers = new String(body, partStart, headersEnd - partStart, StandardCharsets.UTF_8);
            if (headers.toLowerCase().contains("filename=")) {
                byte[] out = new byte[contentEnd - contentStart];
                System.arraycopy(body, contentStart, out, 0, out.length);
                return out;
            }
            idx = nextBoundary;
        }
        return null;
    }

    private static String boundaryOf(String contentType) {
        if (contentType == null) return null;
        for (String part : contentType.split(";")) {
            String p = part.trim();
            if (p.toLowerCase().startsWith("boundary=")) {
                String v = p.substring("boundary=".length()).trim();
                if (v.startsWith("\"") && v.endsWith("\"")) v = v.substring(1, v.length() - 1);
                return v;
            }
        }
        return null;
    }

    private static int indexOf(byte[] hay, byte[] needle, int from) {
        outer:
        for (int i = from; i <= hay.length - needle.length; i++) {
            for (int j = 0; j < needle.length; j++) {
                if (hay[i + j] != needle[j]) continue outer;
            }
            return i;
        }
        return -1;
    }
}
