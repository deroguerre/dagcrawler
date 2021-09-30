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
    getDataFromObject(file.cid, file.path);
}

async function getDataFromObject(cid, path) {

    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getUTCSeconds()
    console.log(time + " searching in " + path + "... ctrl + c to abort")

    let data = await ipfs.object.data(cid)
    let stringData = data.toString()

    stringData = remove_non_ascii(stringData)

    if (stringData.match(new RegExp(searchedWord, "i"))) {
        console.log(cid + " found")
        let objData = JSON.parse(stringData);
        objData.cid = cid.toString()
        objData.path = path
        fs.appendFileSync('crawled_data.json', JSON.stringify(objData))
    }
}

function remove_non_ascii(str) {

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