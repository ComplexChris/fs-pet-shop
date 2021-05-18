//Log( process.argv )
//const { create } = require("eslint/lib/rules/*")
const fs = require("fs")
const { type } = require("os")

module.exports = {
    verifyInput,
    readFile,
    update,
    Log
}

function verifyInput(primary, against){
    against = against || {"age":null, "kind":null, "name":null}
    const results = {...against, ...primary}
    Log(results)
    return (primary.length === results.length && !(null in Object.values(results) ) );
}


async function modifyEntry(filePath, argArray, mode, callBack){
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
        callBack.send(entry);
        return( entry );
    }
    
}

function update(filePath, entry, callBack){
    // Read old file
    // Write old plus new to DB
    // Send response
    //const [ age, kind, name] = argArray
    //const entry = { age, kind, name }
    readFile( filePath, null, (data)=> {
        data.push(entry);
        const newDB = JSON.stringify( data, null, " ");
        writeFile(filePath, newDB, callBack);
    } ) 
}

function writeFile(filePath, data, callBack){
    if(data.length === 0 ){
        process.exitCode = 1
        callBack("ERROR")
    }
    fs.writeFile(filePath, data, (err) => {
        if(err){ 
            callBack ( err );
        } 
        else{
            Log("Saved")
            callBack("Saved")
        }
    });
}

function readFileOld(filePath, index){
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

function readFile(filePath, index, callBack){
    // Assumes .json file is passed.
    filePath = filePath || "./pets.json" ;
    Log("Start of readFile function: ", filePath, index);
    try{
        // If no issues accessing file, read contents and display them.
        fs.readFile(filePath, {encoding:"utf8"}, (err, data) =>{
            // Put callback function here.
            let obj = JSON.parse(data);
            if(err){ 
                Log(err);
                return }
            index = parseInt( index );
            if( typeof(index)==="number" && index<obj.length){
                Log( "Returning partial object" );
                obj = obj[index];
            }
            callBack(obj);
        })  // Closing for normal readFile callBack
    }
    catch(err){
        Log("An error on line 50 has ocured: \n", err, "\x1b[31m");
        callBack(`Invalid to read database`);
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
    //let color = "\x1b[0m"
    const caller = arguments.callee.caller.name
    let color = (caller==="") ? "\x1b[33m" : "\x1b[37m";
    const origin = (caller==="") ? "Unknown Caller" : caller
    if( String(last).startsWith("\x1b") ){
        // Used to define a specific color if one is passed
        color = passedContent.pop()
    }
    let message = ""; 
    passedContent.map( (item) => {message += typeof(item)=="string" ? item : JSON.stringify(item) } )
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