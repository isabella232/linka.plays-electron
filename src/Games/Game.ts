import Vue from "vue";

export class Game extends Vue {
    sounds = {
        good: new Audio('/sounds/good.wav')
    }
    points = 0;

    addPoint() {
        this.points++;
        this.sounds.good.play()
    }
}