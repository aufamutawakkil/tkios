import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import Favorite from '../screens/Favorite';
import Tanya from '../screens/Tanya';
import History from '../screens/History';
import Akun from '../screens/Akun';
import MainScreen from '../screens/MainScreen';


const MainStack = createStackNavigator({
  Main: MainScreen,
});

//mainmenu
MainStack.navigationOptions = {
  tabBarLabel: 'Belanja',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-cart' : 'md-cart'
      }
    />
  ),
};
//---------------------

//favorite
const FavoriteStack = createStackNavigator({
  Favorite: Favorite,
});


FavoriteStack.navigationOptions = {
  tabBarLabel: 'Favorite',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-star' : 'md-link'}
    />
  ),
};
//---------------------


//tanya
const TanyaStack = createStackNavigator({
  Tanya: Tanya,
});

TanyaStack.navigationOptions = {
  tabBarLabel: 'Tanya',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-chatboxes' : 'md-options'}
    />
  ),
};
//---------------------

//history
const HistoryStack = createStackNavigator({
  History: History,
});

HistoryStack.navigationOptions = {
  tabBarLabel: 'Histori',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-filing' : 'md-options'}
    />
  ),
};
//---------------------

//Akun
const AkunStack = createStackNavigator({
  Akun: Akun,
});

AkunStack.navigationOptions = {
  tabBarLabel: 'Akun',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  ),
};
//---------------------

export default createAppContainer(createBottomTabNavigator({
  MainStack,
  FavoriteStack,
  TanyaStack,
  HistoryStack,
  AkunStack
}));
