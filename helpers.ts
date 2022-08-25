import * as coda from "@codahq/packs-sdk";
import Immutable = require("immutable");

const regionMap: Immutable.Map<String, String> = Immutable.Map({
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

export function riotApiUrl(region: String) {
  if (regionMap.has(region)) {
    return `https://${regionMap.get(region.toUpperCase())}.api.riotgames.com/lol`; // prettier-ignore
  } else {
    throw new coda.UserVisibleError(
      "Invalid region. Accepted region strings are: BR, EUNE, EUW, JP, KR, LAN, LAS, NA, OCE, TR, RU."
    );
  }
}
