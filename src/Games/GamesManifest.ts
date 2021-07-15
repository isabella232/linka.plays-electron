import { VueConstructor } from "vue";
import Butterfly from "./Butterfly/Butterfly.vue";
import CatchButterfly from "./CatchButterfly/CatchButterfly.vue";
import TicTacToe from "./TicTacToe/TicTacToe.vue";
export class GamesManifest {
    private static _instance: GamesManifest|null;
    static get instance():GamesManifest{
        if(this._instance==null){
               this._instance = new GamesManifest()
        }
        return this._instance
    }

    games = [
        Butterfly,
        CatchButterfly,
        TicTacToe
    ];

    findById(gameid: string|null):VueConstructor|undefined {
        return this.games.find((game : any)=>game.id===gameid)
    }
}