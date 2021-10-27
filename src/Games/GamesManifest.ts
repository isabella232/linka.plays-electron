import { VueConstructor } from "vue";
import CanvasButterfly from "./CanvasButterfly/CanvasButterfly.vue";
import Arkanoid from "./Arkanoid/Arkanoid.vue";
import JustYouWait from "./JustYouWait/JustYouWait.vue";

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
        Arkanoid,
        JustYouWait
    } as { [key in string]: VueConstructor };

    findById(gameid: string): VueConstructor | undefined {

        return this.games[gameid]
    }
}