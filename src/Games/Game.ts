import Vue from "vue";

//fake for tests
let MAudio: any = undefined;
try {
    MAudio = Audio
} catch (error) {
    MAudio = class FakeAudio {
        constructor(src: string) {
            //
        }
        play() {
            //
        }
        pause() {
            //
        }
        currentTime = 0;
    }
}

export class Game extends Vue {
    sounds = {
        good: new MAudio('/sounds/good.wav'),
        newTask: new MAudio('/sounds/newTask.wav'),
    }
    points = 0;
    errors = 0;
    step = 0;
    maxSteps = 10;


    addPoint() {
        this.points++;
        this.sounds.good.play()
        this.$emit('pointChanged', this.points)
    }
    nextStep() {
        this.step++;
        this.sounds.newTask.pause()
        this.sounds.newTask.currentTime = 0;
        this.sounds.newTask.play();
        this.$emit('stepChanged', this.step)

        if (this.step === this.maxSteps) {
            this.$emit('gameEnd')
        }
    }
}