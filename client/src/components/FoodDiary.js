import React, {useEffect, useState} from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import FoodDiaryService from "../services/food.diary.service"
import DiaryMeal from './DiaryMeal';
import FoodDiaryUtils from '../utils/food.diary.utils'
import Styles from './Styles';
import FoodHeaderTableCell from "./FoodHeaderTableCell";
import {mealTypes, cellWidths, dateOptions} from "../utils/tracker.constants";
import FoodDiaryDivider from "./FoodDiaryDivider";
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import IconButton from "@material-ui/core/IconButton";
import useGlobal from "../store";

const FoodDiary = (props) => {

  const [globalState, globalActions] = useGlobal();
  const [breakfastItems, setBreakfastItems] = useState("");
  const [lunchItems, setLunchItems] = useState("");
  const [dinnerItems, setDinnerItems] = useState("");
  const [snackItems, setSnackItems] = useState("");
  const [open, setOpen] = useState(false);


  const classes = Styles.useStyles();

  useEffect(() => {
    fetchFoodDiaryItems(globalState.foodDiaryDate);
  }, [globalState.foodDiaryDate]);

  const fetchFoodDiaryItems = date => {
    let theDateString = FoodDiaryUtils.dateToQueryParamValue(date);

    FoodDiaryService.getFoodDiary(theDateString).then(
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
  };

  const goPreviousDay = () => {
    globalActions.decrementFoodDiaryDate();
    fetchFoodDiaryItems(globalState.foodDiaryDate);
  };

  const goNextDay = () => {
    globalActions.incrementFoodDiaryDate();
    fetchFoodDiaryItems(globalState.foodDiaryDate);
  };

  const deleteFoodItem = (id) => {
    console.log("Delete food item with id " + id);
    FoodDiaryService.deleteFoodItemFromDiary(id).then(
      (response) => {
        console.log(JSON.stringify(response.data));
        fetchFoodDiaryItems(globalState.foodDiaryDate);
      },
      (error) => {
        alert(error.toString());
      }
    );
  };

  const updateFoodDiaryItem = foodDiaryItem => {
    setOpen(true);
    FoodDiaryService.updateFoodDiaryItem(foodDiaryItem).then(
      (response) => {
        console.log(JSON.stringify(response.data));
        fetchFoodDiaryItems(globalState.foodDiaryDate);
        setOpen(false);
      },
      (error) => {
        alert(error.toString());
        setOpen(false);
      }
    );
  };


  console.log("globalState.foodDiaryDate: " + globalState.foodDiaryDate);
  return (

    <div className="container">
      <div>
        <span>Food Diary:</span>
        <IconButton aria-label="previous day" className={classes.iconButton} onClick={() => goPreviousDay()}>
        <ArrowLeftIcon fontSize="large"/>
        </IconButton>
        <span>{globalState.foodDiaryDate.toLocaleDateString('en-us', dateOptions)}</span>
        <IconButton aria-label="previous day" className={classes.iconButton} onClick={() => goNextDay()}>
        <ArrowRightIcon fontSize="large"/>
        </IconButton>
      </div>
      <DiaryMeal
        foodItems={breakfastItems}
        meal={mealTypes.BREAKFAST}
        date={globalState.foodDiaryDate}
        deleteFoodItemAction={deleteFoodItem}
        updateFoodItem={updateFoodDiaryItem}
      />
      <FoodDiaryDivider/>
      <DiaryMeal
        foodItems={lunchItems}
        meal={mealTypes.LUNCH}
        date={globalState.foodDiaryDate}
        deleteFoodItemAction={deleteFoodItem}
        updateFoodItem={updateFoodDiaryItem}
      />
      <FoodDiaryDivider/>
      <DiaryMeal
        foodItems={dinnerItems}
         meal={mealTypes.DINNER}
         date={globalState.foodDiaryDate}
         deleteFoodItemAction={deleteFoodItem}
         updateFoodItem={updateFoodDiaryItem}
      />
      <FoodDiaryDivider/>
      <DiaryMeal
        foodItems={snackItems}
        meal={mealTypes.SNACKS}
        date={globalState.foodDiaryDate}
        deleteFoodItemAction={deleteFoodItem}
        updateFoodItem={updateFoodDiaryItem}
      />
      <FoodDiaryDivider/>
      <TableContainer component={Paper} >
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <FoodHeaderTableCell className={classes.tableCell} style={{width: cellWidths.DESCRIPTION}}> Totals</FoodHeaderTableCell>
              <FoodHeaderTableCell align="right" className={classes.tableCell} style={{width: cellWidths.SERVINGS}}></FoodHeaderTableCell>
              <FoodHeaderTableCell align="right" className={classes.tableCell} style={{width: cellWidths.CALORIES}}>Calories</FoodHeaderTableCell>
              <FoodHeaderTableCell align="right" className={classes.tableCell}></FoodHeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              <TableRow>
                <TableCell className={classes.tableCell}></TableCell>
                <TableCell className={classes.tableCell}></TableCell>
                <TableCell align="right" className={classes.tableCell}>{
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
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
};

export default FoodDiary;
