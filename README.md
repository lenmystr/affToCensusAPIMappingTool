# American Fact Finder API to Census API Migration Tool
## Overview
This is a NodeJS application using the  [Express] application framework.

The goal of this tool is to provide a utility that might be helpful in simplifying the transition of users from the AFF APIs and datasets to the Census.gov APIs and datasets.

## Functionality
### Mapping AFF Column IDs to Census Variables
One of the chief differences between the two services is that the Census moves data identification from a system of tables with column IDs to a system of global variables.  Data within a table and column in AFF can be directly mapped to a variable within Census.  Labels can also be mapped 1 - 1 when the AFF string is transformed to the matching string in a format used by Census dataset.

Example for an ACS 5YR dataset:

| Description | Value |
| --- | --- |
|AFF Table Id | S0701|
|AFF Column Id | HC01_EST_VC05|
|AFF Column Label | Total; Estimate; AGE - 18 to 24 years|
|Census Group | S0701|
|Census Variable Id | S0701_C01_004E|
|Census Variable Label | Total!!Estimate!!AGE!!18 to 24 years|

Another key difference is that access to the Census datasets are broken up into several APIs outlined in [Census Available Apis].

Where in AFF you reference data by a program (ie. ACS, DEC, etc) and a dataset  within that program that includes reference to the year (ie: 13_5YR, 10_SF1, etc), in Census all data is reference by a year and dataset only (ie. acs/acs5, dec/sf1, etc).
You can find all Census datasets available that are available for each year listed in the table [Census Data]

Given an AFF Table and Column, the tool will find the corresponsing Census Variable ID.

`/mapping/getMappings`

### Get AFF Column Information
Given an AFF Table, this functionality returns column information for that table.  Used withing the mapping functionality.

`/aff/getColumns`

### Get Census Variables
Given a Census dataset, returns the variables.

`/census/getVariables`

### Get Census Data
Given a Census dataset, year and variable list, gets the data from the Census API.
The variable list is supplied in the body to fascilitate management since it can be 
rather large.

`/census/data/getData`

Sample service that supplements the Census data with a row including labels

`/data/getDataWithLabels`

## Local Setup

To setup this project:
1. Clone this repository to your local machine
2. Navigate to the cloned directory and install dependencies with `npm i`
3. Create a .env file in the base directory adding your [Census API Key] with the key "API_KEY".

## Running the Project

`npm start`

Server will run on port 3000

## Postman Collection

I've included the PostMan collection in a folder called "postManCollection".

There are 3 folders.

### Census API
This is just a collection of Census API calls that were used to fetch data from the Census dataset for analysis and validation

### AFF API
This is just a collection of AFF API calls that were used to fetch data from the AFF dataset for analysis and validation

### MappingTool APIs
These are the APIs that are provided by the tool.

There are 4 APIs available in the tool as described below.

#### Get Column Mapping Table
This is the API that when provided and AFF table to map from produces the mapping from an AFF table to the Census varialbe.
Refer to [Statistical Data Metadata Model] for understanding of the parameters
Required are:
* program - the AFF Program in which the table exists
* dataSet - the data set in which the table exists
* tableId - the id of the table for which columns should be mapped
* geoId - the geographical code for the area of the table (makes no difference for this API)

#### [AFF] Get Table Columns
This API was used to make a call to get table data from the AFF dataset. It calls the AFF API directly but parameterizes the call for ease of use.
Refer to [Statistical Data Metadata Model] for understanding of the parameters
Required are:
* program - the AFF Program in which the data exists
* dataSet - the data set in which the data exists
* tableId - the id of the table in which the data exists
* geoId - the geographical code for the area for which the data should be pulled

#### [Census] Get Data
This API retrieves the specified data from the Census dataset. 
Required are:
* year - the year for which the dataset should refer
* dataSet - the data set from which the data should be fetched (see [Census Data] )
* state - the id of the state for which to pull data (by default the code pulls all counties but this can be changed in code)

#### [Census] Get Data with Labels
This API retrieves the specified data from the Census dataset but also adds a row containing the labels or the variables that were included. 
Required are:
* year - the year for which the dataset should refer
* dataSet - the data set from which the data should be fetched (see [Census Data] )
* state - the id of the state for which to pull data (by default the code pulls all counties but this can be changed in code)

#### [Census] Get Variables
This API retrieves the available variables for a specified dataset
Required are:
* year - the year for which the dataset should refer
* dataSet - the data set for which the variables should be fetched (see [Census Data] )

The rest for the requests in this folders are just examples using the above calls

[Express]: https://expressjs.com/
[Census API Key]: https://api.census.gov/data/key_signup.html
[Census Available Apis]: https://www.census.gov/data/developers/data-sets.html
[Census Data]:https://api.census.gov/data.html
[Statistical Data Metadata Model]:https://factfinder.census.gov/service/DataModel.html