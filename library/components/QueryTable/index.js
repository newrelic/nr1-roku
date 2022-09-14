import React, { useState, useEffect, useRef } from 'react';
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

const QueryTable = ({ accountIds, query, title }) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    const loadData = async () => {console.log('query table', accountIds, query)
      setLoading(true);
      const {data: [{data, metadata}] = [{}]} = await NrqlQuery.query({ accountIds, query });
      if (!data || !metadata) {
        setLoading(false);
        console.log('ERROR loading query table results');
        return;
      }
      console.log('data', data)
      setItems(data);
      setAttributes(Object.keys(metadata.units_formatting).filter(u => !(u === 'x' || u === 'y')));
    }
    
    if (!loading && query) loadData();
  }, [accountIds, query]);

  const formatTimestamp = timestamp => Intl.DateTimeFormat('default', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(new Date(timestamp));
  
  return (
    <Card>
      <CardHeader title={title} subtitle="" />
      <CardBody>
        <Table items={items} rowCount={items.length}>
          <TableHeader>
            {attributes.map(attribute => (
              <TableHeaderCell width="fit-content" value={({ item }) => item[attribute]}>
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
  accountIds: PropTypes.array,
  query: PropTypes.string,
  title: PropTypes.string,
};

export default QueryTable;
