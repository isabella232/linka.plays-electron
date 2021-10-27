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
import { Wolf } from "./Wolf";

@Component
export default class JustYouWait extends CanvasGame {
  static id = "JustYouWait";
  static title = "Волк и яйца";
  static description = "...";

  wolf: Wolf | null = null;

  eggs: Egg[] = [];
  controlls: paper.Group | null = null;
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
    this.createControlls(background);
    this.wolf = new Wolf(this.paper);
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
  createControlls(background: paper.Raster) {
    if (background.width < 10) {
      setTimeout(() => {
        this.createControlls;
      }, 100);
      return;
    }
    this.controlls = new paper.Group();
    this.controlls.addChild(
      new this.paper.Path.Rectangle(
        this.paper.view.bounds.topLeft,
        background.bounds.topLeft
      )
    );
    this.controlls.addChild(
      new this.paper.Path.Rectangle(
        this.paper.view.bounds.topRight,
        background.bounds.topRight
      )
    );
    this.controlls.addChild(
      new this.paper.Path.Rectangle(
        this.paper.view.bounds.bottomLeft,
        background.bounds.bottomLeft
      )
    );
    this.controlls.addChild(
      new this.paper.Path.Rectangle(
        this.paper.view.bounds.bottomRight,
        background.bounds.bottomRight
      )
    );

    this.controlls.fillColor = new paper.Color("#CC1111");
  }
  onPoint(point: paper.Point) {
    let state = this.controlls?.children.findIndex((controll) => {
      return controll.contains(point);
    });
    if (state!==undefined && state !== -1) {
      this.wolf?.setSide(state);
    }
  }
  onFrame(): void {
    //
  }
  tick() {
    if (this.gameover) return;
    let shift = false;
    for (const egg of this.eggs) {
      egg.move();
      if (egg.life === 5) {
        if (egg.side === this.wolf?.side && !egg.falling) {
          egg.catch();
          this.addPoint();
          shift = true
        } else {
          if (egg.falling) {
          shift = true
          } else {
            this.nextStep();
          }
          egg.fall();
        }
      }
    }
    if(shift) this.eggs.shift()
    this.lastEggCreateion--;
    if (Math.random() > 0.5 && this.lastEggCreateion <= 0) {
      this.eggs.push(new Egg(this.paper, Math.round(Math.random() * 3)));
      this.lastEggCreateion = 2;
    }

    setTimeout(() => {
      if (!this.gameover) this.tick();
    }, 2000);
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