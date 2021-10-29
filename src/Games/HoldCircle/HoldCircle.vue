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
import { Point } from "paper/dist/paper-core";
import delay from "delay";

type Status = "start" | "tick" | "fall" | "finish";
@Component
export default class HoldCircle extends CanvasGame {
  static id = "HoldCircle";
  static title = "Держи круг";
  static description = "...";
  status: Status = "start";
  circle: paper.Path.Circle | null = null;
  text: paper.TextItem | null = null;

  gameSounds = {
    circle_welcome: new Audio("/voiceover/files/circle_welcome.mp3"),
    circle_5: new Audio("/voiceover/files/circle_5.mp3"),
    circle_4: new Audio("/voiceover/files/circle_4.mp3"),
    circle_3: new Audio("/voiceover/files/circle_3.mp3"),
    circle_2: new Audio("/voiceover/files/circle_2.mp3"),
    circle_1: new Audio("/voiceover/files/circle_1.mp3"),
    circle_done: new Audio("/voiceover/files/circle_done.mp3"),
    circle_fall: new Audio("/voiceover/files/circle_fall.mp3"),
  };
  maxSteps = 6;
  nextStep(){
  super.nextStep();
    if (this.text) this.text.content = this.step.toString();
  }
  lastTS = 0;
  maxDifferent = 0;
  timerId: number | null = null;
  mounted() {
    super.mounted();
  }
  async init() {
    this.drawCircle();
    this.drawText();

    ipcRenderer.on("point", (_, data: GazeData) => {
      if (this.status === "fall") return;
      if (this.lastTS === 0) {
        this.start();
      }

      const diff = data.ts - this.lastTS;
      if (this.maxDifferent < diff) {
        this.maxDifferent = diff;
      }
      this.lastTS = data.ts;
    });
  }

  async start() {
    this.maxDifferent = 0;
    this.status = 'start'
    await this.playAudio(this.gameSounds.circle_welcome);
    const sounds = [
      this.gameSounds.circle_1,
      this.gameSounds.circle_2,
      this.gameSounds.circle_3,
      this.gameSounds.circle_4,
      this.gameSounds.circle_5,
    ];
    for (let i = 0; i < 5; i++) {
      this.nextStep();
      this.maxDifferent = 0;
      await this.playAudio(sounds[i]);
      if (this.maxDifferent > 600||this.maxDifferent ===0) {
        await this.fall();
        return;
      }
      await delay(200)
    }
    await this.playAudio(this.gameSounds.circle_done);
  }

  async fall() {
    this.status = "fall";
    await this.playAudio(this.gameSounds.circle_fall);
    this.restart();
  }

  onFrame(): void {
    //
  }

  drawText() {
    const text = new this.paper.PointText(
      this.paper.view.center.add(new Point(0, this.units.vh(50 / 4)))
    );
    text.content = this.step.toString();
    text.style.fontSize = this.units.vmin(50);
    text.style.justification = "center";
    text.fillColor = new this.paper.Color("red");
    this.text = text;
  }
  drawCircle() {
    this.circle = new this.paper.Path.Circle(
      this.paper.view.center,
      this.units.vmin(45)
    );
    this.circle.fillColor = new this.paper.Color("#DDCDCD");
    this.circle.strokeColor = new this.paper.Color("#BDBDCD");
    this.circle.strokeWidth = this.units.vmin(2);
  }

  playAudio(audio: HTMLAudioElement) {
    return new Promise<void>((resolve, reject) => {
      audio.addEventListener("ended", () => {
        resolve();
      });
      audio.play();
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