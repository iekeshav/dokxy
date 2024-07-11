module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);
        });

        socket.on('send-message', (roomId, message) => {
            io.to(roomId).emit('receive-message', message);
            console.log(`Message sent to room ${roomId}: ${message}`);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};
