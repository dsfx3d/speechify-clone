import { createTranscriptionServer } from './createTranscriptionServer';
import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { env } from './env';
import { createDeepgramServer } from './createDeepgramServer';
import { RequestMap } from './RequestMap';
import { EventMap } from './EventMap';

const app = express();
const server = new http.Server(app);
const io = new Server<RequestMap, EventMap>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

createDeepgramServer(io, env.DEEPGRAM_API_KEY);

app.use(cors({ credentials: false, origin: "*" }));
app.use(express.json());

const staticPath = path.resolve("public/");
app.use(express.static(staticPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(staticPath, "index.html"));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
