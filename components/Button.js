import React from "react";
import {TouchableOpacity,Text,StyleSheet} from "react-native";
import Loading from "../components/Loading";
import renderif from "render-if";

export default class Button extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading:false
        }
    }

    setLoading = (flag) => {
        this.setState({isLoading:flag})
    }

    render(){
        return (
            <TouchableOpacity style={[{
                    flex:1,flexDirection:"column",
                    backgroundColor:this.props.backgroundColor
                    },styles.btn]}
                    onPress={this.props.onPress}
                    >
                    {
                        renderif(this.state.isLoading)(
                            <Loading color="#fff" />
                        )
                    }

                    {
                        renderif(!this.state.isLoading)(
                            <Text style={{
                                fontSize:15,fontWeight:"bold", justifyContent:"center",alignItems:'center',textAlign:"center",color:this.props.color
                                }}> {this.props.text} </Text>
                        )
                    }
                    
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    btn:{
        borderRadius:3,
        padding:16,
        margin:5
    }
});