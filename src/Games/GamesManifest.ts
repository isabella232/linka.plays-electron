import { VueConstructor } from "vue";
import CanvasButterfly from "./CanvasButterfly/CanvasButterfly.vue";
import Arkanoid from "./Arkanoid/Arkanoid.vue";

export class GamesManifest {
    private static _instance: GamesManifest | null;
    static get instance(): GamesManifest {
        if (this._instance == null) {
            this._instance = new GamesManifest()
        }
        return this._instance
    }

    games = {
        CanvasButterfly,
        Arkanoid
    } as { [key in string]: VueConstructor };

    findById(gameid: string): VueConstructor | undefined {
        return this.games[gameid]
    }
}