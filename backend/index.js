const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const { generateRandomCards } = require("./utils");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server);

// In-memory cache
const cache = new Map();
const DEFAULT_EXPIRATION = 3600; // 1 hour in seconds

// Caching function
function getOrSetCache(key, cb) {
  return new Promise(async (resolve, reject) => {
    const now = Date.now();
    
    if (cache.has(key)) {
      const { data, expiration } = cache.get(key);
      if (now < expiration) {
        return resolve(data);
      }
      cache.delete(key);
    }

    try {
      const freshData = await cb();
      cache.set(key, {
        data: freshData,
        expiration: now + DEFAULT_EXPIRATION * 1000
      });
      resolve(freshData);
    } catch (error) {
      reject(error);
    }
  });
}

// Leaderboard functions
const getLatestLeaderboard = async () => {
  return getOrSetCache("leaderboard", () => {
    // Simulating leaderboard data
    return [
      { userName: "user1", userScore: 100 },
      { userName: "user2", userScore: 90 },
      { userName: "user3", userScore: 80 },
    ];
  });
};

const updateLeaderboard = async (userName, score) => {
  const leaderboard = await getLatestLeaderboard();
  const userIndex = leaderboard.findIndex(user => user.userName === userName);
  
  if (userIndex !== -1) {
    leaderboard[userIndex].userScore = score;
  } else {
    leaderboard.push({ userName, userScore: score });
  }
  
  leaderboard.sort((a, b) => b.userScore - a.userScore);
  
  cache.set("leaderboard", {
    data: leaderboard,
    expiration: Date.now() + DEFAULT_EXPIRATION * 1000
  });
  
  return leaderboard;
};

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("WebSocket connected");

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });
});

// Game routes
app.get("/game", async (req, res) => {
  try {
    const { userName } = req.query;

    const game = await getOrSetCache(`game:${userName}`, async () => {
      const randomCards = generateRandomCards();
      return {
        score: 0,
        gameCards: randomCards,
        hasDefuseCard: false,
        activeCard: null
      };
    });

    const leaderboardLatest = await getLatestLeaderboard();
    io.emit("leaderboardUpdate", leaderboardLatest);

    res.status(200).json(game);
  } catch (e) {
    console.error("Failed to fetch data", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/game", async (req, res) => {
  try {
    const { userName, hasDefuseCard, activeCard, score = 0, gameCards } = req.body;

    const updatedGame = {
      gameCards: gameCards || generateRandomCards(),
      hasDefuseCard,
      activeCard,
      score
    };

    cache.set(`game:${userName}`, {
      data: updatedGame,
      expiration: Date.now() + DEFAULT_EXPIRATION * 1000
    });

    const leaderboardLatest = await updateLeaderboard(userName, score);
    io.emit("leaderboardUpdate", leaderboardLatest);

    res.status(200).json(updatedGame);
  } catch (e) {
    console.error("Failed to update game", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/game", async (req, res) => {
  try {
    const { userName } = req.body;
    
    cache.delete(`game:${userName}`);

    const leaderboardLatest = await getLatestLeaderboard();
    io.emit("leaderboardUpdate", leaderboardLatest);

    res.status(200).json({ message: "Game reset successful" });
  } catch (e) {
    console.error("Failed to reset game", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

server.listen(3000, () => {
  console.log("App is running on port 3000");
});