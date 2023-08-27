import type { ConversationMetaType, SpeakerType } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface DatabaseDataType {
  conversationsById: Map<string, ConversationMetaType>;
  speakersById: Map<string, SpeakerType>;
}

/**
 * Index items with idenfier provided by the given callback.
 */
function createIndex<T, R>(list: T[], resolveKey: (item: T) => R) {
  return new Map(list.map(item => [resolveKey(item), item]));
}

/**
 * Fetch database data.
 */
export function fetchDatabase(): Promise<DatabaseDataType> {
  function doFetch(type: string) {
    return fetch(`${import.meta.env.BASE_URL}/database/${type}.json`).then(res => res.json());
  }

  return Promise.all([
    doFetch("conversations") as Promise<ConversationMetaType[]>,
    doFetch("speakers") as Promise<SpeakerType[]>
  ]).then(([conversations, speakers]) => {
    return {
      conversationsById: createIndex(conversations, it => it.ID),
      speakersById: createIndex(speakers, it => it.ID)
    };
  });
}

/**
 * Use central database store.
 */
export const useDatabaseStore = defineStore({
  id: "database",
  state: () => {
    const database = ref<DatabaseDataType|null>(null);

    const loading = fetchDatabase().then(result => {
      database.value = result;
    });

    return {

      /**
       * Database loading promise.
       */
      loading,

      /**
       * Loaded database data.
       */
      database

    };
  }
});
