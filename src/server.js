 
import {GetFiles,Sharp, PrepareTargetDir} from "./index" 
import {join} from "path" 
import { lstatSync } from "fs"

export default async (fastify) =>{


    fastify.post("/api/import/assets", async (req,res)=>{
         
        if(!req.body.sourcePath){
            res.statusCode = 501
            res.send({error:"no path defined"})
        }
        if(!req.body.templateName){
            res.statusCode = 501
            res.send({error:"no project  name "})
        }
        if(!req.body.taskName){
            res.statusCode = 501 
            res.send({error:"no task name defined"})
        }
        
       
        const inputPath= join(process.env.AE_RAW_ASSETS_PATH,req.body.sourcePath) 
        
      
        
        
         
        if(! lstatSync(inputPath).isDirectory()) {
            res.statusCode = 501 
            res.send({error: "directory not exists "  + inputPath})
        }
        
        const outFolder  = await PrepareTargetDir(process.env.AE_PROJECT_ASSETS_PATH,req.body.templateName,req.body.taskName)
        const files = await GetFiles(inputPath) 
        
        const savedFiles = []
        for(let index in files){
            let file = files[index]
            let source = await Sharp.Resize(file,1920,1080) 
        
            source = await Sharp.ToJpeg(source) 
            const savePath = join(outFolder,req.body.taskName + "_" + index + ".jpg")
            
            await source.toFile(savePath)
            savedFiles.push(savePath)
        }

        
        res.send(savedFiles)
       


    })
}