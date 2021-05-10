//console.log( process.argv )
//const { create } = require("eslint/lib/rules/*")
const fs = require("fs")
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

async function startServer(){
    var http = require('http');
    var port = process.env.PORT || 8000;

    var server = http.createServer({}, async function(req, res) {
        //console.log("Response: ", res)
        //console.log("Request: ", req.url)
        const argv = parseQuery (req.url)
        var respJSON = JSON.stringify("TESTTEST")
        if (argv.length===0){
            var respJSON = "Invalid"
            
        }
        else{
            console.log("Passing: ", argv)
            var respJSON = await main(argv) ;
            
        }
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end( JSON.stringify( respJSON ) );
        //res.end( "TEST" )
    });

    server.listen(port, function() {
    console.log('Listening on port', port);
    });
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
    const arguments = ["read", "create", "update", "destroy"]
    
    // A argument has been passed; handle it.
    const [arg, paraPath, ...paraArgz] = argv
    //const arg = process.argv[2]
    //const paraPath = process.argv[3] // Should be a path\
    //const [paraArgz] = process.argv // Should specify what data set to manipulate
    console.log(`Arguments were: "${paraArgz}"`)
    try{
        switch( arg.toUpperCase() ){
            case "READ": 
                // Requires 1 argument minimum (path to file)
                var ret = await readFile(paraPath, paraArgz[0])
                return ret //console.log(resp)
                break
            case "CREATE": 
                var ret = await createEntry(paraPath, paraArgz)
                break
            case "UPDATE": 
                console.log("You passed Update")
                break
            case "DESTROY": 
                console.log("You passed Destroy")
                break
            default:
                console.log("This should not happen")
                return("Invalid")
        }
    } 
    catch(err){
        return( "Error: ", err )
    }
}

async function createEntry(filePath, argArray){
    // Will check for 3 arguments
    // If arguments are valid, will append to pre-defined database
    if( argArray.length!==3){
        // Invalid arguments were passed
        console.log( `Usage: node pets.js create ${filePath} INDEX AGE KIND NAME` )
    }
    const [age, kind, name] = argArray.slice(0, 3);
    const entry = { age, kind, name } ;
    console.log("Calling readFile...")
    //const old_db = await new Promise( resolve => { resolve( readFile( filePath ) ) } )
    const old_db = await readFile( filePath ) ;
    //const old_db = await testAsync( filePath ) ;
    old_db.push(entry)
    const new_db = JSON.stringify( old_db, null, 1 ) // 3rd para for spacing
    const resp = writeFile(filePath, new_db)
    console.log("Returned val: ", typeof(old_db), old_db)
    console.log("End of function")
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
            }
        });
    }) // Closing for Promise function
}


function readFile(filePath, index){
    // Assumes .json file is passed.
    //var filePath = "./pets.json" 
    console.log("Start of readFile function: ", typeof(filePath))
    return new Promise( (resolve, reject) => {
        setTimeout(()=>{
            index = parseInt(index)
            fs.readFile(filePath, {encoding:"utf8"}, (err, data) => {
                // Put callback function here.
                if (err){ 
                    // Handles issues of accessing file (e.g Does not exist)
                    //throw err;
                    //process.exit(1)
                    console.log("Sorry, I can't find that JSON file.")
                    process.exitCode = 1
                    reject("File not found!")
                }
                try{
                    // If no issues accessing file, read contents and display them.
                    const obj = JSON.parse(data)
                    if( typeof(index)==="number" && index<obj.length){
                        console.log( "Returning partial object" )
                        resolve(obj[index])
                    }
                    else{
                        console.log("Returning full object ", obj)
                        resolve(obj)
                    }
                }
                catch(err){
                    //console.log("An error on line 50 has ocured: \n", err)
                    reject(`Invalid .json file! \nUsage: node read ${filePath} INDEX`)
                }
            })  // Closing for normal readFile callBack
        }, 1000) // Closing for setTimout
    }) // Closing for Promise function
}  // Closing for readFile function


async function testAsync(arg){
    return new Promise( (resolve, reject) => {
        resolve ( readFile(arg) )
    })
    //}, 1500)
}