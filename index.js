const http = require('http');
const WebSocket = require('ws');

const server = new WebSocket.WebSocketServer({
        port: 8080
    },
    () => {
        console.log('Server started on port 8080');
    }
);

const users = new Set();

const sendMessage = ( message ) => {
    users.forEach( user => {
        user.ws.send( JSON.stringify(message) );
    })
};

server.on( 'connection', ( ws ) => {
    const userRef = {
        ws,
    }
    users.add( userRef );

    ws.on( 'message', (message) =>{
        console.log(message);
        try {
            const data = JSON.parse(message);

            if(
                typeof data.sender !== 'string' ||
                typeof data.body !== 'string'
            ){
                console.error('Invalid message');
                return;
            }

            const messageToSend = {
                sender: data.sender,
                body: data.body,
                sentAt: Date.now()
            }

            sendMessage(messageToSend);
        } catch(ex) {
            console.error('Error passing message!', e)
        }
    });

    ws.on( 'close', (code, reason) => {
        users.delete(userRef);
        console.log(`Connection closed: ${code} ${reason}!`)
    })
} );
