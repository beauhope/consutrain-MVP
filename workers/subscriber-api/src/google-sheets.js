const GOOGLE_SHEETS_SCOPE =
  "https://www.googleapis.com/auth/spreadsheets";

export async function readSpreadsheetMetadata(env) {
  if (!env.GOOGLE_SPREADSHEET_ID) {
    throw new Error(
      "GOOGLE_SPREADSHEET_ID is missing"
    );
  }

  const accessToken =
    await getGoogleSheetsAccessToken(env);

  const url =
    new URL(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
        env.GOOGLE_SPREADSHEET_ID
      )}`
    );

  url.searchParams.set(
    "fields",
    "spreadsheetId,properties(title),sheets(properties(title))"
  );

  const response =
    await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization:
          `Bearer ${accessToken}`,
      },
    });

  const data =
    await response.json();

  if (!response.ok) {
    console.error(
      "Google Sheets metadata request failed",
      data
    );

    throw new Error(
      `Google Sheets request failed (${response.status})`
    );
  }

  return {
    spreadsheetId:
      data.spreadsheetId,
    title:
      data.properties?.title || null,
    sheets:
      Array.isArray(data.sheets)
        ? data.sheets.map(
            (sheet) =>
              sheet.properties?.title
          )
        : [],
  };
}

export async function readSheetRange(
  env,
  range
) {
  if (!env.GOOGLE_SPREADSHEET_ID) {
    throw new Error(
      "GOOGLE_SPREADSHEET_ID is missing"
    );
  }

  if (
    typeof range !== "string" ||
    range.trim() === ""
  ) {
    throw new Error(
      "Google Sheets range is required"
    );
  }

  const accessToken =
    await getGoogleSheetsAccessToken(env);

  const encodedRange =
    encodeURIComponent(
      range.trim()
    );

  const url =
    new URL(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
        env.GOOGLE_SPREADSHEET_ID
      )}/values/${encodedRange}`
    );

  url.searchParams.set(
    "majorDimension",
    "ROWS"
  );

  const response =
    await fetch(
      url.toString(),
      {
        method: "GET",
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    console.error(
      "Google Sheets range read failed",
      data
    );

    throw new Error(
      `Google Sheets range read failed (${response.status})`
    );
  }

  return {
    range:
      data.range || range,
    values:
      Array.isArray(data.values)
        ? data.values
        : [],
  };
}

async function getGoogleSheetsAccessToken(env) {
  if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON is missing"
    );
  }

  let credentials;

  try {
    credentials =
      JSON.parse(
        env.GOOGLE_SERVICE_ACCOUNT_JSON
      );
  } catch {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON is invalid"
    );
  }

  const clientEmail =
    credentials.client_email;

  const privateKey =
    credentials.private_key;

  const tokenUri =
    credentials.token_uri ||
    "https://oauth2.googleapis.com/token";

  if (
    !clientEmail ||
    !privateKey
  ) {
    throw new Error(
      "Google service account credentials are incomplete"
    );
  }

  const now =
    Math.floor(
      Date.now() / 1000
    );

  const jwtHeader = {
    alg: "RS256",
    typ: "JWT",
  };

  const jwtPayload = {
    iss: clientEmail,
    scope:
      GOOGLE_SHEETS_SCOPE,
    aud: tokenUri,
    iat: now,
    exp: now + 3600,
  };

  const unsignedToken =
    `${base64UrlJson(jwtHeader)}.${base64UrlJson(jwtPayload)}`;

  const cryptoKey =
    await crypto.subtle.importKey(
      "pkcs8",
      pemToArrayBuffer(
        privateKey
      ),
      {
        name:
          "RSASSA-PKCS1-v1_5",
        hash:
          "SHA-256",
      },
      false,
      ["sign"]
    );

  const signature =
    await crypto.subtle.sign(
      {
        name:
          "RSASSA-PKCS1-v1_5",
      },
      cryptoKey,
      new TextEncoder().encode(
        unsignedToken
      )
    );

  const assertion =
    `${unsignedToken}.${bytesToBase64Url(
      new Uint8Array(signature)
    )}`;

  const body =
    new URLSearchParams({
      grant_type:
        "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    });

  const response =
    await fetch(
      tokenUri,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body:
          body.toString(),
      }
    );

  const data =
    await response.json();

  if (
    !response.ok ||
    !data.access_token
  ) {
    console.error(
      "Google OAuth token exchange failed",
      data
    );

    throw new Error(
      `Google OAuth failed (${response.status})`
    );
  }

  return data.access_token;
}


function base64UrlJson(value) {
  return bytesToBase64Url(
    new TextEncoder().encode(
      JSON.stringify(value)
    )
  );
}


function bytesToBase64Url(bytes) {
  let binary = "";

  for (
    let i = 0;
    i < bytes.length;
    i += 1
  ) {
    binary +=
      String.fromCharCode(
        bytes[i]
      );
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}


function pemToArrayBuffer(pem) {
  const base64 =
    pem
      .replace(
        "-----BEGIN PRIVATE KEY-----",
        ""
      )
      .replace(
        "-----END PRIVATE KEY-----",
        ""
      )
      .replace(/\s/g, "");

  const binary =
    atob(base64);

  const bytes =
    new Uint8Array(
      binary.length
    );

  for (
    let i = 0;
    i < binary.length;
    i += 1
  ) {
    bytes[i] =
      binary.charCodeAt(i);
  }

  return bytes.buffer;
}