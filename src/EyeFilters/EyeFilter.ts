import paper from 'paper';

export abstract class EyeFilter {
    protected points: paper.Point[] = []
    protected maxPointCount;

    constructor(maxPointCount = 5) {
        this.maxPointCount = maxPointCount
    }

    addPoint(point: paper.Point) {
        this.points.push(point)
        if (this.points.length > this.maxPointCount) {
            this.points.unshift()
        }
        const value = this.calc()
        return value
    }
    abstract calc(): paper.Point;
}