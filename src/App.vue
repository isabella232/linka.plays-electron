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
      <v-container class="">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import GazePoint from "./components/GazePoint.vue";

export default Vue.extend({
  name: "App",
  components: {
    GazePoint,
  },
  data() {
    return {
      mainPage: this.$router.currentRoute.path === "/",
    };
  },
  created(){
    this.$router
    .afterEach(()=>[
      this.mainPage = this.$router.currentRoute.path === "/"
    ])
  }
});
</script>
