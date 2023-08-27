import HomeView from "@/views/HomeView.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: HomeView
    },
    {
      name: "conversation",
      path: "/conversations/:id",
      component: import("@/views/ConversationView.vue")
    }
  ]
});

export default router;
