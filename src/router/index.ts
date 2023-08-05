import { createRouter, createWebHashHistory } from "vue-router";
import ConversationListView from "../views/ConversationListView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: ConversationListView
    },
    {
      path: "/conversations/:id(\\d+)",
      component: import("../views/ConversationView.vue")
    }
  ]
});

export default router;
