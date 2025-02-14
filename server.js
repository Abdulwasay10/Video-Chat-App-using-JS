const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Serve the landing page
app.get('/', (req, res) => {
  res.render('index');
});

// Generate a new room ID and return it as JSON
app.get('/create-room', (req, res) => {
  const roomId = uuidV4();
  res.json({ roomId });
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    });
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
