const httpClient = require('axios');


const apiKey = process.env["API_KEY"];

function affBaseUrl(program, dataSet, tableId, geoId){return `https://factfinder.census.gov/service/data/v1/en/programs/${program}/datasets/${dataSet}/tables/${tableId}/data/${geoId}`}

exports.getHeadersInTable = async function (program, dataSet, tableId, geoId){
    let url = affBaseUrl (program, dataSet, tableId, geoId);
    let response =  await executeQuery(url);
    return response;
};

function executeQuery(requestUrl) {

    return new Promise((resolve, reject) => {
        console.log("AFF API Query");
        console.log("Request Url: " + requestUrl);
        httpClient.get(requestUrl, { params: {key:apiKey}})
            .then(function (response) {
                console.log("Received positive result from http call");
                resolve(response)
            }).catch(function (response) {
            console.log("Received non positive result from http call");
            console.log(response);
            reject(response)
        })

    });
}
