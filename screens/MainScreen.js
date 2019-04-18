import React from "react";
import {View,Text,StyleSheet} from "react-native";
import MainRouter from '../navigation/MainRouter';

export default class MainScreen extends React.Component{
    static navigationOptions = {
        header : null
    };

    render(){
        return (
            <View style={styles.container}>
                <MainRouter/>
            </View> 
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });
  