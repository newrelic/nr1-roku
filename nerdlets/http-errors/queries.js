const queries = {};

const removeWhiteapces = (str) => str.replace(/\s+/g, ' ');

queries.errors = removeWhiteapces(`
  SELECT count(*) as 'Errors' 
  FROM RokuSystem 
  WHERE actionName = 'HTTP_ERROR' 
    OR (actionName = 'HTTP_RESPONSE' AND (httpCode >= 400 OR httpCode <= 0))  
`);

queries.errorRate = removeWhiteapces(`
  SELECT 100*filter(count(*), 
    WHERE actionName = 'HTTP_ERROR' 
      OR (actionName = 'HTTP_RESPONSE' AND httpCode >= 400))
    /filter(count(*), 
      WHERE actionName in ('HTTP_CONNECT', 'HTTP_REQUEST')) 
    AS 'Error Rate (%)' 
  FROM RokuSystem
`);

queries.affectedUsers = removeWhiteapces(`
  SELECT uniqueCount(uuid) as 'Affected Users' 
  FROM RokuSystem 
  WHERE actionName = 'HTTP_ERROR' 
    OR (actionName = 'HTTP_RESPONSE' AND httpCode >= 400)
`);

queries.affectedUserRate = removeWhiteapces(`
  SELECT 100*filter(uniqueCount(uuid), 
    WHERE actionName = 'HTTP_ERROR' 
      OR (actionName = 'HTTP_RESPONSE' AND httpCode >= 400))
    /uniqueCount(uuid) 
    AS '% Users Affected' 
  FROM RokuSystem
`);

queries.errorsList = removeWhiteapces(`
  SELECT domain, deviceModel, countryCode, method, status, httpCode
  FROM RokuSystem 
  WHERE actionName = 'HTTP_ERROR' 
    OR (actionName = 'HTTP_RESPONSE' AND (httpCode >= 400 OR httpCode <= 0))
  LIMIT MAX
`);

export default queries;
