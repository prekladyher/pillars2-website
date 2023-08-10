<script setup lang="ts">
import DialogueGraph from "@/components/graph/DialogueGraph.vue";
import { withBase } from 'vitepress';
import { ref, watch } from 'vue';
import type { ConversationType, StringTable } from "../../shared/types";

const { id, component } = defineProps<{
  id: string,
  component: string
}>();

const conversation = ref<ConversationType>();
const stringtable = ref<StringTable>();

fetch(withBase(`/database/conversations/${id}.json`))
  .then(response => response.json())
  .then(data => conversation.value = data);

watch(conversation, value => {
  if (!value) {
    stringtable.value = undefined;
  } else {
    const filename = value.Filename.toLowerCase().replace(/\.conversation$/, ".json");
    fetch(withBase(`/database/stringtable/${component}/${filename}`))
      .then(response => response.json())
      .then(data => stringtable.value = data);
  }
});
</script>

<template>
  <div class="window" v-if="conversation && stringtable">
    <DialogueGraph
      :component="component"
      :conversation="conversation"
      :stringtable="stringtable"
    />
  </div>
</template>

<style scoped>
.window {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--vp-nav-height) - 1px);
}
</style>