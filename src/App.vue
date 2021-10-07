<template>
  <v-app>
    <gaze-point />
          
    <v-app-bar app color="primary" dark v-if="mainPage">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo.png"
          transition="scale-transition"
          width="40"
        />

      
      <v-toolbar-title v-if="mainPage"> LINKa. играй </v-toolbar-title>
      
    </v-app-bar>
      <router-view v-else name="header" />

    <v-main>
      <component
        :is="mainPage ? 'v-container' : 'div'"
        :class="{ 'game-container': !mainPage }"
      >
        <router-view @stepChanged="(step) => (this.step = step)" />
      </component>
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
    title: null,
  };
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
  width: 100%;
  padding: 0;
  overflow: hidden;
}
</style>