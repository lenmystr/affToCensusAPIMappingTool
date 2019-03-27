const httpClient = require('axios');


function dataBaseUrl(year,dataset, uri, variableString, stateId) {
    return `https://api.census.gov/data/${year}/${dataset}${uri}?get=${variableString}&for=county:*&in=state:${stateId}`
}

function variablesBaseUrl(year, dataset, uri) {
    return `https://api.census.gov/data/${year}/${dataset}${uri}/variables.json`
}

const profileURI = '/profile';
const subjectURI = '/subject';

const apiKey = process.env["API_KEY"];

exports.getTableData = async function (year, dataset, variableString, stateId) {
    let uri = '';
    let url = dataBaseUrl(year, dataset, uri, variableString, stateId);
    let response =  await executeQuery(url);
    return response;
};

exports.getProfileData = async function (year, dataset, variableString, stateId) {
    let uri = profileURI;
    let url = dataBaseUrl(year, dataset, uri, variableString, stateId);
    let response =  await executeQuery(url);
    return response;
};

exports.getSubjectData = async function (year, dataset, variableString, stateId) {
    let uri = subjectURI;
    let url = dataBaseUrl(year, dataset, uri, variableString, stateId);
    let response =  await executeQuery(url);
    return response;
};

exports.getTableVariables = async function (year, dataset) {
    let uri = '';
    let url = variablesBaseUrl(year, dataset, uri);
    let response =  await executeQuery(url);
    return response;
};

exports.getProfileVariables = async function (year,dataset) {
    let uri = profileURI;
    let url = variablesBaseUrl(year, dataset, uri);
    let response =  await executeQuery(url);
    return response;
};

exports.getSubjectVariables = async function (year,dataset) {
    let uri = subjectURI;
    let url = variablesBaseUrl(year, dataset, uri);
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
