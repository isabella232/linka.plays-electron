import paper from 'paper';

export abstract class EyeFilter {
    points: paper.Point[] = []
    maxPointCount = 5;
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