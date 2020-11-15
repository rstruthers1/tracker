import React, {useEffect, useState} from "react";
import {useTable, usePagination, useFilters} from 'react-table';

import Paper from "@material-ui/core/Paper";
import TableContainer from '@material-ui/core/TableContainer';
import Table from "@material-ui/core/Table";
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {makeStyles, useTheme} from "@material-ui/core/styles";

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

  /*** Text Filter ***/
  const TextFilter = ({
                        column: {filterValue, preFilteredRows, setFilter},
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

  const FoodsTable = () => {
    /**** Initialize react-table ****/
    const {
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      page, 
      gotoPage,
      setPageSize,
      state: {pageIndex, pageSize}
    } = useTable({columns, data, defaultColumn, initialState: {pageIndex: 0},}, useFilters, usePagination);

    const handleChangePage = (event, newPage) => {
      gotoPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
      setPageSize(parseInt(event.target.value, 10));
    };

    const useStyles1 = makeStyles((theme) => ({
      root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
      },
    }));

    function TablePaginationActions(props) {
      const classes = useStyles1();
      const theme = useTheme();
      const { count, page, rowsPerPage, onChangePage } = props;

      const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
      };

      const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
      };

      const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
      };

      const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
      };

      return (
        <div className={classes.root}>
          <IconButton
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="first page"
          >
            {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
          </IconButton>
          <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </IconButton>
          <IconButton
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="next page"
          >
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </IconButton>
          <IconButton
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="last page"
          >
            {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
          </IconButton>
        </div>
      );
    }

    return (
      <Paper>
        <TableContainer>
          <Table size='medium'>
          <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps()}>{column.render('Header')}
                  <span style={{paddingLeft: "10px"}}>{column.canFilter ? column.render('Filter') : null}</span>
                </TableCell>
              ))}
            </TableRow>
          ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                })}
              </TableRow>
            )
          })}
          </TableBody>
        </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={pageSize}
          page={pageIndex}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onChangePage={handleChangePage}
          ActionsComponent={TablePaginationActions}
        />
      </Paper>
    )
  };

  return (
    <div className="container" style={{paddingBottom: "50px"}}>
      <h1>Foods</h1>
      {data ? <FoodsTable/> : <div>No foods</div>}
    </div>
  )
};

export default Foods;
