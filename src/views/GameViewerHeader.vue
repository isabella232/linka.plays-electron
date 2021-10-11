<template>
  <v-app-bar>
    <v-btn icon to="/">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
    <v-toolbar-title>{{ game.title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn>
      <v-icon>mdi-star</v-icon>
      {{ $store.getters.points }}
    </v-btn>
    <v-btn>
      <v-icon>mdi-clock</v-icon>
      {{ $store.getters.step }} / {{ $store.getters.maxSteps }}
    </v-btn>
  </v-app-bar>
</template>


<script lang="ts">
import { Game } from "@/Games/Game";
import { GamesManifest } from "@/Games/GamesManifest";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class GameViewerHeader extends Vue {
  gameid: string | null = null;

  get game() {
    if (this.gameid) return GamesManifest.instance.findById(this.gameid);
    return null;
  }
  created() {
    this.gameid = this.$router.currentRoute.params.gameid;
  }
}
</script>
