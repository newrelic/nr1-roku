import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardBody,
  CardHeader,
  NrqlQuery,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableRowCell,
} from 'nr1';

import { formatTimestamp } from '../../utils/datetime';

const QueryTable = ({ accountId, baseQuery, whereClause, queryTime, title }) => {
  const [items, setItems] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [subtitle, setSubtitle] = useState('');
  const [sortingTypes, setSortingTypes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const accountIds = [accountId];
      const query = `${baseQuery} ${whereClause} ${queryTime}`;
      const {data: [{data, metadata} = {}], error, loading} = await NrqlQuery.query({ accountIds, query });
      // console.log('query table response', data, metadata, error, loading);
      if (error || !data || !metadata) {
        setItems([]);
        setAttributes([]);
        setSubtitle('');
        console.log('ERROR loading query table results');
        return;
      }
      const attribs = Object.keys(metadata.units_formatting).filter(u => !(u === 'x' || u === 'y'));
      setItems(data);
      setAttributes(attribs);
      setSortingTypes(attribs.map(a => TableHeaderCell.SORTING_TYPE.NONE));
      
      if ('timeRange' in metadata) setSubtitle(formatSubtitle(metadata.timeRange));
    }
    
    loadData();
  }, [accountId, whereClause, queryTime]);

  const updateSortingType = (idx, nextSortingType) => 
    setSortingTypes(sortingTypes.map((_, i) => i === idx ? nextSortingType : TableHeaderCell.SORTING_TYPE.NONE));

  const formatSubtitle = ({begin_time: begin, end_time: end}) => `${formatTimestamp(begin)} - ${formatTimestamp(end)}`;
  
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} />
      <CardBody>
        <Table items={items} rowCount={items.length}>
          <TableHeader>
            {attributes.map((attribute, i) => (
              <TableHeaderCell 
                sortable
                sortingType={sortingTypes[i] || TableHeaderCell.SORTING_TYPE.NONE}
                onClick={(_, {nextSortingType}) => updateSortingType(i, nextSortingType)}
                width="fit-content" 
                value={({ item }) => item[attribute]}>
                {attribute}
              </TableHeaderCell>
            ))}
          </TableHeader>
          {({ item }) => (
            <TableRow>
              {attributes.map(attribute => (
                <TableRowCell>{attribute === 'timestamp' ? formatTimestamp(item[attribute]) : item[attribute]}</TableRowCell>
              ))}
            </TableRow>
          )}
        </Table>
      </CardBody>
    </Card>
  );
}

QueryTable.propTypes = {
  accountId: PropTypes.number,
  baseQuery: PropTypes.string,
  whereClause: PropTypes.string,
  queryTime: PropTypes.string,
  title: PropTypes.string,
};

export default QueryTable;
