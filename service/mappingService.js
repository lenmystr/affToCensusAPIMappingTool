const censusAPI = require('../client/censusApi');
const affApi = require('../client/affApi');
const tabletype = require('../data/tabletype');
const affToCensusMap = require('../data/aff_to_census_dataset_map');

const census_variable_label_delimiter = '!!';
const aff_id_delimiter = '_';
const aff_label_delimiter = '; ';

const acs_acs5_detail_table_regex = /[B,C]\d{5}.{0,3}/;
const acs_acs5_subject_table_regex = /S\d{4}.{0,3}/;
const acs_acs5_data_profile_table_regex = /DP\d{2}.{0,2}/;
const dec_sf1_table_regex = /[P,H](CT){0,1}\d{1,2}.{0,2}/;

const acs_data_profile_suffix = '/profile';
const acs_subject_suffix = '/subject';


// global indicating what type of table is being processed
let g_table_type = tabletype.acs_detail;

exports.buildmappingtable = async function (tableId, aff_program, dataSet, geoId) {
    let variables = null;

    //infer census particulars from the AFF particulars that were passed in
    // parse the aff particulars
    let aff_array = dataSet.split('_');
    let aff_year = aff_array[0];
    let aff_dataset = aff_array[1];

    // compose census year
    let census_year = "20" + aff_year;

    //determine the census dataset
    let aff_map_key = aff_program + "_" + aff_dataset;
    let census_dataset = affToCensusMap[aff_map_key].census_dataset;


    //determine which API the target data resides in and get the appropriate variables
    if (tableId.match(acs_acs5_data_profile_table_regex) != null) {
        g_table_type = tabletype.acs_profile;
        // need to modify dataset for this table
        census_dataset = census_dataset + acs_data_profile_suffix;
    } else if (tableId.match(acs_acs5_subject_table_regex) != null) {
        g_table_type = tabletype.acs_subject;
        // need to modify dataset for this table
        census_dataset = census_dataset + acs_subject_suffix;
    } else if (tableId.match(acs_acs5_detail_table_regex) != null) {
        g_table_type = tabletype.acs_detail;
    } else if (tableId.match(dec_sf1_table_regex) != null) {
        g_table_type = tabletype.dec_sf1;
    }
    variables = await censusAPI.getVariables(census_year, census_dataset);

    // get the table headers for the target table
    let table_headers = await affApi.getHeadersInTable(aff_program, dataSet, tableId, geoId);

    // get the mappings for the table
    let map = constructMappingTable(tableId, variables.data, table_headers.data.data.header);

    return map;
};

/*
    Generate the Census version of the label to search for
 */

function getCensusLabelToSearch(categories) {

    let return_label = null;
    let boxhead = null;
    let estimate = null;
    let subject = null;
    let vdim = null;
    let vd1 = null;

    // for some search strings, may need to insert a "Total" string
    let total = '';


    switch (g_table_type) {
        case tabletype.acs_subject:
            boxhead = categories.BOXHEAD;
            estimate = categories.ESTIMATE;
            subject = categories.SUBJECT;
            return_label = boxhead.label + census_variable_label_delimiter + estimate.label + census_variable_label_delimiter + subject.label;
            break;
        case tabletype.acs_detail:
            total = '';
            estimate = categories.ESTIMATE;
            vdim = categories.VDIM;
            // in some of the acs detail tables (B01001, etc) there appears to be the term "Total" inserted that seems to be expected by the
            // census api but doesn't exist in the aff category labels.  Greater success is achieved if we insert it
            // in the event it doesn't exist.
            if (!vdim.label.includes("Total")) {
                total = census_variable_label_delimiter + "Total"
            }
            return_label = estimate.label + total + census_variable_label_delimiter + vdim.label;
            break;
        case tabletype.acs_profile:
            estimate = categories.ESTIMATE;
            subject = categories.SUBJECT;
            return_label = estimate.label + census_variable_label_delimiter + subject.label;
            break;
        case tabletype.dec_sf1:
            total = '';
            vd1 = categories.VD1;
            // in some of the acs detail tables (B01001, etc) there appears to be the term "Total" inserted that seems to be expected by the
            // census api but doesn't exist in the aff category labels.  Greater success is achieved if we insert it
            // in the event it doesn't exist.
            if (!vd1.label.includes("Total")) {
                total = "Total" + census_variable_label_delimiter;
            }
            return_label = total + vd1.label;
            break;
    }

    // The following reg ex replacements are a result of manually analyzing the data and determining what needed
    // to be done to match the ole and new strings

    // any non-space characters such as "-" need to be replaced with the census API delimiter
    return_label = return_label.replace(/\s-\s/g, census_variable_label_delimiter);

    // appears that in all casees the ':' character (usually found in the string "Total:", "Male:", "Female:", etc)
    // in the detail tables
    // is always followed by a "-" so let's just remove this character so we don't end up with "!!!!".
    return_label = return_label.replace(':', '');

    return return_label;
}

