import {Session} from '@/src/types'
import {io, Socket} from 'socket.io-client'
import { NotifierRequest } from '@/src/types';
import { NotifierResponse } from '@/src/types';

export default class Notifier {

  // static instance: SocketIO;
  private socket: any;
  // private toUsers: number[];
  // private callback: (res:NotifierResponse) => void;
  private fromUser: number;
  

  public constructor(fromUser:number) {
    // this.toUsers = toUsers;
    // this.callback = callback;
    this.fromUser = fromUser;
    const socketIOServervice = process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000/'
      : "https://eurekaclubeureka-notification.azurewebsites.net/";
    this.socket = io(socketIOServervice,{
      // withCredentials: true,
      extraHeaders: {
      "session-id": this.fromUser.toString()
      }
    });

    this.socket.on('connection',(res: any)=>{
      console.log("connected to socketio");
      
    });

    this.socket.on(['notify',fromUser],(res: NotifierResponse) => {
        globalThis.dispatchEvent(new CustomEvent('notify',{detail:res}));
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

  public notify(req: NotifierRequest) {
    const {toUsers,data} = req;
    this.socket.emit(`notify`, {
      toUsers,
      data,
    });
  }
  public getSocket(){return this.socket;}

}