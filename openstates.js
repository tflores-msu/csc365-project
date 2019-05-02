'use strict';

const OPEN_STATES_KEY = '828e5ca5-eb3f-4928-ac56-6141e8915e0e';
const OPEN_STATES_ENDPOINT = 'https://openstates.org/graphql';

const graphql_request = require('graphql-request');
const graphClient = new graphql_request.GraphQLClient(OPEN_STATES_ENDPOINT, {
  headers: {
    'x-api-key' : OPEN_STATES_KEY
  }
})

const currentYear = new Date().getFullYear();

const obj = {
  getBillData : function(state, session, billNum) {
    let query = `    {
      bill(jurisdiction: "${state}", session: "${session}", identifier: "${billNum}") {
        id
        identifier
        title
        classification
        updatedAt
        createdAt
        legislativeSession {
          identifier
          jurisdiction {
            name
          }
        }
        actions {
          date
          description
          classification
        }
        documents {
          date
          note
          links {
            url
          }
        }
        versions {
          date
          note
          links {
            url
          }
        }
        sources {
          url
          note
        }
      }
    }`
  
    graphClient.request(query).then(data =>
        console.log(JSON.stringify(data))
    )
  },

  getCurrentBills : function(numBills, chamber)
  {
    let query = `{
      bills(first: ${numBills}, jurisdiction: "Missouri", session: "${currentYear}", chamber: "${chamber}") {
          edges {
            node {
              id
              identifier
              title
              classification
              updatedAt
              createdAt
              legislativeSession {
                identifier
                jurisdiction {
                  name
                }
              }
              actions {
                date
                description
                classification
              }
              documents {
                date
                note
                links {
                  url
                }
              }
              versions {
                date
                note
                links {
                  url
                }
              }
              
              sources {
                url
                note
                  
              }
            }
          }
        }
      }
    `

    graphClient.request(query).then(data =>
      console.log(JSON.stringify(data))
    )
  }
}

module.exports = obj;