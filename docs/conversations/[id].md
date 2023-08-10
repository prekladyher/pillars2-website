---
title: CONVERSATION_TITLE
aside: false
layout: page
---

<script setup>
import { useData } from "vitepress";
import ConversationView from "@/views/ConversationView.vue";

const { params } = useData();

const id = params.value.id;
const component = params.value.component;
</script>

<ClientOnly>
  <ConversationView :id="id" :component="component" />
</ClientOnly>

<style module>
.content {
  position: relative;
  width: 100vw;
  height: calc(100vh - var(--vp-nav-height));
}
</style>
