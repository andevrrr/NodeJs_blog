let io;

module.exports = {
    init: (httpServer, corsOptions) => {
        io = require('socket.io')(httpServer, corsOptions);
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized');
        }
        return io;
    }
};
