import FastGlob from "fast-glob";
import { mkdir, readFile, stat, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { getGameBase } from "./support.js";

/** @typedef {import("../../src/types.js").ConversationMetaType} ConversationMetaType */

/**
 * @param {string} base Database base path.
 * @return {Promise<ConversationMetaType[]>}
 */
export async function loadConversationMeta(base) {
  const filename = `${base}/conversations.json`;
  try {
    await stat(filename);
  } catch {
    console.log("Loading conversation metadata...");
    await mkdir(dirname(filename), { recursive: true });
    await writeFile(filename, JSON.stringify(await initConversationMeta(), null, "  "));
  }
  return JSON.parse(await readFile(filename, "utf-8"));
}

/**
 * @return {Promise<ConversationMetaType[]>}
 */
export async function initConversationMeta()  {
  const conversationFiles = (await FastGlob("*/design/conversations/**/*.conversationbundle" , { 
    cwd: getGameBase(),
  })).sort();
  const result = [];
  for (const conversationFile of conversationFiles) {
    const component = conversationFile.replace(/\/.*/, "");
    const filename = conversationFile.replace(/^[^/]+\//, "");
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

/** @typedef {import("../../src/types.js").ConversationType} ConversationType */

/**
 * @param {string} id Conversation identifier.
 * @param {string} base Database base path.
 * @return {Promise<ConversationType>}
 */
export async function loadConversationData(id, base) {
  const filename = join(`${base}/conversations/${id}.json`);
  try {
    await stat(filename);
  } catch {
    console.log(`Loading conversation data '${id}'...`);
    await mkdir(dirname(filename), { recursive: true });
    await writeFile(filename, JSON.stringify(await initConversationData(id, base), null, "  "));
  }
  return JSON.parse(await readFile(filename, "utf-8"));
}

/**
 * @param {string} id Conversation identifier.
 * @param {string} base Database base path.
 * @return {Promise<ConversationType>}
 */
async function initConversationData(id, base) {
  const meta = (await loadConversationMeta(base)).find(meta => meta.ID === id);
  if (!meta) {
    throw new Error(`Invalid conversation ID: ${id}`);
  }
  const filename = join(getGameBase(), meta.Component, meta.Filename);
  return JSON.parse(await readFile(filename, "utf-8")).Conversations[0];
}
