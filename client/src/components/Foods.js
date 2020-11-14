import React, {useEffect, useState} from "react";
import FoodService from "../services/food.service";


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
            <div>
              {
                foods.map((row) => (
                  <div key={row.id}>
                    <h2>{row.description}</h2>
                    
                  </div>
                ))
              }
            </div>
          ) :
          (
            <div>No foods</div>
          )
      }
    </div>
  )
};

export default Foods;
