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

  getBillAuthor(sponsorships) {

    let mainSponsor = null;

    if(sponsorships.length > 1) {
      sponsorships.forEach(function (sponsor) {
        if(sponsor.primary && sponsor.classification === 'primary')
        {
          mainSponsor = sponsor.name;
        }
      });
    }
    else {
      mainSponsor = sponsorships[0].name;
    }

    return mainSponsor;
    
  },
  
  getBillData : function(state, session, billNum, callback) {

    let query = `    {
      bill(jurisdiction: "${state}", session: "${session}", identifier: "${billNum}") {
        identifier
        title
        classification
        actions {
          description,
          classification,
          order,
          vote {
            startDate,
            motionText,
            motionClassification,
            result
          }
        }
        legislativeSession {
          identifier
          jurisdiction {
            name
          }
        }
        documents {
          date
          note
          links {
            url
          }
        }
        sponsorships {
          name
          entityType
          primary
          classification
        }
        versions {
          date
          note
          links {
            url
          }
        }
      }
    }`
  
    graphClient.request(query).then(data => {


      let billData = {
        num : data.bill.identifier.replace(' ', '-'),
        title : data.bill.title,
        author : this.getBillAuthor(data.bill.sponsorships)
      };

      // console.log(data);

      callback(billData);
    })
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
            }
          }
        }
      }
    `

    graphClient.request(query).then(data =>
      console.log(data)
    )
  }
}

module.exports = obj;