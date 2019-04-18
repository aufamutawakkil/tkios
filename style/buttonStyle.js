import {StyleSheet} from "react-native";
import Colors from "../constants/Colors";

export const buttonStyle = StyleSheet.create({
    base : {
        backgroundColor:Colors.baseColor,
        borderRadius:5,
        padding:10,
        color:'#fff',
        textTransform:'uppercase',
        fontSize:14,
        margin:5
    },
    gray : {
        backgroundColor:"#bbb"
    }
});