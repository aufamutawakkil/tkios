import React from "react";
import {View,ActivityIndicator} from "react-native";

export default class Loading extends React.Component{
    componentWillMount(){
        if( this.props.color !== undefined && this.props.color !== null )
            this.props.color = "#a0a0a0";   
    }
   render(){
        return (
            <View style={{flex:1,flexDirection:"column"}}>
                <ActivityIndicator
                    style={{flex:1,justifyContent:"center",alignItems:"center"}}
                    size="small"
                    color={this.props.color}
                />
            </View>
        );
    }
}