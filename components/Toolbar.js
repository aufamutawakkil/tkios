import React from "react";
import { Icon } from "expo";
import {StyleSheet,View,Text} from 'react-native';
import Colors from "../constants/Colors";

class Toolbar extends React.Component{
    render(){
        
        _back = () =>{
            if( this.props.backStack == "goBack" )
                this.props.navigation.goBack();
            else
                this.props.navigation.navigate(this.props.backStack);
        }

        return(
            <View style={style.container}>
                <View style={style.statusBar}></View>
                <View style={style.icon}>
                    <Icon.Ionicons
                        name={this.props.icon}
                        size={28}
                        color="black"
                        onPress={()=>_back.bind(this)}
                    />
                </View>
                <Text fontWeight="bold" style={style.title}>{this.props.title}</Text>
            </View>
        );
    }
}

const style = StyleSheet.create({
    container : {
        backgroundColor:"#f9f9f9",
        height:80
    },
    title : {
        left:40,
        fontSize:18,
        color:'black',
        position:"absolute",
        top:45
    },
    icon : {
        marginTop:15,
        marginLeft:15
    },
    statusBar:{
        backgroundColor:"#f2f2f2",
        height:25
    }
});

export default Toolbar;