const Message = require('../../db').models.message;
const Sequelize = require('sequelize');

module.exports = (server) => {
    const io = require('socket.io').listen(server);

    const clients = {};

    io.on('connection', (socket) => {
        socket.on('users:connect', ({ username, userId }) => {
            const socketId = socket.id;
            const newUser = {
                socketId,
                username: username,
                userId: userId,
                activeRoom: null,
            };
            clients[socketId] = newUser;
            socket.emit('users:list', Object.values(clients));
            socket.broadcast.emit('users:add', newUser);
        });

        socket.on('message:add', (payload) => {
            const { recipientId, senderId, text, roomId } = payload;
            if (!text) return;

            const recipient = clients[roomId];

            saveMessage({ recipientId, senderId, text });
            clients[socket.id].activeRoom = roomId;

            socket.json.emit('message:add', { recipientId, senderId, text });

            if (recipient.activeRoom === socket.id) {
                if (recipient.socketId !== socket.id) {
                    io.to(roomId).emit('message:add', {
                        recipientId,
                        senderId,
                        text,
                    });
                }
            }
        });

        socket.on('message:history', async (payload) => {
            try {
                const history = await getHistory(payload);
                socket.emit('message:history', history);
            } catch (err) {
                console.error(err);
            }
        });

        socket.on('disconnect', () => {
            delete clients[socket.id];
            socket.broadcast.emit('users:leave', socket.id);
        });
    });
};

async function saveMessage({ recipientId, senderId, text }) {
    const data = {
        userId: senderId,
        recipientId,
        text,
    };
    try {
        await Message.create(data);
    } catch (err) {
        console.error(err);
    }
}

async function getHistory(payload) {
    const { userId, recipientId } = payload;

    const messages = await Message.findAll({
        where: { 
            [Sequelize.Op.or]: [
                { userId, recipientId },
                { userId: recipientId, recipientId: userId }
            ]
         },
         order: [[ 'id', 'ASC' ]]
    });
    
    const history = messages.map(({ dataValues }) => {
        const { recipientId, userId, text } = dataValues;
        return {
            recipientId,
            senderId: userId,
            text,
        };
    });

    return history;
}
