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
import { Color, Group, Path, Point, Size } from "paper/dist/paper-core";
import { EventEmitter } from "events";
import { ipcRenderer } from "electron";

@Component
export default class Arkanoid extends Game {
  static id = "Arkanoid";
  static title = "Звездный теннис";
  static description = "Арканоид";
  frameEventEmmiter = new EventEmitter();
  frameGroup: paper.Group;
  ballVector = new Point(1, -1);
  ball: paper.Path.Circle;
  deck: paper.Path.Rectangle;
  gameX = 0;
  maxSteps = 4 * 6;

  SIZES = {
    frameWidth: 0,
    frameHeight: 0,
    deckWidth: 0,
    brickWidth: 0,
    brickHeight: 0,
  };
  bricks: paper.Group;

  mounted() {
    const canvas = document.getElementById("myCanvas");

    if (!canvas) {
      return;
    }
    // Create an empty project and a view for the canvas:
    paper.setup(canvas as HTMLCanvasElement);

    this.SIZES.frameWidth = this.units.vw(60);
    this.SIZES.frameHeight = this.units.vh(80);
    this.SIZES.deckWidth = this.units.vw(10);
    this.SIZES.brickWidth = this.units.vw(2.5);
    this.SIZES.brickHeight = this.units.vw(1);

    paper.view.onResize = this.onResize;
    paper.view.play();
    paper.view.onFrame = (event: any) => {
      this.frameEventEmmiter.emit("frame", event);
    };
    this.gameX = this.units.vw(50);

    this.drawFrames();
    this.drawBricks();
    this.ball = new paper.Path.Circle(
      new Point(this.units.vw(50), this.units.vh(50)),
      this.units.vmin(1)
    );
    this.ball.fillColor = new Color("red");

    this.frameEventEmmiter.on("frame", this.onFrame);

    paper.view.onMouseDrag = (event: { point: paper.Point }) => {
      this.setGameX(event.point.x);
    };
    ipcRenderer.on("point", (_, data: GazeData) => {
      const rect = this.$el.getBoundingClientRect();
      this.setGameX(data.x - rect.x);
    });
  }

  setGameX(value: number) {
    const min =
      this.units.vw(50) - this.SIZES.frameWidth / 2 + this.SIZES.deckWidth / 2;
    const max =
      this.units.vw(50) + this.SIZES.frameWidth / 2 - this.SIZES.deckWidth / 2;
    if (value < min) {
      this.gameX = min;
    } else if (value > max) {
      this.gameX = max;
    } else {
      this.gameX = value;
    }
  }

  onFrame(arg0: string, onFrame: any) {
    this.deck.position = new Point(this.gameX, this.units.vh(80));
    this.frameGroup.children.forEach(this.countCollision);
    this.bricks.children.filter(this.countCollision).map((brick) => {
      brick.remove();
      this.nextStep();
    });
    this.ball.position = this.ball.position.add(this.ballVector);
  }
  countCollision(child: paper.Item) {
    if (child.bounds.contains(this.ball.position)) {
      const t =
        child.bounds.leftCenter.x === this.ball.position.x ||
        child.bounds.rightCenter.x === this.ball.position.x;
      this.ballVector = this.ballVector.multiply(
        new Point(t ? -1 : 1, t ? 1 : -1)
      );
      return true;
    }
    return false;
  }
  drawFrames() {
    this.deck = new paper.Path.Rectangle(
      new Point(
        this.units.vw(50) - this.SIZES.deckWidth / 2,
        this.units.vh(80)
      ),
      new Point(
        this.units.vw(50) + this.SIZES.deckWidth / 2,
        this.units.vh(80) + this.units.vmin(1)
      )
    );
    this.frameGroup = new paper.Group([
      new paper.Path.Rectangle(
        new Point(
          this.units.vw(50) - this.SIZES.frameWidth / 2,
          this.units.vh(50) - this.SIZES.frameHeight / 2
        ),
        new Point(
          this.units.vw(50) + this.SIZES.frameWidth / 2,
          this.units.vh(50) - this.SIZES.frameHeight / 2 + this.units.vmin(1)
        )
      ),
      new paper.Path.Rectangle(
        new Point(
          this.units.vw(50) - this.SIZES.frameWidth / 2,
          this.units.vh(50) - this.SIZES.frameHeight / 2
        ),
        new Point(
          this.units.vw(50) - this.SIZES.frameWidth / 2 + this.units.vmin(1),
          this.units.vh(50) + this.SIZES.frameHeight / 2
        )
      ),
      new paper.Path.Rectangle(
        new Point(
          this.units.vw(50) + this.SIZES.frameWidth / 2,
          this.units.vh(50) - this.SIZES.frameHeight / 2
        ),
        new Point(
          this.units.vw(50) + this.SIZES.frameWidth / 2 + this.units.vmin(1),
          this.units.vh(50) + this.SIZES.frameHeight / 2
        )
      ),
      this.deck,
    ]);
    this.frameGroup.fillColor = new Color("yellow");
    this.deck.fillColor = new Color("red");
    this.deck.strokeWidth = 1;
    this.deck.strokeColor = new Color("white");
  }

  drawBricks() {
    const rowsCount = 4;
    const celsCount = 6;

    this.bricks = new paper.Group();
    for (let y = 0; y < rowsCount; y++) {
      for (let x = 0; x < celsCount; x++) {
        const brick = new paper.Path.Rectangle(
          new Point(
            this.units.vw(50) -
              (x + 0.75 - celsCount / 2) * (this.SIZES.brickWidth * 2),
            this.units.vh(50) - y * (this.SIZES.brickHeight * 2)
          ),
          new Size(this.SIZES.brickWidth, this.SIZES.brickHeight)
        );
        brick.fillColor = new Color("#adcdfc");
        this.bricks.addChild(brick);
      }
    }
    this.bricks.position = paper.view.center.add(
      new Point(0, -this.units.vh(20))
    );
  }

  get units() {
    const vw = paper.view.viewSize.width / 100;
    const vh = paper.view.viewSize.height / 100;
    const units = {
      vw,
      vh,
      vmax: vw > vh ? vw : vh,
      vmin: vw < vh ? vw : vh,
    };
    return {
      vw(number: number) {
        return Math.floor(units.vw * number);
      },
      vh(number: number) {
        return Math.floor(units.vh * number);
      },
      vmin(number: number) {
        return Math.floor(units.vmin * number);
      },
      vmax(number: number) {
        return Math.floor(units.vmax * number);
      },
    };
  }

  onResize() {
    //
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