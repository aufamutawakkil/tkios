import React from "react";
import {StyleSheet,  TouchableOpacity,View,Dimensions,Text,FlatList,Image,ScrollView} from "react-native";
import renderIf from 'render-if';
import Req from "../helper/Req";
import URL from "../constants/URL";
import DB from "../db/DB";
import Helper from "../helper/Helper";
import Loading from "../components/Loading";

export default class Favorite extends React.Component{
    constructor(props) {
        super(props);
        Loading
        this.state = {
            dimens:Dimensions.get('window'),
            favActive:"toko",
            rendered:false,
            dsToko:[],
            dsProduk:[],
            view:"loading", //main,error
        };
    }

    static navigationOptions = {
        title: 'Favorite',
    };

    componentWillMount(){
        this._render();
    }

    _render  = () => {
        DB.profile((p)=>{
            if( this.state.favActive == "toko" )
                this._renderToko( p.id )
            else if( this.state.favActive == "produk" )
                this._renderProduk( p.id )
                           
        })
    }


    _renderToko = (userId) => {
        this.setState({view:"loading"});
        Req.start(URL.baseUrl + "favorite/toko/" + userId,"GET",false,false,(res)=>{
            this.setState({dsToko:res.data.favorites});
            this.setState({view:"main"});
        })
    }

    _renderProduk = (userId) => {
        this.setState({view:"loading"});
        Req.start(URL.baseUrl + "favorite/barang/" + userId,"GET",false,false,(res)=>{
            this.setState({dsProduk:res.data.favorites});
            this.setState({view:"main"});
        })
    }



    _renderItemsToko = ({item}) => (
        <TouchableOpacity
            onPress={this._onPressToko.bind(this,item)}>
            <View style={styles.items}>
                <Image
                    style={[styles.img,{width:this.state.dimens.width/3}]}
                    source={{url:Helper.convertUrl(item.photo)}}
                />
                <Text style={styles.title}> {item.nama}</Text>
                <Text >{item.alamat_jalan}</Text>
            </View>
        </TouchableOpacity>
    );

    _renderItemsProduk = ({item}) => (
        <TouchableOpacity
            style={{width:this.state.dimens.width/2}}
            onPress={this._onPressProduk.bind(this,item)}>
            <View style={styles.items}>
                <Image
                    style={[styles.img]}
                    source={{url:Helper.convertUrl(item.photo)}}
                />
                <Text style={{fontSize:12,fontWeight:"bold"}}>{item.nama}</Text>
                <Text >{Helper.formatCurrency(item.harga)}</Text>
                <Text style={{fontSize:10}}>Toko : { Helper.isTimeInRange(item.date_mulai,item.date_akhir) ? "Buka" : "Tutup" } </Text>
                <Text style={{fontSize:10}}>Kondisi : {item.kondisi} </Text>
                <Text style={{fontSize:10,fontWeight:"bold"}}>{item.nama_toko} </Text>
                <Text style={{fontSize:10}}>{item.alamat} </Text>
            </View>
        </TouchableOpacity>
    );


    _keyExtractor = (item, index) => item.id;
    
    _onPressToko = (item) => {

    }

    _onPressProduk = (item) => {
        
    }

    _onTabClick = (screen) =>{
        this.setState({favActive:screen})
        this._render();
    }
    

    render(){

        //main render
        if( this.state.view =="main" )
        return (
           <View>
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <TouchableOpacity
                            style={{width:this.state.dimens.width/2,height:50, backgroundColor: 'powderblue'}}
                            onPress={this._onTabClick.bind(this,"toko")}>
                            <Text> Toko </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={{width:this.state.dimens.width/2,height:50, backgroundColor: 'skyblue'}} 
                            onPress={this._onTabClick.bind(this,"produk")}>
                            <Text> Produk </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{height:this.state.dimens.height - 50,width:this.state.dimens.width,marginTop:50}}>
                        {
                            (renderIf( this.state.favActive=="toko" ))(
                                <FlatList
                                    data={this.state.dsToko}
                                    extraData={this.state}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={this._renderItemsToko}
                                    numColumns={3}
                                />
                            )

                        } 

                        {
                            (renderIf( this.state.favActive=="produk" ))(
                                <FlatList
                                    data={this.state.dsProduk}
                                    extraData={this.state}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={this._renderItemsProduk}
                                    numColumns={2}
                                />
                            )
                        }

                    </View>
                    
                </View>
           </View>  

        );

        if(  this.state.view == "loading")
            return (
                <Loading/>
            );
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    tab:{
    },
    title:{
        fontWeight:"bold",
        textAlign:"center"
    },
    items:{
        padding:5,
        borderWidth:1,
        borderColor:"#eee",
        margin:3
    },
    img:{
        height:80,
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});