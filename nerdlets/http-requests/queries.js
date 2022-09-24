const queries = {};

const removeWhiteapces = str => str.replace(/\s+/g, ' ');

queries.durationFirstByteTime = removeWhiteapces(`
  SELECT median(firstByteTime)  AS 'Duration (First Byte Time)'
  FROM RokuSystem 
  WHERE actionName = 'HTTP_COMPLETE'
`);

queries.avgReqsPerSession = removeWhiteapces(`
  SELECT count(*)/uniqueCount(uuid) AS 'Avg Requests/Session'
  FROM RokuSystem 
  WHERE actionName = 'HTTP_COMPLETE'
`);

queries.requestDuration = removeWhiteapces(`
  SELECT median(timeSinceHttpRequest) AS 'Request Duration'
  FROM RokuSystem 
  WHERE actionName = 'HTTP_RESPONSE'
`);

export default queries;
