const httpClient = require('axios');


function dataBaseUrl(year, program, dataset, uri, variableString, stateId) {
    return `https://api.census.gov/data/${year}/${program}/${dataset}${uri}?get=${variableString}&for=county:*&in=state:${stateId}`
}

function variablesBaseUrl(year, program, dataset, uri) {
    return `https://api.census.gov/data/${year}/${program}/${dataset}${uri}/variables.json`
}

const profileURI = '/profile';
const subjectURI = '/subject';

const apiKey = process.env["API_KEY"];

exports.getTableData = async function (year, program, dataset, variableString, stateId) {
    let uri = '';
    let url = dataBaseUrl(year, program, dataset, uri, variableString, stateId);
    let response =  await executeQuery(url);
    return response;
};

exports.getProfileData = async function (year, program, dataset, variableString, stateId) {
    let uri = profileURI;
    let url = dataBaseUrl(year, program, dataset, uri, variableString, stateId);
    let response =  await executeQuery(url);
    return response;
};

exports.getSubjectData = async function (year, program, dataset, variableString, stateId) {
    let uri = subjectURI;
    let url = dataBaseUrl(year, program, dataset, uri, variableString, stateId);
    let response =  await executeQuery(url);
    return response;
};

exports.getTableVariables = async function (year, program, dataset) {
    let uri = '';
    let url = variablesBaseUrl(year, program, dataset, uri);
    let response =  await executeQuery(url);
    return response;
};

exports.getProfileVariables = async function (year, program, dataset) {
    let uri = profileURI;
    let url = variablesBaseUrl(year, program, dataset, uri);
    let response =  await executeQuery(url);
    return response;
};

exports.getSubjectVariables = async function (year, program, dataset) {
    let uri = subjectURI;
    let url = variablesBaseUrl(year, program, dataset, uri);
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
