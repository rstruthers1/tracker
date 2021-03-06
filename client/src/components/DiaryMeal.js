import React, {useState} from "react";
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
import Tooltip from '@material-ui/core/Tooltip'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import FoodHeaderTableCell from "./FoodHeaderTableCell";
import FoodDiaryUtils from '../utils/food.diary.utils';
import Styles from './Styles';
import {cellWidths} from "../utils/tracker.constants";
import EditFoodDiaryEntry from "./EditFoodDiaryEntry";


const DiaryMeal = ({foodItems, meal, date, deleteFoodItemAction, updateFoodItem}) => {
  const classes = Styles.useStyles();

  const [show, setShow] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const handleClose = () => setShow(false);

  function editEntry(event, foodDiaryItem) {
    setEditRow({...foodDiaryItem, servings: FoodDiaryUtils.formatServings(foodDiaryItem.servings)});
    setShow(true);
  }

  const editRowChanged = (event, whichItem) => {
    let newEditRow = {
      ...editRow,
    };
    newEditRow[whichItem] = event.target.value;
    console.log("newEditRow: " + JSON.stringify(newEditRow));
    setEditRow(newEditRow);
  };

  const saveFoodItemChanges = foodDiaryItem => {
    setShow(false);
    updateFoodItem(foodDiaryItem);
  };


  return (
    <TableContainer component={Paper} >
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <FoodHeaderTableCell style={{width: cellWidths.DESCRIPTION}} className={classes.tableCell}>{meal}</FoodHeaderTableCell>
            <FoodHeaderTableCell align="right" style={{width: cellWidths.SERVINGS}} className={classes.tableCell}>Servings</FoodHeaderTableCell>
            <FoodHeaderTableCell align="right" style={{width: cellWidths.CALORIES}} className={classes.tableCell}>Calories</FoodHeaderTableCell>
            <FoodHeaderTableCell align="right" className={classes.tableCell}></FoodHeaderTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {foodItems ? (foodItems.map((row) => (
            <TableRow key={row.id}>
              <TableCell className={classes.descriptionCell}>
                <Tooltip title="Edit entry">
                <span onClick={event => {editEntry(event, row)}}>
                {row.description + ' - ' + row.servingSize}
                </span>
                </Tooltip>
              </TableCell>
              <TableCell  align="right" className={classes.tableCell}>{FoodDiaryUtils.formatServings(row.servings)}</TableCell>
              <TableCell   align="right" className={classes.tableCell}>{row.calories * row.servings}</TableCell>
              <TableCell align="center" className={classes.tableCell}>
                <Tooltip title="Delete entry">
                <IconButton
                  aria-label="delete"
                  className={classes.iconButton}
                  onClick={(event) => {deleteFoodItemAction(event.currentTarget.id)}}
                  id={row.id}>
                <DeleteIcon/>
              </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))) : (<TableRow><TableCell className={classes.tableCell}>Loading...</TableCell></TableRow>)}
          <TableRow>
            <TableCell align="left" className={classes.tableCell}>
              <Link style={{fontWeight: 'bold'}}
                    to={`/addFoodToDiary?date=${FoodDiaryUtils.dateToQueryParamValue(date)}&meal=${meal}`}>
                Add Food
              </Link>
            </TableCell>
            <TableCell></TableCell>
            <TableCell align="right" className={classes.tableCell}>{FoodDiaryUtils.sumCalories(foodItems)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editRow && editRow.description}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditFoodDiaryEntry foodDiaryItem={editRow} foodItemChanged={editRowChanged}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={event => saveFoodItemChanges(editRow)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </TableContainer>

  )

};

export default DiaryMeal;
