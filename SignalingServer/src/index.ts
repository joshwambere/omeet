import {WebSocketLib} from './libs/sockets/WebSocket.lib';
import WebSocket from "ws";
import {HOST} from "./_shared/config/env.variables";

export class App{
    private static _instance: WebSocketLib;

    private  websocketOptions:WebSocket.ServerOptions = {
        port: 3334,
        host: HOST,
        path: '/',
    }
    constructor(){
        App._instance = new WebSocketLib(this.websocketOptions);
        App._instance.init();
    }

}

new App();
