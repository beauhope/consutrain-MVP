export async function createUnsubscribeToken(
  subscriberId,
  secret
) {
  const payload =
    `unsubscribe:v1:${subscriberId}`;

  const key =
    await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );

  const signature =
    await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(payload)
    );

  const subscriberPart =
    base64UrlEncodeBytes(
      new TextEncoder().encode(subscriberId)
    );

  const signaturePart =
    base64UrlEncodeBytes(
      new Uint8Array(signature)
    );

  return `v1.${subscriberPart}.${signaturePart}`;
}

export async function createUnsubscribeUrl(
  subscriberId,
  secret
) {
  const token =
    await createUnsubscribeToken(
      subscriberId,
      secret
    );

  return (
    "https://consutrain.com/unsubscribe.html" +
    `?token=${encodeURIComponent(token)}`
  );
}

function base64UrlEncodeBytes(bytes) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}