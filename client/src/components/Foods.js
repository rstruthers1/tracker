import React, {useEffect, useState} from "react";
import { useTable, usePagination, useFilters } from 'react-table';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

import FoodService from "../services/food.service";

const Foods = (props) => {

  const [foods, setFoods] = useState([]);

  /**** Row data section ***/
  useEffect(() => {
    FoodService.getAllFoods().then(
      (response) => {
        console.log(JSON.stringify(response.data));
        setFoods(response.data);
      },
      (error) => {
        alert(error.toString());
      });
  }, []);
  
  const populateTableRows = (data) => {
    let rows = [];
    if (!data) {
      return rows;
    }
    for (let i = 0; i < data.length; i++) {
      let dataItem = data[i];
      rows.push({
        description: dataItem.description,
        servingSize: dataItem.servingSize,
        calories: dataItem.calories
      });
    }
    return rows;
  };

  // Need to use React.useMemo with react-table for performance reasons.
  const data = React.useMemo(() =>
      populateTableRows(foods),
    [foods]
  );
  
  /**** Column section ***/
  const columns = React.useMemo(
    () => [
          {
            Header: 'Description',
            accessor: 'description',
            sortType: 'basic'
          },
          {
            Header: 'Serving Size',
            accessor: 'servingSize',
            disableFilters: true // No filter
          },
          {
            Header: 'Calories',
            accessor: 'calories',
            disableFilters: true // No filter
          },
     
    ],
    []
  );
  
  /*** Text Filter ***/
  const TextFilter = ({
                        column: { filterValue, preFilteredRows, setFilter },
                      }) => {
    const count = preFilteredRows.length;

    return (
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
        placeholder={`Search ${count} records...`}
      />
    )
  };

  /*** Default column is configured to use the TextFilter above **/
  const defaultColumn = React.useMemo(
    () => ({
      Filter: TextFilter,
    }),
    []
  );
  
  /**** Initialize react-table ****/
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable({ columns, data, defaultColumn, initialState: { pageIndex: 0 }, }, useFilters, usePagination);
  
  /*** Component used for paging through table ***/
  const TablePageNavigation = () => {
    return (<>
      <span style={{paddingRight: "10px"}}>
        <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage} style={{marginRight: "5px"}}>
          {'<<'}
        </Button>
        <Button onClick={() => previousPage()} disabled={!canPreviousPage} style={{marginRight: "5px"}}>
          {'<'}
        </Button>
        <Button onClick={() => nextPage()} disabled={!canNextPage} style={{marginRight: "5px"}}>
          {'>'}
        </Button>
        <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} style={{marginRight: "5px"}}>
          {'>>'}
        </Button>
      </span>
      <span style={{marginRight: "10px"}}>
          Page{' '}
        <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
      </span>
      <span style={{marginRight: "20px"}}>
          Go to page:{' '}
        <input
          type="number"
          defaultValue={pageIndex + 1}
          onChange={e => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page)
          }}
          style={{ width: '100px' }}
        />
      </span>
      <select
        value={pageSize}
        onChange={e => {
          setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 30, 40, 50].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
      </>);
  };
  
  /**** Component for listing foods in a pageable, filterable table ***/
  const FoodsTable = () => {
    return (
      <div>
        <Table {...getTableProps()}>
          <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}
                  <span style={{paddingLeft: "10px"}}>{column.canFilter ? column.render('Filter') : null}</span>
                </th>
              ))}
            </tr>
          ))}
          </thead>
          <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
          </tbody>
        </Table>
        <TablePageNavigation/>
      </div>
    )
  };
  
  return (
    <div className="container" style={{paddingBottom: "20px"}}>
      <h1>Foods</h1>
      {
        data ? <FoodsTable/> : <div>No foods</div>
      }
    </div>
  )
};

export default Foods;
