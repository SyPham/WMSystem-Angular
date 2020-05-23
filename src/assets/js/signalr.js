import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';

export const CONNECTION_HUB = new signalR.HubConnectionBuilder()
    .withUrl(environment.hub)
    .configureLogging(signalR.LogLevel.Information)
    .build();
// Start the connection.
start();
async function start() {
    try {
        await CONNECTION_HUB.start();
        console.log("bot connected");
        console.log("State: ", CONNECTION_HUB.connectionState);
    } catch (err) {
        console.log(err);
        setTimeout(() => start(), 5000);
    }
};
