import React from "react";
import {View,Text,StyleSheet,FlatList,Image,TouchableOpacity,Dimensions} from "react-native";
import URL from "../constants/URL";
import Req from "../helper/Req";
import Helper from "../helper/Helper";
import renderif from "render-if";
import DB from "../db/DB";
import Loading from "../components/Loading";

export default class History extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource:[],
            rendered:false,
            dimens:Dimensions.get("window"),
            statusHistory:"1",
            view:"loading"
        }
    }
    
    static navigationOptions = {
        title : "History"
    };

    componentWillMount(){
        this._render();
    }

    _render = () => {
        DB.profile((p)=>{
            Req.start(URL.baseUrl + "history/user/" + p.id + "/status/" + this.state.statusHistory ,"GET",false,false,(res)=>{
                this.setState({dataSource:res.data.history});
                this.setState({view:"main"});
            });
        })
    }

    _renderItems = ({item}) => (
        <TouchableOpacity
            onPress={this._onPressItem.bind(this,item)}>
            <View style={styles.items}>
                <View style={{flex:1,flexDirection:"row"}}>
                    <Image
                        source={require("../assets/images/clock_line.png")}
                        style={{width:20,height:20}}
                    />
                    <Text style={styles.title}> {item.time} - {item.tgl}</Text>
                </View>
                <Text style={styles.title}>Pesanan {item.type}</Text>
                <Text >Status : {item.status}</Text>
            </View>
        </TouchableOpacity>
    );

    _keyExtractor = (item, index) => item;

    _onPressItem = (item) => {
        this.props.navigation.navigate("HistoryDetail",{id:item.id})
    };

    render(){

        if( this.state.view == "main" )
        return (
                <View style={[styles.flatList,{flex:1}]}>
                    <FlatList
                        data={this.state.dataSource}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItems}
                    />
                </View>
        );

        if(this.state.view=="loading")
        return(
            <Loading/>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    img:{
        height:50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgKatCont:{
        borderColor:"#eee",
        borderWidth:1
    },
    flatList:{
        justifyContent: 'center',
    },
    title:{
        fontWeight:"bold",
    },
    items:{
        padding:10,
        borderWidth:1,
        borderColor:"#eee",
        marginTop:2,
        marginRight:5,
        marginLeft:5
    }

});


