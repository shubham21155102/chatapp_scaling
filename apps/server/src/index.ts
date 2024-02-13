import express from "express";
import http from "http";
import cors from "cors";
import SocketService from "./services/socket";
import { startMessageConsumers } from "./services/kafka";
import prismaClient from "./services/prisma";
import { UserService } from "./services/user";
const app = express();
const server = http.createServer(app);
const socketService = new SocketService();
app.use(cors());
app.use(express.json());
const userService = new UserService();
app.post("/login", async (req, res) => {
    // npx prisma migrate dev
    const {user_name, password} = req.body;
    const user=await userService.logInUser(user_name, password);
    res.send(user);
});

app.post("/register", async (req, res) => {
    const {user_name, email, password} = req.body;
    const user=await userService.registerUser(user_name, email, password);
    res.send(user);
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    startMessageConsumers("4970bb19-82ea-4411-afe4-f7d0dc729f9c");
    socketService.io.attach(server);
    socketService.initListeners();
    
});