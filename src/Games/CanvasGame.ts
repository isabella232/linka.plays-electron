import { Game } from "./Game";
import paper from 'paper'

export abstract class CanvasGame extends Game {
    paper: paper.PaperScope = new paper.PaperScope;
    mounted() {
        const canvas = this.$refs.myCanvas;
        if (!canvas) {
            return;
        }
        // Create an empty project and a view for the canvas:
        // this.paper = paper;
        this.paper.setup(canvas as HTMLCanvasElement);
        this.paper.view.on('frame', () => {
            if (!this.gameover) this.onFrame()
        })
        setTimeout(() => {
            this.init()

        }, 0);

    }
    abstract init(): void
    abstract onFrame(): void;

    restart() {
        super.restart()
        this.paper.project.activeLayer.removeChildren();
    }


    get units() {
        const vw = this.paper.view.viewSize.width / 100;
        const vh = this.paper.view.viewSize.height / 100;
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
}