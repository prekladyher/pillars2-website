import { basename, dirname, join } from "path";
import { loadConversationData, loadConversationMeta } from "../../src/node/loaders/conversation";
import { loadStringTable } from "../../src/node/loaders/stringtable";

export default {
  async paths() {
    const result: any[] = [];

    for (const entry of await loadConversationMeta()) {
      const conversation = await loadConversationData(entry.ID);
      const filename = conversation.Filename.toLowerCase();
      const stringtable = await loadStringTable(
        entry.Component,
        join(dirname(filename), basename(filename, ".conversation"))
      );

      result.push({
        params: {
          id: entry.ID,
          component: entry.Component,
          conversation: JSON.stringify(conversation),
          stringtable: JSON.stringify(conversation)
        }
      });
    }

    return result;
  }
}
