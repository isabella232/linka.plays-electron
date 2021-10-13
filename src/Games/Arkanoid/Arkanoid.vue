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
  frameGroup: paper.Group | null = null;
  ball: paper.Path.Circle | null = null;
  deck: paper.Path.Rectangle | null = null;
  coins: paper.Group | null = null;
  gameX = 0;
  rowsCount = 4;
  celsCount = 6;
  lifes = 2;
  maxSteps = this.rowsCount * this.celsCount * this.lifes;
  speed = 2;
  angle = -(Math.PI / 0.2 + Math.PI / 4);
  getBallVector() {
    return new Point(Math.sin(this.angle), Math.cos(this.angle)).multiply(
      this.speed
    );
  }

  SIZES = {
    frameWidth: 0,
    frameHeight: 0,
    deckWidth: 0,
    brickWidth: 0,
    brickHeight: 0,
    ballRadius: 0,
  };
  bricks: paper.Group | null = null;

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
    this.SIZES.brickWidth = this.units.vw(3);
    this.SIZES.brickHeight = this.units.vw(1.25);
    this.SIZES.ballRadius = this.units.vw(0.4);

    paper.view.onResize = this.onResize;
    paper.view.play();
    paper.view.onFrame = (event: any) => {
      this.onFrame();
      this.frameEventEmmiter.emit("frame", event);
    };
    this.gameX = this.units.vw(50);

    this.drawFrames();
    this.drawBricks();
    this.coins = new paper.Group();
    this.ball = new paper.Path.Circle(
      new Point(this.units.vw(50), this.units.vh(50)),
      this.SIZES.ballRadius
    );
    this.ball.fillColor = new Color("red");

    // this.frameEventEmmiter.on("frame", this.onFrame);

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

  onFrame() {
    if (this.gameover) {
      return;
    }
    if (this.deck)
      this.deck.position = new Point(this.gameX, this.units.vh(80));
    if (this.frameGroup)
      this.frameGroup.children.forEach((item) =>
        this.countCollision(item as paper.PathItem)
      );
    if (this.bricks)
      this.bricks.children
        .filter((item) => this.countCollision(item as paper.PathItem))
        .map((brick) => {
          brick.data.lives--;
          brick.fillColor = [
            new Color("red"),
            new Color("#DDDDFF"),
            new Color("#DDDD9F"),
            new Color("#DDDDAF"),
          ][brick.data.lives];
          if (brick.data.lives === 0) {
            this.createCoin(brick.position);
            brick.remove();
          }
          this.nextStep();
        });
    if (this.ball) {
      this.ball.position = this.ball.position.add(this.getBallVector());

      if (this.deck && this.ball.position.y > this.deck.position.y) {
        this.makeGameOver();
        this.speed = 0;
      }
    }
    if (this.coins) {
      for (const coin of this.coins.children) {
        coin.position = coin.position.add(new Point(0, 1));
        if (this.deck && coin.position.y > this.deck.bounds.topCenter.y) {
          if (
            coin.bounds.right > this.deck.bounds.left &&
            coin.bounds.left < this.deck.bounds.right
          ) {
            this.addPoint();
          }
          coin.remove();
        }
      }
    }
  }
  createCoin(position: paper.Point) {
    const size = new paper.Size(
      this.SIZES.ballRadius,
      this.SIZES.ballRadius
    ).multiply(5);
    const coin = new paper.Raster({
      source: "/images/coin.png",
      position,
      size,
    });
    setTimeout(() => {
      // bug fix
      coin.size = size;
    }, 150);
    if (this.coins) this.coins.addChild(coin);
  }
  countCollision(child: paper.PathItem) {
    if (!this.ball) return false;

    const intersections = child.getIntersections(this.ball);
    if (intersections.length < 3 && intersections[0]) {
      let angle = this.ball.position.subtract(intersections[0].point).angle;
      if (angle < 0) angle += 360;
      angle += 45;
      const side = Math.floor(angle / 90);

      if (side === 1 || side === 3) {
        this.speed *= -1;
      }

      //   new paper.Path.Circle(intersections[0].point, 5).fillColor = new Color(
      //     "red"
      //   );
      //   new paper.Path.Circle(child.position, 5).fillColor = new Color("red");
      this.angle *= -1;
      if (child.data.name === "deck") {
        let hitpos = (child.position.x - intersections[0].point.x) * -1;
        // this.angle*=hitpos
        // TODO: add mirror
      }

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
        this.units.vh(80) + this.units.vmin(2)
      )
    );
    this.deck.data.name = "deck";
    this.frameGroup = new paper.Group([
      new paper.Path.Rectangle(
        new Point(
          this.units.vw(50) - this.SIZES.frameWidth / 2,
          this.units.vh(50) - this.SIZES.frameHeight / 2
        ),
        new Point(
          this.units.vw(50) + this.SIZES.frameWidth / 2,
          this.units.vh(50) - this.SIZES.frameHeight / 2 + this.units.vmin(2)
        )
      ),
      new paper.Path.Rectangle(
        new Point(
          this.units.vw(50) - this.SIZES.frameWidth / 2,
          this.units.vh(50) - this.SIZES.frameHeight / 2
        ),
        new Point(
          this.units.vw(50) - this.SIZES.frameWidth / 2 + this.units.vmin(2),
          this.units.vh(50) + this.SIZES.frameHeight / 2
        )
      ),
      new paper.Path.Rectangle(
        new Point(
          this.units.vw(50) + this.SIZES.frameWidth / 2,
          this.units.vh(50) - this.SIZES.frameHeight / 2
        ),
        new Point(
          this.units.vw(50) + this.SIZES.frameWidth / 2 + this.units.vmin(2),
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
    const rowsCount = this.rowsCount;
    const celsCount = this.celsCount;

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
        brick.data.lives = this.lifes;
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