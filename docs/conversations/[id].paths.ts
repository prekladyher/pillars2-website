import { loadConversationMeta } from "../../src/node/loaders/conversation";

export default {
  async paths() {
    const result: any[] = [];

    for (const entry of await loadConversationMeta()) {
      result.push({
        params: {
          id: entry.ID,
          component: entry.Component,
        }
      });
    }

    return result;
  }
}
