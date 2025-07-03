import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Game Data
let playersArray = [];
let foodArray = [];
let scoreArray = [];
let clock = 100;

const CSS_COLOR_NAMES = [ /* same color array as before */ ];

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate initial food
for (let i = 0; i < 8; i++) {
  const color = randomChoice(CSS_COLOR_NAMES);
  const x = Math.floor(Math.random() * 800) + 200;
  const y = Math.floor(Math.random() * 400) + 200;
  foodArray.push({
    x, y, newX: x, newY: y,
    rotation: Math.floor(Math.random() * 360),
    w: 15, h: 15, type: "food", color
  });
}

// Handle connections
io.on('connection', socket => {
  socket.userId = Math.floor(Math.random() * 90000) + 10000;
  const color = randomChoice(CSS_COLOR_NAMES);
  const x = Math.floor(Math.random() * 800) + 200;
  const y = Math.floor(Math.random() * 400) + 200;

  const newPlayer = {
    id: socket.userId,
    username: socket.userId.toString(),
    score: 0,
    x, y, newX: x, newY: y,
    rotation: Math.floor(Math.random() * 360),
    w: 30, h: 30, type: "player", color
  };

  playersArray.push(newPlayer);
  scoreArray.push({ id: socket.userId, points: 0 });

  socket.emit('userstats', {
    rank: scoreArray.findIndex(p => p.id === socket.userId) + 1,
    info: scoreArray.find(p => p.id === socket.userId)
  });

  io.emit('server message', `${io.engine.clientsCount} users`);
  updateScoreboard();

  socket.emit('mystats', newPlayer);
  socket.emit('give the new user the full foodArray', foodArray);
  socket.emit('give the new user the full playersArray', playersArray);
  socket.broadcast.emit('add a new player to playersArray', {
    playerObj: newPlayer,
    index: playersArray.findIndex(p => p.id === socket.userId)
  });

  socket.on('setusername', name => {
    if (name?.length > 0 && name.length <= 12) {
      const nameExists = playersArray.some(p => p.username === name);
      if (!nameExists) {
        const player = playersArray.find(p => p.id === socket.userId);
        player.username = name;
        socket.username = name;

        socket.emit('userstats', {
          rank: scoreArray.findIndex(p => p.id === socket.userId) + 1,
          info: scoreArray.find(p => p.id === socket.userId)
        });

        updateScoreboard();
        socket.broadcast.emit('server message', `${name} joined. ${io.engine.clientsCount} users`);
        io.emit('update username', {
          id: socket.userId,
          username: name,
          index: playersArray.findIndex(p => p.id === socket.userId)
        });
      }
    }
  });

  socket.on('move', direction => {
    const player = playersArray.find(p => p.id === socket.userId);
    if (!player) return;

    if (direction === 'right') player.x += 5;

    socket.emit('mystats', player);
    io.emit('move player', {
      index: playersArray.findIndex(p => p.id === socket.userId),
      x: player.x, y: player.y
    });
  });

  socket.on('disconnect', () => {
    const index = playersArray.findIndex(p => p.id === socket.userId);
    if (index !== -1) playersArray.splice(index, 1);
    scoreArray = scoreArray.filter(s => s.id !== socket.userId);

    io.emit('remove player', { id: socket.userId, index });
    io.emit('server message', `${socket.username ?? socket.userId} left. ${io.engine.clientsCount} users`);
    updateScoreboard();
  });
});

// Helpers
function addPoints(userId, amount) {
  const player = playersArray.find(p => p.id === userId);
  const score = scoreArray.find(s => s.id === userId);
  if (player && score) {
    player.score += amount;
    score.points = player.score;
    updateScoreboard();
  }
}

function updateScoreboard() {
  const top5 = [...scoreArray].sort((a, b) => b.points - a.points).slice(0, 5);
  io.emit('scoreboard', top5);
}

function moveRandomFood() {
  const index = Math.floor(Math.random() * foodArray.length);
  const food = foodArray[index];
  food.x += Math.floor(Math.random() * 40) - 20;
  food.y += Math.floor(Math.random() * 40) - 20;

  io.emit('move a piece of food', {
    index,
    newX: food.x,
    newY: food.y
  });
}

// Timers
setInterval(() => {
  if (clock <= 0) clock = 100;
  clock--;
  io.emit('timer tick', clock);
  moveRandomFood();
}, 100);

setTimeout(() => {
  io.emit('server reset', true);
}, 1000);
