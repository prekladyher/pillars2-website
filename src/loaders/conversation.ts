import dotenv from "dotenv";
import FastGlob from "fast-glob";
import { readFile, stat, writeFile } from "fs/promises";
import { join } from "path";

dotenv.config();

export interface ConversationInfo {
  Component: string;
  ID: string;
  Name: string;
  Filename: string;
}

const CONVERSATIONS_META_FILE = "data/conversations.json";

export async function loadConversationMeta(): Promise<ConversationInfo[]> {
  try {
    await stat(CONVERSATIONS_META_FILE);
  } catch {
    console.log("Loading conversation metadata...");
    await writeFile(
      CONVERSATIONS_META_FILE,
      JSON.stringify(await initConversationMeta(), null, "  ")
    );
  }
  return JSON.parse(await readFile(CONVERSATIONS_META_FILE, "utf-8"));
}

function getGameBase() {
  const gameBase = process.env.PILLARS_BASE;
  if (!gameBase) {
    throw new Error(`Missing PILLARS_BASE environment variable`);
  }
  return gameBase;
}

export async function initConversationMeta() {
  const conversationFiles = (
    await FastGlob("*/design/conversations/**/*.conversationbundle", {
      cwd: getGameBase()
    })
  ).sort();
  const result: ConversationInfo[] = [];
  for (const conversationFile of conversationFiles) {
    const component = conversationFile.replace(/\/.*/, "");
    const filename = conversationFile.replace(/^[^\/]+\//, "");
    const conversation = JSON.parse(await readFile(join(getGameBase(), conversationFile), "utf-8"))
      .Conversations[0];
    result.push({
      Component: component,
      ID: conversation.ID,
      Name: filename.replace(/design\/conversations\/(.*)\.conversationbundle/, "$1"),
      Filename: filename
    });
  }
  return result;
}

export interface ConversationData {
  [key: string]: any;
}

export async function loadConversationData(id: string): Promise<ConversationData> {
  const meta = (await loadConversationMeta()).find((meta) => meta.ID === id);
  if (!meta) {
    throw new Error(`Invalid conversation ID: ${id}`);
  }
  const filename = join(getGameBase(), meta.Component, meta.Filename);
  return JSON.parse(await readFile(filename, "utf-8")).Conversations[0];
}
