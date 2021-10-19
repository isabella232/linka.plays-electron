<template>
  <div class="GameView">

    <v-overlay :value="gameover">
      <v-card
          class=""
      elevation=""
          max-width=""
        >
        <v-card-title primary-title>
          Игра окончена
        </v-card-title>
          <v-card-text>
            <p class="">
              Набрано очков: {{$store.getters.points}}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              color=""
              @click="restart"
            >
             Начать сначала
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              text
              color=""
              to="/"
            >
            Выйти
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-overlay>
    <component
      v-if="gameShows"
      :is="game"
      ref="gameInstance"
      @pointChanged="(points) => $emit('pointChanged', points)"
      @stepChanged="(points) => $emit('stepChanged', points)"
    />
  </div>
</template>

<script lang="ts">
import { Game } from "@/Games/Game";
import { GamesManifest } from "@/Games/GamesManifest";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class GameViewer extends Vue {
  gameid: string | null = null;
gameShows=true
  get game() {
    return this.gameid?GamesManifest.instance.findById(this.gameid):null;
  }
  get gameover() {
    return this.$store.getters.gameover;
  }
  restart(){
    this.gameShows = false;
    this.$nextTick(()=>{
      this.gameShows = true
    })
    // (this.$refs.gameInstance as Game).$mount()
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