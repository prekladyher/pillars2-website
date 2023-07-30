import { loadConversationMeta } from "../src/loader/conversation";

export default {
  async load() {
    return loadConversationMeta();
  }
};
