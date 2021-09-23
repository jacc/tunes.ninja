import axios from "axios";
import { load } from "cheerio";

export const fetchGenius = async (data: LyricsRequest) => {
  const optimizedFetchTitle = `${data.artist} - ${data.title}`;
  const requestURL = `https://api.genius.com/search?q=${encodeURIComponent(
    optimizedFetchTitle
  )}`;

  try {
    const searchResult = await axios.get(requestURL, {
      validateStatus: (code) => code === 200,
      headers: {
        authorization: `Bearer ${process.env.GENIUS_AUTH}`,
        "user-agent": `tunes.ninja TCLS-LB/${process.pid}`,
      },
    });

    const searchData = searchResult.data;
    if (searchData.response.hits.length === 0) {
      return {
        copyright: null,
        staticLyrics: null,
        syncedLyrics: null,
      };
    }
    const results = searchData.response.hits.map((hit: any) => {
      return { uniqueLookup: hit.result.url };
    });

    const scraperResult = await axios.get(results[0].uniqueLookup, {
      validateStatus: (code) => code === 200,
      headers: {
        authorization: `Bearer ${process.env.GENIUS_AUTH}`,
        "user-agent": `tunes.ninja TCLS-LB/${process.pid}`,
      },
    });

    const html = scraperResult.data;
    const loadedData = load(html);

    let lyrics = loadedData('div[class="lyrics"]').text().trim();
    if (!lyrics) {
      lyrics = "";
      loadedData('div[class^="Lyrics__Container"]').each((_index, element) => {
        if (loadedData(element).text().length != 0) {
          const snippet = loadedData(element)
            .html()
            ?.replace(/<br>/g, "\n")
            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
          lyrics +=
            loadedData("<textarea/>")
              .html(snippet ?? "")
              .text()
              .trim() + "\n\n";
        }
      });
    }

    if (!lyrics) throw new Error("Nothing");

    return {
      copyright: null,
      staticLyrics: lyrics.trim(),
      syncedLyrics: null,
    };
  } catch {
    return {
      copyright: null,
      staticLyrics: null,
      syncedLyrics: null,
    };
  }
};

interface LyricsRequest {
  title: string;
  artist: string;
  album?: string;
}
