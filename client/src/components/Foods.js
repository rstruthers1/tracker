import React, {useEffect, useState} from "react";
import {useTable, usePagination, useFilters} from 'react-table';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from "@material-ui/core/Paper";
import TableContainer from '@material-ui/core/TableContainer';
import Table from "@material-ui/core/Table";
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';

/*** Icons ***/
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';

import {makeStyles, useTheme} from "@material-ui/core/styles";

import FoodDelete from "./FoodDelete";
import FoodEdit from "./FoodEdit";

import FoodService from "../services/food.service";

const Foods = (props) => {

  const [foods, setFoods] = useState([]);
  const [backdropOpen, setBackdropOpen] = useState(false);
  
  const [foodDeleteOpen, setFoodDeleteOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);
  
  const [fetchFoodTrigger, setFetchFoodTrigger] = useState(0);
  
  const [foodEditOpen, setFoodEditOpen] = useState(false);
  const [foodToEdit, setFoodToEdit] = useState(null);

  /**** Row data section ***/
  useEffect(() => {
    console.log("Fetching foods, fetchFoodTrigger = " + fetchFoodTrigger);
    FoodService.getAllFoods().then(
      (response) => {
        console.log("Got foods");
        setFoods(response.data);
      },
      (error) => {
        console.log("******ERROR: " + JSON.stringify(error.response));
        alert(JSON.stringify(error.response));
      });
  }, [fetchFoodTrigger]);
  
  const triggerFetchFoods = () => {
    setFetchFoodTrigger(fetchFoodTrigger + 1);
  };

  const populateTableRows = (theFoods) => {
    let rows = [];
    if (!theFoods) {
      return rows;
    }
    for (let i = 0; i < theFoods.length; i++) {
      let dataItem = theFoods[i];
      rows.push({
        description: dataItem.description,
        servingSize: dataItem.servingSize,
        calories: dataItem.calories,
        id: dataItem.id
      });
    }
    return rows;
  };

  // Need to use React.useMemo with react-table for performance reasons.
  const data = React.useMemo(() =>
      populateTableRows(foods), 
    [foods]
  );

  const closeFoodDeleteDialog = () => {
    setFoodDeleteOpen(false);
  };

  const openFoodDeleteDialog = (food) => {
    setFoodDeleteOpen(true);
    setFoodToDelete(food);
  };

  const handleCloseFoodDeleteOk = () => {
    closeFoodDeleteDialog();
    setBackdropOpen(true);
    
    FoodService.deleteFood(foodToDelete.id).then(
      (response) => {
        console.log(JSON.stringify(response.data));
        triggerFetchFoods();
        setBackdropOpen(false);
      },
      (error) => {
        setBackdropOpen(false);
        console.log(JSON.stringify(error.response));
        alert(`Error deleting food ${foodToDelete.description}.\n` + error.response.data.message);
      }
    );
  };

  const handleCloseFoodDeleteCancel = () => {
    closeFoodDeleteDialog();
  };
  
  const handleCloseFoodEditOk = (editedFood) => {
    setFoodEditOpen(false);
    alert(JSON.stringify(editedFood));
  };
  
  const handleCloseFoodEditCancel = () => {
    setFoodEditOpen(false);
   
  };

  const handleBackdropClose = () => {
    setBackdropOpen(false);
  };
  
  const handleDeleteFood = (foodIndex) => {
    console.log("Delete food: " + foodIndex + ", " + JSON.stringify(foods[foodIndex]));
    openFoodDeleteDialog(foods[foodIndex]);
  };

  const handleEditFood = (foodIndex) => {
    //alert("Edit food: " + foodIndex + ", " + JSON.stringify(foods[foodIndex]));
    setFoodToEdit(foods[foodIndex]);
    setFoodEditOpen(true);
  };

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
        disableFilters: true,
        Cell: row => <div style={{ textAlign: "right" }}>{row.value}</div>
      },
      {
        Header: 'Edit/Delete',
        disableFilters: true,
        Cell: row =>
          <div style={{ textAlign: "center" }}>
            <IconButton onClick={event=> {handleEditFood(row.row.index)}} style = {{padding: "0px", marginRight: "4px"}}>
              <EditIcon/>
            </IconButton>
            <IconButton onClick={event=> {handleDeleteFood(row.row.index)}} style = {{padding: "0px"}}>
              <DeleteForeverIcon/>
            </IconButton>
          </div>
      },
    ],
    [foods]
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
                {row.cells.map((cell, index) => {
                  return <TableCell {...cell.getCellProps()} >
                    {
                      cell.render('Cell')
                    }
                  </TableCell>
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

  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
      pointerEvents: 'none'
    },
  }));

  const classes = useStyles();
  
  return (
    <div className="container" style={{paddingBottom: "50px"}}>
      <h1>Foods</h1>
      {data ? <FoodsTable/> : <div>No foods</div>}
      <Backdrop className={classes.backdrop} open={backdropOpen} onClick={handleBackdropClose}>
        <CircularProgress color="inherit" />
        <h1>Wait, deleting food...</h1>
      </Backdrop>
      <FoodDelete
        open = {foodDeleteOpen}
        handleCloseOk = {handleCloseFoodDeleteOk}
        handleCloseCancel = {handleCloseFoodDeleteCancel}
        food = {foodToDelete}
      />
      <FoodEdit
        open = {foodEditOpen}
        handleCloseOk = {handleCloseFoodEditOk}
        handleCloseCancel = {handleCloseFoodEditCancel}
        food = {foodToEdit}
      />
    </div>
  )
};

export default Foods;
