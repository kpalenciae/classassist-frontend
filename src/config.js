const cleanUrl = (url) => {
  if (!url) return null;
  return url.replace(/^"|"$/g, "").trim();
};

const envUrl = cleanUrl(import.meta.env.VITE_BACKEND_URL);

export const API_URL =
  envUrl && envUrl.startsWith("http")
    ? envUrl
    : "https://classassist-backend-1rvg.onrender.com";
    console.log("ENV:", import.meta.env.VITE_BACKEND_URL);
console.log("API_URL FINAL:", API_URL);