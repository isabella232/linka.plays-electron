<template>
  <section>
    <canvas id="myCanvas" resize></canvas>
  </section>
</template>

<script lang="ts">
import { GazeData } from "tobiiee/build/GazeData";
import Vue from "vue";
import Component from "vue-class-component";
import { Game } from "../Game";
import paper from "paper";
import { Color, Path, Point } from "paper/dist/paper-core";
import { EventEmitter } from "events";

@Component
export default class CanvasButterfly extends Game {
  static id = "butterfly";
  static title = "Бабочки";
  static description = "...";
  maxSteps = 60;
  frameEventEmmiter = new EventEmitter();
  flower: paper.Item | null = null;
  butterflyPoints = [] as paper.Point[];
  butterflies: paper.Group | null = null;
  interval: number | null = null;
  mounted() {
    const canvas = document.getElementById("myCanvas");
    if (!canvas) {
      return;
    }
    // Create an empty project and a view for the canvas:
    paper.setup(canvas as HTMLCanvasElement);

    paper.view.onResize = this.onResize;
    paper.view.play();
    paper.view.onFrame = (event: any) => {
      this.frameEventEmmiter.emit("frame", event);
    };
    document.addEventListener("tobii.point", (e) => {
      const data = (e as any).detail as GazeData;
      const rect = this.$el.getBoundingClientRect();
      this.onPoint(
        new paper.Point({
          x: data.x - rect.x,
          y: data.y - rect.y,
        })
      );
    });
    paper.view.onMouseDrag = (event: { point: { x: number; y: number } }) => {
      const point = new Point({ x: event.point.x, y: event.point.y });
      this.onPoint(point);
    };
    this.frameEventEmmiter.on("frame", () => {
      if (this.flower) {
        this.flower.rotate(2);
      }
    });
    this.interval = +setInterval(() => {
      this.nextStep(false);
      if (this.gameover) {
        if (this.interval   ) clearInterval(this.interval);
      }
    }, 1000);
    this.drawFlowers();
  }
  onPoint(point: paper.Point) {
    this.butterflyPoints.push(point);
    if (this.butterflyPoints.length > 5) {
      this.butterflyPoints.shift();
    }

    if (this.flower&&this.flower.bounds.contains(point)) {
      console.log("hit");
      this.addPoint();
      this.drawFlowers();
      this.butterflyPoints = [];
    }

    this.drawButterflies();
  }
  drawButterflies() {
    if (this.butterflies != null) {
      this.butterflies.children.forEach((c) => c.remove());
      this.butterflies.remove();
    }
    this.butterflies = new paper.Group();
    console.log(this.butterflyPoints.length);

    for (let index = 0; index < this.butterflyPoints.length; index++) {
      const point = this.butterflyPoints[index];
      const prevPoint = this.butterflyPoints[index - 1];
      const butterfly = new paper.Raster({
        source: "/images/butterfly.png",
        size: new paper.Size(25, 25),
      });
      if (prevPoint) butterfly.rotate(prevPoint.subtract(point).angle + 90);
      //   butterfly.fillColor = new paper.Color('red')
      butterfly.position = point as paper.Point;
      this.butterflies.addChild(butterfly);
    }
    console.log("draw butterfly");
  }
  drawFlowers() {
    if(this.flower) this.flower.remove();
    const point = new paper.Point(
      Math.random() * paper.view.size.width * 0.8,
      Math.random() * paper.view.size.height * 0.8
    );
    this.flower = this.getFlower();
    const flower = this.flower;
    flower.position = point;
  }
  getFlower() {
    const size = 250/(this.points*0.2+1);

    const romashka = new paper.Raster({
      source: "/images/romashka.png",
      size: new paper.Size(size, size),
    });
    return romashka;
  }

  onResize() {
    //   paper.view.clear
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