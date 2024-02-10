import { getGenericToken } from "@/Spotify/Auth/serverAuth";
import { makePhrase } from "./utilities";
import { SayListBlock } from "./SayListBlock";
import { Search } from "@/Spotify/Search/search";

const CLIENT_ID = "a1143666ce6a418ab007c2501431c096";
const CLIENT_SECRET = "e6138706c3d64583ad685dcfd185d8c8";
const AUTH_TOKEN_GRANT_TYPE = "client_credentials";

const search = new Search(getGenericToken); //TODO: rename this to reflect that it's an object that helps us search

export const POST = async (req) => {
  try {
    const { message } = await req.json();

    //let accessToken = await getGenericToken();

    //let searchResult = await searchTracks(accessToken, "hello");

    let blah = await search.searchTracks("hello");

    let blooh = await search.searchTracks("fortnite");

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
          current_block.phrase = makePhrase(message, word_index, size);
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
