<script setup lang="ts">
import { Background } from "@vue-flow/background";
import { VueFlow, type Edge, type Node } from "@vue-flow/core";
import { MiniMap } from "@vue-flow/minimap";
import { ref, toRef, watch } from "vue";
import { buildConversationGraph } from "../../../shared/graph";
import type { ConversationType, StringTable } from "../../../shared/types";

const props = defineProps<{
  component: string,
  conversation: ConversationType,
  stringtable: StringTable,
}>();

const nodes = ref([] as Node[]);
const edges = ref([] as Edge[]);

watch(
  toRef(() => props.conversation),
  (conversation) => {
    if (!conversation) {
      nodes.value = [];
      edges.value = [];
    } else {
      const graph = buildConversationGraph(conversation, props.stringtable);
      nodes.value = graph.nodes;
      edges.value = graph.edges;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <VueFlow :nodes="nodes" :edges="edges">
      <Background pattern-color="#888" :gap="8" />
      <MiniMap />
    </VueFlow>
  </div>
</template>

<style scoped></style>
