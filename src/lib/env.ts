const fallbackBaseUrl = "http://localhost:3000";

export function getBaseUrl() {
  const raw =
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL ||
    fallbackBaseUrl;

  const normalized = raw.startsWith("http") ? raw : `https://${raw}`;

  try {
    return new URL(normalized);
  } catch {
    return new URL(fallbackBaseUrl);
  }
}

export function getBaseUrlString() {
  return getBaseUrl().toString().replace(/\/$/, "");
}
