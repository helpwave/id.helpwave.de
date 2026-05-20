package de.helpwave.keycloak.picture;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3ClientBuilder;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;

/** Tiny wrapper around the AWS S3 client that works with Cloudflare R2 via a custom endpoint. */
public final class S3Storage {

    private final S3Client client;
    private final String bucket;
    private final String publicBaseUrl;

    public S3Storage(PictureConfig config) {
        this.bucket = config.bucket();
        this.publicBaseUrl = config.publicBaseUrl().replaceAll("/+$", "");

        S3ClientBuilder builder = S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(config.accessKey(), config.secretKey())))
                .region(Region.of(config.region()))
                // R2 only supports path-style addressing.
                .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build());

        if (config.endpoint() != null && !config.endpoint().isBlank()) {
            builder = builder.endpointOverride(URI.create(config.endpoint()));
        }
        this.client = builder.build();
    }

    public String put(String key, byte[] data, String contentType) {
        client.putObject(PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .cacheControl("public, max-age=31536000, immutable")
                .build(), RequestBody.fromBytes(data));
        return publicBaseUrl + "/" + key;
    }

    public void delete(String key) {
        client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build());
    }

    public void close() { client.close(); }
}
