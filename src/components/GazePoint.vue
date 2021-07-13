<template>
  <div class="point" :style="{ top: y + 'px', left: x + 'px' }"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TobiiAwareElement } from "tobii-vue-mixin";
import { GazeData } from "tobiiee/build/GazeData";

@Component
export default class GazePoint extends TobiiAwareElement {
  x = 0;
  y = 0;
  created() {
    this.$on("tobii.point", (point: GazeData) => {
      this.gaze(point);
    });
  }
  gaze({ x, y }:GazeData) {
    this.x = x;
    this.y = y;
  }
}
</script>

<style scoped>
.point {
  width: 5px;
  height: 5px;
  background: red;
  border-radius: 50%;
  position: fixed;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>