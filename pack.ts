import * as coda from "@codahq/packs-sdk";
import * as schemas from "./schemas";
import * as helpers from "./helpers";
import { Champion } from "./types";

// This line creates your new Pack.
export const pack = coda.newPack();

pack.setVersion("5.0");

pack.setSystemAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "X-Riot-Token",
});

pack.addNetworkDomain("riotgames.com");
pack.addNetworkDomain("leagueoflegends.com");

const RegionParameter = coda.makeParameter({
  type: coda.ParameterType.String,
  name: "Region",
  description: "The region the summoner is associated with.",
  suggestedValue: "NA",
});

const SummonerNameParameter = coda.makeParameter({
  type: coda.ParameterType.String,
  name: "Summoner Name",
  description: "The summoner name of the League of Legends account.",
});

pack.addFormula({
  name: "Summoner",
  description: "Gets account information about a League of Legends summoner.",
  parameters: [SummonerNameParameter, RegionParameter],
  resultType: coda.ValueType.Object,
  schema: schemas.SummonerSchema,
  execute: async function ([name, region]: [string, string], context: coda.ExecutionContext) {
    return helpers.getSummonerByName(name, region, context.fetcher);
  },
});

pack.addSyncTable({
  name: "Champions",
  schema: schemas.ChampionSchema,
  identityName: "Champion",
  formula: {
    name: "SyncChampions",
    description: "Sync all champion data.",
    parameters: [],
    execute: async function ([], context) {
      let result = await helpers.getAllChampions(context.fetcher);
      return { result };
    },
  },
});

pack.addSyncTable({
  name: "ChampionMasteries",
  schema: schemas.ChampionMasterySchema,
  identityName: "ChampionMasteries",
  formula: {
    name: "SyncChampionMasteries",
    description: "Sync champion mastery data for a summoner.",
    parameters: [SummonerNameParameter, RegionParameter],
    execute: async function ([name, region]: [string, string], context: coda.ExecutionContext) {
      let summonerId: string = await helpers.getSummonerIdByName(name, region, context.fetcher);
      let championMasteryResponse = await context.fetcher.fetch({
        method: "GET",
        url: `${helpers.riotApiUrl(region)}/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`,
      });
      let allChampionsById: Map<number, Champion> = new Map();
      (await helpers.getAllChampions(context.fetcher)).forEach((champion: Champion) => {
        allChampionsById.set(champion.key, champion);
      });

      let result = championMasteryResponse.body.map((mastery) => ({
        championId: mastery.championId,
        championLevel: mastery.championLevel,
        championPoints: mastery.championPoints,
        lastPlayTime: mastery.lastPlayTime / 1000,
        championPointsSinceLastLevel: mastery.championPointsSinceLastLevel,
        championPointsUntilNextLevel: mastery.championPointsUntilNextLevel,
        chestGranted: mastery.chestGranted,
        tokensEarned: mastery.tokensEarned,
        summonerId: mastery.summonerId,
        champion: allChampionsById.get(mastery.championId),
      }));
      return { result };
    },
  },
});
