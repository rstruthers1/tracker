import React from "react";
import {Link} from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FoodHeaderTableCell from "./FoodHeaderTableCell";
import FoodDiaryUtils from '../utils/food.diary.utils';
import Styles from './Styles';
import {cellWidths} from "../utils/tracker.constants";

const DiaryMeal = (props) => {
  const classes = Styles.useStyles();
  let foodItems = props.foodItems;
  let meal = props.meal;
  let dateString = props.dateString;
  let deleteFoodItemAction = props.deleteFoodItemAction;

  return (
    <TableContainer component={Paper} style={{width: 600}}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <FoodHeaderTableCell style={{width: cellWidths.DESCRIPTION}} className={classes.tableCell}>{meal}</FoodHeaderTableCell>
            <FoodHeaderTableCell align="right" style={{width: cellWidths.CALORIES}} className={classes.tableCell}>Calories</FoodHeaderTableCell>
            <FoodHeaderTableCell align="right" className={classes.tableCell}></FoodHeaderTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {foodItems ? (foodItems.map((row) => (
            <TableRow key={row.id}>
              <TableCell className={classes.tableCell}>
                {row.description}
              </TableCell>
              <TableCell align="right" className={classes.tableCell}>{row.calories}</TableCell>
              <TableCell align="center" className={classes.tableCell}>
                <IconButton
                  aria-label="delete"
                  className={classes.iconButton}
                  onClick={(event) => {deleteFoodItemAction(event.currentTarget.id)}}
                  id={row.id}>
                <DeleteIcon/>
              </IconButton>
              </TableCell>
            </TableRow>
          ))) : (<TableRow><TableCell className={classes.tableCell}>Loading...</TableCell></TableRow>)}
          <TableRow>
            <TableCell align="left" className={classes.tableCell}>
              <Link style={{fontWeight: 'bold'}}
                    to={`/addFoodToDiary?date=${dateString}&meal=${meal}`}>
                Add Food
              </Link>
            </TableCell>

            <TableCell align="right" className={classes.tableCell}>{FoodDiaryUtils.sumCalories(foodItems)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )

};

export default DiaryMeal;
