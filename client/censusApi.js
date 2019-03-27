const httpClient = require('axios');


function dataBaseUrl(year, dataset, variableString, stateId) {
    return `https://api.census.gov/data/${year}/${dataset}?get=${variableString}&for=county:*&in=state:${stateId}`
}

function variablesBaseUrl(year, dataset) {
    return `https://api.census.gov/data/${year}/${dataset}/variables.json`
}

function variableDetailsBaseUrl(year, dataset, variableName) {
    return `https://api.census.gov/data/${year}/${dataset}/variables/${variableName}.json`
}

const apiKey = process.env["API_KEY"];

exports.getData = async function (year, dataset, variableStringArray, stateId) {

    let objectArray = variableStringArray.variableString;
    let variableString = '';

    objectArray.forEach(function myFunction(value, index, array) {
        variableString = variableString.concat(value);
        if (index + 1 < array.length) {
            variableString = variableString.concat(',');
        }
    })

    let url = dataBaseUrl(year, dataset, variableString, stateId);
    let response = await executeQuery(url);
    return response;
};

exports.getDataWithLabels = async function (year, dataset, variableStringArray, stateId) {
    let objectArray = variableStringArray.variableString;
    let variableString = '';

    objectArray.forEach(function myFunction(value, index, array) {
        variableString = variableString.concat(value);
        if (index + 1 < array.length) {
            variableString = variableString.concat(',');
        }
    })

    let url = dataBaseUrl(year, dataset, variableString, stateId);
    let response = await executeQuery(url);

    response = await poplulateLabelRowInResponse(response, year, dataset);

    return response;

}

exports.getVariables = async function (year, dataset) {
    let url = variablesBaseUrl(year, dataset);
    let response = await executeQuery(url);
    return response;
};

// insert a row with appropriate labels for data returned from the Census APIs
async function poplulateLabelRowInResponse(response, year, dataset) {
    let headerRow = response.data[0];

    let labelRow = [];

    //get the entire list of  variables 1st.  Should have majority of labels there and save calls.
    let url = variablesBaseUrl(year, dataset);
    let variableResponse = await executeQuery(url);
    let variables = variableResponse.data.variables;

    // now for each variable in the header row, find the determine the label
    for (var key in headerRow) {
        var variableLabel = '';
        var variableId = headerRow[key];

        // variables such as "county" and "state" have no information
        if (variableId == "state" || variableId == "county") {
            variableLabel = variableId;
        } else if (variableId in variables) {
            //first check in the variables list, if there use it
            variableLabel = variables[variableId].label;
        } else {
            // otherwise check the variable api to get the information
            let variableDetailUrl = variableDetailsBaseUrl(year, dataset, variableId);
            let variableDetailResponse = await executeQuery(variableDetailUrl);
            // if the call was successful, use the label
            if (variableDetailResponse.status == 200) {
                variableLabel = variableDetailResponse.data.label;
            } else {
                // otherwise just use the original ID
                variableLabel = variableId;
            }
        }
        labelRow.push(variableLabel)
    }
    // insert the new label row right under the heading row (optionally can go on top)
    response.data.splice(1, 0, labelRow);

    return response;
}

function executeQuery(requestUrl) {

    return new Promise((resolve, reject) => {
        console.log("Census API Query");
        console.log("Request Url: " + requestUrl);
        httpClient.get(requestUrl, {params: {key: apiKey}})
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
