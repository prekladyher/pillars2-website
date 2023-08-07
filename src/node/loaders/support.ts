import dotenv from "dotenv";

dotenv.config();

export function getGameBase() {
  const gameBase = process.env.PILLARS_GAME_BASE;
  if (!gameBase) {
    throw new Error(`Missing PILLARS_BASE environment variable`);
  }
  return gameBase;
}
