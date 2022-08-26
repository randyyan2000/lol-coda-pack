import * as coda from "@codahq/packs-sdk";
import Immutable = require("immutable");
import { Champion } from "./types";

const regionMap: Immutable.Map<string, string> = Immutable.Map({
  BR: "br1",
  EUNE: "eun1",
  EUW: "euw1",
  JP: "jp1",
  KR: "kr",
  LAN: "la1",
  LAS: "la2",
  NA: "na1",
  OCE: "oc1",
  TR: "tr1",
  RU: "ru",
});

export function riotApiUrl(region: string): string {
  region = region.toUpperCase();
  if (regionMap.has(region)) {
    return `https://${regionMap.get(region)}.api.riotgames.com/lol`; // prettier-ignore
  } else {
    throw new coda.UserVisibleError(
      "Invalid region. Accepted region strings are: BR, EUNE, EUW, JP, KR, LAN, LAS, NA, OCE, TR, RU."
    );
  }
}

export async function getAllChampions(fetcher: coda.Fetcher): Promise<Champion[]> {
  let versionResponse: coda.FetchResponse<string[]> = await fetcher.fetch({
    method: "GET",
    url: "https://ddragon.leagueoflegends.com/api/versions.json",
    disableAuthentication: true,
  });
  let latestVersion = versionResponse.body[0];
  let championsResponse = await fetcher.fetch({
    method: "GET",
    url: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`,
    disableAuthentication: true,
  });
  return Object.entries(championsResponse.body.data).map(([_, info]: [any, any]) => ({
    id: info.id,
    key: Number(info.key),
    name: info.name,
    title: info.title,
    blurb: info.blurb,
    image: `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${info.id}.png`,
    tags: info.tags,
    partype: info.partype,
  }));
}
