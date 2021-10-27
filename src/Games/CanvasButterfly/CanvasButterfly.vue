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

@Component
export default class CanvasButterfly extends CanvasGame {
  static id = "CanvasButterfly";
  static title = "Бабочки";
  static description = "...";
  maxSteps = 60;
  flower: paper.Item | null = null;
  butterflyPoints = [] as paper.Point[];
  butterflies: paper.Group | null = null;
  interval: number | null = null;
  lastGazeTS = 0;
  mounted() {
    super.mounted()
    this.paper.view.onResize = this.onResize;
    this.paper.view.play();
  }
    init(): void {
    
    ipcRenderer.on("point", (_, data: GazeData) => {
    
      const rect = this.$el.getBoundingClientRect();
      this.onPoint(
        new this.paper.Point({
          x: data.x - rect.x,
          y: data.y - rect.y,
        })
      );
    });
    this.paper.view.onMouseDrag = (event: { point: { x: number; y: number } }) => {
      const point = new this.paper.Point({ x: event.point.x, y: event.point.y });
      this.onPoint(point);
    };
    this.interval = +setInterval(() => {
      this.nextStep(false);
      if (this.gameover) {
        if (this.interval) clearInterval(this.interval);
      }
    }, 1000);
    this.drawFlowers();
    }


  onFrame(){
      if (this.flower) {
        this.flower.rotate(2);
      }
      this.drawButterflies();
  }
  onPoint(point: paper.Point) {
    this.butterflyPoints.push(point);
    if (this.butterflyPoints.length > 5) {
      this.butterflyPoints.shift();
    }

    if (this.flower && this.flower.bounds.contains(point)) {
      this.addPoint();
      this.drawFlowers();
      this.butterflyPoints = [];
    }
  }
  drawButterflies() {
    if (this.butterflies != null) {
      this.butterflies.children.forEach((c) => c.remove());
      this.butterflies.remove();
    }
    this.butterflies = new this.paper.Group();

    for (let index = 0; index < this.butterflyPoints.length; index++) {
      const point = this.butterflyPoints[index];
      const prevPoint = this.butterflyPoints[index - 1];
      const butterfly = new this.paper.Raster({
        source: "/images/butterfly.png",
        size: new this.paper.Size(25, 25),
      });
      if (prevPoint) butterfly.rotate(prevPoint.subtract(point).angle + 90);
      //   butterfly.fillColor = new this.paper.Color('red')
      butterfly.position = point as paper.Point;
      this.butterflies.addChild(butterfly);
    }
  }
  drawFlowers() {
    if (this.flower) this.flower.remove();
    const point = new this.paper.Point(
      Math.random() * this.paper.view.size.width * 0.8,
      Math.random() * this.paper.view.size.height * 0.8
    );
    this.flower = this.getFlower();
    const flower = this.flower;
    flower.position = point;
  }
  getFlower() {
    const size = 250 / (this.points * 0.2 + 1);

    const romashka = new this.paper.Raster({
      source: "/images/romashka.png",
      size: new this.paper.Size(size, size),
    });
    return romashka;
  }

  onResize() {
    //   this.paper.view.clear
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