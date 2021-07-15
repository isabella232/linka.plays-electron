<template>
  <section>
    <h1>tic tac toe</h1>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Game } from "../Game";

@Component
export default class TicTacToe extends Vue {
  static id = "TicTacToe";
  static title = "Крестики нолики";
  static description = "...";
}

</script>

<style scoped>
section{
  width: 100%;
  height: 100%;
  background-color: black;
}
</style>