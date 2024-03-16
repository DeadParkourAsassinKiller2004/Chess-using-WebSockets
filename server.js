import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuid } from "uuid";

const clients = {};
let connectedClients = 0;
let restartsId = [];
let i = 0;

const wss = new WebSocketServer({ port: 8000 });

wss.on("connection", (ws) => {
    if (connectedClients >= 2) {
        ws.terminate();
        console.log("Connection rejected: maximum clients reached");
        return;
    }

    const id = uuid();
    clients[id] = ws;
    connectedClients++;

    if(connectedClients === 2){
        for (const clientId in clients) {
            send(clientId, {type: "start"})
        }
    }

    console.log(`New client ${id}`);

    const color = connectedClients === 1 ? 'white' : 'black';
    send(id, { type: 'color', color });

    ws.on('message', (rawMessage) => {
        const message = JSON.parse(rawMessage.toString());

        if (message.type === 'move') {
            for (const clientId in clients) {
                if (clientId !== id) {
                    send(clientId, message);
                }
            }
        }
        else if(message.type === 'result'){
            for (const clientId in clients) {
                send(clientId, message)
            }
        }
        else if(message.type === 'restart'){
            if(!restartsId.includes(id)){
                restartsId[i] = id;
                i++;
                console.log(i);
            }

            if(restartsId.length === 2){
                console.log('перезапускаем');
                for(const clientId in clients){
                    send(clientId, {type: "confirmRestart"})
                }
                restartsId = [];
                i = 0;
            }
        }
    });

    ws.on('close', () => {
        delete clients[id];
        connectedClients--;
        console.log(`Client is closed ${id}`);
    });
});

function send(id, message) {
    const client = clients[id];

    if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
    } else {
        console.log(`Error sending message to client ${id}: client not found or connection closed`);
    }
}
