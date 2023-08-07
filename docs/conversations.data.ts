import { loadConversationMeta } from "../src/node/loaders/conversation";

export default {
  async load() {
    return loadConversationMeta();
  }
};