<template>
    <v-layout row wrap class="GameView">
        <component :is="game" />
    </v-layout>
</template>

<script lang="ts">
import { GamesManifest } from '@/Games/GamesManifest';
import Vue from 'vue'
import Component from 'vue-class-component';

@Component
export default class GameViewer extends Vue{
    gameid: string|null = null;
    get game(){
        return GamesManifest
        .instance
        .findById(this.gameid)
    }
    created(){
        this.gameid = this.$router.currentRoute.params.gameid
    }
}
</script>

<style scoped>
.GameView{
    position: absolute;
    width: 100vw;
    height: 100vh;
    margin: 0;
    margin-top: 28px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>