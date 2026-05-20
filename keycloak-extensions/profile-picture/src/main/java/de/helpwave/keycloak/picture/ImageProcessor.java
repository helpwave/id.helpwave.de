package de.helpwave.keycloak.picture;

import net.coobird.thumbnailator.Thumbnails;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Decodes uploaded images, strips metadata (re-encoding to PNG/JPEG via Thumbnailator) and
 * produces a fixed set of square thumbnails for the avatar use case.
 */
public final class ImageProcessor {

    /** Output sizes (pixels). Keys are used as filename suffixes. */
    static final Map<String, Integer> SIZES = new LinkedHashMap<>();
    static {
        SIZES.put("original", 512);
        SIZES.put("256", 256);
        SIZES.put("128", 128);
        SIZES.put("64", 64);
    }

    public static final String OUTPUT_CONTENT_TYPE = "image/jpeg";
    private static final String OUTPUT_FORMAT = "jpg";

    private ImageProcessor() {}

    /** Validates that the bytes decode as an image and returns a sanitized image. */
    public static BufferedImage decode(byte[] bytes) throws IOException {
        BufferedImage img = ImageIO.read(new ByteArrayInputStream(bytes));
        if (img == null) throw new IOException("not a valid image");
        return img;
    }

    /** Returns the encoded JPEG bytes for the given square size. */
    public static byte[] toSquareJpeg(BufferedImage source, int size) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Thumbnails.of(source)
                .size(size, size)
                .crop(net.coobird.thumbnailator.geometry.Positions.CENTER)
                .outputFormat(OUTPUT_FORMAT)
                .outputQuality(0.88f)
                .toOutputStream(out);
        return out.toByteArray();
    }
}
