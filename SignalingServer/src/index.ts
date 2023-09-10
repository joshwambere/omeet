import {WebSocketLib} from './libs/sockets/WebSocket.lib';
import WebSocket from "ws";

export class App{
    private static _instance: WebSocketLib;

    private  websocketOptions:WebSocket.ServerOptions = {
        port: 3334,
        host: 'localhost',
        path: '/',
    }
    constructor(){
        App._instance = new WebSocketLib(this.websocketOptions);
        App._instance.init();
    }

}

new App();
