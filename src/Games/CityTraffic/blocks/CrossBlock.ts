import { Block, RotationType } from "./Block";
import paper, { Color, PaperScope } from 'paper'
import { GazeAwareWatcher } from "@/CanvasUtils/GazeAwareWatcher";

export class CrossBlock extends Block {
    light: paper.Group | null = null;
    lightRotation = 0

    get rotated() { return this._rotated }
    set rotated(value: RotationType) {
        this._rotated = value;
    }

    constructor(scope: paper.PaperScope, rotated: RotationType = 0) {
        super(scope, 'cross', rotated)

        this.group.on('click', () => {
            this.rotate()
        })
        new GazeAwareWatcher(scope, this.group, {
            watchClik: true,
            watchHover: true,
            clickTimeout: 1000
        })
        .on('click', ()=>{
            this.rotate()
        })
    }
    rotate() {
        const rotated = this.rotated + 1

        this.rotated = (rotated > 3 ? 0 : rotated) as RotationType

    }
    drawBorders(): void {
        const borders =
            [
                new this.scope.Path.Rectangle(new this.scope.Point(-Block.SIZES.width / 2, -Block.SIZES.width / 2), new this.scope.Point(-Block.SIZES.width / 2 + Block.SIZES.border, -Block.SIZES.width / 2 + Block.SIZES.border)),

                new this.scope.Path.Rectangle(new this.scope.Point(Block.SIZES.width / 2, -Block.SIZES.width / 2), new this.scope.Point(Block.SIZES.width / 2 - Block.SIZES.border, -Block.SIZES.width / 2 + Block.SIZES.border)),
                new this.scope.Path.Rectangle(new this.scope.Point(-Block.SIZES.width / 2, Block.SIZES.width / 2), new this.scope.Point(-Block.SIZES.width / 2 + Block.SIZES.border, Block.SIZES.width / 2 - Block.SIZES.border)),


                new this.scope.Path.Rectangle(new this.scope.Point(Block.SIZES.width / 2, Block.SIZES.width / 2), new this.scope.Point(Block.SIZES.width / 2 - Block.SIZES.border, Block.SIZES.width / 2 - Block.SIZES.border)),


            ]
        borders.forEach((border) => {
            border.fillColor = Block.COLORS.border
            this.group.addChild(border)
        })

        this.light = new this.scope.Group()

        const circle = new this.scope.Path.Circle(new this.scope.Point(0, 0), Block.SIZES.width / 4);
        circle.fillColor = new Color('black')

        const greenCircles = [new this.scope.Path.Circle(new this.scope.Point(0, - Block.SIZES.width / 4), Block.SIZES.width / 16), new this.scope.Path.Circle(new this.scope.Point(0, Block.SIZES.width / 4), Block.SIZES.width / 16),];

        const redCircles = [new this.scope.Path.Circle(new this.scope.Point(- Block.SIZES.width / 4, 0), Block.SIZES.width / 16), new this.scope.Path.Circle(new this.scope.Point(Block.SIZES.width / 4, 0), Block.SIZES.width / 16),];
        greenCircles.forEach((circle) => { circle.fillColor = new Color('green'); this.light!.addChild(circle) });
        redCircles.forEach((circle) => { circle.fillColor = new Color('red'); this.light!.addChild(circle) });
        this.light.rotation = 0
        this.light.addChild(circle)
        this.group.addChild(this.light)


    }
    onFrame() {
        const light = this.group.children[this.group.children.length - 1]
        if (light && this.rotated * 90 !== this.lightRotation) {
            console.log(this.rotated * 90, this.lightRotation);
            this.lightRotation +=5 ;
            light.rotation = 5
            if (this.lightRotation > 360) this.lightRotation = 0
        }
    }
}