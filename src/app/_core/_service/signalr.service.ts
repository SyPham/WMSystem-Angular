import { Injectable, EventEmitter } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
//   public hubConnection: signalR.HubConnection;
//   public SendMessageToGroup = new EventEmitter<any>();
//   public ReceiveTyping = new EventEmitter<any>();
//   public ReceiveStopTyping = new EventEmitter<any>();
//   // public ReceiveTyping = new EventEmitter<any>();
//   receivedMessageGroup = new BehaviorSubject<number>(0);
//   currentreceiveMessageGroup = this.receivedMessageGroup.asObservable();
//   // method này để change source message
//   receivedTyping = new BehaviorSubject<string>('');
//   currentReceiveTyping = this.receivedTyping.asObservable();
//   // method này để change source message
//   changeReceiveTyping(message) {
//     this.receivedMessageGroup.next(message);
//   }
//   changeReceiveMessage(message) {
//     this.receivedMessageGroup.next(message);
//   }
//   constructor() {
//     this.startConnection();
//     this.registerOnServerEvents();
//   }
//   public startConnection = () => {
//     this.hubConnection = new signalR.HubConnectionBuilder()
//                             .withUrl(environment.hub)
//                            // .configureLogging(signalR.LogLevel.Information)
//                             .build();
//     this.start();
//   }
//   public async start() {
//     try {
//         await this.hubConnection.start();
//         console.log('connected');
//     } catch (err) {
//         console.log(err);
//         setTimeout(() => this.start(), 5000);
//     }
// }

// // emit event to server
//  public joiGroup(room: string, user: string) {
//    this.hubConnection
//    .invoke('JoinGroup', room.toString(), user.toString())
//    .catch((err) => {
//       console.error(err.toString());
//    });
//  }
//  public stopTyping(room: string, user: string) {
//    this.hubConnection
//    .invoke('StopTyping', room.toString(), user.toString())
//    .catch((err) => {
//       console.error(err.toString());
//    });
//  }
//  public typing(room: string, user: string) {
//    this.hubConnection
//    .invoke('Typing', room.toString(), user.toString())
//    .catch((err) => {
//       console.error(err.toString());
//    });
//  }
//  public sendToGroup(room: string, message: string, user: string) {
//    this.hubConnection
//    .invoke('SendMessageToGroup', room.toString(), message, user.toString())
//    .catch((err) => {
//       console.error(err.toString());
//    });
//  }

//  // receive event to server
//  public checkAlert(user: string) {
//   this.hubConnection
//   .invoke('CheckAlert', user)
//   .catch((err) => {
//      console.error(err.toString());
//   });
// }
//  public receiveJoinGroup(callBack: (user: string, username: string) => any) {
//    this.hubConnection.on('ReceiveJoinGroup', callBack);
//  }
//  public receiveTyping(callBack: (user: string, username: string) => any) {
//    this.hubConnection.on('ReceiveTyping', callBack);
//  }
//  public receiveStopTyping(callBack: (user: string) => any) {
//   this.hubConnection.on('ReceiveStopTyping', callBack);
// }
//  public receiveMessageGroup(callBack: (message: string) => any) {
//    this.hubConnection.on('ReceiveMessageGroup', callBack);
//  }
//  private registerOnServerEvents(): void {
//   this.hubConnection.on('ReceiveMessageGroup', (message) => {
//     this.changeReceiveMessage(message);
//   });

//   this.hubConnection.on('ReceiveTyping', (message) => {
//     this.changeReceiveTyping(message);
//   });
//   }
}
