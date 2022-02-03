const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const locations = require('./locations_sv.js');
const roles = require('./roles_sv.js');
const room = require('./rooms_sv.js');

// Initialise the rooms
const rooms = new Map();

// Set directory for public static files
app.use(express.static(path.join(__dirname, '../public')));

app.all('/', (req, res) => {
    res.sendFile(path.join(__dirnname, '../public/index.html'));
})

app.all('/rules', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/rules.html'));
})

app.all('/:roomCode', (req, res) => {
    const roomCode = req.params.roomCode;
    if (rooms.has(roomCode)) {
        // Check if game is full then
        // Join game...
    } else {
        // Invalid code
    }
    res.sendFile(path.join(__dirname, '../public/room.html'));
})

io.on("connection", socket => {
    const player = {
        room: null,
        username: null,
    }

    // Start Game button clicked
    socket.on('requestStartGame', () => {
        let newRoomCode = null;
        do {
            newRoomCode = Math.floor(Math.random() * 100000).toString();
            while (newRoomCode.length < 5) {
                newRoomCode = "0" + newRoomCode;
            }
        } while (rooms.has(newRoomCode));
        rooms.set(newRoomCode, new room.Room());
        socket.emit('acceptStartGameRequest', newRoomCode);
    })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`SpyFall.Live server now running on ${server.address().address}:${port}`);
})