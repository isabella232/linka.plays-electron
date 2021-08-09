<template>
  <div class="GameView">
    <component :is="game" @pointChanged="(points)=>$emit('pointChanged', points)"  @stepChanged="(points)=>$emit('stepChanged', points)"  />
  </div>
</template>

<script lang="ts">
import { GamesManifest } from "@/Games/GamesManifest";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class GameViewer extends Vue {
  gameid: string | null = null;
  get game() {
    return GamesManifest.instance.findById(this.gameid);
  }
  created() {
    this.gameid = this.$router.currentRoute.params.gameid;
  }
}
</script>

<style scoped>
.GameView {
  width: 100%;
  height: 100%;
}
</style>