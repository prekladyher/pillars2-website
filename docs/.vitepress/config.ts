import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Pillars of Eternity II: Deadfire",
  description: "Support website for community localization of Pillars of Eternity II: Deadfire.",
  base: "/pillars2-website/",
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Conversations', link: '/conversations' }
    ],
  }
});
