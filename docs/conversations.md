---
title: Conversations
aside: false
---

<script setup>
import { data } from "./conversations.data.ts";
import { withBase } from "vitepress";
</script>

# Conversations

<ul>
  <li v-for="entry in data">
    <span :class="$style.badge">
      {{ entry.Component }}
    </span>
    <a :href="withBase(`/conversations/${entry.ID}.html`)">
      {{ entry.Name }}
    </a>
  </li>
</ul>

<style module>
.badge {
  font-size: 12px;
  padding: 3px 5px;
  margin-right: 8px;
  border-radius: 3px;
  background: #333333;
}
</style>