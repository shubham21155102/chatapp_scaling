import prismaClient from "./prisma";

export class UserService{
    constructor(){}
    async registerUser(user_name:string, email:string, password:string){
       const existingUser = await prismaClient.users.findFirst({
            where:{
                user_name:user_name
            }
        })
        if(existingUser){
            return {
                status:400,
                message:"User already exists"
            }
        }
        const existingEmail = await prismaClient.users.findFirst({
            where:{
                email:email
            }
        })
        if(existingEmail){
            return {
                status:400,
                message:"Email already exists"
            }
        }
        const user = await prismaClient.users.create({
            data:{
                user_name:user_name,
                email:email,
                password:password
            }
        })
        return {
            status:200,
            message:"Registration successful",
            data:user
        }
    }
    async logInUser(user_name:string, password:string){
        
        const user = await prismaClient.users.findFirst({
            where:{
                user_name:user_name,
                password:password
            }
        })
        if(user){
            return {
                status:200,
                message:"Login successful",
                data:user
            }
        }
        else{
            return {
                status:400,
                message:"Login failed"
            }
        }
    }
}