/*
    Generate the legacy AFF label
 */

function getAffLabel(categories) {

    let return_label = null;
    let boxhead = null;
    let estimate = null;
    let subject = null;
    let vdim = null;

    switch (g_table_type) {
        case tabletype.acs_subject:
            boxhead = categories.BOXHEAD;
            estimate = categories.ESTIMATE;
            subject = categories.SUBJECT;
            return_label = boxhead.label + aff_label_delimiter + estimate.label + aff_label_delimiter + subject.label;
            break;
        case tabletype.acs_detail:
            estimate = categories.ESTIMATE;
            vdim = categories.VDIM;
            return_label = estimate.label + aff_label_delimiter + vdim.label;
            break;
        case tabletype.acs_profile:
            estimate = categories.ESTIMATE;
            subject = categories.SUBJECT;
            return_label = estimate.label + aff_label_delimiter + subject.label;
            break;
        case tabletype.dec_sf1:
            vd1 = categories.VD1;
            return_label = vd1.label;
            break;
    }
    return return_label;
}

/*
    Generate the legacy AFF ID
 */
function getAffId(categories) {

    let return_label = null;
    let boxhead = null;
    let estimate = null;
    let subject = null;
    let vdim = null;

    switch (g_table_type) {
        case tabletype.acs_subject:
            boxhead = categories.BOXHEAD;
            estimate = categories.ESTIMATE;
            subject = categories.SUBJECT;
            return_label = boxhead.id + aff_id_delimiter + estimate.id + aff_id_delimiter + subject.id;
            break;
        case tabletype.acs_detail:
            estimate = categories.ESTIMATE;
            vdim = categories.VDIM;
            return_label = estimate.id + aff_id_delimiter + vdim.id;
            break;
        case tabletype.acs_profile:
            estimate = categories.ESTIMATE;
            subject = categories.SUBJECT;
            return_label = estimate.id + aff_id_delimiter + subject.id;
            break;
        case tabletype.dec_sf1:
            vd1 = categories.VD1;
            return_label = vd1.id;
            break;
    }
    return return_label;
}

function constructMappingTable(tableId, variables_root, table_headers) {

    // first thing is to convert this giant JSON object that is returned by the Variables API
    // into a JSON object Array so that we can more easily perform the searches we'll need to do

    let variables = variables_root.variables;
    let object_array = [];

    // while traversing, only add the object to the array if the group name matches the table ID
    // we care about to keep the array small as possible
    for (var key in variables) {
        let object = variables[key];
        if (object.group === tableId) {
            object.key = key;
            object_array.push(object);
        }
    }
    let variables_array = {variables: object_array};

    //now we have an array of the variables that are relevant to the tableId passed in, we can iterate thru the
    // table_headers and find the matching variable and create a new Array

    let cells = table_headers.cells;
    let mapping_array = [];
    for (var key in cells) {
        let cell = cells[key];
        let categories = cell.categories;

        let census_label_to_search = getCensusLabelToSearch(categories);

        let variable = findVariableByLabel(census_label_to_search, variables_array);
        let new_mapping_object = null;

        if (variable != null) {
            new_mapping_object = {
                affTableId: tableId,
                affColumnId: getAffId(categories),
                affColumnLabel: getAffLabel(categories),
                censusGroup: variable.group,
                censusVariableId: variable.key,
                censusVariableLabel: variable.label
            }
        } else {
            new_mapping_object = {
                affTableId: tableId,
                affColumnId: getAffId(categories),
                affColumnLabel: getAffLabel(categories),
                censusVariable: "not Found",
                label_searched_for: census_label_to_search,
                affCategories: categories

            }
        }
        mapping_array.push(new_mapping_object);


    }

    let mappings = {mappings: mapping_array};

    // alternatively structure the mappings into any result you want to have returned
    let result = {data: mappings, status: 200};

    return result;
}

function findVariableByLabel(label_to_search, variable_array) {
    var object_array = variable_array.variables;

    for (var key in object_array) {
        let object = object_array[key];
        if (object.label === label_to_search) {
            return object;
        }
    }
}
