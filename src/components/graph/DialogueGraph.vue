<script setup lang="ts">
import { buildConversationGraph } from "@/graph/build.js";
import { type ConversationType } from "@/types.js";
import { Background } from "@vue-flow/background";
import { VueFlow, type Edge, type Node } from "@vue-flow/core";
import { MiniMap } from "@vue-flow/minimap";
import { ref, toRef, watch } from "vue";

const props = defineProps<{
  conversation: ConversationType;
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
      const graph = buildConversationGraph(conversation);
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
      <Background pattern-color="#aaa" :gap="8" />
      <MiniMap />
    </VueFlow>
  </div>
</template>

<style scoped></style>
