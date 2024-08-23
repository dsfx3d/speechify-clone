import "dotenv/config";
import {EventMap} from "./EventMap";
import {RequestMap} from "./RequestMap";
import {Server} from "socket.io";
import {createDeepgramServer} from "./createDeepgramServer";
import {env} from "./env";
import cors from "cors";
import express from "express";
import http from "node:http";
import path from "node:path";

const app = express();
const server = new http.Server(app);
const io = new Server<RequestMap, EventMap>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

createDeepgramServer(io, env.DEEPGRAM_API_KEY);

app.use(cors({credentials: false, origin: "*"}));
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
