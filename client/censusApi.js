const httpClient = require('axios');


function dataBaseUrl(year,dataset, variableString, stateId) {
    return `https://api.census.gov/data/${year}/${dataset}?get=${variableString}&for=county:*&in=state:${stateId}`
}

function variablesBaseUrl(year, dataset) {
    return `https://api.census.gov/data/${year}/${dataset}/variables.json`
}

const apiKey = process.env["API_KEY"];

exports.getData = async function (year, dataset, variableStringArray, stateId) {

    let objectArray = variableStringArray.variableString;
    let variableString = '';

    objectArray.forEach(function myFunction(value, index, array) {
        variableString = variableString.concat(value);
        if (index+1 < array.length){
            variableString = variableString.concat(',');
        }
    })

    let url = dataBaseUrl(year, dataset, variableString, stateId);
    let response =  await executeQuery(url);
    return response;
};

exports.getVariables = async function (year, dataset) {
    let url = variablesBaseUrl(year, dataset);
    let response =  await executeQuery(url);
    return response;
};

function executeQuery(requestUrl) {

    return new Promise((resolve, reject) => {
        console.log("Census API Query");
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
