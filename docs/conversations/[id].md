---
title: CONVERSATION_TITLE
aside: false
layout: page
---

<script setup>
import { useData } from "vitepress";
import { computed } from "vue";
import DialogueGraph from "@/components/graph/DialogueGraph.vue";

const { params } = useData();

const component = computed(() => params.value.component);
const conversation = computed(() => JSON.parse(params.value.conversation));
const stringtable = computed(() => JSON.parse(params.value.stringtable));
</script>

<DialogueGraph
  :class="$style.content"
  :conversation="conversation"
  :stringtable="stringtable"
/>

<style module>
.content {
  position: relative;
  width: 100vw;
  height: calc(100vh - var(--vp-nav-height));
}
</style>
