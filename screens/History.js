import React from "react";
import {View,Text} from "react-native";

export default class History extends React.Component{
    static navigationOptions = {
        title: 'Histori',
    };

    render(){
        return (
            <View>
                <Text> History </Text>
            </View>
        );
    }
}

