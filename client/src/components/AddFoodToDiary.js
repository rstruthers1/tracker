import React, { useState, useEffect } from "react";
import { useForm} from "react-hook-form";
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import queryString from "query-string";
import FoodService from "../services/food.service";
import { useHistory } from 'react-router-dom';


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#00548F',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


const AddFoodToDiary = (props) => {
  const history = useHistory();
  const { register, handleSubmit} = useForm();
  console.log(JSON.stringify(props));
  console.log(props.history.location.search);
  const parsed = queryString.parse(props.history.location.search);
  console.log(parsed);
  let date = new Date(parsed.date);
  console.log("date: " + date);

  const [foods, setFoods] = useState("");
  let loadError = null;

  useEffect(() => {
    FoodService.getAllFoods().then(
      (response) => {
        console.log(JSON.stringify(response.data));
        setFoods(response.data);

      },
      (error) => {

        alert(error.toString())
      }
    );
  }, []);

  const onSubmit = data => {
    console.log(JSON.stringify(data));
    console.log(Object.keys(data));
    let foodsToAdd = [];
    Object.keys(data).forEach(key => {
      console.log("key: " + key);
      console.log("value: " + data[key]);
      if (data[key]) {
        foodsToAdd.push(parseInt(key))
      }
    });

    if (foodsToAdd.length > 0) {
      const foodDiaryData = {
        foodIds: foodsToAdd,
        meal: parsed.meal,
        foodDiaryDate: parsed.date
      };
      FoodService.addFoodsToDiary(foodDiaryData).then(
        (response) => {
          console.log("Posted successfully, response is: " + JSON.stringify(response.data));
          history.push(`/food`)
        },
        (error) => {
          console.log(JSON.stringify(error));
          loadError = JSON.stringify(error);
        }
      )
    }
  };

 return (
   <div className="container">
     <h1>Add Food To Diary: {parsed.meal}</h1>
     <div>Date: {date.toLocaleDateString('en-us')}</div>
     <form onSubmit={handleSubmit(onSubmit)}>
     <Table component={Paper} style={{width: "600px"}}>
       <TableHead>
         <TableRow>
           <TableCell style={{fontSize: "8"}}>
             <div className="form-group">
               <div className="col-sm-6">
               <button type="submit"  className="btn btn-primary btn-block">Add Checked</button>
               </div>
             </div>
           </TableCell>

           <StyledTableCell align="right">Calories</StyledTableCell>

         </TableRow>
       </TableHead>
       <TableBody>
       {foods ? (

         foods.map((row) =>
           <TableRow key={row.id}>
             <TableCell>

               <input name={row.id} type="checkbox" autoComplete="off" ref={register}/>
               <span style={{paddingLeft: "10px"}}>{row.description}</span>

             </TableCell>
             <TableCell align="right">{row.calories}</TableCell>

           </TableRow>
         )): (loadError? <TableRow><TableCell>{loadError}</TableCell></TableRow> :
         <TableRow><TableCell>Loading...</TableCell></TableRow>)}

       </TableBody>
     </Table>
     </form>
   </div>
 )
};

export default AddFoodToDiary;
