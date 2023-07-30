import { loadConversationMeta } from "../../src/loader/conversation";

export default {
  async paths() {
    const meta = await loadConversationMeta();
    return meta.map(entry => ({
      params: {
        id: entry.ID
      }
    }));
  }
}
