import { Kafka, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import prismaClient from "./prisma";
import kafka from "../configruation/kafkaConnect";
// const kafka = new Kafka({
//     brokers: [host name],
//     ssl: {
//         ca: fs.readFileSync(path.resolve("./ca.pem"), 'utf-8'),
//     },
//     sasl: {
//         username: "",
//         password: "",
//         mechanism: "plain"
//     }
// })

let producer: null | Producer = null;
export async function createProducer() {
    if (producer) {
        return producer;
    }
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}

export async function produceMessage(message: string) {
    const producer = await createProducer();
    await producer.send({
        topic: "MESSAGES",
        messages: [
            {
                key: `message_${Date.now()}`,
                value: message
            }
        ]
    })

}
export async function startMessageConsumers(user_id:any) {
    const consumer = kafka.consumer({ groupId: "default" });
    await consumer.connect();
    await consumer.subscribe({ topic: "MESSAGES" });
    await consumer.run({
        autoCommit: true,
        eachMessage: async ({ message, pause }) => {
            console.log("Message received from kafka: ");

            if (message.value !== null && message.value !== undefined) {
                try {
                    const findMessage=await prismaClient.messages.findFirst({
                        where:{
                            userId:user_id,
                        }
                    });
                    if(findMessage){
                        let messages=findMessage.message;
                        messages=messages+message.value.toString();
                    }
                    await prismaClient.messages.create({
                        data: {
                            message: message.value.toString(),
                            userId:user_id,
                        },
                    });
                } catch (e) {
                    console.log(e);
                    pause();
                    setTimeout(() => {
                        console.log("Resuming");
                        consumer.resume([{ topic: "MESSAGES" }])
                        pause();
                    }
                        , 10000);
                }
            }
        },
    });
}

export default kafka;