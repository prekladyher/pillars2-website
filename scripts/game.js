import { program } from "commander";
import { join } from "path";
import { fileURLToPath } from "url";
import { loadConversationData, loadConversationMeta } from "./loaders/conversation.js";
import { loadSpeakerData } from "./loaders/speakers.js";
import { loadStringTable } from "./loaders/stringtable.js";

program
  .name("load")
  .description("Loading game assets and preparing game database");

program.command("load")
  .description("Extract game asset data")
  .action(async () => {
    const databasePath = fileURLToPath(new URL("../public/database" , import.meta.url));
    const conversationList = await loadConversationMeta(databasePath);
    for (const conversationMeta of conversationList) {
      await loadConversationData(conversationMeta.ID, databasePath);
      await loadStringTable(
        conversationMeta.Component,
        join("conversations", conversationMeta.Name),
        databasePath
      );
      await loadSpeakerData(databasePath);
    }
  });

program.parseAsync();
