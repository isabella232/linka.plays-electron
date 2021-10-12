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

export abstract class Game extends Vue {
    sounds = {
        good: new MAudio('/sounds/good.wav'),
        newTask: new MAudio('/sounds/newTask.wav'),
    }
    static id: string;
    points = 0;
    step = 0;
    maxSteps = 10;
    get gameover() {
        return this.step >= this.maxSteps
    }

    constructor(options: any) {
        super(options)
        setTimeout(() => {

            this.$store.commit('maxSteps', this.maxSteps)
            this.restart()
        }, 0);
    }
    restart() {
        this.points = 0
        this.step = 0
        this.$store.commit('points', this.points)
        this.$store.commit('step', this.step)

    }

    addPoint() {
        if (this.gameover) return;
        this.points++;
        this.sounds.good.play()
        this.$store.commit('points', this.points)
        this.$emit('pointChanged', this.points)
    }
    nextStep(sounded = true) {
        if (this.gameover) return;
        this.step++;
        this.$store.commit('step', this.step)
        if (sounded) {
            this.sounds.newTask.pause()
            this.sounds.newTask.currentTime = 0;
            this.sounds.newTask.play();
        }
        this.$emit('stepChanged', this.step)

        if (this.gameover) {
            this.$emit('gameoover')
        }
    }
    makeGameOver() {
        if (this.gameover) return;
        this.step = this.maxSteps;
        this.$store.commit('step', this.step)
        this.$emit('stepChanged', this.step)

        if (this.gameover) {
            this.$emit('gameoover')
        }
    }
}