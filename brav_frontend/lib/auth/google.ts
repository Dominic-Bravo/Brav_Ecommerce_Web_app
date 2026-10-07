const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI =
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.");
}

if (!GOOGLE_REDIRECT_URI) {
  throw new Error("NEXT_PUBLIC_GOOGLE_REDIRECT_URI is not configured.");
}

const GOOGLE_AUTHORIZATION_ENDPOINT =
  "https://accounts.google.com/o/oauth2/v2/auth";

export function startGoogleLogin() {
  const state = crypto.randomUUID();

  sessionStorage.setItem("google_oauth_state", state);

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  window.location.href =
    `${GOOGLE_AUTHORIZATION_ENDPOINT}?${params.toString()}`;
}