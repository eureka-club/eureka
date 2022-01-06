import {Session} from '@/src/types'
import {io, Socket} from 'socket.io-client'
import {WEBAPP_URL} from '@/src/constants'

/* interface SocketIOResponse{
  fromUser: string;
  toUser: string;
  data: Record<string,string>;
} */
export default class SocketIO {

  // static instance: SocketIO;
  private socket: any;
  private toUsers: number[];
  private callback: (data:Record<string,any>)=>void;
  private fromUser?: number;
  

  public constructor(toUsers:number[],callback: (data:Record<string,any>)=>void,fromUser?:number) {
    this.toUsers = toUsers;
    this.callback = callback;
    if(fromUser)
      this.fromUser = fromUser;
    this.socket = io("https://eurekaclubeureka-notification.azurewebsites.net/",{
      // withCredentials: true,
      extraHeaders: {
      //"session-id": session?session.user.id.toString():''
      }
    });

    this.socket.on('connection',(res: any)=>{
      console.log(res);
    });

    this.socket.on(['notify',this.toUsers],(data:any) => {
        this.callback(data);
        // alert(data.message);
    });

  }

  // public static getInstance(toUsers:number[],callback: (data:Record<string,any>)=>void,fromUser?:number): SocketIO {
  //     if (!SocketIO.instance) {
  //         SocketIO.instance = new SocketIO(toUsers,callback,fromUser);
  //     }
  //     SocketIO.instance.toUsers = toUsers;
  //     SocketIO.instance.callback = callback;
  //     if(fromUser)
  //       SocketIO.instance.fromUser = fromUser;
  //     return SocketIO.instance;
  // }

  public notify(data:any) {
    this.socket.emit(`notify`, {toUsers: this.toUsers, ...data});
  }
  public getSocket(){return this.socket;}

}