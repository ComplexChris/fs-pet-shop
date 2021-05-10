//console.log( process.argv )
//const { create } = require("eslint/lib/rules/*")
const fs = require("fs")
const { resolve } = require("path")
const dbPath = "./pets.json"

if (process.argv.length > 2){
    main()
}
else{
    // No arguments were passed; crash it.
    const msg = `Usage: node pets.js [read | create | update | destroy]`
    console.log(msg)
    process.exitCode = 1
}

function main( ){
    // Executes during call
    const arguments = ["read", "create", "update", "destroy"]
    
    // A argument has been passed; handle it.
    const [arg, paraPath, ...paraArgz] = process.argv.slice(2, process.argv.length)
    //const arg = process.argv[2]
    //const paraPath = process.argv[3] // Should be a path\
    //const [paraArgz] = process.argv // Should specify what data set to manipulate
    console.log(`Arguments were: "${paraArgz}"`)
    try{
        switch( arg.toUpperCase() ){
            case "READ": 
                // Requires 1 argument minimum (path to file)
                const resp = readFile(paraPath, paraArgz[0])
                console.log(resp)
                break
            case "CREATE": 
                createEntry(paraPath, paraArgz)
                break
            case "UPDATE": 
                console.log("You passed Update")
                break
            case "DESTROY": 
                console.log("You passed Destroy")
                break
            default:
                console.log("This should not happen")
        }
    } catch(err){
        console.log( "Error: ", err )
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
    if(data.length === 0 ){
        process.exitCode = 1
        return
    }
    fs.writeFile(filePath, data, (err) => {
        if(err){ 
            console.log ( "Could not save file." );
        }
        else{
            console.log("Saved")
        }
    });
}

function readFile(filePath, index){
    // Assumes .json file is passed.
    //var filePath = "./pets.json" 
    console.log("Start of readFile function: ", typeof(filePath))
    index = parseInt(index)
    fs.readFile(filePath, {encoding:"utf8"}, (err, data) => {
        // Put callback function here.
        if (err){ 
            // Handles issues of accessing file (e.g Does not exist)
            console.log("Sorry, I can't find that JSON file.")
            process.exitCode = 1
            return("File not found!")
        }
        try{
            // If no issues accessing file, read contents and display them.
            const obj = JSON.parse(data)
            if( typeof(index)==="number" && index<obj.length){
                console.log( "Returning partial object" )
                return(obj[index])
            }
            else{
                console.log("Returning full object ", obj)
                return(obj)
            }
        }
        catch(err){
            //console.log("An error on line 50 has ocured: \n", err)
            return(`Invalid .json file! \nUsage: node read ${filePath} INDEX`)
        }
    })  // Closing for normal readFile callBack
}  // Closing for readFile function


