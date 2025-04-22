import fetch from "node-fetch";
import { AchievementStats, SteamAchievementResponse } from "../types/achievementsTypes";

const API_URL = `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?key=${process.env.STEAM_API_KEY}&gameid=367520&format=json`;

let cachedStats: Record<string, number> = {};

async function fetchAchievementStats() {
  try {
    const res = await fetch(API_URL);
    const json = (await res.json()) as SteamAchievementResponse;

    const list: AchievementStats[] = json.achievementpercentages.achievements;

    cachedStats = Object.fromEntries(list.map((a) => [a.name, a.percent]));
    console.log("✅ Steam achievement stats updated.");
  } catch (err) {
    console.error("⚠️ Failed to fetch Steam achievement stats:", err);
  }
}

// Fetch on import
fetchAchievementStats();

// Refresh every 24 hours
setInterval(fetchAchievementStats, 1000 * 60 * 60 * 24);

export function getAchievementPercent(name: string): number | null {
  return cachedStats[name] ?? null;
}
