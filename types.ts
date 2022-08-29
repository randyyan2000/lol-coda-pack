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
  revisionDate: number;
  name: string;
  summonerId: string;
  puuid: string;
  level: number;
};
