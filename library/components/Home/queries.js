const homeQueries = {};

homeQueries.uniqValuesQuery = (attribute, queryTime) => 
  `SELECT uniques(${attribute}) AS uniques FROM RokuSystem LIMIT MAX ${queryTime}`;

homeQueries.attributesQuery = queryTime =>
  `SELECT keySet() FROM RokuSystem ${queryTime}`;

homeQueries.valuesQuery = (attributes, queryTime) => `
  query ValuesQuery($accounts: [Int!]!) {
    actor {
      ${attributes.map((attr, i) => `
        attr${i}: nrql(accounts: $accounts, query: "${homeQueries.uniqValuesQuery(attr, queryTime)}") {
          results
        }`
      )}
    }
  }
`;

export default homeQueries;
