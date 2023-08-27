<script setup lang="ts">
import TextBadge from "@/components/shared/TextBadge.vue";
import { useDatabaseStore } from "@/stores/database";
import { storeToRefs } from "pinia";

const { database } = storeToRefs(useDatabaseStore());
</script>

<template>
  <main>
    <ul v-if="database">
      <li v-for="[id, conversation] in database.conversationsById" :key="id">
        <router-link :to="`/conversations/${id}`" class="link">
          <TextBadge>{{ conversation.Component }}</TextBadge>
          <TextBadge>{{ id }}</TextBadge>
          <span>{{ conversation.Name }}</span>
        </router-link>
      </li>
    </ul>
  </main>
</template>

<style scoped>
main {
  overflow-y: scroll;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
ul > li {
  padding: 2px 10px;
}
ul > li + li {
  border-top: 1px solid var(--color-border-hover);
}
.link {
  text-decoration: none;
}
.link > * + * {
  margin-left: 8px;
}
</style>
