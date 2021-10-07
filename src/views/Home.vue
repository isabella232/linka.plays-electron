<template>
  <v-container row wrap class="home">
    <h1>Игры</h1>
    <v-container>
      <v-row>
        <v-col cols="4" v-for="game of games" :key="game.id" >
          <v-card >
            <v-card-title primary-title> {{ game.title }} </v-card-title>
            <v-card-text>
              <p class="">{{ game.description }}</p>
              <div class="text--primary"></div>
            </v-card-text>
            <v-card-actions>
              <v-btn text :to="'/game/' + game.id"> Играть! </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { GamesManifest } from "@/Games/GamesManifest";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Home extends Vue {
  public get games() {
    return GamesManifest.instance.games;
  }
}
</script>

<style scoped>
.home {
  display: block;
  padding: 56px;
}
</style>