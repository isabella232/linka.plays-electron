import { VueConstructor } from "vue";
import CanvasButterfly from "./CanvasButterfly/CanvasButterfly.vue";

export class GamesManifest {
    private static _instance: GamesManifest | null;
    static get instance(): GamesManifest {
        if (this._instance == null) {
            this._instance = new GamesManifest()
        }
        return this._instance
    }

    games = [
        CanvasButterfly,

    ];

    findById(gameid: string | null): VueConstructor | undefined {
        return this.games.find((game: any) => game.id === gameid)
    }
}