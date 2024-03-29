const SEARCH_URL = "https://api.spotify.com/v1/search?";

export class Search {
  constructor(fetchAccessToken) {
    this.fetchAccessToken = fetchAccessToken;
    this.accessToken = "";
    this.accessTokenExpiration = null;
    this.expiration = null;
  }

  async getAccessToken() {
    //if accessToken hasn't been populated yet, or if it's expired, fetch it
    try {
      if (
        !this.accessToken ||
        (this.expiration && Date.now() > this.expiration)
      ) {
        let accessTokenResponse = await this.fetchAccessToken();
        this.accessToken = accessTokenResponse.access_token;
        const expiresIn = accessTokenResponse.expires_in;
        this.expiration = new Date(Date.now() + (expiresIn - 30) * 1000);
      }
    } catch (error) {
      console.error("error fetching access token", error);
    }

    return this.accessToken;
  }

  async searchTracks(query) {
    const accessToken = await this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const args = new URLSearchParams({
      q: query,
      type: "track",
      limit: "50",
    });

    const reponse = await fetch(`${SEARCH_URL}${args}`, {
      method: "GET",
      headers: headers,
    });

    const trackResponse = await reponse.json();

    let simplifiedResponse = trackResponse.tracks.items
      .map((item) => ({
        name: item.name,
        album: {
          id: item.album.id,
          images: item.album.images,
          name: item.album.name,
        },
        artists: item.artists.map((artist) => artist.name),
        popularity: item.popularity,
      }))
      .filter(
        (track) =>
          track.name.replace(/[\s\p{P}]/gu, "").toLowerCase() ==
          query.replace(/[\s\p{P}]/gu, "").toLowerCase()
      )
      .sort((a, b) => b.popularity - a.popularity);
    return simplifiedResponse;
  }
}
