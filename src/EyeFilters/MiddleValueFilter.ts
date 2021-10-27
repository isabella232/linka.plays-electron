import paper from "paper";

import { EyeFilter } from "./EyeFilter";

export class MiddleValueFilter extends EyeFilter {
    calc(): paper.Point {
        let sum = new paper.Point(0, 0)

        for (const point of this.points) {
            sum = sum.add(point)
        }
        return sum.divide(this.points.length)
    }
}