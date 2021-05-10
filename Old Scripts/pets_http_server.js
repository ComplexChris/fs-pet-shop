//console.log( process.argv )
//const { create } = require("eslint/lib/rules/*")
const fs = require("fs")
const { type } = require("os")
const dbPath = "./pets.json"
start()

module.exports = start

async function start(){
    if (process.argv.length > 2){
        if( process.argv[2]==="server"){
            startServer()
        }
        else{
            response = await main( process.argv.slice(2) )
            console.log(response)
        }
    }
    else{
        // No arguments were passed; crash it.
        const msg = `Usage: node pets.js [read | create | update | destroy]`
        console.log(msg)
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
                console.log("Catch")
                res.setHeader('Content-Type', 'text/plain');
                res.statusCode = 404
                res.end("Bad request")
            }
        }

    });
    server.listen(port, function() {
    console.log('Listening on port', port);
    });
}

async function handleGet(argv, res){
    //var respJSON = JSON.stringify("TESTTEST")
    console.log("Handling GET request...")
    var respJSON = await main(argv) ;
    console.log("Response from program: ", respJSON)
    if( respJSON[0]===404 ){
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Error-Message', respJSON[1]);
        res.statusCode = 404
        respJSON = "Not Found"
        res.end( respJSON );
    } else{
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        respJSON = JSON.stringify( respJSON )
        res.end( respJSON );
    }
    
}

async function handlePost(argv, res){
    // Primary function to handle Post requests.
    console.log("Handling POST request...")
    //var respJSON = await main(argv) ;
    handleGet(argv, res)
}

function parseQuery(request){
    const ind = request.indexOf("/?")
    if( ind>=0 ){
        const argz = request.slice(ind+2, request.length)
        return( argz.split("/") )
    }
    else{
        return []
    }
}

async function main( argv ){
    // Executes during call
    // A argument has been passed; handle it.
    Log("Argv: ", argv)
    const [arg, paraPath, ...paraArgz] = argv    // [command] [file path] (options)
    console.log(`Arguments in main func were: "${paraArgz}" ${typeof(paraArgz)}`)
    try{
        switch( arg.toUpperCase() ){
            case "READ": 
                // Requires 1 argument minimum (path to file)
                var ret = await readFile(paraPath, paraArgz[0])
                return ret //console.log(resp)
                break
            case "CREATE": 
            console.log("Creating:")
                var ret = await modifyEntry(paraPath, paraArgz, "CREATE")
                return ret
                break
            case "UPDATE": 
                console.log("You passed Update")
                var ret = await modifyEntry(paraPath, paraArgz, "UPDATE")
                return ret
                break
            case "DESTROY": 
                console.log("You passed Destroy")
                break
            default:
                console.log("This should not happen")
                throw("Invalid - No argument supplied")
        }
    } 
    catch(err){
        // Default error handler for all functions
        return( [404, err] )
    }
}

async function modifyEntry(filePath, argArray, mode){
    console.log("Arguments: ", argArray )
    // Will check for 3 arguments
    // If arguments are valid, will append to pre-defined database
    const [ age, kind, name] = argArray.slice(0, 3);
    const entry = { age, kind, name } ;
    entry['age'] = parseInt(entry['age'])
    console.log("Entry: ", entry)
    if( argArray.length!==3 || typeof(entry['age']) !== "number" ){
        // Invalid arguments were passed
        console.log( `Usage: node pets.js create ${filePath} AGE KIND NAME` )
        throw("Invalid arguments")
    }
    
    console.log("Calling readFile...")
    const old_db = await readFile( filePath ) ;
    console.log("Type is: ",  old_db )
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
            console.log("DDDEEFFAAUULLTT")
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
                console.log("Saved")
                resolve("Saved")
            }
        });
    }) // Closing for Promise function
}

function readFile(filePath, index){
    // Assumes .json file is passed.
    //var filePath = "./pets.json" 
    console.log("Start of readFile function: ", typeof(filePath))
    return new Promise( (resolve, reject) => {
        index = parseInt(index)
        try{
            // If no issues accessing file, read contents and display them.
            fs.readFile(filePath, {encoding:"utf8"}, (err, data) => {
                // Put callback function here.
                const obj = JSON.parse(data)
                if(err){ throw(err) }
                if( typeof(index)==="number" && index<obj.length){
                    console.log( "Returning partial object" )
                    resolve(obj[index])
                }
                else{
                    //console.log("Returning full object ", obj)
                    console.log("Out of index")
                    resolve(obj)
                }
            })  // Closing for normal readFile callBack
        }
        catch(err){
            console.log("An error on line 50 has ocured: \n", err)
            reject(`Invalid .json file! \nUsage: node read ${filePath} INDEX`)
        }
    }) // Closing for Promise function
}  // Closing for readFile function


function Log(){
    Log.caller
    const message = ("Object vals: ", Object.values(arguments).join(" ")  )
    const caller = ("From: ", arguments.callee.caller.name)
    const origin = (caller==="") ? "Unknown Caller" : caller
    console.log(`[${origin}]: ${message}`)
}