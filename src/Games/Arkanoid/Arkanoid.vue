<template>
  <section>
    <canvas ref="myCanvas" resize></canvas>
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
import { EyeFilter } from "@/EyeFilters/EyeFilter";
import { MiddleValueFilter } from "@/EyeFilters/MiddleValueFilter";
import { CanvasGame } from "../CanvasGame";

@Component
export default class Arkanoid extends CanvasGame {
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
  speed = 1.25;
  deckSpeed = 4;
  angle = -(Math.PI / 0.2 + Math.PI / 4);
  controlls = {
    left: null as paper.PathItem | null,
    right: null as paper.PathItem | null,
    move: 0,
  };
  getBallVector() {
    return new Point(Math.sin(this.angle), Math.cos(this.angle)).multiply(
      this.speed
    );
  }

  SIZES = {
    frameWidth: 0,
    frameHeight: 0,
    frameBold: 0,
    deckWidth: 0,
    brickWidth: 0,
    brickHeight: 0,
    ballRadius: 0,
  };
  bricks: paper.Group | null = null;

  filter: EyeFilter = new MiddleValueFilter(3);

  mounted() {
    super.mounted();
  }
  init() {
    this.SIZES.frameWidth = this.units.vw(60);
    this.SIZES.frameHeight = this.units.vh(80);
    this.SIZES.frameBold = this.units.vw(1);
    this.SIZES.deckWidth = this.units.vw(10);
    this.SIZES.brickWidth = this.units.vw(3);
    this.SIZES.brickHeight = this.units.vw(1.25);
    this.SIZES.ballRadius = this.units.vw(0.4);

    this.paper.view.onResize = this.onResize;
    this.gameX = this.units.vw(50);

    this.drawFrames();
    this.drawControlls();
    this.drawBricks();
    this.coins = new paper.Group();
    this.ball = new paper.Path.Circle(
      new Point(this.units.vw(50), this.units.vh(50)),
      this.SIZES.ballRadius
    );
    this.ball.fillColor = new Color("red");

    this.paper.view.onMouseMove = (event: { point: paper.Point }) => {
      const point = event.point;
      if (this.controlls.left && this.controlls.left.bounds.contains(point)) {
        this.controlls.move = -1;
      } else if (
        this.controlls.right &&
        this.controlls.right.bounds.contains(point)
      ) {
        this.controlls.move = 1;
      } else {
        this.controlls.move = 0;
      }
    };
    ipcRenderer.on("point", (_, data: GazeData) => {
      const rect = this.$el.getBoundingClientRect();
      const point = new Point(data.x, data.y).subtract(
        new Point(rect.x, rect.y)
      );
      if (this.controlls.left && this.controlls.left.bounds.contains(point)) {
        this.controlls.move = -1;
      } else if (
        this.controlls.right &&
        this.controlls.right.bounds.contains(point)
      ) {
        this.controlls.move = 1;
      } else {
        this.controlls.move = 0;
      }
    });
  }
  drawControlls() {
    const sq = this.units.vw(4);
    this.controlls.left = new paper.Path.Rectangle(
      new Point(
        this.units.vw(50) - this.SIZES.frameWidth / 2 + this.SIZES.frameBold,
        this.units.vh(50) + this.SIZES.frameHeight / 2 - sq
      ),
      new Point(
        this.units.vw(50) -
          this.SIZES.frameWidth / 2 +
          +this.SIZES.frameBold +
          sq,
        this.units.vh(50) + this.SIZES.frameHeight / 2
      )
    );

    this.controlls.right = new paper.Path.Rectangle(
      new Point(
        this.units.vw(50) + this.SIZES.frameWidth / 2,
        this.units.vh(50) + this.SIZES.frameHeight / 2 - sq
      ),
      new Point(
        this.units.vw(50) + this.SIZES.frameWidth / 2 - sq,
        this.units.vh(50) + this.SIZES.frameHeight / 2
      )
    );
    this.controlls.left.fillColor = this.controlls.right.fillColor = new Color(
      "red"
    );
  }

  setGameX() {
    if (!this.deck) return;
    const min =
      this.units.vw(50) -
      this.SIZES.frameWidth / 2 +
      this.SIZES.deckWidth / 2 +
      this.SIZES.frameBold;
    const max =
      this.units.vw(50) + this.SIZES.frameWidth / 2 - this.SIZES.deckWidth / 2;
    const value = this.deck.position.x;
    
    if (this.controlls.move == -1) {
      const newValue = value - this.deckSpeed;
      if (newValue < min) {
        this.gameX = min;
      } else {
        this.gameX = newValue;
      }
    }
    if (this.controlls.move == 1) {
      const newValue = value + this.deckSpeed;
      if (newValue > max) {
        this.gameX = max;
      } else {
        this.gameX = newValue;
      }
    }
      this.deck.position = new Point(this.gameX, this.units.vh(80));

  }

  onFrame() {
    if (this.gameover) {
      return;
    }
    this.setGameX();
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
        this.units.vh(80) + this.SIZES.frameBold
      )
    );
    this.deck.data.name = "deck";

    this.frameGroup = new paper.Group([
      //top frame
      new paper.Path.Rectangle(
        new Point(
          this.units.vw(50) - this.SIZES.frameWidth / 2,
          this.units.vh(50) - this.SIZES.frameHeight / 2
        ),
        new Point(
          this.units.vw(50) + this.SIZES.frameWidth / 2,
          this.units.vh(50) - this.SIZES.frameHeight / 2 + this.SIZES.frameBold
        )
      ),
      //left frame
      new paper.Path.Rectangle(
        new Point(
          this.units.vw(50) - this.SIZES.frameWidth / 2,
          this.units.vh(50) - this.SIZES.frameHeight / 2
        ),
        new Point(
          this.units.vw(50) - this.SIZES.frameWidth / 2 + this.SIZES.frameBold,
          this.units.vh(50) + this.SIZES.frameHeight / 2
        )
      ),
      //right frame
      new paper.Path.Rectangle(
        new Point(
          this.units.vw(50) + this.SIZES.frameWidth / 2,
          this.units.vh(50) - this.SIZES.frameHeight / 2
        ),
        new Point(
          this.units.vw(50) + this.SIZES.frameWidth / 2 + this.SIZES.frameBold,
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
    this.bricks.position = this.paper.view.center.add(
      new Point(0, -this.units.vh(20))
    );
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