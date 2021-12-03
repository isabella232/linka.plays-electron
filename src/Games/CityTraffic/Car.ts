import { v4 as uuidv4 } from 'uuid';
import paper from 'paper'
import { Map } from "./maps/Map";
import { Block, RotationType } from "./blocks/Block";
import { HouseBlock } from './blocks/HouseBlock';
import { Point } from 'paper/dist/paper-core';

export class Car {
    private speed = 1
    static SIZE = new paper.Point(1, 1.5).multiply(7)
    rect: paper.Path.Rectangle;
    private block: HouseBlock;
    private map: Map;
    rotated: RotationType;
    finish = false;
    gameover = false;
    static TURNMAP: { [key in RotationType]: RotationType } = {
        0: 0,
        1: 3,
        2: 2,
        3: 1
    };
    id: string = uuidv4()
    rightTurn = true;
    lastUnderBlock: Block | null = null;
    color: string;
    blockDrivesCount = 0;
    get underBlock(): Block | null {
        return this.map.getBlockUnderCoords(this.rect.position)
    }
    constructor(scope: paper.PaperScope, map: Map, block: HouseBlock) {
        this.map = map;
        this.block = block;
        this.rect = new scope.Path.Rectangle(Car.SIZE.multiply(-1), Car.SIZE)
        this.rect.fillColor = new paper.Color(block.color)
        this.color = block.color
        this.rotated = block.rotated;
        this.rect.position = block.group.position.add(new Point(0, Block.SIZES.width / 5).rotate(block.rotated * 90, new Point(0, 0)))
    }
    onFrame(cars: Car[], index: number) {
        const nearCarDistance = this.getNearCarDistance(cars, index)

        if (nearCarDistance != undefined && nearCarDistance < Car.SIZE.y*3) {
            if (this.underBlock?.type === 'house') {
                this.gameover = true;
            }
            return;
        }

        const underBlock = this.underBlock;
        if (underBlock == null) return;
        let moved = false;
        let newBlock = false
        if (this.lastUnderBlock?.id != underBlock.id) {
            this.lastUnderBlock?.removeCar(this)
            this.lastUnderBlock = underBlock
            this.lastUnderBlock.addCar(this)
            newBlock = true;
            this.blockDrivesCount = 0
        }

        let canDriveCross = false
        if (underBlock?.type === 'cross') {
            const freeCross = underBlock.cars.filter(car => car.color !== this.color&&car.blockDrivesCount>0).length < 1 
            const trueDirection = underBlock.rotated % 2 === this.rotated % 2
            canDriveCross = (freeCross && trueDirection) || (!trueDirection && this.blockDrivesCount > 3);

        }

        if (underBlock?.type === 'basic' || (underBlock?.type === 'house' && (underBlock as HouseBlock).direction) || canDriveCross) {


            this.rect.position = this.rect.position.add(new Point(0, this.speed).rotate(Car.TURNMAP[this.rotated] * 90, new Point(0, 0)));
            moved = true;
        }
        if (this.underBlock?.type === 'turn') {
            if (newBlock) {
                this.rightTurn = underBlock.rotated <= this.rotated || this.rotated === 0;

                const rotated = this.rotated + (this.rightTurn ? -1 : 1);
                this.rotated = rotated > 3 ? 0 : rotated < 0 ? 3 : rotated as RotationType;

            }
            const turnConnor = [this.underBlock.group.bounds.bottomRight, this.underBlock.group.bounds.bottomLeft, this.underBlock.group.bounds.topLeft, this.underBlock.group.bounds.topRight]
            this.rect.rotate(0.9 * (this.rightTurn ? 1 : -1), turnConnor[this.underBlock.rotated])
            moved = true;


        }
        if (this.underBlock?.type === 'house' && !(this.underBlock as HouseBlock).direction) {
            this.finish = true
        }
        if (moved) {
            this.blockDrivesCount++
        }

    }
    getNearCarDistance(cars: Car[], index: number) {
        let distance: number | undefined = undefined
        for (let i = index - 1; i > -1; i--) {
            const ldistance = cars[i].rect.position.getDistance(this.rect.position)
            if (distance === undefined || distance > ldistance) distance = ldistance
        }
        return distance
    }
}