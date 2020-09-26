import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#00548F',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
  tableCell: {
    padding: 6
  }
})

const sumCalories = (items) => {
  if (!items) {
    return 0;
  }
  let sum = 0;
  items.forEach(item => {
    sum += item.calories;
  });
  return sum;
};

const deleteFoodItem = id => {
  console.log("deleteFoodItem placeholder")
};

const foodItems = [];


const DiaryMeal = (props) => {
  const classes = useStyles();
  console.log("DiaryMeal props: " + JSON.stringify(props))
  let foodItems = props.foodItems;
  let meal = props.meal;
  let dateString = props.dateString;
  let deleteFoodItemAction = props.deleteFoodItemAction;
  return (
    <TableContainer component={Paper} style={{width: 600}}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell style={{width: 400}} className={classes.tableCell}>Food</StyledTableCell>
            <StyledTableCell align="right" style={{width: 100}} className={classes.tableCell}>Calories</StyledTableCell>
            <StyledTableCell align="right" className={classes.tableCell}></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {foodItems ? (foodItems.map((row) => (
            <TableRow key={row.id}>
              <TableCell className={classes.tableCell}>
                {row.description}
              </TableCell>
              <TableCell align="right" className={classes.tableCell}>{row.calories}</TableCell>
              <TableCell align="center" className={classes.tableCell}><IconButton aria-label="delete" onClick={(event) => {
                deleteFoodItemAction(event.currentTarget.id)
              }} id={row.id}>
                <DeleteIcon/>
              </IconButton></TableCell>
            </TableRow>
          ))) : (<TableRow><TableCell>Loading...</TableCell></TableRow>)}
          <TableRow>
            <TableCell align="left" className={classes.tableCell}><Link style={{fontWeight: 'bold'}}
                                          to={`/addFoodToDiary?date=${dateString}&meal=${meal}`}>
              Add Food
            </Link></TableCell>

            <TableCell align="right" className={classes.tableCell}>{sumCalories(foodItems)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )

};

export default DiaryMeal;
