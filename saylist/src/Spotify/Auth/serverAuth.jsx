const CLIENT_ID = "a1143666ce6a418ab007c2501431c096";
const CLIENT_SECRET = "e6138706c3d64583ad685dcfd185d8c8";
const TOKEN_URL = new URL("https://accounts.spotify.com/api/token");

export const getGenericToken = async () => {
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  const base64Credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  headers.append("Authorization", `Basic ${base64Credentials}`);

  // Data with the grant type
  const data = "grant_type=client_credentials";
  try {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: headers,
      body: data,
    });

    const authResponse = await response.json();
    return authResponse.access_token;
  } catch (error) {
    console.error("Error: ", error);
  }
};
