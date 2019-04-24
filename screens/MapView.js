import React from "react";
import {Alert,View,Text,StyleSheet,Dimensions,WebView,Button} from "react-native";
import DB from "../db/DB";
import MOrder from "../db/MOrder";
import OrderHelper from "../helper/OrderHelper";

export default class MapView extends React.Component{
    static navigationOptions = {
        title: 'Lokasi Anda',
    };

    constructor(props){
        super(props);
		this.state = {
            dimens:Dimensions.get("window")
        }; 
        this.webView = false;
         
    }

    componentDidMount(){
       
    }

    _postMessage = (data) => {
        if( this.webView )
            this.webView.postMessage(data);
    }

    _onMessage = (e) => {
        var d = JSON.parse( e.nativeEvent.data );
        OrderHelper.infoOrder([{lat:d.lat},{lng:d.lng},{address:d.address}],()=>{
           this.props.navigation.navigate("OrderDetail")
        })
    }

    _onNext = () => {

    }

    render(){ 
        return (  
                <View style={{height:this.state.dimens.height,width:this.state.dimens.width}}>
                    
                    <WebView 
                        ref={(view) => this.webView = view}
                        source={require("../assets/html/map.html")}
                        onMessage={this._onMessage}
                        useWebKit={true}
                        scrollEnabled={false}
                        javaScriptEnabled={true}
                    />
                  
                    
                </View>
            
        );
    }
}

const styles = StyleSheet.create({
    btn:{
        position:"absolute",
        bottom:20,
        backgroundColor:"#bbb",
        color:"#000",
    },  
    welcome: {
		fontSize: 12,
		textAlign: "center",
	},
	webViewContainer: {
		marginBottom: 0
	}
});