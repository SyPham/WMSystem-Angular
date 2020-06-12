import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';

export const CONNECTION_HUB = new signalR.HubConnectionBuilder()
    .withUrl(environment.hub)
    // .configureLogging(signalR.LogLevel.Information)
    .build();
// Start the connection.
start();
function start() {
    CONNECTION_HUB.start().then(function () {
        // ReceiveCheckAlert();
        CONNECTION_HUB.on('UserConnected', (conId) => {
            // console.log("UserConnected", conId);

        });
        CONNECTION_HUB.on('UserDisconnected', (conId) => {
            // console.log("UserDisconnected", conId);

        });
        // console.log("Signalr connected");
    }).catch(function (err) {
        // console.log(err);
        setTimeout(() => start(), 5000);
    });
}
// start();
// async function start() {
//     try {
//         await CONNECTION_HUB.start();
//         // console.log("Signalr connected");
//         CONNECTION_HUB.on('UserDisconnected', (conId) => {
//             // console.log("UserDisconnected");
//         });
//     } catch (err) {
//         // console.log(err);
//         setTimeout(() => start(), 5000);
//     }
// };

// function registerEvent() {
//     CONNECTION_HUB.on('ReceiveCheckAlert', () => {

//     });
//     CONNECTION_HUB.on('UserConnected', () => {

//     });
// }
