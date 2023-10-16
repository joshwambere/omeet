import {IRoomMember} from "../interfaces/IRoomMember";

class SocketUtil{
    private users:Array<IRoomMember> = [];
    public userJoin =(roomMember:IRoomMember)=> {
        const user = { id: roomMember.id, username: roomMember.username, room: roomMember.room, socketId: roomMember.socketId, isOnline: roomMember.isOnline, email: roomMember.email };
        this.users.forEach((item,index)=>{
            if (item.id==roomMember.id){
                this.users.splice(index,1)
            }
        })
        this.users.findIndex((item) => (item.id === roomMember.socketId && item.id === roomMember.id && item.room === roomMember.room)) ===-1 ? this.users.push(user) : null;
        return user;
    }
    public getRoomUsers = (room:string)=> {
        return this.users.filter(user => user.room === room);
    }

    public getCurrentUser =(id:string)=> {
        return this.users.find(user => user.id === id);
    }

    public userLeave = (id:string)=> {
        const index = this.users.findIndex(user => user.id === id);

        if (index !== -1) {
            return this.users.splice(index, 1)[0];
        }
    }
}

export default SocketUtil;
