<template>
  <v-app>
    <gaze-point />
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          v-if="mainPage"
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-btn icon to="/" v-else>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container :class="{ 'game-container': !mainPage }">
        <router-view @stepChanged="(step) => (this.step = step)" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import GazePoint from "./components/GazePoint.vue";
@Component({
  components: {
    GazePoint,
  },
})
export default class App extends Vue {
  mainPage = this.$router.currentRoute.path === "/";
  gameInfo = {
step: 0,
points: 0,
title: null
  }
  created() {
    this.$router.afterEach(() => {
      this.mainPage = this.$router.currentRoute.path === "/";
    });
  }
}
</script>

<style scoped>
.game-container {
  height: 100%;
  padding: 0;
  overflow: hidden;
}
</style>