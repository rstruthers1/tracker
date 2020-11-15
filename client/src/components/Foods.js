import React, {useEffect, useState} from "react";
import { useTable, usePagination, useFilters } from 'react-table';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

import FoodService from "../services/food.service";

const Foods = (props) => {

  const [foods, setFoods] = useState([]);

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
    };
    return rows;
  };

  

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
            disableFilters: true
          },
          {
            Header: 'Calories',
            accessor: 'calories',
            disableFilters: true
          },
     
    ],
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: TextFilter,
    }),
    []
  )



  const data = React.useMemo(() =>
      populateTableRows(foods),
    [foods]
  );

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
  } = useTable({ columns, data, defaultColumn, initialState: { pageIndex: 0 }, }, useFilters, usePagination)


  function TextFilter({
                        column: { filterValue, preFilteredRows, setFilter },
                      }) {
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
  }
  
  return (
    <div className="container" style={{paddingBottom: "50px"}}>
      <h1>Foods</h1>
      {
        data ? (
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
                prepareRow(row)
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
            <span style={{paddingRight: "10px"}}>
              <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {'<<'}
              </Button>{' '}
              <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                {'<'}
              </Button>{' '}
              <Button onClick={() => nextPage()} disabled={!canNextPage}>
                {'>'}
              </Button>{' '}
              <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {'>>'}
              </Button>{' '}
            </span>
              <span style={{paddingRight: "10px"}}>
          Page{' '}
                <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
              <span style={{paddingRight: "20px"}}>
          Go to page:{' '}
                <input
                  type="number"
                  defaultValue={pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
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
            
          </div>
          ) :
          (
            <div>No foods</div>
          )
      }
    </div>
  )
};

export default Foods;
