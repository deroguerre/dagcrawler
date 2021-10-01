import * as IPFS from 'ipfs-core'
import { CID } from 'multiformats/cid'
import * as fs from 'fs'


// Change DAG CID here (QmHash)
const stringCID = 'QmfKVJVcisw6WTcx18u1a6oDR1R988ocAukDdZ2YXZAm5q'

// Change searched word here
const searchedWord = 'zombie'

// Stop program after x millisecond (1000 = 1sec), 0 disable timeout
var maxtimeout = 0




var startTime, endTime;
const ipfs = await IPFS.create()
const validCID = CID.parse(stringCID)
const foundData = []
const today = new Date()
var totalObj = 0
var nbFound = 0

// Clear crawled_data before crawling
try {
    fs.unlinkSync('./crawled_data.json')
} catch (error) {
    console.log("no file")
}

startTimer()

//make a ls on dag cid
for await (const file of ipfs.ls(validCID, { 'timeout': maxtimeout })) {
    // console.log(file)
    getDataFromObject(file)
}

endTimer()
console.log("searching DONE " + nbFound + " found on " + totalObj)
process.exit()

async function getDataFromObject(file) {

    totalObj++
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getUTCSeconds()
    console.log(nbFound + "/" + totalObj + " " + time + " searching in " + file.path + " size " + file.size + "... ctrl + c to abort")

    let data = await ipfs.object.data(file.cid)
    let stringData = data.toString()

    if (stringData.match(new RegExp(searchedWord, "i"))) {

        nbFound++
        console.log('\x1b[32m%s\x1b[0m', nbFound + "/" + totalObj + " " + time + " searching in " + file.path + " size " + file.size + " => " + file.cid + " found")

        stringData = removeNonAscii(stringData)

        let objData = JSON.parse(stringData)
        objData.cid = file.cid.toString()
        objData.path = file.path
        // foundData.push(objData)

        // Save file
        fs.appendFileSync('crawled_data.json', JSON.stringify(objData))

    }
}

function removeNonAscii(str) {

    if ((str === null) || (str === ''))
        return false
    else
        str = str.toString()

    return str.replace(/[^\x20-\x7E]/g, '')
}

function startTimer() {
    startTime = new Date()
}

function endTimer() {
    endTime = new Date()
    var timeDiff = endTime - startTime //in ms
    // strip the ms
    timeDiff /= 1000

    // get seconds 
    var seconds = Math.round(timeDiff)
    console.log(seconds + " seconds")
}