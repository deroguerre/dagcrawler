import * as IPFS from 'ipfs-core'
import { CID } from 'multiformats/cid'
import * as fs from 'fs'


// Change DAG CID here (QmHash)
const stringCID = 'QmfKVJVcisw6WTcx18u1a6oDR1R988ocAukDdZ2YXZAm5q'

// Change searched word here
const searchedWord = 'zombie'

// Stop program after x millisecond (1000 = 1sec), 0 disable timeout
var maxtimeout = 0





const ipfs = await IPFS.create()

const validCID = CID.parse(stringCID)

// Clear crawled_data before crawling
try {
    fs.unlinkSync('./crawled_data.json')
} catch (error) {
    console.log("no file")
}

//make a ls on dag cid
for await (const file of ipfs.ls(validCID, { 'timeout': maxtimeout })) {
    // console.log(file)
    getDataFromObject(file);
}

async function getDataFromObject(file) {

    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getUTCSeconds()
    console.log(time + " searching in " + file.path + " size " + file.size + "... ctrl + c to abort")

    let data = await ipfs.object.data(file.cid)
    let stringData = data.toString()
    
    if (stringData.match(new RegExp(searchedWord, "i"))) {

        console.log(file.cid + " found")

        stringData = removeNonAscii(stringData)

        let objData = JSON.parse(stringData);
        objData.cid = file.cid.toString()
        objData.path = file.path

        fs.appendFileSync('crawled_data.json', JSON.stringify(objData))
    }
}

function removeNonAscii(str) {

    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();

    return str.replace(/[^\x20-\x7E]/g, '');
}

console.log("searching DONE !")

// const testCidObject = CID.parse('QmeqNQdjbKjrG9q19L33u2J7su8ksbfmLCmAHB5daXraJH')

// const data = await ipfs.object.data(testCidObject)
// console.log(data.toString())

// async function getAndLog(cid, path) {
//     const result = await ipfs.dag.get(cid, { path })
//     console.log(result.value)
//     return result.value;
// }

// const loggedCid = getAndLog(fromString, '/10')