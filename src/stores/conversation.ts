import type { ConversationLinkType, ConversationMetaType, ConversationNodeType, ConversationType, StringTable } from "@/types";
import { defineStore } from "pinia";
import { useDatabaseStore } from "./database";

/**
 * Loaded conversation model.
 */
export interface ConversationModel {

  /**
   * Conversation identifier.
   */
  id: string;

  /**
   * Conversation node index.
   */
  nodesById: Map<number, ConversationNodeType>;

  /**
   * Conversation link index.
   */
  linksById: Map<string, ConversationLinkType>;

}

/**
 * Build conversation model from the given conversation data.
 */
export function defineConversation(data: ConversationType): ConversationModel {
  const id = data.ID;
  const nodes = data.Nodes || [];

  const nodesById = new Map(nodes.map(node => [node.NodeID, node]));

  const linksById = new Map(nodes.map(node => {
    return (node.Links || []).map((link, idx) => ({
      id: `${node.NodeID}_${idx}`,
      ...link
    }));
  }).flat().map(link => [link.id, link]));

  return { id, nodesById, linksById };
}

/**
 * Fetch conversation data from the server.
 */
export function fetchConversation(id: string) {
  return fetch(`${import.meta.env.BASE_URL}/database/conversations/${id}.json`)
      .then(res => res.json())
      .then(json => defineConversation(json));
}

/**
 * Fetch stringtable data from the server.
 */
export function fetchStringTable(name: string) {
  return fetch(`${import.meta.env.BASE_URL}/database/stringtable/${name}`)
      .then(res => res.json()) as Promise<StringTable>;
}

/**
 * Find valid conversation start node.
 */
export function findStartNode(conversation: ConversationModel): ConversationNodeType {
  return conversation.nodesById.get(0) as ConversationNodeType;
}

/**
 * Use conversation store.
 */
export const useConversationStore = defineStore({
  id: "conversation",
  state: () => {
    return {

      /**
       * Flag indicating that the conversation data is being loaded.
       */
      loading: false,

      /**
       * Flag indicating whether to show additional debug information.
       */
      debug: false,

      /**
       * Conversation meta data.
       */
      metadata: undefined as ConversationMetaType|undefined,

      /**
       * Conversation data mode.
       */
      conversation: undefined as ConversationModel|undefined,

      /**
       * Conversation string table.
       */
      stringtable: undefined as StringTable|undefined,

      /**
       * Currently active (focused) conversation node.
       */
      currentNode: undefined as ConversationNodeType|undefined,

      /**
       * Currently active (focused) conversation path.
       */
      activePath: [] as ConversationNodeType[]

    };
  },
  actions: {

    /**
     * Load data for conversation with the given identifier.
     */
    async loadConversation(id: string) {
      this.loading = true;
      try {
        // Load metadata
        const databaseStore = useDatabaseStore();
        await databaseStore.loading;
        this.metadata = databaseStore.database?.conversationsById.get(id);
        // Load conversation
        this.conversation = await fetchConversation(id);
        // Load stringtable
        this.stringtable = await fetchStringTable(`${this.metadata?.Component}/conversations/${this.metadata?.Name}.json`);
        // Reset selection state
        this.currentNode = undefined;
        this.activePath = [];
      } finally {
        this.loading = false;
      }
    },

    /**
     * Switch currently active node.
     */
    updateCurrentNode(node: ConversationNodeType|undefined) {
      this.currentNode = node;
    },

   /**
    * Switch currently active node path.
    */
    updateActivePath(path: ConversationNodeType[]) {
      this.activePath = path;
    }

  }
});
