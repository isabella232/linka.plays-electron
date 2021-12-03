import paper from "paper";
import { Point } from "paper/dist/paper-core";
import { BasicBlock } from "../blocks/BasicBlock";
import { Block, BlockType, RotationType } from "../blocks/Block";
import { CrossBlock } from "../blocks/CrossBlock";
import { HouseBlock } from "../blocks/HouseBlock";
import { TurnBlock } from "../blocks/TurnBlock";
import { Car } from "../Car";

export class Map {
    blocksLocation: BlocksLocation;
    blocks: Block[] = []
    cars: Car[] = [];
    constructor(blocksLocation: BlocksLocation) {
        this.blocksLocation = blocksLocation;
    }

    drawMap(scope: paper.PaperScope) {
        for (const key in this.blocksLocation) {
            if (Object.prototype.hasOwnProperty.call(this.blocksLocation, key)) {
                for (const element of this.blocksLocation[key as BlockType]) {
                    let block: Block | null = null;
                    switch (key as BlockType) {
                        case 'basic':
                            block = new BasicBlock(scope, element.rotation)
                            break;
                        case 'cross':
                            block = new CrossBlock(scope, element.rotation)
                            break;
                        case 'turn':
                            block = new TurnBlock(scope, element.rotation)
                            break;
                        case 'house':


                            if (element.color) {
                                block = new HouseBlock(scope, element.rotation, element.color, element.direction)
                                setInterval(() => {
                                    if ((block as HouseBlock).direction) this.cars.push(new Car(scope, this, block as HouseBlock))

                                }, 3000);
                             setTimeout(() => {
                                if ((block as HouseBlock).direction) this.cars.push(new Car(scope, this, block as HouseBlock))
                                 
                            }, 0);

                            }
                            break;
                    }
                    if (!block) return;
                    block.group.position = scope.view.center.add(new Point(element.x * Block.SIZES.width, element.y * Block.SIZES.width))

                    this.blocks.push(block)
                }
            }
        }
    }

    getBlockUnderCoords(position: paper.Point): Block | null {
        for (const block of this.blocks) {
            if (block.group.bounds.contains(position)) return block;
        }
        return null;
    }
    onFrame(){
        for (const block of this.blocks) {
            if(block.type==='cross'){
                (block as CrossBlock).onFrame()
            }
        }
    }
}

interface location { x: number, y: number, rotation: RotationType, color?: string, direction?: boolean }
type BlocksLocation = { [key in BlockType]: location[] }