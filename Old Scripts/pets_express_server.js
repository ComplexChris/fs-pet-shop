//Log( process.argv )
//const { create } = require("eslint/lib/rules/*")
const fs = require("fs")
const express = require("express")

const dbPath = "./pets.json"

start()

module.exports = start

async function start(){
    if (process.argv.length > 2){
        if( process.argv[2]==="server"){
            //startServer()
            startExpress()
        }
        else{
            response = await main( process.argv.slice(2) )
            Log(response)
        }
    }
    else{
        // No arguments were passed; crash it.
        const msg = `Usage: node pets.js [read | create | update | destroy]`
        Log(msg)
        process.exitCode = 1
    }
}

function startServer(){
    var http = require('http');
    var port = process.env.PORT || 8000;

    var server = http.createServer({}, (req, res) => {

        const argv = parseQuery (req.url)
        if (argv.length===0){
            res.statusCode = 404
            res.end("No arguments passed.")
        }
        else{
            try{
                switch( req.method ){
                    case "GET": handleGet(argv, res)
                    case "POST": handlePost(argv, res)
                }
            } catch{
                Log("Catch")
                res.setHeader('Content-Type', 'text/plain');
                res.statusCode = 404
                res.end("Bad request")
            }
        }

    });
    server.listen(port, function() {
    Log('Listening on port', port);
    Log("ASSSSS", "ASS", "TEST")
    });
}

function startExpress(){
    // Primary function to handle Express server instance
    Log("Starting server...")
    const server = express()
    const port = 3500

    server.listen(port, () => {
        Log(`Server running/listening on http://localhost:${port}`)
    })

    server.get("/", (req,res,next) => {
        const greet = "You're in the right place, but you'll need to be more specific on where you want to go. \nPlease specify in the URL along with any arguments"
        res.send(greet)
    })

    server.get("/pets", (req,res,next) => {
        const content = ""
        res.send(content)
    })


    server.use((req, res, next) => {
        res.status(404).json("ERROR")
    })

    server.use((err, req, res, next) => {
        res.status(500).json({ error: { message: 'Something went wrong!' }})
    })
    
}

async function main( argv ){
    // Executes during call
    // A argument has been passed; handle it.
    Log("Argv: ", argv)
    const [arg, paraPath, ...paraArgz] = argv    // [command] [file path] (options)
    Log(`Arguments in main func were: "${paraArgz}" ${typeof(paraArgz)}`)
    try{
        switch( arg.toUpperCase() ){
            case "READ": 
                // Requires 1 argument minimum (path to file)
                var ret = await readFile(paraPath, paraArgz[0])
                return ret //Log(resp)
                break
            case "CREATE": 
            Log("Creating:")
                var ret = await modifyEntry(paraPath, paraArgz, "CREATE")
                return ret
                break
            case "UPDATE": 
                Log("You passed Update")
                var ret = await modifyEntry(paraPath, paraArgz, "UPDATE")
                return ret
                break
            case "DESTROY": 
                Log("You passed Destroy")
                break
            default:
                Log("This should not happen")
                throw("Invalid - No argument supplied")
        }
    } 
    catch(err){
        // Default error handler for all functions
        return( [404, err] )
    }
}

async function modifyEntry(filePath, argArray, mode){
    Log("Arguments: ", argArray )
    // Will check for 3 arguments
    // If arguments are valid, will append to pre-defined database
    const [ age, kind, name] = argArray.slice(0, 3);
    const entry = { age, kind, name } ;
    entry['age'] = parseInt(entry['age'])
    Log("Entry: ", entry)
    if( argArray.length!==3 || typeof(entry['age']) !== "number" ){
        // Invalid arguments were passed
        Log( `Usage: node pets.js create ${filePath} AGE KIND NAME` )
        throw("Invalid arguments")
    }
    
    Log("Calling readFile...")
    const old_db = await readFile( filePath ) ;
    Log("Type is: ",  old_db )
    let new_db = {}
    switch(mode){
        case "CREATE": 
            old_db.push(entry)
            new_db = old_db.slice()
            break
        case "UPDATE":
            const temp = old_db.slice()    // Used soley to get index position
            temp.forEach( (elem, ind) => {
                if( entry.name === elem.name){
                    old_db.splice(ind, 1, entry)
                    new_db = old_db.slice()
                }
            } )
            
            break
        default:
            Log("DDDEEFFAAUULLTT")
    }
    if(new_db.length.length===0){
        throw("Error - No changes could be made")
    }
    else{
    const resp = await writeFile(filePath, JSON.stringify( new_db , null, 1  ) )// 3rd para for spacing )
    return( entry )
    }
}

function writeFile(filePath, data, index){
    return new Promise(  (resolve, reject) => {
        if(data.length === 0 ){
            process.exitCode = 1
            return
        }
        fs.writeFile(filePath, data, (err) => {
            if(err){ 
                reject ( err );
            }
            else{
                Log("Saved")
                resolve("Saved")
            }
        });
    }) // Closing for Promise function
}

function readFile(filePath, index){
    // Assumes .json file is passed.
    //var filePath = "./pets.json" 
    Log("Start of readFile function: ", typeof(filePath))
    return new Promise( (resolve, reject) => {
        index = parseInt(index)
        try{
            // If no issues accessing file, read contents and display them.
            fs.readFile(filePath, {encoding:"utf8"}, (err, data) => {
                // Put callback function here.
                const obj = JSON.parse(data)
                if(err){ throw(err) }
                if( typeof(index)==="number" && index<obj.length){
                    Log( "Returning partial object" )
                    resolve(obj[index])
                }
                else{
                    //Log("Returning full object ", obj)
                    Log("Out of index")
                    resolve(obj)
                }
            })  // Closing for normal readFile callBack
        }
        catch(err){
            Log("An error on line 50 has ocured: \n", err)
            reject(`Invalid .json file! \nUsage: node read ${filePath} INDEX`)
        }
    }) // Closing for Promise function
}  // Closing for readFile function

function appendFile(path, content){
    fs.appendFile(path, content, () => {} )
}
function getTime(){
    let curr = new Date()
    //const old = curr.split(" ").slice(1,5).join(" ")
    return( curr.toString()  )
}
function Log(){
    const message = JSON.stringify( Object.values(arguments), null, 0 )
    const caller = ("From: ", arguments.callee.caller.name)
    const origin = (caller==="") ? "Unknown Caller" : caller
    const currentTime = getTime().split(" ").slice(1,5).join(" ")
    product = `[${currentTime} @${origin}]: ${message}`
    console.log( product )
    appendFile("Log.txt", product+"\n")
}