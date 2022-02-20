#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const Path = require("path")
const dotenv = require("dotenv")
const fs = require("")
const Lib = require("../lib/index.js")
dotenv.config()
if(!argv.inputPath){
    throw new Error("workdir not specified")
}
if(!argv.outputPath){
    
}
const fullPath= Path.join(process.env.AE_RAW_ASSETS_DIR,argv.inputPath) 

if(!fs.lstatSync(fullPath).isDirectory() ){
    throw new Error("folder not exists ")
}

const imagesExts = [".jpg",".jpeg",".webm"]
let  files= fs.readdirSync(fullPath)
files= files.filter(file => imagesExts.indexOf(Path.extname(file)) > -1) 


