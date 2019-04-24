import React from "react";
import {TouchableOpacity, View,Text,ScrollView,StyleSheet,FlatList,Image} from "react-native";
import OrderHelper from "../helper/OrderHelper";
import Loading from "../components/Loading";
import LayoutError from "../components/LayoutError";
import Req from "../helper/Req";
import URL from "../constants/URL";
import DB from "../db/DB";
import Button from "../components/Button";
import Helper from "../helper/Helper";
import renderif from "render-if";

export default class OrderDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            ds:{},
            dsOrders:[],
            view:"loading",
            dsjamOrders:[],
            id:0,
        }
    }
    static navigationOptions = {
        title: 'Detail',
    };

    componentWillMount(){
        this.setState({id:this.props.navigation.state.params.id},()=>{
            this._render();
        });
    }

    _render = () => {
        Req.start(URL.baseUrl+"barang/history_barang/" + this.state.id,"GET",false,false,(res)=>{
            this.setState({ds:res.data.history.order},()=>{
                this.setState({dsOrders:res.data.history.barang},()=>{
                    this.setState({dsJamOrders:res.data.history.jam_antar},()=>{
                        this.setState({view:"main"})
                    });
                });
            })
        });
    }

  
    _produkItems = ({item}) => (
        <View style={{flex:1,flexDirection:"row"}} >
            <Image
                style={{width:70,height:70}}
                source={{uri:Helper.convertUrl(item.photo)}}
            />
            <View>
                <Text style={{fontWeight:"bold"}}>{item.nama}</Text>
                <Text>Qty : {item.qty}</Text>
                <Text>Total Harga : {Helper.formatCurrency(item.total)}</Text>
                <Text>Note : {item.note}</Text>
                <View style={{flex:1,flexDirection:"row",fontSize:9,paddingTop:5,borderTopWidth:1,borderTopColor:"#eee"}}>
                    <Text style={{color:"red",fontStyle:"italic",fontSize:10}}> {item.toko_nama} </Text>
                    <Text style={{fontStyle:"italic",fontSize:10}}>-</Text>
                    <Text style={{fontStyle:"italic",fontSize:10}}> {item.toko_alamat} </Text>
                </View>
                
            </View>
        </View>
    );

    _jamOrderItems = ({item}) => (
        <View style={{flex:1,flexDirection:"row"}} >
            <Image
                style={{width:15,height:15}}
                source={require("../assets/images/clock_line.png")}
            />
            <View>
                <Text> {item.waktu}</Text>
            </View>
        </View>
    )


    _keyExtractor = (item, index) => item.id;

    render(){
        if( this.state.view=="main" )
        return (
            <ScrollView style={{backgroundColor:"#eee"}}>
                <View>
                    {
                        //jika status cancel / complete, order ulang
                        renderif( this.state.status == "Complete" || this.state.status == "Cancel" )(
                        <View style={[styles.section]}>
                            <Text style={styles.title}>Order ulang untuk pesanan ini</Text>
                            <TouchableOpacity 
                                style={styles.btn}
                                onPress={this._doReorder.bind(this)}>
                                <Text style={{fontSize:12,fontWeight:"bold", justifyContent:"center",alignItems:'center',color:"#fff"}}>ORDER ULANG</Text>
                            </TouchableOpacity>
                        </View>
                        )
                    }
                    
                    <View style={styles.section}>
                            <Text style={styles.title}> Jam Order </Text>
                            <FlatList
                                data={this.state.dsJamOrders}
                                extraData={this.state}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._jamOrderItems}
                            />
                            <Text> {this.state.ds.master_deskripsi_pengiriman} </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={{fontWeight:"bold"}}> {this.state.ds.order_alamat} </Text>
                        <Text> {this.state.ds.order_ket_lain} </Text>
                    </View>


                    <View style={styles.section}>
                        <Text style={styles.title}>Detail </Text>
                        <View style={{flex:1,flexDirection:"row"}}>
                            <Text style={{flex:1,fontWeight:"bold"}}>Berat</Text>
                            <Text style={{flex:1,textAlign:"right"}}>{this.state.ds.total_berat}</Text>
                        </View>

                        <View style={{flex:1,flexDirection:"row"}}>
                            <Text style={{flex:1,fontWeight:"bold"}}>Jarak</Text>
                            <Text style={{flex:1,textAlign:"right"}}>{this.state.ds.km}Km</Text>
                        </View>

                        <View style={{flex:1,flexDirection:"row"}}>
                            <Text style={{flex:1,fontWeight:"bold"}}>Ongkir</Text>
                            <Text style={{flex:1,textAlign:"right"}}>{ Helper.formatCurrency(this.state.ds.price_antar)}</Text>
                        </View>

                        <View style={{flex:1,flexDirection:"row"}}>
                            <Text style={{flex:1,fontWeight:"bold"}}>Biaya Belanja</Text>
                            <Text style={{flex:1,textAlign:"right"}}>{Helper.formatCurrency(this.state.ds.price)}</Text>
                        </View>

                        <View style={[{flex:1,flexDirection:"row"},styles.total]}>
                            <Text style={{flex:1,fontWeight:"bold"}}>Total</Text>
                            <Text style={{flex:1,textAlign:"right"}}>{ Helper.formatCurrency(Number(this.state.ds.price) + Number(this.state.ds.price_antar))}</Text>
                        </View>

                        <View style={{flex:1,flexDirection:"row"}}>
                            <Text style={{flex:1,fontWeight:"bold"}}>Metode Bayar</Text>
                            <Text style={{flex:1,textAlign:"right"}}>{this.state.ds.payment_method}</Text>
                        </View>

                        <View style={{flex:1,flexDirection:"row"}}>
                            <Text style={{flex:1,fontWeight:"bold"}}>Ekspedisi</Text>
                            <Text style={{flex:1,textAlign:"right"}}>{this.state.ds.ekspedisi}</Text>
                        </View>

                   
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.title}> Status </Text>
                        <Text> {this.state.ds.status} </Text>
                    </View>
                       
                    <View style={styles.section}>
                        <Text style={styles.title}> Pesanan </Text>
                        <FlatList
                            data={this.state.dsOrders}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._produkItems}
                        />
                    </View>

                    {
                        renderif(this.state.ds.status=="Progress")(
                            <Button 
                                isLoading={false}
                                ref={btn=>this.btnCancel = btn}
                                backgroundColor="#00ba4a"
                                color="#fff"
                                text="KONFIRMASI BARANG SAMPAI"
                                onPress={this._doKonfirmasi.bind(this)}
                            />
    
                        )
                    }

                    {
                        renderif(this.state.ds.status=="Pending")(
                            <Button 
                                backgroundColor="red"
                                color="#fff"
                                text="BATALKAN PESANAN"
                                
                            />
                        )
                    }
                  

                </View>

            </ScrollView>
        );

        else if( this.state.view=="loading" )
        return (
            <Loading/>
        );

        else if( this.state.view == "error" )
        return(
            <LayoutError/>
        );
    }

    _doKonfirmasi = () => {
       this.btnKonfirmas.setLoading(true);
       Req.start( URL.baseUrl + "barang/finish_order/" + this.state.id,"GET",false,false,()=>{
            alert("Barang telah di konfirmasi, Terimakasih telah menggunakan layanan TokoKota");
            this.props.navigation.navigate("History");
       }) 
    }

    _doCancel = () => {
        this.btnCancel.setLoading(true);
        Req.start( URL.baseUrl + "barang/finish_order/" + this.state.id,"GET",false,false,()=>{
             alert("Barang telah di konfirmasi, Terimakasih telah menggunakan layanan TokoKota");
             this.props.navigation.navigate("History");
        }) 
     }

     _doReorder = () => {
        this.btnReorder.setLoading(true);
        Req.start( URL.baseUrl + "barang/finish_order/" + this.state.id,"GET",false,false,()=>{
             alert("Barang telah di konfirmasi, Terimakasih telah menggunakan layanan TokoKota");
             this.props.navigation.navigate("History");
        }) 
     }
}

const styles = StyleSheet.create({
    section:{
        backgroundColor:"#fff",
        padding:15,
        marginBottom:10
    },
    dot:{
        height:15,
        width:15,
        borderRadius:10,
        marginRight:5
    },
    pembayaranItem:{
        padding:10,
        borderColor:"#eee",
        borderRadius:3,
        borderWidth:1,
        marginBottom:5
    },
    title:{
        fontWeight:"bold",
        marginBottom:5,
        fontSize:14
    },
    input:{
        padding:5,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        marginBottom:5
    },
    btn:{
        width:140,
        paddingTop:10,
        paddingBottom:10,
        paddingRight:15,
        paddingLeft:15,
        backgroundColor:"orange",
        borderRadius:5,
        alignItems:"center"
    },
    total:{
        marginTop:5,
        paddingTop:10,
        borderTopWidth:1,
        borderTopColor:"#bbb"
    },
})