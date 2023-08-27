import FastGlob from "fast-glob";
import { mkdir, readFile, stat, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { getGameBase, loadBundleData } from "./support.js";

/** @typedef {import("../../src/types.js").SpeakerType} SpeakerType */

/** @typedef {import("../../src/types.js").GameDataBundle<SpeakerType>} SpeakerAssetBundle */

/**
 * @param {string} base Database base path.
 * @return {Promise<SpeakerType[]>} Loaded speaker data.
 */
export async function loadSpeakerData(base) {
  const filepath = join(base, "speakers.json");
  try {
    await stat(filepath);
  } catch {
    console.log("Loading speaker data...");
    await mkdir(dirname(filepath), { recursive: true });
    await writeFile(filepath, JSON.stringify(await initSpeakerData(), null, "  "));
  }
  return JSON.parse(await readFile(filepath, "utf-8"));
}

/**
 * @return {Promise<SpeakerType[]>} Loaded string table.
 */
async function initSpeakerData()  {
  const speakerFiles = (await FastGlob("*/design/gamedata/speakers.gamedatabundle" , { 
    cwd: getGameBase(),
  })).sort();
  
  /** @type {Map<string, SpeakerType>} */
  const result = new Map();
  
  for (const speakerFile of speakerFiles) {
    /** @type {SpeakerAssetBundle} */
    const gameData = await loadBundleData(join(getGameBase(), speakerFile));
    for (const speaker of gameData.GameDataObjects) {
      result.set(speaker.ID, speaker);
    }
  }

  return Array.from(result.values());
}
