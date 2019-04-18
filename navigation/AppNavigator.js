import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import TabNavigatorFavorite from './TabNavigatorFavorite';
import Router from './Router';



const AppNavigator =  createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
  Router:Router
},{
  initialRouteName:"Main"
});

 
export default createAppContainer(AppNavigator);