import React, {useEffect, useState} from "react";
import FoodDiaryService from "../services/food.diary.service";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { Checkbox, Input } from "@material-ui/core";
import { Input as AntdInput } from "antd";


const FoodDiary = () => {



  const { control, handleSubmit } = useForm();

  const onSubmit = data => {
    alert(JSON.stringify(data));
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>First Name</label>
      <Controller
        as={Input}
        name="firstName"
        control={control}
        defaultValue=""
        className="materialUIInput"
      />
      <label>First Name</label>
      <Controller
        as={AntdInput}
        name="lastName"
        control={control}
        defaultValue=""
      />
      <label>Ice Cream Preference</label>
      <Controller
        name="iceCreamType"
        as={Select}
        options={[
          { value: "chocolate", label: "Chocolate" },
          { value: "strawberry", label: "Strawberry" },
          { value: "vanilla", label: "Vanilla" }
        ]}
        control={control}
        defaultValue=""
      />
      <Controller
        name="Checkbox"
        control={control}
        render={props => (
          <Checkbox
            onChange={e => props.onChange(e.target.checked)}
            checked={props.value}
          />
        )}
      />

      <input type="submit" />
    </form>
  );
};

export default FoodDiary;
