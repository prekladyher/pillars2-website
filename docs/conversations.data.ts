import { loadConversationMeta } from "@/loaders/conversation.js";

export default {
  async load() {
    return loadConversationMeta();
  }
};
