'use strict';

const OPEN_STATES_KEY = '828e5ca5-eb3f-4928-ac56-6141e8915e0e';
const OPEN_STATES_ENDPOINT = 'https://openstates.org/graphql';
const SENATE_BASE_DOCUMENT_URL = 'https://www.senate.mo.gov/19info/pdf-bill/intro/';

const graphql_request = require('graphql-request');
const graphClient = new graphql_request.GraphQLClient(OPEN_STATES_ENDPOINT, {
  headers: {
    'x-api-key' : OPEN_STATES_KEY
  }
})

const currentYear = new Date().getFullYear();

const obj = {

  getMoreLink(sources, organization) {

    let sourcesLink = '';

    if(sources.length >= 1)
    {
      if(organization === 'Senate')
      {
        sourcesLink = sources[0].url;
      }
      else
      {
        sourcesLink = sources[1].url;
      }
    }

    return sourcesLink;

  },

  getBillAuthor(sponsorships) {

    let mainSponsor = null;
    let sponsorDetails = { name : '', party : '' };

    if(sponsorships.length > 1) {

      sponsorships.forEach(function (sponsor) {
        if(sponsor.primary && sponsor.classification === 'primary')
        {
          mainSponsor = sponsor;
        }
      });

    }
    else {
      mainSponsor = sponsorships[0];
    }

    sponsorDetails.name = mainSponsor.name;
    if(mainSponsor.familyName)
    {
      console.log(mainSponsor.familyName);
    }

    if(mainSponsor.person)
    {
      sponsorDetails.party = mainSponsor.person.currentMemberships.organization.name;
    }

    return sponsorDetails;
    
  },
  
  getBillData : function(state, session, billNum, callback) {

    let query = `    {
      bill(jurisdiction: "${state}", session: "${session}", identifier: "${billNum}") {
        identifier
        title
        classification
        fromOrganization {
          name
        }
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
          person {
            name
            familyName
            currentMemberships {
              organization
                {
                  name
                }
              label
              role
            }
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
        }
      }
    }`
  
    graphClient.request(query).then(data => {

      let sponsorDetails = this.getBillAuthor(data.bill.sponsorships);
      let billMoreLink = this.getMoreLink(data.bill.sources, data.bill.fromOrganization);

      console.log(JSON.stringify(data.bill.versions));

      let billData = {
        num : data.bill.identifier.replace(' ', '-'),
        title : data.bill.title,
        author : sponsorDetails.name,
        affiliation : sponsorDetails.party, 
        documentAvailable : data.bill.fromOrganization.name === 'Senate',
        status : data.bill.versions.length !== 0 ? data.bill.versions[0].note : '',
        link : billMoreLink,
        pdf_link : SENATE_BASE_DOCUMENT_URL + data.bill.identifier.replace(' ','') + '.pdf'
      };

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