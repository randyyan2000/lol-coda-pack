import * as coda from "@codahq/packs-sdk";

export const SummonerSchema = coda.makeObjectSchema({
  properties: {
    accountId: { type: coda.ValueType.String },
    profileIconId: { type: coda.ValueType.Number },
    revisionDate: { type: coda.ValueType.Number, codaType: coda.ValueHintType.DateTime },
    name: { type: coda.ValueType.String },
    summonerId: { description: "Encrypted summoner ID.", type: coda.ValueType.String, required: true },
    puuid: { type: coda.ValueType.String },
    level: { type: coda.ValueType.Number },
  },
  displayProperty: "name",
});

export const ChampionSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String, required: true },
    key: { type: coda.ValueType.Number, required: true },
    name: { type: coda.ValueType.String, required: true },
    title: { type: coda.ValueType.String },
    blurb: { type: coda.ValueType.String },
    image: { type: coda.ValueType.String, codaType: coda.ValueHintType.ImageReference },
    tags: { type: coda.ValueType.Array, items: { type: coda.ValueType.String } },
    partype: { type: coda.ValueType.String },
  },
  featuredProperties: ["title", "image"],
  idProperty: "key",
  displayProperty: "name",
});

export const ChampionMasterySchema = coda.makeObjectSchema({
  properties: {
    championId: { type: coda.ValueType.Number, required: true },
    championLevel: { type: coda.ValueType.Number },
    championPoints: { type: coda.ValueType.Number },
    lastPlayTime: { type: coda.ValueType.Number, codaType: coda.ValueHintType.DateTime },
    championPointsSinceLastLevel: { type: coda.ValueType.Number },
    championPointsUntilNextLevel: {
      description:
        "Number of points needed to achieve next level. " +
        "Zero if player reached maximum champion level for this champion.",
      type: coda.ValueType.Number,
    },
    chestGranted: {
      description: "Is chest granted for this champion or not in current season.",
      type: coda.ValueType.Boolean,
    },
    tokensEarned: {
      description: "The token earned for this champion at the current championLevel",
      type: coda.ValueType.Number,
    },
    summonerId: { type: coda.ValueType.String },
    champion: { ...ChampionSchema, required: true },
  },
  featuredProperties: ["champion", "championLevel", "chestGranted"],
  idProperty: "championId",
  displayProperty: "championId",
});
