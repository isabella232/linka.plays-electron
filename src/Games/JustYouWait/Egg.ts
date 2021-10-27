import paper from 'paper'
import { Point } from "paper/dist/paper-core";


export class Egg {
    static moveVector = new Point(30, 20);
    static eggInitPosition = new Point(400, 75);
    static fallingPosition = new Point(-200, 285);
    raster: paper.Raster;
    side: number;
    life = 0;
    falling = false;
    scope: paper.PaperScope;

    constructor(scope: paper.PaperScope, side: number) {
        this.side = side
        this.scope = scope;
        this.raster = new scope.Raster({
            source: "/images/JustYouWait/egg.png",
        });
        const multiplier = new Point(-1, -1)
        if (side === 1 || side == 3) {
            multiplier.x = 1
        }
        if (side === 2 || side == 3) {
            multiplier.y = 1
        }
        this.raster.position = scope.view.center.add(Egg.eggInitPosition.multiply(multiplier));

    }
    get sideMultiplier() {
        return this.side % 2 === 1 ? -1 : 1
    }
    move() {
        if (this.falling) this.catch()
        if (this.life > 4) return;

        this.raster.position = this.raster.position.add(Egg.moveVector.multiply(new Point(this.sideMultiplier, 1)))
        this.raster.rotate(30 * this.sideMultiplier)

        this.life++;
    }
    catch() {
        this.raster.remove()
    }
    fall() {
        this.falling = true;
        this.raster.position = this.scope.view.center.add(Egg.fallingPosition.multiply(new Point(this.sideMultiplier, 1)))
        this.raster.source = "/images/JustYouWait/badEgg.png"
    }
}