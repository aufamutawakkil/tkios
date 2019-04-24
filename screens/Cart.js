import React from "react";
import { Button,AsyncStorage, View,Text,StyleSheet,FlatList,Image,TouchableOpacity,Dimensions} from "react-native";
import URL from "../constants/URL";
import Req from "../helper/Req";
import Helper from "../helper/Helper";
import renderif from "render-if";
import OrderHelper from "../helper/OrderHelper";

export default class Cart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource:[],
            rendered:false,
            dimens:Dimensions.get("window"),
            totalItem:0,
            totalHarga:0,
            refreshCart:true
        }
    }
    
    static navigationOptions = {
        title : "Cart"
    };

    componentWillMount(){
        this._render();
        this._total();
    }

    _onNext = () => {
        this.props.navigation.navigate("MapView");
    }

    _total = (data) => {
        let totalItem=0;let totalHarga=0;let ids=[];
        for( var i in data ){
            if( !this.inArray(ids,data[i].id) ){
                ids.push(data[i].id);
                totalItem++;
            }
            totalHarga+= Number(data[i].priceTotal);
        }

        this.setState({totalItem:totalItem});
        this.setState({totalHarga:totalHarga});
    }

    inArray = (arr,find) => {
        arr.map((i)=>{
            if(i == find) return true;
        })

        return false;
    }

    _render = () => {
        OrderHelper.get((r)=>{
            this._total(r);
            this.setState({dataSource:r},()=>{
                this.setState({rendered:true});
            });
            
        })
    }

    
    _onPlus = (data) => {
        let qty  = Number(data.qty) + 1;
        let order = {
            qty:qty,
            priceSatuan:data.priceSatuan,
            catatan:data.note,
            id:data.id
        }

        OrderHelper.updateOrder(order,(res)=>{
            OrderHelper.get((r)=>{
                this._total(r);
                this.setState({dataSource:r});
                
            })
        })
    }
    _onMin = (data) => {
        if( Number(data.qty) > 1 ){
            let qty  = Number(data.qty) - 1;
            let order = {
                qty:qty,
                priceSatuan:data.priceSatuan,
                catatan:data.note,
                id:data.id
            }

            OrderHelper.updateOrder(order,(res)=>{
                OrderHelper.get((r)=>{
                    this._total(r);
                    this.setState({dataSource:r});
                })
            })
        }
    }

    

    _renderItems = ({item}) => (
        <View style={styles.items}>
            <View
                style={{flex:1,flexDirection:"row"}}>
                    <Image
                        style={[styles.img,{width:80,height:80,marginRight:10}]}
                        source={{url:Helper.convertUrl(item.photo)}}
                    />
                    <View>
                        <Text style={{fontWeight:"bold"}}>{item.nama}</Text>
                        <Text>Harga Satuan : {Helper.formatCurrency(item.priceSatuan)}</Text>
                        <Text>Harga Total  : {Helper.formatCurrency(item.priceTotal)}</Text>
                        <Text>Catatan  : {item.note}</Text>
                        <View style={{flex:1,flexDirection:"row"}} >
                            <TouchableOpacity
                                onPress={this._onMin.bind(this,item)}>
                                    <Image
                                        style={{height:30,width:30}}
                                        source={require('../assets/images/icon_min.png')}
                                        resizeMode="center"
                                    />
                                </TouchableOpacity>

                                <Text style={styles.inputQty}> {item.qty} </Text>

                                <TouchableOpacity
                                    onPress={this._onPlus.bind(this,item)}>
                                    <Image
                                        style={{height:30,width:30}}
                                        source={require('../assets/images/icon_plus.png')}
                                        resizeMode="center"
                                    />
                            </TouchableOpacity>
                        </View>
                    </View>
            </View>
            
        </View>
    );

    _keyExtractor = (item, index) => item.id;

    _onPressItem = (item) => {
    };

    render(){
        return (
            <View>
                {
                    renderif(this.state.rendered)(
                        <View  style={{marginTop:-50,flex:1,flexDirection:"column"}}>
                            <View style={[styles.flatList,{height:this.state.dimens.height-250}]}>
                                <FlatList
                                    data={this.state.dataSource}
                                    extraData={this.state.refreshCart}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={this._renderItems}
                                />
                            </View>
                            <View style={{height:250}}>
                                <Text style={{fontWeight:"bold",marginBottom:10}}>Detail checkout</Text>
                                <Text>Total Item : {this.state.totalItem}</Text>
                                <Text>Total Harga : {Helper.formatCurrency(this.state.totalHarga)}</Text>
                                <View style={styles.btn}>
                                    <Button
                                        title="LANJUT"
                                        color="#fff"
                                        onPress={this._onNext.bind(this)}
                                    />
                                </View>
                            </View>
                        </View>
                    )
                }
            </View>
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
        marginTop:50,
        justifyContent: 'center',
    },
    title:{
        fontWeight:"bold",
        textAlign:"center"
    },
    items:{
        padding:10,
        borderColor:"#eee",
        margin:10,
        borderWidth:1,
        borderRadius:2
    },
    inputQty:{
        marginLeft:15,
        marginRight:15,
        fontSize:15,
        color:"#000",
        borderColor:"#eee",
        borderWidth:1,
        paddingLeft:5,
        paddingRight:5,
        fontWeight:"bold"
    },
    btn:{
        padding:5,
        backgroundColor:"red",
    }

});


