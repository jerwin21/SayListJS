import { useEffect, useState } from "react";

import { getUserToken, refreshSpotifyToken } from "@/Spotify/Auth/auth";

export default function useRefreshToken(code) {
  const [expiresIn, setExpiresIn] = useState(0);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //uses code from inital authorization to get access and refresh tokens. Stores them in session storage.
  const fetchToken = async () => {
    let response = await getUserToken(code);
    console.log("DEBUG: access token response");
    console.log(response);
    setRefreshToken(response.refresh_token);
    setAccessToken(response.access_token);
    setExpiresIn(response.expires_in);
    sessionStorage.setItem("access_token", response.access_token);
    sessionStorage.setItem("refresh_token", response.refresh_token);
    sessionStorage.setItem("expires_in", response.expires_in);
  };

  // uses refresh token to retrieve new access and refresh tokens. Stores them in session storage.
  const refreshTokenFn = async () => {
    let response = await refreshSpotifyToken(refreshToken);
    setAccessToken(response.access_token);
    setExpiresIn(response.expires_in);
    //setRefreshToken(response.refresh_token); //TODO: why does this
    sessionStorage.setItem("access_token", response.access_token);
    sessionStorage.setItem("expires_in", response.expires_in);
    sessionStorage.setItem("refresh_token", response.refresh_token);
  };

  //on initial load, grabs refresh token from session storage and sets state variable
  useEffect(() => {
    console.log("DEBUG: grabbing values from session storage");
    let refresh = sessionStorage.getItem("refresh_token");
    console.log("refresh token from storage - " + refresh);
    setRefreshToken(refresh);
  }, []);

  //when refreshToken
  useEffect(() => {
    if (refreshToken) {
      console.log("refresh token from hook state - " + refreshToken);
      if (!refreshToken) return;
      refreshTokenFn();
    }
  }, [refreshToken]);

  useEffect(() => {
    console.log("hello numba 1");
    if (!code) {
      return;
    }
    console.log("DEBUG: original fetchToken() call");
    fetchToken();
  }, [code]);

  useEffect(() => {
    console.log("hello numba 2");
    if (!refreshToken || !expiresIn) return;
    console.log("DEBUG: setting interval");
    const interval = setInterval(() => {
      refreshTokenFn();
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!accessToken);

    setIsLoading(false);

    console.log("hello numba 3");
  }, [accessToken]);

  console.log("DEBUG: useRefreshToken return");
  console.log(isAuthenticated);
  console.log(accessToken);
  return { isAuthenticated, isLoading };
}
