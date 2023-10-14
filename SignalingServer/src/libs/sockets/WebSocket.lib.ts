import WebSocket, {WebSocketServer} from 'ws';
import * as http from "http";
import {ISocketData} from "../../_shared/interfaces/ISocket.interface";
import {randomUUID} from "crypto";
import {User} from "../../_shared/interfaces/IUser.interface";
import axios from "axios";
import SocketUtil from "../../_shared/utils/Socket.util";
import {IRoomMember} from "../../_shared/interfaces/IRoomMember";
import {BadRequestException} from "../../exceptions/Signaling.exception";

export class WebSocketLib extends WebSocketServer{
    public static options: WebSocket.ServerOptions;
    private static _rooms: Map<string, WebSocket[]> = new Map<string, WebSocket[]>();
    private SocketUtil = new SocketUtil();

    constructor(options: WebSocket.ServerOptions) {
        super(options);
    }


    public init(): void {
        this.on('connection', (ws: WebSocket,req: http.IncomingMessage) => {

            let socketId = req.headers['sec-websocket-key'] as string;
            console.info(`===== 🚀 Socket with id ${socketId} connected =====`);

            ws.on('message', (message: any) => {
                // validate message
                if (!this.handleIncomingMessages(JSON.parse(message)))
                    return;

                const {type, data} = JSON.parse(message) as ISocketData<any>;

                switch (type) {
                    case "create":

                        try {
                            this.getUserInformation(`http://localhost:4000/users/token/${data.t}`).then((user:User) => {
                                const roomName = this.generateRoomName();
                                this.create(roomName, user);
                                this.join(roomName, user, socketId);
                                ws.send(JSON.stringify({type: 'room:created', data: {roomName: roomName, members: this.getRoomUsers(roomName)}}));
                            });
                        }catch (e){
                            console.log(e);
                        }

                        break;
                    case "create:join":
                        try {
                            const roomName = data.d.roomName;
                            this.getUserInformation(`http://localhost:4000/users/token/${data.t}`).then((user:User) => {
                                this.join(roomName, user, socketId);
                                ws.send(JSON.stringify({type: 'room:joined', data: {roomName: roomName, members: this.getRoomUsers(roomName)}}));
                            })
                        }catch (e){
                            console.log(e);
                        }
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

    public create(roomName: string, user: User): void {
        if ( !WebSocketLib._rooms.has(roomName) ) {
            WebSocketLib._rooms.set(roomName, []);
        }
    }

    public join(roomName: string, user: User, socketId:string): void {
        if ( !WebSocketLib._rooms.has(roomName) )
            throw new BadRequestException('Room does not exist');

        this.SocketUtil.userJoin({id: user.id, username: user.username, room: roomName, socketId: socketId, isOnline: true, email: user.email});
    }

    public leave(roomName: string, user: User): void {
        this.SocketUtil.userLeave(user.id);
    }

    public getRoomUsers(roomName: string): IRoomMember[] {
        return this.SocketUtil.getRoomUsers(roomName);
    }

    private handleIncomingMessages(data:any):boolean {
        return (
            data !== null &&
            typeof data === 'object' &&
            'type' in data &&
            'data' in data
        );
    }

    private async getUserInformation(url:string): Promise<User>{
        return await axios.get<User>(url).then((response) => {
            return response.data;
        })
    }
    public generateRoomName(length: number = 27): string {
        return randomUUID();
    }


}
