import FastGlob from "fast-glob";
import { mkdir, readFile, stat, writeFile } from "fs/promises";
import { dirname, join } from "path";
import type { ConversationMetaType, ConversationType } from "../../shared/types";
import { getGameBase } from "./support";

const DATABASE_BASE = "docs/public/database";

export async function loadConversationMeta(): Promise<ConversationMetaType[]> {
  const filename = `${DATABASE_BASE}/conversations.json`;
  try {
    await stat(filename);
  } catch {
    console.log("Loading conversation metadata...");
    await writeFile(filename, JSON.stringify(await initConversationMeta(), null, "  "));
  }
  return JSON.parse(await readFile(filename, "utf-8"));
}

export async function initConversationMeta()  {
  const conversationFiles = (await FastGlob("*/design/conversations/**/*.conversationbundle" , { 
    cwd: getGameBase(),
  })).sort();
  const result: ConversationMetaType[] = [];
  for (const conversationFile of conversationFiles) {
    const component = conversationFile.replace(/\/.*/, "");
    const filename = conversationFile.replace(/^[^\/]+\//, "");
    const conversation = JSON.parse((await readFile(join(getGameBase(), conversationFile), "utf-8"))).Conversations[0];
    result.push({
      Component: component,
      ID: conversation.ID,
      Name: filename.replace(/design\/conversations\/(.*)\.conversationbundle/, "$1"),
      Filename: filename
    });
  }
  return result;
}

export async function loadConversationData(id: string): Promise<ConversationType> {
  const filename = join(`${DATABASE_BASE}/conversations/${id}.json`)
  try {
    await stat(filename);
  } catch {
    console.log(`Loading conversation data '${id}'...`);
    await mkdir(dirname(filename), { recursive: true });
    await writeFile(filename, JSON.stringify(await initConversationData(id), null, "  "));
  }
  return JSON.parse(await readFile(filename, "utf-8"));
}

async function initConversationData(id: string): Promise<ConversationType> {
  const meta = (await loadConversationMeta()).find(meta => meta.ID === id);
  if (!meta) {
    throw new Error(`Invalid conversation ID: ${id}`);
  }
  const filename = join(getGameBase(), meta.Component, meta.Filename);
  return JSON.parse(await readFile(filename, "utf-8")).Conversations[0];
}
