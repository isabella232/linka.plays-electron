import paper from "paper";

import { EyeFilter } from "./EyeFilter";

export class JackanapesFilter extends EyeFilter {
    calc(): paper.Point {
        let sum = new paper.Point(0, 0)

        for (const point of this.points) {
            sum = sum.add(point)
        }
        const midValue = sum.divide(this.points.length)
        if(this.points.length===1){
            return midValue
        }
        let maxDistance = 0;
        let maxDistanceIndex = 0;
        for (const key in this.points) {
            if (Object.prototype.hasOwnProperty.call(this.points, key)) {
                const element = this.points[key];
                const distance = element.getDistance(midValue);
                if(distance>maxDistance){
                    maxDistance=distance
                    maxDistanceIndex = +key
                }

            }
        }
        sum = sum.subtract(this.points[maxDistanceIndex])
        return sum.divide(this.points.length-1)
    }
}