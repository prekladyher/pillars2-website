<script setup lang="ts">
import HeaderPanel from "@/components/header/HeaderPanel.vue";
import { useDropZone } from "@/composables/useDropZone";
import { useLanguageStore } from "@/stores/language";
import { ref } from "vue";

const languageStore = useLanguageStore();

const dropZoneRef = ref<HTMLDivElement>();
const { isOverDropZone } = useDropZone(dropZoneRef, async entries => {
  if (entries?.length) {
    languageStore.clear();
    languageStore.loadFiles(entries);
  }
});
</script>

<template>
  <div 
    id="app-root"
    ref="dropZoneRef"
    :class="{ dropzone: isOverDropZone }"
  >
    <HeaderPanel />
    <router-view />
  </div>
</template>

<style>
#app-root {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 3rem auto;
  height: 100vh;
}

.dropzone::after {
  display: block;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid #cc0000;
  background: rgba(128, 128, 128, 0.5);
}
</style>
