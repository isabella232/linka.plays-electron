import paper from 'paper'
import { Point } from "paper/dist/paper-core";


export class Wolf {
    scope: paper.PaperScope;
    raster: paper.Raster;
    side: number;

    constructor(scope: paper.PaperScope, side = 0) {
        this.side = side
        this.scope = scope;
        this.raster = new scope.Raster({
            source: "/images/JustYouWait/wolf-0.png",
        });
        this.raster.position = scope.view.center.add(new Point(0, 120));
    }

    setSide(value: number) {
        this.raster.
            source = `/images/JustYouWait/wolf-${value}.png`
        this.side = value
    }
}