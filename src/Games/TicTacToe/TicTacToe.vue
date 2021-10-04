<template>
  <section>
    <h1>tic tac toe</h1>
    <table>
      <tr v-for="(row, yindex) of game" :key="yindex">
        <td v-for="(cel, xindex) of row" :key="xindex">
          <v-btn
            class="cell-button"
            elevation=""
            :color="colors[cel]"
            @click="move(xindex, yindex)"
          >
            {{ texts[cel] }}
          </v-btn>
        </td>
      </tr>
    </table>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Game } from "../Game";

@Component({
  mixins: [Game],
})
export default class TicTacToe extends Game {
  static id = "TicTacToe";
  static title = "Крестики нолики";
  static description = "...";
  game: cel[][] = [];
  colors = ["gray", "green", "red"];
  texts = ["", "╳", "⃝"];
  created() {
    this.initGame();
  }
  initGame() {
    this.game = [];
    for (let x = 0; x < 3; x++) {
      this.game[x] = [] as cel[];
      for (let y = 0; y < 3; y++) {
        this.game[x].push(0);
      }
    }
  }
  move(x: number, y: number, bot = false) {
    const current = this.game[y][x];
    if (current === 0) {
      const row = this.game[y];
      row[x] = bot ? 2 : 1;
      Vue.set(this.game, y, row);
    }
    if (!bot) this.aIMove();
  }
  aIMove() {
    let maxCelIndex = [0, 0];
    let maxCelVal = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        let val = this.calcCelValuw(x, y);
        if (maxCelVal < val) {
          maxCelIndex = [x, y];
          maxCelVal = val;
        }
      }
    }
    this.move(maxCelIndex[0], maxCelIndex[1], true);
  }
  calcCelValuw(x: number, y: number): number {
    let val = 0;
    try {
      if (this.game[y][x + 1] > 0) {
        val++;
      }
      if (this.game[y][x - 1] > 0) {
        val++;
      }
      if (this.game[y + 1][x] > 0) {
        val++;
      }
      if (this.game[y - 1][x + 1] > 0) {
        val++;
      }
    } catch (error) {
      //s
    }
    return val;
  }
}
type cel = 0 | 1 | 2;
</script>

<style scoped>
section {
  width: 100%;
  height: 100%;
}
table {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60vmin;
  height: 60vmin;
}
.cell-button {
  width: 100%;
  height: 100%;
  display: block;
}
td {
  padding: 0;
}
</style>