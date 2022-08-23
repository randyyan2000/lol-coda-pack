import * as coda from "@codahq/packs-sdk";

// This line creates your new Pack.
export const pack = coda.newPack();

pack.addNetworkDomain("leagueoflegends.com");

const ChampionSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String, required: true },
    name: { type: coda.ValueType.String, required: true },
    title: { type: coda.ValueType.String },
    blurb: { type: coda.ValueType.String },
    image: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    tags: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    partype: { type: coda.ValueType.String },
  },
  featuredProperties: ["title", "image"],
  idProperty: "name",
  displayProperty: "name",
});

pack.addSyncTable({
  name: "Champions",
  schema: ChampionSchema,
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
        });
      let latestVersion = versionResponse.body[0];
      let championsResponse = await context.fetcher.fetch({
        method: "GET",
        url: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`,
      });
      let result = Object.entries(championsResponse.body.data).map(
        ([_, info]: [any, any]) => ({
          id: info.id,
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
