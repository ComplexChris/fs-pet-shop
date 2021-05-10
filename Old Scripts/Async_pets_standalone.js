//Log( process.argv )
//const { create } = require("eslint/lib/rules/*")
const fs = require("fs")
const { type } = require("os")

module.exports = {
    start,
    main,
    Log
}



async function start(){
    if (process.argv.length > 2){
        if( process.argv[2]==="server"){
            //startServer()
            const server = require("./Main_express_server_standalone")
            server.startExpress(4000)
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

async function main( argv, res, callBack ){
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
                callBack (res, ret)
                return ret //Log(resp)
            case "CREATE": 
            Log("Creating:")
                var ret = await modifyEntry(paraPath, paraArgz, "CREATE")
                return ret
            case "UPDATE": 
                Log("You passed Update")
                var ret = await modifyEntry(paraPath, paraArgz, "UPDATE")
                return ret
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
            fs.readFile(filePath, {encoding:"utf8"}, (err, data) =>{
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

function readFileNew(filePath, index){
    // Assumes .json file is passed.
    //var filePath = "./pets.json" 
    Log("Start of readFile function: ", typeof(filePath))
    index = parseInt(index)
    try{
        // If no issues accessing file, read contents and display them.
        fs.readFile(filePath, {encoding:"utf8"}, (err, data) =>{
            // Put callback function here.
            const obj = JSON.parse(data)
            if(err){ throw(err) }
            if( typeof(index)==="number" && index<obj.length){
                Log( "Returning partial object" )
                return(obj[index])
            }
            else{
                //Log("Returning full object ", obj)
                Log("Out of index")
                return(obj)
            }
        })  // Closing for normal readFile callBack
    }
    catch(err){
        Log("An error on line 50 has ocured: \n", err, "\x1b[31m")
        return(`Invalid .json file! \nUsage: node read ${filePath} INDEX`)
    }
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
    //const message = JSON.stringify( Object.values(arguments), null, 0 )
    const passedContent = Object.values(arguments)
    const last = passedContent[passedContent.length -1]
    let color = "\x1b[0m"
    if( String(last).startsWith("\x1b") ){
        // Used to define a specific color if one is passed
        color = passedContent.pop()
    }
    let message = ""; 
    passedContent.map( (item) => {message += typeof(item)=="string" ? item : JSON.stringify(item) } )
    const caller = arguments.callee.caller.name
    const origin = (caller==="") ? "Unknown Caller" : caller
    const currentTime = getTime().split(" ").slice(1,5).join(" ")
    product = `|-[${currentTime} @${origin}]:   \t ${message} `
    console.log( color, product)
    //console.log("\x1b[0m")
    appendFile("Log.txt", product+"\n")
}


/*
(function() {
    // Auto run; IIFE
    start()
} )();
*/