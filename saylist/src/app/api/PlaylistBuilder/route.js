import { getGenericToken } from "@/Spotify/Auth/serverAuth";
import { makePhrase } from "./utilities";

const CLIENT_ID = "a1143666ce6a418ab007c2501431c096";
const CLIENT_SECRET = "e6138706c3d64583ad685dcfd185d8c8";
const AUTH_TOKEN_GRANT_TYPE = "client_credentials";

class SayListBlock {
  constructor(index, wordIndex, maxSize) {
    this.index = index;
    this.wordIndex = wordIndex;
    this.sizesNotTried = this.createSizeList(maxSize);
    this.sizeLastTried = 0; // Assuming a default value
    this.track = null; // Assuming a default value, adjust based on your needs
    this.phrase = ""; // Assuming a default value
  }

  createSizeList(maxSize) {
    let list = [];
    for (let i = 1; i <= maxSize; i++) {
      list.push(i);
    }

    // Shuffling the list
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]]; // Swap elements
    }

    return list;
  }
}

const searchTracks = async (accessToken, query) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const args = new URLSearchParams({
    q: query,
    type: "track",
    limit: "50",
  });

  const reponse = await fetch(`https://api.spotify.com/v1/search?${args}`, {
    method: "GET",
    headers: headers,
  });

  const trackResponse = await reponse.json();
  return trackResponse;
};

export const POST = async (req) => {
  try {
    const { message } = await req.json();

    let accessToken = await getGenericToken();

    let searchResult = await searchTracks(accessToken, "hello");

    let playlist = [];
    let current_block = null;
    let block_index = 0;
    let words_remaining = message.length;
    let word_index = 0;

    let forward = true; //we might not use this

    let complete = true;

    while (words_remaining > 0) {
      if (block_index == -1) {
        let failed_block = playlist.pop();
        block_index = failed_block.index;
        word_index = failed_block.word_index;
        words_remaining--;

        current_block = new SayListBlock(
          block_index,
          word_index,
          Math.min(words_remaining, 7)
        );
        playlist.push(current_block);

        if (words_remaining <= 0) break;
      } else if (block_index < playlist.length) {
        current_block = playlist[block_index];
      } else {
        current_block = new SayListBlock(
          block_index,
          word_index,
          Math.min(words_remaining, 7)
        );

        playlist.push(current_block);
      }

      if (current_block.sizesNotTried.length) {
        let size = current_block.sizesNotTried.pop();

        if (size <= words_remaining) {
          current_block.sizeLastTried = size;
          current_block.phrase = makePhrase(words, word_index, size);
        }
      }
    }

    console.log(message);

    return new Response("Success!", { status: 200 });
  } catch (error) {
    console.log("we got an error!");
    console.log(error);
    return new Response(`Failure ${error}`, { status: 500 });
  }
};
