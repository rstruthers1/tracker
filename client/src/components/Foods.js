import React, {useEffect, useState} from "react";
import FoodService from "../services/food.service";
import {cellWidths} from "../utils/tracker.constants";


const Foods = (props) => {

  const [foods, setFoods] = useState([]);

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
  
  
  return (
    <div className="container">
      <h1>Foods</h1>
      {
        foods ? (
            <table>
              <thead>
              <tr><th>Description</th><th>Serving Size</th><th>Calories</th></tr>
              </thead>
              <tbody>
              {
                foods.map((row) => (
                  <tr key={row.id}>
                    <td style={{width: cellWidths.DESCRIPTION}}>{row.description}</td>
                    <td style={{width: cellWidths.SERVING_SIZE}}>{row.servingSize}</td>
                    <td e={{width: cellWidths.CALORIES}}>{row.calories}</td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          ) :
          (
            <div>No foods</div>
          )
      }
    </div>
  )
};

export default Foods;
