// Path: SignalingServer/src/libs/sockets/WebSocket.lib.ts
import WebSocket, {WebSocketServer} from 'ws';

export class WebSocketLib extends WebSocketServer{
    public static options: WebSocket.ServerOptions;
    private static _rooms: Map<string, WebSocket[]> = new Map<string, WebSocket[]>();

    constructor(options: WebSocket.ServerOptions) {
        super(options);
    }


    public init(): void {
        this.on('connection', (ws: WebSocket) => {

            ws.on('message', (message: any) => {
                const obj = JSON.parse(message);
                const type = obj.token;
                const params = obj.token;
                console.log(`Received message ${message}`);
                console.log(`Type: ${type}`);
                switch (type) {
                    case "create":
                        const roomName = this.generateRoomName();
                        this.create(roomName);
                        break;
                    default:
                        console.warn(`Type: ${type} unknown`);
                        break;
                }
            });

            ws.on('close', () => {
                console.log('disconnected');
            });
        });
    }

    public create(roomName: string): void {
        if (!WebSocketLib._rooms.has(roomName)) {
            WebSocketLib._rooms.set(roomName, []);
        }
    }

    public generateRoomName(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
        const roomNameLength = 15;
        return Math.random().toString(36).substring(2, roomNameLength);
    }
}
