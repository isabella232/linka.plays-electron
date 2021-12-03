import { v4 as uuidv4 } from 'uuid';
import paper, { Color, PaperScope } from 'paper'
import { Car } from '../Car';

export type BlockType = 'basic' | 'cross' | 'turn' | 'house';
export type RotationType = 0 | 1 | 2 | 3
export abstract class Block {
    cars: Car[] = []
    static COLORS = {
        road: new Color('#124D70'),
        border: new Color('#dddddd')
    }
    static SIZES = {
        width: 100,
        border: 10,
        dotLenth: 20
    }
    id: string = uuidv4()
    group: paper.Group
    protected _rotated: RotationType = 0;
    scope: paper.PaperScope;
    type: BlockType;

    get rotated() {
        return this._rotated;
    }
    set rotated(value: RotationType) {
        this._rotated = value;
        this.group.rotation = value*90  ;
            

    }

    constructor(scope: paper.PaperScope, type: BlockType, rotated: RotationType = 0) {
        this.scope = scope
        this.group = new scope.Group();
        this.type = type;
        const main = new scope.Path.Rectangle(new scope.Point(-Block.SIZES.width / 2, -Block.SIZES.width / 2), new scope.Point(Block.SIZES.width / 2, Block.SIZES.width / 2))
        main.fillColor = Block.COLORS.road;
        this.group.addChild(main)
        this.drawBorders();
        this.rotated = rotated


    }
    abstract drawBorders(): void;


    removeCar(car: Car) {
        this.cars = this.cars.filter((c) => car.id !== c.id)
    }
    addCar(car: Car) {
        this.cars.push(car)
    }
    indexOfCar(car: Car) {
        return this.cars.indexOf(car)
    }

}