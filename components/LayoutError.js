import React from "react";
import {TouchableOpacity,Text,StyleSheet} from "react-native";

export default class LayoutError extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View>
                <Text style={{fontWeight:"bold",fontSize:12,marginBottom:10,marginRight:30,marginLeft:30}} >Terdapat kesalahan, periksa koneksi internet Anda lalu klik tombol di bawah ini</Text>
                <TouchableOpacity style={styles.btn}
                    onPress={this.props.onPress}>
                        <Text style={{
                            fontSize:12,fontWeight:"bold", justifyContent:"center",alignItems:'center',textAlign:"center",color:"black"
                            }}> RETRY </Text>
                </TouchableOpacity>
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    btn:{
        width:140,
        paddingTop:10,
        paddingBottom:10,
        paddingRight:15,
        paddingLeft:15,
        backgroundColor:"red",
        borderRadius:5,
        alignItems:"center",
        alignSelf:"center"
    },
});