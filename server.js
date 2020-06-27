const express = require('express');
const path = require('path');
const http = require('http');
const formatMsg = require('./utils/messages');
const { joinUser, getCurrentuser, userLeave, getRoomUsers } = require('./utils/users')

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server);

const bot = 'ChatBook Bot';

io.on('connection', socket => {
    socket.on('join-room', ({ name, room }) => {
        const user = joinUser(socket.id, name, room);

        socket.join(user.room);

        socket.emit('message', formatMsg(bot, 'Welcome to Messenger.'));

        socket.on('new-user-Join', () => {
            socket.broadcast.to(user.room).emit('message', formatMsg(bot, `${user.name} has joined the chat`));
        });

        io.to(user.room).emit('roomUsers', {  
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    socket.on('chatMsg', (msg) => {
        const user = getCurrentuser(socket.id); 
        socket.broadcast.to(user.room).emit('message', formatMsg(user.name, msg))
    });
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            socket.broadcast.to(user.room).emit('message', formatMsg(bot, `${user.name} has left the chat`))
            
            io.to(user.room).emit('roomUsers', {  
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));