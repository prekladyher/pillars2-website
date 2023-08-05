<script setup lang="ts">
import ActionIcon from "../shared/ActionIcon.vue";

</script>

<template>
  <ActionIcon
    class="switch"
    role="switch"
    title="toggle debug"
  >
    <slot></slot>
  </ActionIcon>
</template>

<style scoped>
.switch {
  position: relative;
  background: var(--color-background-soft);
}

.switch.active > :first-child {
  filter: invert();
}
</style>