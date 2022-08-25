import * as coda from "@codahq/packs-sdk";
import * as schemas from "./schemas";
import * as helpers from "./helpers";

// This line creates your new Pack.
export const pack = coda.newPack();

pack.setSystemAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "X-Riot-Token",
});

pack.addNetworkDomain("riotgames.com");
pack.addNetworkDomain("leagueoflegends.com");

const RegionParameter = coda.makeParameter({
  type: coda.ParameterType.String,
  name: "Region",
  description: "Region summoner is associated with.",
  suggestedValue: "NA",
});

pack.addFormula({
  name: "Summoner",
  description: "Get account information about a League of Legends summoner.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "Summoner Name",
      description: "League of Legends summoner name",
    }),
    RegionParameter,
  ],
  resultType: coda.ValueType.Object,
  schema: schemas.SummonerSchema,
  execute: async function (
    [name, region]: [String, String],
    context: coda.ExecutionContext
  ) {
    let summonerResponse = await context.fetcher.fetch({
      method: "GET",
      url: `${helpers.riotApiUrl(region)}/summoner/v4/summoners/by-name/${name}`, // prettier-ignore
    });
    let summoner = summonerResponse.body;
    return {
      accountId: summoner.accountId,
      profileIconId: summoner.profileIconId,
      revisionDate: summoner.revisionDate / 1000,
      name: summoner.name,
      summonerId: summoner.id,
      puuid: summoner.puuid,
      level: summoner.summonerLevel,
    };
  },
});

pack.addSyncTable({
  name: "ChampionMasteries",
  schema: schemas.ChampionMasterySchema,
  identityName: "ChampionMasteries",
  formula: {
    name: "SyncChampionMasteries",
    description: "Sync champion data.",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "Summoner Id",
        description: "Id of summoner to retrieve data for.",
      }),
      RegionParameter,
    ],
    execute: async function (
      [id, region]: [String, String],
      context: coda.ExecutionContext
    ) {
      let championMasteryResponse = await context.fetcher.fetch({
        method: "GET",
        url: `${helpers.riotApiUrl(region)}/champion-mastery/v4/champion-masteries/by-summoner/${id}`, // prettier-ignore
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
      }));
      return { result };
    },
  },
});

pack.addSyncTable({
  name: "Champions",
  schema: schemas.ChampionSchema,
  identityName: "Champion",
  formula: {
    name: "SyncChampions",
    description: "Sync champion data.",
    parameters: [],
    execute: async function ([], context) {
      let versionResponse: coda.FetchResponse<String[]> =
        await context.fetcher.fetch({
          method: "GET",
          url: "https://ddragon.leagueoflegends.com/api/versions.json",
          disableAuthentication: true,
        });
      let latestVersion = versionResponse.body[0];
      let championsResponse = await context.fetcher.fetch({
        method: "GET",
        url: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`,
        disableAuthentication: true,
      });
      let result = Object.entries(championsResponse.body.data).map(
        ([_, info]: [any, any]) => ({
          id: info.id,
          key: Number(info.key),
          name: info.name,
          title: info.title,
          blurb: info.blurb,
          image: `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${info.id}.png`,
          tags: info.tags,
          partype: info.partype,
        })
      );
      return { result };
    },
  },
});
