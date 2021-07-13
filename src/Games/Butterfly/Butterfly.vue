<template>
  <section>
    <div
      v-for="point of points"
      :key="point.x+point.y"
      class="butterfly"
      :style="{ left: point.x + 'px', top: point.y + 'px' }"
    >
      <img src="@/assets/butterfly.png" alt="" />
    </div>
  </section>
</template>

<script lang="ts">
import { GazeData } from "tobiiee/build/GazeData";
import Vue from "vue";
import Component from "vue-class-component";
import { Game } from "../Game.vue";
import { Vector } from "../../Vector";

@Component
export default class Butterfly extends Vue {
  static id = "Butterfly";
  static title = "Бабочки";
  static description = "...";
  points: Vector[] = [{ x: 20, y: 30 }];

  created() {
    document.addEventListener("tobii.point", (e) => {
      const data = (e as any).detail as GazeData;
      const rect = this.$el.getBoundingClientRect();
      this.points.push({
        x: data.x - rect.x,
        y: data.y - rect.y,
      });
      setTimeout(() => {
        this.points.shift();
      }, 1000);
    });
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
}
.butterfly>img{
  width: 100%;
}
</style>