import React, {useEffect, useState} from "react";
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FoodService from "../services/food.service";
import DiaryMeal from './DiaryMeal';

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
  h2: {
    fontSize: '1rem'
  },
  tableCell: {
    padding: 6
  }
});


let date = new Date();

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




const FoodDiary = (props) => {

  const [breakfastItems, setBreakfastItems] = useState("");
  const [lunchItems, setLunchItems] = useState("");
  const [dinnerItems, setDinnerItems] = useState("");
  const [snackItems, setSnackItems] = useState("");

  const classes = useStyles();
  console.log(date);
  let dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  console.log(dateString);

  function getMealItems(items, meal) {
    let mealItems = [];
    if (!items) {
      return mealItems;
    }
    items.forEach(item => {
      if (item.meal === meal) {
        mealItems.push(item);
      }
    });
    return mealItems;
  }

  function fetchFoodDiaryItems(theDateString) {
    FoodService.getFoodDiary(theDateString).then(
      (response) => {
        console.log(JSON.stringify(response.data));

        setBreakfastItems(getMealItems(response.data, "Breakfast"));
        setLunchItems(getMealItems(response.data, "Lunch"));
        setDinnerItems(getMealItems(response.data, "Dinner"));
        setSnackItems(getMealItems(response.data, "Snacks"));
      },
      (error) => {
        alert(error.toString());
      }
    );
  }

  useEffect(() => {
    fetchFoodDiaryItems(dateString);
  }, [dateString]);

  const deleteFoodItem = (id) => {
    console.log("Delete food item with id " + id);
    FoodService.deleteFoodItemFromDiary(id).then(
      (response) => {
        console.log(JSON.stringify(response.data));
        fetchFoodDiaryItems(dateString);
      },
      (error) => {
        alert(error.toString());
      }
    );
  };

  return (

    <div className="container">

      <h1>Food Diary</h1>
      <div>Date: {date.toLocaleDateString('en-us')}</div>
      <h2 className={classes.h2}>Breakfast</h2>
      <DiaryMeal foodItems={breakfastItems} meal="Breakfast" dateString={dateString} deleteFoodItemAction={deleteFoodItem}/>
      <div style={{paddingBottom: "10px"}}></div>
      <h2 className={classes.h2}>Lunch</h2>
      <DiaryMeal foodItems={lunchItems} meal="Lunch" dateString={dateString} deleteFoodItemAction={deleteFoodItem}/>
      <div style={{paddingBottom: "10px"}}></div>
      <h2 className={classes.h2}>Dinner</h2>
      <DiaryMeal foodItems={dinnerItems} meal="Dinner" dateString={dateString} deleteFoodItemAction={deleteFoodItem}/>
      <div style={{paddingBottom: "10px"}}></div>
      <h2 className={classes.h2}>Snacks</h2>
      <DiaryMeal foodItems={snackItems} meal="Snacks" dateString={dateString} deleteFoodItemAction={deleteFoodItem}/>
      <div style={{paddingBottom: "10px"}}></div>
      <TableContainer component={Paper} style={{width: 600}}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell style={{width: 400}} className={classes.tableCell}>Totals</StyledTableCell>
              <StyledTableCell align="right" style={{width: 100}} className={classes.tableCell}>Calories</StyledTableCell>
              <StyledTableCell align="right" className={classes.tableCell}></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              <TableRow>
                <TableCell className={classes.tableCell}></TableCell>
                <TableCell align="right" className={classes.tableCell} >{
                  sumCalories(breakfastItems) +
                    sumCalories(lunchItems) +
                    sumCalories(dinnerItems) +
                    sumCalories(snackItems)
                }</TableCell>
                <TableCell className={classes.tableCell}></TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{paddingBottom: "40px"}}></div>
    </div>

  )
};

export default FoodDiary;
