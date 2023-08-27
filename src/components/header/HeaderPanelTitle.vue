<script setup lang="ts">
import { useConversationStore } from "@/stores/conversation";
import { useDatabaseStore } from "@/stores/database";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const { conversation, loading } = storeToRefs(useConversationStore());

const { database } = storeToRefs(useDatabaseStore());
const title = computed(() => {
  const id = conversation.value?.id;
  return id ? database.value?.conversationsById.get(id)?.Name : "";
});
</script>

<template>
  <div>
    <div v-if="conversation && !loading" class="title">
      {{ title }}
    </div>
    <div v-if="loading" class="loading">
      LOADING...
    </div>
  </div>
</template>

<style scoped>
.loading {
  color: #888888;
}
</style>
