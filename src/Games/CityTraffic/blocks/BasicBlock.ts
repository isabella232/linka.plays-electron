import { Block, RotationType } from "./Block";
import paper, { Color, PaperScope } from 'paper'
import { Point } from "paper/dist/paper-core";

export class BasicBlock extends Block {
    constructor(scope: paper.PaperScope, rotated: RotationType = 0) {
        super(scope, 'basic', rotated)
    }
    drawBorders(): void {
        const borders =
            [
                new this.scope.Path.Rectangle(new this.scope.Point(-Block.SIZES.width / 2, -Block.SIZES.width / 2), new this.scope.Point(-Block.SIZES.width / 2 + Block.SIZES.border, Block.SIZES.width / 2)),
                new this.scope.Path.Rectangle(new this.scope.Point(Block.SIZES.width / 2 - Block.SIZES.border, -Block.SIZES.width / 2), new this.scope.Point(Block.SIZES.width / 2, Block.SIZES.width / 2)),
                new this.scope.Path.Star(new Point(0, 0), 3, Block.SIZES.width / 4, Block.SIZES.width / 8)
            ]
        // borders[2].rotate(this.rotated * 90)
        borders.forEach((border) => {
            border.fillColor = Block.COLORS.border
            this.group.addChild(border)
        })
    }

}