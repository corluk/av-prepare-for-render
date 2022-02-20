import Fastify from "fastify"
import Server from "./src/server"
import dotenv from "dotenv"
(async ()=>{

    dotenv.config()
    console.log(process.env.AE_RAW_ASSETS_PATH)
    console.log(process.env.AE_PROJECT_ASSETS_PATH)
    const fastify  = Fastify({logger:true }) 
   
    await  Server(fastify)
    await fastify.listen(18080)
    console.log("stating")
})()