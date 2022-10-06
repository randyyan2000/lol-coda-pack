export type Champion = {
  id: string;
  key: number;
  name: string;
  title: string;
  blurb: string;
  image: string;
  tags: string[];
  partype: string;
};

export type Summoner = {
  accountId: string;
  profileIconId: number;
  profileIconImage: string;
  revisionDate: number;
  name: string;
  summonerId: string;
  puuid: string;
  level: number;
};

export type MatchParticipant = {
  profileIcon: number;
  puuid: string;
  summonerName: string;
  championId: number;
  championName: string;
  champLevel: number;
  teamPosition: string;
  lane: string;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  killParticipation: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  item0: number; // item id
  item1: number; // item id
  item2: number; // item id
  item3: number; // item id
  item4: number; // item id
  item5: number; // item id
  item6: number; // item id
  goldEarned: number;
  goldSpent: number;
  totalMinionsKilled: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  damageDealtToObjectives: number;
  totalHeal: number;
  damageSelfMitigated: number;
  win: boolean;
  display: string;
};

export type Match = {
  matchId: string;
  gameStartTimestamp: number;
  gameDuration: number;
  gameMode: string;
  gameVersion: string;
  queue: string;
  win: boolean;
  me: MatchParticipant;
  participants: MatchParticipant[];
};
