import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import ProdukFavorite from '../screens/favorite/ProdukFavorite';
import TokoFavorite from '../screens/favorite/TokoFavorite';

const ProdukStack = createStackNavigator({
  Main: ProdukFavorite,
});
ProdukStack.navigationOptions = {
  tabBarLabel: 'Produk'
};
//---------------------

//favorite
const TokoStack = createStackNavigator({
  Toko: TokoFavorite,
});
TokoStack.navigationOptions = {
  tabBarLabel: 'Toko'
};
//---------------------




export default createAppContainer(createBottomTabNavigator({
    ProdukStack,
    TokoStack
}));
