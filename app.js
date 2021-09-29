import * as IPFS from 'ipfs-core'
import { CID } from 'multiformats/cid'
import * as fs from 'fs'

const ipfs = await IPFS.create()

const fromString = 'QmfKVJVcisw6WTcx18u1a6oDR1R988ocAukDdZ2YXZAm5q'
const validCID = CID.parse(fromString)

var finalData = {};
var abortController = new AbortController();
var signal = abortController.signal


var totalIteration = 0;

//make a ls on dag cid
for await (const file of ipfs.ls(validCID, { 'timeout': 300 })) {
    console.log(file.cid)
    getDataFromObject(file.cid);
}

async function getDataFromObject(cid) {
    const data = await ipfs.object.data(cid)

    var stringData = data.toString()
    stringData = remove_non_ascii(stringData)
    // console.log(stringData)
    const obj = JSON.parse(stringData);

    // console.log(obj.attributes)

    // obj.attributes.forEach(attribute => {
    //     console.log(attribute.trait_type);
    //     console.log(attribute.value);
    // });

    fs.appendFileSync('message.json', JSON.stringify(obj))
}

function remove_non_ascii(str) {

    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();

    return str.replace(/[^\x20-\x7E]/g, '');
}


// const testCidObject = CID.parse('QmeqNQdjbKjrG9q19L33u2J7su8ksbfmLCmAHB5daXraJH')

// const data = await ipfs.object.data(testCidObject)
// console.log(data.toString())

// async function getAndLog(cid, path) {
//     const result = await ipfs.dag.get(cid, { path })
//     console.log(result.value)
//     return result.value;
// }

// const loggedCid = getAndLog(fromString, '/10')