import React, {useEffect, useState} from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FoodService from "../services/food.service";
import DiaryMeal from './DiaryMeal';
import FoodDiaryUtils from '../utils/food.diary.utils'
import Styles from './Styles';
import FoodHeaderTableCell from "./FoodHeaderTableCell";
import {mealTypes} from "../utils/tracker.constants";

let date = new Date();

const FoodDiary = (props) => {

  const [breakfastItems, setBreakfastItems] = useState("");
  const [lunchItems, setLunchItems] = useState("");
  const [dinnerItems, setDinnerItems] = useState("");
  const [snackItems, setSnackItems] = useState("");

  const classes = Styles.useStyles();
  let dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

  useEffect(() => {
    fetchFoodDiaryItems(dateString);
  }, [dateString]);

  const fetchFoodDiaryItems = theDateString => {
    FoodService.getFoodDiary(theDateString).then(
      (response) => {
        console.log(JSON.stringify(response.data));
        setBreakfastItems(FoodDiaryUtils.getMealItems(response.data, mealTypes.BREAKFAST));
        setLunchItems(FoodDiaryUtils.getMealItems(response.data, mealTypes.LUNCH));
        setDinnerItems(FoodDiaryUtils.getMealItems(response.data, mealTypes.DINNER));
        setSnackItems(FoodDiaryUtils.getMealItems(response.data, mealTypes.SNACKS));
      },
      (error) => {
        alert(error.toString());
      }
    );
  ;}

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
      <h2 className={classes.h2}>{mealTypes.BREAKFAST}</h2>
      <DiaryMeal foodItems={breakfastItems} meal={mealTypes.BREAKFAST} dateString={dateString} deleteFoodItemAction={deleteFoodItem}/>
      <div style={{paddingBottom: "10px"}}></div>
      <h2 className={classes.h2}>{mealTypes.LUNCH}</h2>
      <DiaryMeal foodItems={lunchItems} meal={mealTypes.LUNCH} dateString={dateString} deleteFoodItemAction={deleteFoodItem}/>
      <div style={{paddingBottom: "10px"}}></div>
      <h2 className={classes.h2}>{mealTypes.DINNER}</h2>
      <DiaryMeal foodItems={dinnerItems} meal={mealTypes.DINNER} dateString={dateString} deleteFoodItemAction={deleteFoodItem}/>
      <div style={{paddingBottom: "10px"}}></div>
      <h2 className={classes.h2}>{mealTypes.SNACKS}</h2>
      <DiaryMeal foodItems={snackItems} meal={mealTypes.SNACKS} dateString={dateString} deleteFoodItemAction={deleteFoodItem}/>
      <div style={{paddingBottom: "10px"}}></div>
      <TableContainer component={Paper} style={{width: 600}}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <FoodHeaderTableCell className={classes.tableCell}>Totals</FoodHeaderTableCell>
              <FoodHeaderTableCell align="right" className={classes.tableCell}>Calories</FoodHeaderTableCell>
              <FoodHeaderTableCell align="right" className={classes.tableCell}></FoodHeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              <TableRow>
                <TableCell className={classes.tableCell}></TableCell>
                <TableCell align="right" className={classes.tableCell} >{
                  FoodDiaryUtils.sumCalories(breakfastItems) +
                  FoodDiaryUtils.sumCalories(lunchItems) +
                  FoodDiaryUtils.sumCalories(dinnerItems) +
                  FoodDiaryUtils.sumCalories(snackItems)
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
