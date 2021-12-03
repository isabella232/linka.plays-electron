<template>
  <section>
    <canvas ref="myCanvas" resize></canvas>
  </section>
</template>

<script lang="ts">
import { GazeData } from "tobiiee/build/GazeData";
import Vue from "vue";
import paper from "paper";
import Component from "vue-class-component";
// import { Color, Path, Point } from "this.paper/dist/this.paper-core";
import { EventEmitter } from "events";
import { ipcRenderer } from "electron";
import { CanvasGame } from "../CanvasGame";
import { level1Map } from "./maps/Level1Map";
@Component
export default class CityTraffic extends CanvasGame {
  static id = "CityTraffic";
  static title = "Автотрафик";
  static description = "...";
  maxSteps = 60;
  mounted() {
    super.mounted();
  }

  init(): void {
    level1Map.drawMap(this.paper);
  }
  onFrame(): void {
    level1Map.onFrame();
    level1Map.cars = level1Map.cars.filter((car, index) => {
      car.onFrame(level1Map.cars, index);
      if (car.finish) {
        car.rect.remove();
        this.addPoint()
      }
      if(car.gameover) {
        this.makeGameOver(true)
      }
      return !car.finish;
    });
  }
}
</script>


<style scoped>
section {
  height: 100%;
}
canvas {
  width: 100%;
  height: calc(100vh - 64px);
  background: #000;
}
</style>