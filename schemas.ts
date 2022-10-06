import * as coda from "@codahq/packs-sdk";

export const SummonerSchema = coda.makeObjectSchema({
  properties: {
    accountId: { type: coda.ValueType.String },
    profileIconId: { type: coda.ValueType.Number },
    profileIconImage: { type: coda.ValueType.String, codaType: coda.ValueHintType.ImageReference },
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
      description: "The number of tokens earned for this champion at the current championLevel.",
      type: coda.ValueType.Number,
    },
    summonerId: { type: coda.ValueType.String },
    champion: { ...ChampionSchema, required: true },
  },
  featuredProperties: ["champion", "championLevel", "chestGranted"],
  idProperty: "championId",
  displayProperty: "championId",
});

export const MatchSchema = coda.makeObjectSchema({
  properties: {
    matchId: { type: coda.ValueType.String, required: true },
    gameStartTimestamp: { type: coda.ValueType.Number, codaType: coda.ValueHintType.DateTime, required: true },
    gameDuration: { type: coda.ValueType.Number, codaType: coda.ValueHintType.Duration },
    gameMode: { type: coda.ValueType.String },
    gameVersion: { type: coda.ValueType.String },
    queueId: { type: coda.ValueType.Number },
    win: { type: coda.ValueType.Boolean },
    participants: {
      type: coda.ValueType.Array,
      items: coda.makeObjectSchema({
        properties: {
          profileIcon: { type: coda.ValueType.Number },
          puuid: { type: coda.ValueType.String },
          summonerName: { type: coda.ValueType.String },
          championId: { type: coda.ValueType.Number },
          championName: { type: coda.ValueType.String },
          champLevel: { type: coda.ValueType.Number },
          teamPosition: { type: coda.ValueType.String },
          lane: { type: coda.ValueType.String },
          kills: { type: coda.ValueType.Number },
          deaths: { type: coda.ValueType.Number },
          assists: { type: coda.ValueType.Number },
          kda: { type: coda.ValueType.Number, precision: 2 },
          killParticipation: { type: coda.ValueType.Number, codaType: coda.ValueHintType.Percent, precision: 2 },
          largestKillingSpree: { type: coda.ValueType.Number },
          largestMultiKill: { type: coda.ValueType.Number },
          item0: { type: coda.ValueType.Number },
          item1: { type: coda.ValueType.Number },
          item2: { type: coda.ValueType.Number },
          item3: { type: coda.ValueType.Number },
          item4: { type: coda.ValueType.Number },
          item5: { type: coda.ValueType.Number },
          item6: { type: coda.ValueType.Number },
          goldEarned: { type: coda.ValueType.Number },
          goldSpent: { type: coda.ValueType.Number },
          totalMinionsKilled: { type: coda.ValueType.Number },
          totalDamageDealtToChampions: { type: coda.ValueType.Number },
          totalDamageTaken: { type: coda.ValueType.Number },
          damageDealtToObjectives: { type: coda.ValueType.Number },
          totalHeal: { type: coda.ValueType.Number },
          damageSelfMitigated: { type: coda.ValueType.Number },
          win: { type: coda.ValueType.Boolean },
          display: { type: coda.ValueType.String },
        },
      }),
    },
  },
  featuredProperties: ["gameStartTimestamp"],
  idProperty: "matchId",
  displayProperty: "display",
});
