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
        this.paper.view.on('frame', this.onFrame)
        setTimeout(() => {
            this.init()
            
        }, 0);

    }
    abstract init() :void
    abstract onFrame(): void;

    restart(){
        super.restart()
        this.paper.project.activeLayer.removeChildren();
    }
}