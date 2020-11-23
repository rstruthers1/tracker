import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {createMuiTheme, lighten, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { ThemeProvider } from '@material-ui/styles';

import { useHistory } from 'react-router-dom';

import queryString from "query-string";

import FoodService from "../services/food.service";
import FoodDiaryService from "../services/food.diary.service"
import {dateOptions, addFoodDiary} from "../utils/tracker.constants";
import FoodDiaryUtils from '../utils/food.diary.utils'


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00548F',
    },
    secondary: {
      main: '#00548F',
    },
  },
});


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'description', numeric: false, disablePadding: true, label: 'Description' },
  { id: 'servings', numeric: true, disablePadding: false, label: 'Servings' },
  { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },

];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/*<Checkbox*/}
          {/*  indeterminate={numSelected > 0 && numSelected < rowCount}*/}
          {/*  checked={rowCount > 0 && numSelected === rowCount}*/}
          {/*  onChange={onSelectAllClick}*/}
          {/*  inputProps={{ 'aria-label': 'select all foods' }}*/}
          {/*/>*/}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.primary.main,
        backgroundColor: lighten(theme.palette.primary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.primary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography component="div">
          Search: <input
          type="text"
          value={props.filterStr}
          onChange={props.handleFilterChange}
                />
        </Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {

  },
  paper: {
    marginBottom: theme.spacing(2),
  },
  table: {

  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const AddFoodToDiary = (props) => {

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('description');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = useState({foods: [], isFetching: false, error: ''});
  const [filterStr, setFilterStr] = React.useState('');
  const [filtered, setFiltered] = React.useState([]);
  const [servings, setServings] = React.useState([]);

  const parsed = queryString.parse(props.history.location.search);
  
  let date = FoodDiaryUtils.parseDate(parsed.date);
  let meal = parsed.meal;

  const classes = useStyles();
  const history = useHistory();


  useEffect(() => {
    setData({foods: data.foods, isFetching: true, error: ''});
    setFiltered(getFoodsMatchingDescription(data.foods, filterStr));

    FoodService.getAllFoods().then(
      (response) => {
        setData({foods: response.data, isFetching: false, error: ''});
        setFiltered(getFoodsMatchingDescription(response.data, filterStr));
        console.log("Got data from server! " + JSON.stringify(data.isFetching));

      },
      (error) => {
        setData({foods: data.foods, isFetching: false, error: error.toString()});
        setFiltered(getFoodsMatchingDescription(data.foods, filterStr));

      }
    );
  }, []);

  const onSubmit = event => {
    console.log(JSON.stringify(selected));
    if (selected.length > addFoodDiary.MAX_ITEMS_SUBMIT_AT_ONE_TIME) {
      alert(`Please select ${addFoodDiary.MAX_ITEMS_SUBMIT_AT_ONE_TIME} or fewer items to add.`);
      return;
    }
    if (selected.length === 0) {
      history.push(`/food`)
    }
    else {
      const foodsToAdd = [];
      selected.forEach(i => {
        foodsToAdd.push(
            {
              foodId: i,
              servings: servingsValue(i),
              meal: parsed.meal,
              date: parsed.date
            });
      });
      let foodDiaryData = {
        foodDiaryData: foodsToAdd
      };
      FoodDiaryService.addFoodsToDiary(foodDiaryData).then(
        (response) => {
          console.log("Posted successfully, response is: " + JSON.stringify(response.data));
          history.push(`/food`)
        },
        (error) => {
          alert(JSON.stringify(error));
        }
      )
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.foods.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    console.log("selectedIndex: " + selectedIndex);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    console.log("newSelected: " + JSON.stringify(newSelected));
    setSelected(newSelected);
  };

  const handleServingsChanged = (event, id) => {
    console.log("handleServingsChanged, food id: " + id);
    setServingsValue(id, event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const servingsValue = id => {
    for (let i = 0; i < servings.length; i++) {
      let serving = servings[i];
      if (serving.id === id) {
        return serving.value;
      }
    }
    return "1";
  };

  const setServingsValue = (id, value) => {
    let newServings = [];
    let foundServing = false;

    servings.forEach(serving => {
      if (serving.id === id) {
        serving.value = value;
        foundServing = true;
      }
      newServings.push(serving);
    });

    if (!foundServing) {
      newServings.push({
        id: id,
        value: value
      })
    }

    setServings(newServings);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filtered.length - page * rowsPerPage);

  const getFoodsMatchingDescription = (items, partialDescription) => {
    let matchingItems = [];
    //console.log("getMatchingItems from: " + JSON.stringify(items));
    if (!items) {
      return matchingItems;
    }
    items.forEach(food => {
      if (food.description.toLowerCase().includes(partialDescription.toLowerCase())) {
        food.servings = 1;
        matchingItems.push(food);
      }
    });
    return matchingItems;
  };

  const handleFilterChange = e => {
    console.log(e.target.value);
    setFilterStr(e.target.value);
    let viewableFoods = getFoodsMatchingDescription (data.foods, e.target.value);
    setFiltered(viewableFoods);
    //console.log("filtered: " + JSON.stringify(filtered));
  };

  const handleServingsFocus = (event) => event.target.select();

  return(
    <div className="container">
      <div style={{paddingBottom: "10px"}}>
      <div style={{paddingBottom: "10px", fontWeight: "bold"}}>Add Food to {meal}: {date.toLocaleDateString('en-us', dateOptions)}</div>
      <div>
        {data.isFetching && <div>Loading...</div>}
        {data.error && <div>{data.error}</div>}
      </div>
        <div className={classes.root}>
          <ThemeProvider theme={theme}>
          <Paper className={classes.paper}>
            <EnhancedTableToolbar numSelected={selected.length}
                                  filterStr={filterStr}
                                  handleFilterChange={handleFilterChange}/>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={filtered.length}
                />
                <TableBody>
                  {stableSort(filtered, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover

                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}

                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ 'aria-labelledby': labelId }}
                              onClick={(event) => handleClick(event, row.id)}
                              key={row.id}
                              selected={isItemSelected}
                            />
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row" padding="none">
                            {row.description + ' - ' + row.servingSize}
                          </TableCell>
                          <TableCell align="right">
                              <input
                              type="text"
                              id={row.id}
                              style={{textAlign: "right", width: '50px'}}
                              value={servingsValue(row.id)}
                              onChange={event => handleServingsChanged(event, row.id)}
                              onFocus={event => handleServingsFocus(event)}
                            />

                          </TableCell>
                          <TableCell align="right">{row.calories}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filtered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
          </ThemeProvider>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Compact Table"
          />
        </div>
      </div>
      <div className="form-group">
        <div className="col-sm-4">
          <button type="submit"  style={{backgroundColor: '#00548F'}} className="btn btn-primary btn-block" onClick={event => onSubmit(event)}>Add Checked</button>
        </div>
      </div>
    </div>
  );
};

export default AddFoodToDiary;
