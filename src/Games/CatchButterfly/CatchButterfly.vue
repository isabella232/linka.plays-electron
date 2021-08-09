<template>
  <section>
    <div
      class="butterfly"
      @click="hit()"
      v-if="butterflyVisible"
      :style="{ left: point.x + 'px', top: point.y + 'px' }"
    >
      <img src="@/assets/butterfly.png" alt="" />
    </div>
  </section>
</template>

<script lang="ts">
import { GazeData } from "tobiiee/build/GazeData";
import Vue from "vue";
import Component, { mixins } from "vue-class-component";
import delay from "delay";

import { Game } from "../Game";
import { Vector } from "../../Vector";

import { mixin } from "vue/types/umd";

@Component({
  mixins: [Game],
})
export default class CatchButterfly extends Game {
  static id = "CatchButterfly";
  static title = "Поймай бабочку";
  static description = "...";
  point: Vector = { x: 20, y: 30 };
  hitBoxSize = 50;
  butterflyVisible = true;
  created() {
    document.addEventListener("tobii.point", (e) => {
      const data = (e as any).detail as GazeData;
      const rect = this.$el.getBoundingClientRect();
      const gpoint = {
        x: data.x - rect.x,
        y: data.y - rect.y,
      };
      if (
        gpoint.x > this.point.x - this.hitBoxSize &&
        gpoint.x < this.point.x + this.hitBoxSize &&
        gpoint.y > this.point.y - this.hitBoxSize &&
        gpoint.y < this.point.y + this.hitBoxSize
      ) {
        this.hit();
      }
    });
  }
  hit() {
    if(!this.butterflyVisible){
      return
    }
    this.butterflyVisible = false;
    setTimeout(() => {
      this.butterflyVisible = true;
    }, 500);

    const x = Math.random() * this.$el.clientWidth * 0.5 + 200;
    const y = Math.random() * this.$el.clientHeight * 0.5 + 200;
    this.point = { x, y };
    (this as unknown as Game).nextStep();
  }
}
</script>

<style scoped>
section {
  width: 100%;
  height: 100%;
  background-color: black;
  overflow: hidden;
}
.butterfly {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  cursor: pointer;
}
.butterfly > img {
  width: 100%;
}
</style>