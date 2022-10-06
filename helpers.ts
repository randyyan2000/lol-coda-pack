import * as coda from "@codahq/packs-sdk";
import { GLOBALREGIONMAP, QUEUES, REGIONMAP } from "./constants";
import { Champion, Summoner, Match, MatchParticipant } from "./types";

export function riotApiUrl(region: string, global: boolean = false): string {
  region = region.toUpperCase();
  if (REGIONMAP[region] !== undefined) {
    return `https://${global ? GLOBALREGIONMAP[region] : REGIONMAP[region]}.api.riotgames.com/lol`; // prettier-ignore
  } else {
    throw new coda.UserVisibleError(
      "Invalid region. Accepted region strings are: BR, EUNE, EUW, JP, KR, LAN, LAS, NA, OCE, TR, RU."
    );
  }
}

async function getLatestVersion(fetcher: coda.Fetcher): Promise<string> {
  let versionResponse: coda.FetchResponse<string[]> = await fetcher.fetch({
    method: "GET",
    url: "https://ddragon.leagueoflegends.com/api/versions.json",
    disableAuthentication: true,
  });
  return versionResponse.body[0];
}

export async function getAllChampions(fetcher: coda.Fetcher): Promise<Champion[]> {
  let latestVersion = await getLatestVersion(fetcher);
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

export async function getSummonerByName(name: string, region: string, fetcher: coda.Fetcher): Promise<Summoner> {
  let summonerResponse = await fetcher.fetch({
    method: "GET",
    url: `${riotApiUrl(region)}/summoner/v4/summoners/by-name/${name}`,
  });
  let summoner = summonerResponse.body;
  return {
    accountId: summoner.accountId,
    profileIconId: summoner.profileIconId,
    profileIconImage:
      "https://ddragon.leagueoflegends.com/cdn/" +
      `${getLatestVersion(fetcher)}/img/profileicon/` +
      `${summoner.profileIconId}.png`,
    revisionDate: summoner.revisionDate / 1000,
    name: summoner.name,
    summonerId: summoner.id,
    puuid: summoner.puuid,
    level: summoner.summonerLevel,
  };
}

export async function getSummonerIdByName(name: string, region: string, fetcher: coda.Fetcher): Promise<string> {
  return (await getSummonerByName(name, region, fetcher)).summonerId;
}

export async function getPuuidByName(name: string, region: string, fetcher: coda.Fetcher): Promise<string> {
  return (await getSummonerByName(name, region, fetcher)).puuid;
}

export async function getMatchIdsByPuuid(
  puuid: string,
  region: string,
  fetcher: coda.Fetcher,
  startTime?: number,
  endTime?: number,
  start: number = 0,
  count: number = 20
): Promise<string[]> {
  let queryParams = new URLSearchParams({
    start: start.toString(),
    count: count.toString(),
  });
  if (startTime !== undefined) queryParams.append("startTime", startTime.toString());
  if (endTime !== undefined) queryParams.append("startTime", endTime.toString());

  let matchesResponse: coda.FetchResponse<string[]> = await fetcher.fetch({
    method: "GET",
    url: `${riotApiUrl(region, true)}/match/v5/matches/by-puuid/${puuid}/ids?` + queryParams.toString(),
  });
  if (matchesResponse.body === undefined) {
    throw new coda.UserVisibleError("Error fetching recent matches");
  }
  return matchesResponse.body;
}

export async function getMatchIdsByName(
  name: string,
  region: string,
  fetcher: coda.Fetcher,
  startTime?: number,
  endTime?: number,
  start: number = 0,
  count: number = 20
): Promise<string[]> {
  let puuid: string = await getPuuidByName(name, region, fetcher);
  return getMatchIdsByPuuid(puuid, region, fetcher, startTime, endTime, start, count);
}

export async function getMatchByMatchId(
  matchId: string,
  region: string,
  fetcher: coda.Fetcher,
  myPuuid: string
): Promise<Match> {
  const matchResponse = await fetcher.fetch({
    method: "GET",
    url: `${riotApiUrl(region, true)}/match/v5/matches/${matchId}`,
  });
  if (matchResponse.status !== 200) {
    throw new coda.UserVisibleError("Failed to retrieve match.");
  }
  const match = matchResponse.body;
  const matchInfo = match.info;
  let me: MatchParticipant;
  const participants: MatchParticipant[] = [];
  for (const resP of matchInfo.participants) {
    const participant: MatchParticipant = {
      profileIcon: resP.profileIcon,
      puuid: resP.puuid,
      summonerName: resP.summonerName,
      championId: resP.championId,
      championName: resP.championName,
      champLevel: resP.champLevel,
      teamPosition: resP.teamPosition,
      lane: resP.lane,
      kills: resP.kills,
      deaths: resP.deaths,
      assists: resP.assists,
      kda: (resP.kills + resP.assists) / resP.deaths,
      killParticipation: resP.challenges.killParticipation,
      largestKillingSpree: resP.largestKillingSpree,
      largestMultiKill: resP.largestMultiKill,
      item0: resP.item0,
      item1: resP.item1,
      item2: resP.item2,
      item3: resP.item3,
      item4: resP.item4,
      item5: resP.item5,
      item6: resP.item6,
      goldEarned: resP.goldEarned,
      goldSpent: resP.goldSpent,
      totalMinionsKilled: resP.totalMinionsKilled,
      totalDamageDealtToChampions: resP.totalDamageDealtToChampions,
      totalDamageTaken: resP.totalDamageTaken,
      damageDealtToObjectives: resP.damageDealtToObjectives,
      totalHeal: resP.totalHeal,
      damageSelfMitigated: resP.damageSelfMitigated,
      win: resP.win,
      display: `${resP.summonerName} (${resP.championName})`,
    };

    if (participant.puuid === myPuuid) {
      me = participant;
    }
  }

  return {
    matchId: match.metadata.matchId,
    gameStartTimestamp: matchInfo.gameStartTimestamp / 1000,
    gameDuration: matchInfo.gameDuration,
    gameMode: matchInfo.gameMode,
    gameVersion: matchInfo.gameVersion,
    queue: QUEUES[matchInfo.queueId],
    win: me.win,
    me: me,
    participants: participants,
  };
}
