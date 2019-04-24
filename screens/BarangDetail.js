import React from "react";
import {ProgressViewIOS, Linking,ScrollView,View,Text,Dimensions,StyleSheet,Image,TouchableOpacity,Button,TextInput} from "react-native";
import Helper from "../helper/Helper";
import DB from "../db/DB";
import renderif from "render-if"; 
import Req from "../helper/Req"; 
import URL from "../constants/URL"; 
import OrderHelper from "../helper/OrderHelper";
import MOrder from "../db/MOrder";

export default class BarangDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            barang : {},
            rendered:false,
            dimens: Dimensions.get("window"),
            tabActive:"detail",
            qty:"1",
            catatan:"",
            userId:0,
            favoriteIcon:require("../assets/images/heart_nonactive.png"),
            stock:""
        }
    }
    
    static navigationOptions =  {
       header : null,
    };

    componentWillMount(){
        DB.profile((r)=>{
            this._render(507,r.id);
        });
    }

    _render = (id,userId) => {
        this.setState({userId:userId});
        Req.start(URL.baseUrl + "barang/detail/" + id + "/" + userId ,"GET",false,false,(res)=>{
            this.setState({barang:res.data.barang},()=>{
                console.log("photo " + this.state.barang.photo);
                console.log("state " + this.state.rendered); 
            });
            OrderHelper.issetOrder(id,(r,index)=>{
                if( r ){
                    this.setState({qty:r.qty[index].toString()})
                    this.setState({catatan:r.note[index]})
                }
                
                //favorite icon
                if( res.data.barang.is_favorite == "yes" ){
                    this.setState({favoriteIcon:require("../assets/images/heart_active.png")});
                }else this.setState({favoriteIcon:require("../assets/images/heart_nonactive.png")});
                
                //stok
                if( this.state.barang.tipe_stock == "Real" ){
                    this.setState({stock:this.state.barang.stock})
                }else{ this.setState({stock:"Ready"}) }

                this.setState({rendered:true},()=>{
                    console.log("state " + this.state.rendered);
                })
            })
            
            
        })
    }

    
      

    render(){
        _onTabClick = (tab) => {
            this.setState({tabActive:tab})
        }

        _openChat = () => {
            let url = "https://api.whatsapp.com/send?phone=" +  this.state.barang.no_telp + "&text=Hai%20saya%20mau%20pesan";
            Linking.openURL(url).catch((err) => console.error('An error occurred', err));
        }

        _openStore = () => {
            OrderHelper.reset(()=>{

            });
        }

        _favorite = () =>{
            let post = JSON.stringify({
                user_id:this.state.userId,
                from_id:this.state.barang.id,
                tipe:"Barang"
            });


            Req.start(URL.baseUrl + "favorite/set","POST",false,post,(res) => {
                let brg = this.state.barang;
                if( res.status ){
                    if( this.state.barang.is_favorite == "yes" ){
                        brg.is_favorite = "no";
                        this.setState({barang:brg})
                        this.setState({favoriteIcon:require("../assets/images/heart_nonactive.png")});
                    }else{
                        brg.is_favorite = "yes";
                        this.setState({barang:brg})
                        this.setState({favoriteIcon:require("../assets/images/heart_active.png")});
                    } 
                }else{
                    //alert(res.message);
                }

            });
        }

        _onAddToCart  = ()=>{
            OrderHelper.issetOrder(this.state.barang.id,(orders)=>{
                if(!orders){ //jika pertama insert
                    MOrder.id.push(this.state.barang.id);
                    MOrder.nama.push(this.state.barang.nama);
                    MOrder.qty.push(this.state.qty);
                    MOrder.priceTotal.push(Number(this.state.barang.harga) * Number(this.state.qty));
                    MOrder.priceSatuan.push(this.state.barang.harga);
                    MOrder.berat.push(this.state.barang.berat);
                    MOrder.note.push(this.state.catatan);
                    MOrder.photo.push(this.state.barang.photo);
                    MOrder.tokoAlamatGmap.push(this.state.barang.toko_alamat_gmap);
                    MOrder.tokoId.push(this.state.barang.toko_id);
                    MOrder.tokoNama.push(this.state.barang.nama_toko);
                    OrderHelper.saveOrder(MOrder,()=>{
                        alert("Berhasil menambah produk ke cart");
                    })
                }else{ //jika upudate
                    let order = {
                        qty:this.state.qty,
                        priceSatuan:this.state.barang.harga,
                        catatan:this.state.catatan,
                        id:this.state.barang.id
                    }
                    OrderHelper.updateOrder(order,(r)=>{
                        alert("Berhasil update produk ke cart ");
                    })
                }
            })
        }

        _onBayar = () =>{
            this.props.navigation.navigate("Cart");
        }

        _onPlus = () => {
            let lastQty = Number(this.state.qty);
            this.setState({qty:(lastQty+1)+""})
        }

        _onMin = () => {
            let lastQty = Number(this.state.qty);
            if( lastQty - 1 >= 0 ){
                this.setState({qty:(lastQty-1)+""})
            }            
        }

        return (
            <ScrollView>
                
                {renderif(this.state.rendered)( 
                    <View>
                        <ProgressViewIOS/>
                        {/* photos  */}
                        <Image
                            style={{width:this.state.dimens.width,
                                    height:this.state.dimens.width}}
                            source={{url:Helper.convertUrl(this.state.barang.photo)}}
                        />

                         {/* back  */}
                         <Image
                            source={require('../assets/images/arrow_left.png')}
                            style={[{width:35,height:30},styles.backButton]}
                            resizeMode='center'
                        />

                        {/* button favorite  */}
                        <TouchableOpacity
                            style={[styles.favButton,{top:(this.state.dimens.width-75),right:20}]}
                            onPress={_favorite.bind(this)}
                            >
                            <Image
                                style={{width:65,height:65}}
                                source={this.state.favoriteIcon}
                                key={this.state.favoriteIcon}
                            />

                        </TouchableOpacity>

                        {/* nama & harga  */}
                        <Text style={styles.title}>{ this.state.barang.nama }</Text>
                        <Text style={styles.harga}>{ Helper.formatCurrency(this.state.barang.harga) }</Text>
                        
                        {/* tab  */}
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity
                                style={{width:this.state.dimens.width/3,height:50, backgroundColor: '#bbb'}}
                                onPress={_onTabClick.bind(this,"detail")}>
                                <Text> DETAIL </Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={{width:this.state.dimens.width/3,height:50, backgroundColor: '#bbb'}} 
                                onPress={_onTabClick.bind(this,"deskripsi")}>
                                <Text> DESKRIPSI </Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={{width:this.state.dimens.width/3,height:50, backgroundColor: '#bbb'}} 
                                onPress={_onTabClick.bind(this,"pengiriman")}>
                                <Text> PENGIRIMAN </Text>
                            </TouchableOpacity>

                        </View>
                        
                        {renderif(this.state.tabActive=="detail")(
                            <View>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{width:this.state.dimens.width/3}}>
                                        <Image
                                            style={{height:20,width:20}}
                                            source={require('../assets/images/icon_berat.png')}
                                        />
                                        <Text> Isi : {this.state.barang.isi + " " + this.state.barang.tipe_isi}</Text>
                                    </View>

                                    <View  style={{width:this.state.dimens.width/3}}>
                                        <Image
                                            style={{height:20,width:20}}
                                            source={require('../assets/images/icon_berat.png')}
                                        />
                                        <Text> Berat : {this.state.barang.berat + " gr"}</Text>
                                    </View>

                                    <View style={{width:this.state.dimens.width/3}}>
                                        <Image
                                            style={{height:20,width:20}}
                                            source={require('../assets/images/icon_mata.png')}
                                        />
                                        <Text> Lihat : {this.state.barang.lihat}</Text>
                                    </View>

                                </View>

                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{width:this.state.dimens.width/3}}>
                                        <Image
                                            style={{height:20,width:20}}
                                            source={require('../assets/images/icon_berat.png')}
                                        />
                                        <Text> Stock : {this.state.stock}</Text>
                                    </View>

                                    <View  style={{width:this.state.dimens.width/3}}>
                                        <Image
                                            style={{height:20,width:20}}
                                            source={require('../assets/images/icon_kondisi.png')}
                                        />
                                        <Text> Kondisi : {this.state.barang.kondisi}</Text>
                                    </View>

                                </View>

                            </View>
                        )}

                        {renderif(this.state.tabActive=="deskripsi")(
                            <View >
                                <Text> Deskripsi Produk </Text>
                                <Text> {this.state.barang.deskripsi} </Text>
                                <Text> {this.state.barang.master_deskripsi} </Text>
                            </View>
                        )}

                        {renderif(this.state.tabActive=="pengiriman")(
                            <View >     
                                <Text> {this.state.barang.master_deskripsi_pengiriman} </Text>
                            </View>
                        )}

                        <View style={{flex:1,flexDirection:"row",marginTop:30}}>
                            <View style={{flex:1,flexDirection:"row"}}>
                               <TouchableOpacity
                                onPress={_onMin.bind(this)}>
                                    <Image
                                        style={{height:35,width:35}}
                                        source={require('../assets/images/icon_min.png')}
                                        resizeMode="center"
                                    />
                                </TouchableOpacity>

                                <TextInput 
                                    style={styles.inputQty}
                                    onChangeText={(text) => this.setState({qty:text})}
                                    value={this.state.qty}
                                    placeholder="0"
                                />

                                <TouchableOpacity
                                    onPress={_onPlus.bind(this)}>
                                    <Image
                                        style={{height:35,width:35}}
                                        source={require('../assets/images/icon_plus.png')}
                                        resizeMode="center"
                                    />
                                </TouchableOpacity>
                            </View>

                            <TextInput 
                                style={styles.catatan}
                                placeholder="Catatan"
                                onChangeText={(text)=>{ this.setState({catatan:text}) }}
                                style={{width:Helper.screenPros(60)}}
                                value={this.state.catatan}
                            />
                        </View >

                        <View style={{flex:1,flexDirection:"row",marginTop:30,marginBottom:10}}>
                            <View style={{flex:0.5,flexDirection:"row"}}>
                                <TouchableOpacity
                                    onPress={_openChat.bind(this)}>
                                    <Image
                                        style={{height:40,width:40,marginRight:10}}
                                        source={require('../assets/images/logo_wa.png')}
                                        resizeMode="center"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={_openStore.bind(this)}>
                                    <Image
                                        style={{height:40,width:40}}
                                        source={require('../assets/images/logo_store.png')}
                                        resizeMode="center"
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{flex:1,flexDirection:"row",justifyContent:"flex-end"}}>
                                <View style={styles.button}>
                                    <Button
                                        title="Masuk Keranjang"
                                        onPress={_onAddToCart.bind(this)}
                                        color="#fff"
                                        fontSize={7}
                                    />
                                </View>
                                

                                <View style={[styles.button,{marginLeft:5,marginRight:5}]}>
                                    <Button
                                        title="Bayar"
                                        onPress={_onBayar.bind(this)}
                                        color="#fff"
                                        fontSize={7}
                                    />
                                </View>

                                
                            </View>

                        </View>


                        

                    </View>
                )}
                
            </ScrollView>
        );
        
    }
}

const styles = StyleSheet.create({
    backButton:{
        position:"absolute",
        top:25,
        left:20
    },
    
    favButton:{
        position:"absolute",
    },

    title:{
        fontSize:15,
        fontWeight:"bold",
        color:"#000"
    },
    harga:{
        fontSize:14,
        fontWeight:"bold",
        color:"#ef1f65",
        marginBottom:10
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
    catatan:{
        paddingLeft:5,
        paddingRight:5,
        color:"#000",
        borderColor:"#eee",
        borderWidth:1
    },
    button:{
        backgroundColor:"#ef1f65",
        color:"#fff",
        fontSize:8,
        borderRadius:3
    }
})