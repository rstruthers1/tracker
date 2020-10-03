import React, {useState} from "react";

const EditFoodDiaryEntry = ({ foodItemChanged, foodDiaryItem }) => {
  const handleFocus = event => {
    event.target.select();
  };

  return (
    <div>
      <div style={{fontWeight: "bold"}}>Meal: {foodDiaryItem.meal}</div>
      <form>
        <div className="form-group">
          <label htmlFor="name">Servings:</label>
          <input
           style={{textAlign: "right"}}
           className="form-control"
           id="name"
           value={foodDiaryItem.servings}
           onChange={event => foodItemChanged(event, 'servings')}
           onFocus = {event => handleFocus(event)}
          />
        </div>

      </form>

    </div>
  )
};

export default EditFoodDiaryEntry;
