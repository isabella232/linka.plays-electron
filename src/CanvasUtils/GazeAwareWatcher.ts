import { ipcRenderer } from "electron";
import { EventEmitter } from "events";
import paper from 'paper'
import { Color } from "paper/dist/paper-core";
import { GazeData } from "tobiiee/build/GazeData";

export class GazeAwareWatcher extends EventEmitter {
    options: GazeAwareWatcherOptions
    element: paper.PathItem|paper.Group;
    lastInsideEnter: number | null = null;
    gazeTS = 0;
    scope: paper.PaperScope;
    processCircle: paper.Path.Circle;
    constructor(scope: paper.PaperScope, element: paper.PathItem|paper.Group, options: GazeAwareWatcherOptions = {
        watchClik: true,
        watchHover: true,
        clickTimeout: 1000
    }) {
        super();
        this.element = element
        this.options = options
        this.scope=scope

        ipcRenderer.on("point", (_, data: GazeData) => {
            const rect = this.element.view.element.getBoundingClientRect()

            this.onPoint(
                new paper.Point({
                    x: data.x - rect.x,
                    y: data.y - rect.y,
                }), data.ts
            );
        });

        element.view.on('frame', () => {
            this.onFrame()
        })

        this.processCircle = new scope.Path.Circle(element.position, Math.min(element.bounds.width, element.bounds.height)/8)

        this.processCircle.fillColor = new Color('red')
        this.processCircle.fillColor.alpha = 0
    }
    onFrame() {
                this.processCircle.position = this.element.position    
        if (this.options.clickTimeout) {
            const nowTS = + new Date(

            )

            const progress = nowTS - this.gazeTS 
            if(this.processCircle.fillColor) this.processCircle.fillColor.alpha = progress/this.options.clickTimeout
            if (progress> this.options.clickTimeout / 4) {
                this.lastInsideEnter = null
            }
            if (this.lastInsideEnter != null) {
                if (nowTS - this.lastInsideEnter > this.options.clickTimeout) {
                    this.emit('click')
                    this.lastInsideEnter = null;
                }
            }
        }
    }
    onPoint(data: paper.Point, ts: number) {
        const inside = this.element.bounds.contains(data)
        this.gazeTS = ts;
        if (this.lastInsideEnter === null && inside) {
            this.lastInsideEnter = ts
            if (this.options.watchHover) {
                this.emit('hover')
            }
        }
        if (!inside && this.lastInsideEnter !== null) {
            this.lastInsideEnter = null;
            if (this.options.watchHover) {
                this.emit('unhover')
            }
        }
    }
}

interface GazeAwareWatcherOptions {
    watchHover: boolean,
    watchClik: boolean,
    clickTimeout: number
}