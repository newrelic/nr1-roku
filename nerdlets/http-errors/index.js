import React, { useState, useEffect } from 'react';

import {
  AreaChart,
  AutoSizer,
  BillboardChart,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  LineChart,
  NerdGraphQuery,
  nerdlet,
  ngql as gql,
  NrqlQuery,
  usePlatformState,
} from 'nr1';

import NRLabsFilterBar from '../../library/components/NRLabsFilterBar';
import NRLabsMultiSelect from '../../library/components/NRLabsMultiSelect';
import QueryTable from '../../library/components/QueryTable';
import queries from './queries';

const HTTPErrorsNerdlet = () => {
  nerdlet.setConfig({ accountPicker: true });
  const [groups, setGroups] = useState([
    {item: 'domain', display: 'Request Domain', isSelected: false},
    {item: 'deviceModel', display: 'Device Model', isSelected: false},
    {item: 'countryCode', display: 'Country code', isSelected: false},
    {item: 'method', display: 'HTTP Method', isSelected: false},
    {item: 'status', display: 'Error Message', isSelected: false},
    {item: 'httpCode', display: 'Error Code', isSelected: false},
  ]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [{ accountId, timeRange }] = usePlatformState();

  const [queryTime, setQueryTime] = useState('');
  const [facets, setFacets] = useState('');
  const [whereClause, setWhereClause] = useState('');
  const [errorsQuery, setErrorsQuery] = useState(`${queries.errors} TIMESERIES`);
  const [errorRateQuery, setErrorRateQuery] = useState(`${queries.errorRate} TIMESERIES`);
  const [affectedUsersQuery, setAffectedUsersQuery] = useState(`${queries.affectedUsers} TIMESERIES`);
  const [affectedUserRateQuery, setAffectedUserRateQuery] = useState(`${queries.affectedUserRate} TIMESERIES`);
  const [errorsListQuery, setErrorsListQuery] = useState();

  useEffect(() => {
    const loadAttributes = async () => {
      if (accountId === 'cross-account') return;
      const qryTime = timeRange.duration
      ? `SINCE ${Date.now() - timeRange.duration}`
      : `SINCE ${timeRange.begin_time} UNTIL ${timeRange.end_time}`;
      setQueryTime(qryTime);
      const attribsQuery = `SELECT * FROM RokuSystem LIMIT MAX ${qryTime}`;
      setErrorsListQuery(`${queries.errorsList} ${qryTime}`);
      const query = gql`
        query AttributesQuery($accounts: [Int!]!) {
          actor {
            nrql(accounts: $accounts, query: "${attribsQuery}") {
              results
            }
          }
        }
      `;
      const variables = { accounts: [accountId] };
      setLoading(true);
      const {
        data: {actor: {nrql: {results} = {}}},
        error,
      } = await NerdGraphQuery.query({ query, variables });
      
      if (error || !results) {
        setLoading(false);
        console.log('ERROR loading attributes or no results returned', error);
        return;
      }
      console.log('results', results)
      const attributes = results.reduce((attribs, res) => {
        Object.keys(res).reduce((_, attrib) => {
          if (/entity.|nr.|timestamp|actionName/.test(attrib)) return;
          const val = res[attrib];
          if (!(attrib in attribs)) attribs[attrib] = {values: {}};
          if (!(val in attribs[attrib]['values'])) attribs[attrib]['values'][val] = '';
          // return attribs;
        });
        return attribs;
      }, {});
      console.log('attributes', Object.keys(attributes).length, attributes)
      setFilterOptions(Object.keys(attributes).map(attrib => 
        ({option: attrib, values: Object.keys(attributes[attrib]['values']), group: ''})));
    };

    if (!loading) loadAttributes();
  }, [accountId, timeRange]);

  useEffect(() => {
    const selectedFacets = groups.reduce((acc, group) => (group.isSelected ? [...acc, group.item] : acc), []);
    console.log('selectedFacets', selectedFacets)
    setFacets(selectedFacets.length ? `FACET ${selectedFacets.join(', ')}` : '')
  }, [groups]);

  useEffect(() => {
    console.log('filters', filters)
  }, [filters]);

  const billboardStyles = {height: '60px', width: '96px'};

  if (accountId === 'cross-account')
    return (
      <EmptyState
        fullHeight
        fullWidth
        type={EmptyState.TYPE.ERROR}
        iconType={EmptyState.ICON_TYPE.INTERFACE__STATE__CRITICAL}
        title="No account selected!"
        description="Please choose an account to get started."
      />
    );

  return (
    <div className="container">
      <div className="control-bar">
        <NRLabsMultiSelect items={groups} onChange={setGroups} />
        <NRLabsFilterBar options={filterOptions} filters={filters} onChange={setFilters} />
      </div>
      <div className="charts">
        <div className="summary">
          <div className="header">
            <h4>Error Summary</h4>
            <small>time period</small>
          </div>
          <div className="metric">
            <BillboardChart accountIds={[accountId]} query={`${queries.errors} ${queryTime}`} style={billboardStyles} />
          </div>
          <div className="metric">
            <BillboardChart accountIds={[accountId]} query={`${queries.errorRate} ${queryTime}`} style={billboardStyles} />
          </div>
          <div className="metric">
            <BillboardChart accountIds={[accountId]} query={`${queries.affectedUsers} ${queryTime}`} style={billboardStyles} />
          </div>
          <div className="metric">
            <BillboardChart accountIds={[accountId]} query={`${queries.affectedUserRate} ${queryTime}`} style={billboardStyles} />
          </div>
        </div>
        <Card>
          <CardHeader title="Errors" subtitle="" />
          <CardBody>
            <AreaChart accountIds={[accountId]} query={`${errorsQuery} ${facets} ${queryTime}`} fullWidth />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Error Rate %" subtitle="" />
          <CardBody>
            <LineChart accountIds={[accountId]} query={`${errorRateQuery} ${facets} ${queryTime}`} fullWidth />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Users Affected" subtitle="" />
          <CardBody>
            <AreaChart accountIds={[accountId]} query={`${affectedUsersQuery} ${facets} ${queryTime}`} fullWidth />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Users Affected Rate %" subtitle="" />
          <CardBody>
            <LineChart accountIds={[accountId]} query={`${affectedUserRateQuery} ${facets} ${queryTime}`} fullWidth />
          </CardBody>
        </Card>
        <div className="full-width">
          <QueryTable accountIds={[accountId]} query={errorsListQuery} title="Errors" />
        </div>
      </div>
    </div>
  );
}

export default HTTPErrorsNerdlet;
