import { Block, RotationType } from "./Block";
import paper, { Color, PaperScope } from 'paper'

export class TurnBlock extends Block {
    constructor(scope: paper.PaperScope,  rotated:RotationType = 0){
        super(scope, 'turn', rotated)
    }
    drawBorders(): void {
           const borders =
                [
                    new this.scope.Path.Rectangle(new this.scope.Point(-Block.SIZES.width / 2, -Block.SIZES.width / 2), new this.scope.Point(-Block.SIZES.width / 2 + Block.SIZES.border, Block.SIZES.width / 2)),
                    new this.scope.Path.Rectangle(new this.scope.Point(-Block.SIZES.width / 2, -Block.SIZES.width / 2), new this.scope.Point(Block.SIZES.width / 2 , -Block.SIZES.width / 2+ Block.SIZES.border)),
                ]
            borders.forEach((border) => {
                border.fillColor = Block.COLORS.border
                this.group.addChild(border)
            })
    }

}