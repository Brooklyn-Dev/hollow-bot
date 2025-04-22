export type AchievementStats = {
  name: string;
  percent: number;
};

export type SteamAchievementResponse = {
  achievementpercentages: {
    achievements: AchievementStats[];
  };
};
