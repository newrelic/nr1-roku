const homeQueries = {};

homeQueries.uniqValuesQuery = (attribute, queryTime, conditions) =>
  `SELECT uniques(${attribute}) AS uniques FROM RokuSystem LIMIT MAX ${queryTime} ${conditions}`;

homeQueries.attributesQuery = (queryTime) =>
  `SELECT keySet() FROM RokuSystem ${queryTime}`;

homeQueries.valuesQuery = (attributes, queryTime, conditions = '') => `
  query ValuesQuery($accounts: [Int!]!) {
    actor {
      ${attributes.map(
        (attr, i) => `
        attr${i}: nrql(accounts: $accounts, query: "${homeQueries.uniqValuesQuery(
          attr,
          queryTime,
          conditions
        )}") {
          results
        }`
      )}
    }
  }
`;

export default homeQueries;
