<script setup lang="ts">
import type { ConversationModel } from "@/stores/conversation";
import type { StringTable } from "@/types";
import { Background } from "@vue-flow/background";
import { VueFlow, type Edge, type Node } from "@vue-flow/core";
import { MiniMap } from "@vue-flow/minimap";
import { ref, watchEffect } from "vue";
import { buildConversationGraph } from "./build";

const {
  component,
  conversation,
  stringtable
} = defineProps<{
  component: string,
  conversation: ConversationModel,
  stringtable: StringTable,
}>();

const nodes = ref([] as Node[]);
const edges = ref([] as Edge[]);

watchEffect(() => {
  if (!conversation || !stringtable) {
    nodes.value = [];
    edges.value = [];
  } else {
    const graph = buildConversationGraph(conversation, stringtable);
    nodes.value = graph.nodes;
    edges.value = graph.edges;
  }
});
</script>

<template>
  <div class="border">
    <VueFlow :nodes="nodes" :edges="edges">
      <Background pattern-color="#888" :gap="8" />
      <MiniMap />
    </VueFlow>
  </div>
</template>

<style scoped>
.border {
  flex: 1;
}
</style>
