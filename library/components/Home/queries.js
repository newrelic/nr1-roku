const homeQueries = {};

const removeWhiteapces = str => str.replace(/\s+/g, ' ');

// const attribsQuery = `SELECT keySet() FROM RokuSystem ${qryTime}`;
const valuesNrql = queryTime => 
  `SELECT * FROM RokuSystem LIMIT MAX ${queryTime}`;

homeQueries.attributesQuery = queryTime =>
  `SELECT keySet() FROM RokuSystem ${queryTime}`;

homeQueries.valuesQuery = queryTime => `
  query ValuesQuery($accounts: [Int!]!) {
    actor {
      values: nrql(accounts: $accounts, query: "${valuesNrql(queryTime)}") {
        results
      }
    }
  }
`;

export default homeQueries;
