const socketIo = require('socket.io')

let io;

function initalizeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });


    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

async function sendMessageToSocketId(messageOject) {
    if (io) {
        io.emit(messageOject.event, messageOject.data)
    } else {
        console.log('socket.io not initialized');

    }
}

module.exports = { initalizeSocket, sendMessageToSocketId };