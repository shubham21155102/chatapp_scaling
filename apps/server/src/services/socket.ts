import { Server } from "socket.io";
import { Redis } from "ioredis";
import prismaClient from "./prisma";
import { pub,sub } from "../configruation/redisConnect";
import dotenv from "dotenv";
dotenv.config();
import { produceMessage } from "./kafka";
const REDIS_HOST=process.env.REDIS_HOST;
const REDIS_PORT=process.env.REDIS_PORT;
const REDIS_USERNAME=process.env.REDIS_USERNAME;
const REDIS_PASSWORD=process.env.REDIS_PASSWORD;
console.log(REDIS_HOST,REDIS_PORT,REDIS_USERNAME,REDIS_PASSWORD)
// const pub = new Redis({
//     host: REDIS_HOST,
//     port: 22649,
//     username: REDIS_USERNAME,
//     password: REDIS_PASSWORD
// });
class SocketService {
    private _io: Server;
    constructor() {
        console.log("Init Socket Service....");
        this._io = new Server({
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                allowedHeaders: "*"
            }
        });
        sub.subscribe("MESSAGES");
    }

    public initListeners() {
        const io = this.io;
        console.log("Init Listeners....")
        io.on("connect", (socket) => {

            console.log("New client connected with socket id: ", socket.id);
            socket.on("event:message", async ({ message }: { message: string }) => {
                console.log("Message received: ", message);
                // socket.emit("event:message", { message: "Message received" });
                await pub.publish("MESSAGES", JSON.stringify({ message }));

            });
        });
        sub.on("message",async (channel, message) => {
            if (channel !== "MESSAGES") return;
            console.log("Message received from redis: ", message);
            io.emit("message", JSON.parse(message));
            await produceMessage(message);
            console.log("Message sent to kafka: ", message)
            // save to postgresql
        //    await prismaClient.messages.create({
        //         data:{
        //             message:JSON.parse(message).message
        //         }
        //    })

        }
        );
    }

    get io(): Server {
        return this._io;
    }
}
export default SocketService;
