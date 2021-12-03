import { Map } from "./Map";


export const level1Map = new Map(
    {
        cross: [
            { x: 0, y: 0, rotation: 0 },
            { x: -5, y: -2, rotation: 0 }
        ],
        house: [
            
            { x: -3, y: 2, rotation: 2, direction: true, color: 'red' },
            { x: 2, y: -1, rotation: 0, direction: false, color: 'red' },
            { x: -1, y: 1, rotation: 0, direction: false, color: 'green' },
            { x: 0, y: -2, rotation: 0, direction: true, color: 'green' },
        ],
        basic: [
            { x: 0, y: 1, rotation: 2 },
            { x: 0, y: -1, rotation:2 },
            { x: 1, y: 0, rotation: 1 },
            { x: -1, y: 0, rotation: 1 },
            { x: -2, y: 0, rotation: 1 },
            { x: -3, y: 1, rotation: 0 },
            // { x:  1, y: 2, rotation: 1 },
        ],
        turn: [
            { x: -3, y: 0, rotation: 0 },
            { x: 2, y: 0, rotation: 2 },
            { x: 0, y: 2, rotation: 2 },
            { x: -1, y: 2, rotation: 3 },

        ]
    }

)