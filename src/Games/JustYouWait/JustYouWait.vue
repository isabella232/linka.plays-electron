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
import { Point, Size } from "paper/dist/paper-core";
import { Egg } from "./Egg";

@Component
export default class JustYouWait extends CanvasGame {
  static id = "JustYouWait";
  static title = "Волк и яйца";
  static description = "...";
  wolfState = 0;
  wolf: paper.Raster | null = null;

  ts = 0;

  eggs: Egg[] = [];
  lastEggCreateion = 0;

  mounted() {
    super.mounted();
  }
  init() {
    console.log("init");

    const background = new this.paper.Raster({
      source: "/images/JustYouWait/background.png",
    });
    background.position = this.paper.view.center;

    this.createWolf();

    this.paper.view.onMouseDrag = (event: { point: paper.Point }) => {
      const point = event.point;
      this.onPoint(point);
    };

    ipcRenderer.on("point", (_, data: GazeData) => {
      const rect = this.$el.getBoundingClientRect();

      const point = new Point(data.x, data.y).subtract(
        new Point(rect.x, rect.y)
      );
      this.onPoint(point);
    });
    this.tick();
  }
  onPoint(point: paper.Point) {
    let state: number | undefined = undefined;
    if (point.x < this.units.vw(33) && point.y < this.units.vh(33)) {
      state = 0;
    }
    if (point.x > this.units.vw(66) && point.y < this.units.vh(33)) {
      state = 1;
    }
    if (point.x < this.units.vw(33) && point.y > this.units.vh(66)) {
      state = 2;
    }
    if (point.x > this.units.vw(66) && point.y > this.units.vh(66)) {
      state = 3;
    }
    if (state !== undefined) this.wolfState = state;
  }
  onFrame(): void {
    if (this.wolf)
      this.wolf.source = `/images/JustYouWait/wolf-${this.wolfState}.png`;
  }
  tick() {
    for (const egg of this.eggs) {
      egg.move();
      if (egg.life === 5) {
        if (egg.side === this.wolfState && !egg.falling) {
          egg.catch();
          this.addPoint();
          this.eggs.shift();
        } else {
          if (egg.falling) {
            this.eggs.shift();

          }
          else{
            this.nextStep();

          }
          egg.fall();
        }
      }
    }
    this.lastEggCreateion--;
    if (Math.random() > 0.5 && this.lastEggCreateion <= 0) {
      this.eggs.push(new Egg(this.paper, Math.round(Math.random() * 3)));
      this.lastEggCreateion = 3;
    }

    setTimeout(() => {
      if (!this.gameover) this.tick();
    }, 2000);
  }

  createWolf() {
    this.wolf = new this.paper.Raster({
      source: "/images/JustYouWait/wolf-0.png",
      //   size: new this.paper.Size(100, 100),
    });
    this.wolf.position = this.paper.view.center.add(new Point(0, 120));
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
  /* background: #000; */
}
</style>