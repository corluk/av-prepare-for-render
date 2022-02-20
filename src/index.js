import {join , extname , basename} from "path"
import { homedir , tmpdir } from "os";
import {promises} from "fs"
import sharp from "sharp";
import { ZeroPad } from "./utils";
export  const GetVideoSize = (video)=>{

    
    const videoStream = video.streams.find(stream => stream.codec_type == "video") 
    if(!videoStream){
        throw new Error("no video stream")

    }
    return { width: videoStream.coded_width,height :videoStream.coded_height}
 }

 export const GetFiles = async (path,filter = [".mp4",".jpg","jpeg","webp"])=>{
    return new Promise(async (res,rej)=>{
        filter = filter.map( ext => {
            if( !ext.startsWith(".")){
                return "." + ext 
            }
            return ext 
        
        })
        let  files= await promises.readdir(path) 
        files = files.filter(file => {
            const ext = extname(file)
             
            return ( filter.indexOf(ext) > -1) 
        }) 
        if(files.length < 1){
            rej(new Error("no file exists"))
        }
        res(files.map(file=> join(path,file)))


    })
   
}

export const Sharp = {


    Resize : async  (source,  width , height , opts = {})=>{
        if(typeof source == "string"){
            source = sharp(source)
        }
    
        opts = {...{
            fit : "cover" , 
            position : "center"
            },...{opts}}
        
            const buffer = await source.resize(width,height,opts).toBuffer()
            return sharp(buffer)

        
        

     
    
    

} , 

 

 ToJpeg : async (source, opts = {} )=>{

    opts = { ...{
        quality : 70 
    }, ...opts} 

    const buffer = await source.jpeg(opts).toBuffer()
    return sharp(buffer)
} 

 
}
 
export const isImage = (extname)=>{

    const supportedImageExts = [".jpg",".jpeg",".webp"]
    return supportedImageExts.indexOf(extname) > -1 
}

export const GetDirectories =async  (path)=>{
    console.log("path", path)
    const dirs = await promises.readdir(path, { withFileTypes: true })
    console.log(typeof dirs)
   
  
    return dirs.filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name) 
}

export const PrepareTargetDir = async (path,projectName,taskName )=>{
    console.log("path" , path) 
    console.log("projectName" , projectName) 
    console.log("taskName " , taskName)
    const namePattern = projectName + "-" + taskName
    let  dirs = await GetDirectories(path) 
    dirs = dirs.filter(dir => dir.startsWith(namePattern)) 
    const name =  namePattern + "-" + ZeroPad(parseInt(dirs.length+1),2)
    const targetDir = join(path,name)
    await promises.mkdir(targetDir)
    return targetDir

    
} 