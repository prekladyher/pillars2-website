<script setup lang="ts">
import DialogueDebug from "@/components/DialogueDebug.vue";
import DialogueFlow from "@/components/flow/DialogueFlow.vue";
import DialogueGraph from "@/components/graph/DialogueGraph.vue";
import { IconList } from "@/components/icons";
import DialogueSearch from "@/components/search/DialogueSearch.vue";
import ToggleIcon from "@/components/shared/ToggleIcon.vue";
import { findStartNode, useConversationStore } from "@/stores/conversation";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const conversationStore = useConversationStore();

const {
  metadata,
  conversation,
  stringtable,
  currentNode
} = storeToRefs(conversationStore);

// const dialogueGraph = ref<InstanceType<typeof DialogueGraph>|null>(null);

function syncCurrentNode() {
  const nodeId = route.query.nodeId;
  if (typeof nodeId !== "string" || !/^[0-9a-f-]+$/.test(nodeId)) {
    return; // missing or invalid nodeId parameter
  }
  if (currentNode.value && currentNode.value.id === +nodeId) {
    return; // node already synced
  }
  currentNode.value = conversation.value?.nodesById.get(+nodeId);
}

watch(() => [route.params.id, route.query.nodeId], async ([id, nodeId]) => {
  if (!id || typeof id !== "string") {
    conversationStore.$reset();
  } else if (conversationStore.conversation?.id !== id) {
    await conversationStore.loadConversation(id);
  }
  if (conversation.value && typeof nodeId !== "string") {
    router.replace({ ...route, query: { nodeId: findStartNode(conversation.value).id }});
  } else {
    syncCurrentNode();
  }
}, { immediate: true });

watch(currentNode, node => {
  const nodeId = route.query.nodeId;
  if (node && nodeId !== "" + node.NodeID) {
    router.push({ ...route, query: { nodeId: node.NodeID }});
  }
});

const showDialogue = ref(true);
</script>

<template>
  <main v-if="metadata && conversation && stringtable">
    <section class="dialogue-graph">
      <DialogueGraph
        ref="dialogueGraph"
        :component="metadata?.Component"
        :conversation="conversation"
        :stringtable="stringtable"
      />
      <div class="toggle-dialogue">
        <ToggleIcon v-model="showDialogue" title="toggle dialogue">
          <IconList />
        </ToggleIcon>
      </div>
    </section>
    <Transition name="pane">
      <section
        v-if="showDialogue"
        class="dialogue-pane"
        :class="{ empty: !currentNode }"
      >
        <DialogueFlow />
      </section>
    </Transition>
    <DialogueSearch />
    <!-- <DialogueMinimap :graph="dialogueGraph" /> -->
  </main>
  <DialogueDebug />
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.dialogue-graph {
  display: flex;
  flex: 1;
}
.dialogue-graph > :first-child {
  flex: 1;
}

.dialogue-pane {
  background: var(--color-background-soft);
  box-shadow: rgba(0, 0, 0, 0.4) 0px -1px 2px;
  overflow-y: scroll;
  max-height: 50%;
  flex-basis: min(300px, 50%);
}
.dialogue-pane.empty::before {
  position: absolute;
  display: block;
  content: "";
  width: 100%;
  height: 100%;
  background: url("/logo.png") center center no-repeat;
  filter: grayscale() opacity(0.1);
}

.toggle-dialogue {
  position: absolute;
  bottom: 12px;
  left: 12px;
  border: 2px solid var(--color-border);
  border-radius: 18px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 2px;
  background: var(--color-background-soft);
}

.pane-enter-active,
.pane-leave-active {
  overflow: hidden;
  transition: flex-basis 200ms ease-in-out;
}

.pane-enter-from,
.pane-leave-to {
  overflow: hidden;
  flex-basis: 0;
}
</style>
