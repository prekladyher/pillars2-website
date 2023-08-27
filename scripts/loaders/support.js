import dotenv from "dotenv";
import { readFile } from "fs/promises";

dotenv.config();

/**
 * Get game base directory.
 * @return {string} Game base directory as defined in PILLARS_GAME_BASE environment variable.
 */
export function getGameBase() {
  const gameBase = process.env.PILLARS_GAME_BASE;
  if (!gameBase) {
    throw new Error("Missing PILLARS_GAME_BASE environment variable");
  }
  return gameBase;
}

/**
 * Load bundle data while fixing known JSON inconsistencies (BOM and line breaks in string values).
 * @param {string} file Bundle file path.
 * @returns Loaded bundle data.
 */
export async function loadBundleData(file) {
  const rawData = await readFile(file);
  try {
    // Some files are not valid JSON files (they have BOMs and line breaks in values)
    return JSON.parse(new TextDecoder("utf-8").decode(rawData).replaceAll("\n", ""));
  } catch (error) {
    throw new Error(`Error parsing ${file}`, { cause: error });
  }
}
