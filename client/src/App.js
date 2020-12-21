import React, { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";

import useSWR, { SWRConfig } from 'swr'

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import FoodDiary from "./components/FoodDiary";
import AddNewFood from "./components/AddNewFood";
import AddFoodToDiary from "./components/AddFoodToDiary"
import AddRecipe from "./components/AddRecipe";
import Recipes from "./components/Recipes";
import WakeUp from './components/WakeUp';
import WakeUpService from './services/wakeup.service';
import Foods from "./components/Foods";
import EditableFoodGrouping from "./components/EditableFoodGrouping";




const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [wakingUp, setWakingUp] = useState(true);
  const [seconds, setSeconds] = useState(5);
  const [isActive, setIsActive] = useState(true);
  
  const wakeupPoll = () => {
    console.log("Calling wakeup");
    WakeUpService.isServerAwake().then(
      (response) => {

        setWakingUp(false);
        setIsActive(false);
      },
      (error) => {

      }
    );
  };
  
  useEffect(() => {
    
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    
    

    let interval = null;
    if (isActive) {
      wakeupPoll();
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const logOut = () => {
    AuthService.logout();
  };

  return (wakingUp ? (<WakeUp/>) :(
   
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          tracker
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li>
          {currentUser && (
            <li className="nav-item">
              <Link to={"/Food"} className="nav-link">
                Food Diary
              </Link>
            </li>
          )}
          {currentUser && (
            <li className="nav-item">
              <Link to={"/addNewFood"} className="nav-link">
                New Food
              </Link>
            </li>
          )}
          {currentUser && (
            <li className="nav-item">
              <Link to={"/foods"} className="nav-link">
                Foods
              </Link>
            </li>
          )}
          {currentUser && (
            <li className="nav-item">
              <Link to={"/addRecipe"} className="nav-link">
                Add Recipe
              </Link>
            </li>
          )}
          {currentUser && (
            <li className="nav-item">
              <Link to={"/recipes"} className="nav-link">
                Recipes
              </Link>
            </li>
          )}
          {currentUser && (
            <li className="nav-item">
              <Link to={"/efg"} className="nav-link">
                EFG
              </Link>
            </li>
          )}
        </div>
        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">

        <Switch>
          <Route exact path={["/", "/home"]} component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/food" component={FoodDiary} />
          <Route path="/addNewFood" component={AddNewFood} />
          <Route path="/addFoodToDiary" component={AddFoodToDiary}/>
          <Route path="/addRecipe" component={AddRecipe}/>
          <Route path="/recipes" component={Recipes}/>
          <Route path="/foods" component={Foods}/>
          <Route path="/efg" component={EditableFoodGrouping}/>
        </Switch>
      </div>
    </div>
    
  ));
};

export default App;
