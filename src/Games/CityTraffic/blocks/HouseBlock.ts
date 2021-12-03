import { Block, RotationType } from "./Block";
import paper, { Color, PaperScope } from 'paper'

export class HouseBlock extends Block {
    color: string;
    direction: boolean;
    constructor(scope: paper.PaperScope, rotated: RotationType = 0, color: string, direction = true) {
        super(scope, 'house', rotated)
        this.color = color;
        this.direction = direction
        
    }
    drawBorders(): void {
        const borders =
            [
                new this.scope.Path.Rectangle(new this.scope.Point(-Block.SIZES.width / 2, -Block.SIZES.width / 2), new this.scope.Point(-Block.SIZES.width / 2 + Block.SIZES.border, Block.SIZES.width / 2)),
                new this.scope.Path.Rectangle(new this.scope.Point(Block.SIZES.width / 2 - Block.SIZES.border, -Block.SIZES.width / 2), new this.scope.Point(Block.SIZES.width / 2, Block.SIZES.width / 2)),
                new this.scope.Path.Rectangle(new this.scope.Point(-Block.SIZES.width / 2, -Block.SIZES.width / 2), new this.scope.Point(Block.SIZES.width / 2, -Block.SIZES.width / 2 + Block.SIZES.border)),

            ]
        borders.forEach((border) => {
            border.fillColor = Block.COLORS.border
            this.group.addChild(border)
        })

        const house =new this.scope.Path.Rectangle(new this.scope.Point(-Block.SIZES.width / 5, -Block.SIZES.width / 5), new this.scope.Point(Block.SIZES.width / 5, Block.SIZES.width / 5))
        setTimeout(() => {
            house.fillColor = new paper.Color(this.color)
            if(this.direction) house.rotate(45)

        }, 0);
        this.group.addChild(house)
    }

}