---
title: Conversations
layout: doc
---

<script setup>
import { data } from "./conversations.data.ts";
import { withBase } from "vitepress";
</script>

<ul>
  <li v-for="entry in data">
    {{ entry.Component }}
    <a :href="withBase(`/conversations/${entry.ID}.html`)">
      {{ entry.Name }}
    </a>
  </li>
</ul>

