import React from "react";
import {TouchableOpacity, View,Text,ScrollView,StyleSheet,FlatList,TextInput} from "react-native";
import OrderHelper from "../helper/OrderHelper";
import Loading from "../components/Loading";
import Req from "../helper/Req";
import URL from "../constants/URL";
import DB from "../db/DB";
import Button from "../components/Button";

export default class OrderDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            barang:{},
            infoOrder:{},
            dsPengiriman:[],
            rendered:false,
            dsPembayaran:{},
            saldo:0,
            pembayaranSelected:"",
            pengirimanSelected:"",
            refreshPembayaran:false,
            refreshPengiriman:false,
            kodeVoucher:"",
            userId:0,
            tokoId:0
        }
    }
    static navigationOptions = {
        title: 'Detail',
    };

    componentWillMount(){

        OrderHelper.get((o)=>{
            this.setState({barang:o},()=>{
                OrderHelper.getInfoOrder((i)=>{
                    this.setState({infoOrder:i},()=>{
                        //get eks
                        this._getEks(this.state.barang[0].tokoId,()=>{
                            this.setState({tokoId:this.state.barang[0].tokoId});
                            //get profile
                            DB.profile((p)=>{
                                this.setState({userId:p.id});
                                this._getSaldo(p.id,()=>{
                                    this.setState({rendered:true});
                                });
                            });
                        });
                    });
                });
            });
        })
    }

    _getEks = (tokoId,cb) => {
        Req.start(URL.baseUrl+"ekspedisi/" + tokoId,"GET",false,false,(res)=>{
            this.setState({dsPengiriman:res.data.ekspedisi},()=>{
                return cb(true);
            })
        });
    }

    _getSaldo = (userId,cb) => {
        Req.start(URL.baseUrl+"saldo/saldo_user/" + userId,"GET",false,false,(res)=>{
            this.setState({dsPembayaran:[
                    {nama:"Cash",value:"Cash"},
                    {nama:"Saldo ( " + res.data.saldo + " )",value:"Saldo"}
                ]},()=>{
                    this.setState({saldo:res.data.saldo},()=>{
                        return cb(true);
                    })
                });
        });
    }

    _pengirimanItems = ({item}) => (
        <TouchableOpacity style={[{flex:1,flexDirection:"row"},styles.pembayaranItem]}
        onPress={this._selectPengiriman.bind(this,item)}>
            <View style={[styles.dot,(item.id == this.state.pengirimanSelected.id && item.nama == this.state.pengirimanSelected.nama) ? {backgroundColor:"red"} : {backgroundColor:"#bbb"} ]}></View>
            <Text style={styles.title}> {item.nama}</Text>
        </TouchableOpacity>
    );

    _selectPengiriman = (item) => {
        this.setState({pengirimanSelected:item},()=>{
            this.setState({refreshPengiriman:!this.state.refreshPengiriman})
        });
    }

    _pembayaranItems = ({item}) => (
        <TouchableOpacity style={[{flex:1,flexDirection:"row"},styles.pembayaranItem]}
            onPress={this._selectPembayaran.bind(this,item)}>
            <View style={[{justifyContent:"center"},styles.dot,item.value == this.state.pembayaranSelected ? {backgroundColor:"red"} : {backgroundColor:"#bbb"} ]}></View>
            <Text style={[styles.title,{justifyContent:"center"}]}> {item.nama}</Text>
        </TouchableOpacity>
    );

    _selectPembayaran = (item) => {
        this.setState({pembayaranSelected:item.value},()=>{
            this.setState({refreshPembayaran:!this.state.refreshPembayaran})
        });
    }

    _keyExtractor = (item, index) => item.id;

    _checkKodeVoucher = () => {
        var post = JSON.stringify({
            user_id:this.state.userId,
            kode:this.state.kodeVoucher,
            toko_id:this.state.tokoId,
        });
        Req.start( URL.baseUrl + "voucher/check","POST",false,post,()=>{
            
        })
    }

    _order = () => {
        alert("order")
    }

    render(){
        if( this.state.rendered )
        return (
            <ScrollView style={{backgroundColor:"#eee"}}>
                <View>
                    <View style={styles.section}>
                        <Text style={{fontWeight:"bold"}}> {this.state.infoOrder.address} </Text>
                        <Text> {this.state.infoOrder.ket} </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.title}> Metode Pembayaran </Text>
                        <FlatList
                            data={this.state.dsPembayaran}
                            extraData={this.state.refreshPembayaran}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._pembayaranItems}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.title}> Pengiriman </Text>
                        <FlatList
                            data={this.state.dsPengiriman}
                            extraData={this.state.refreshPengiriman}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._pengirimanItems}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.title}> Kode Voucher </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text)=>{this.setState({kodeVoucher:text})}}
                            value={this.state.kodeVoucher}
                        />
                        <TouchableOpacity 
                            style={styles.btn}
                            onPress={this._checkKodeVoucher.bind(this)}
                        >
                            <Text style={{fontSize:12,fontWeight:"bold", justifyContent:"center",alignItems:'center',color:"#fff"}}>GUNAKAN KODE</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.title}>Detail </Text>
                        <View style={{flex:1,flexDirection:"row"}}>
                            <Text style={{flex:1,fontWeight:"bold"}}>Berat</Text>
                            <Text style={{flex:1,textAlign:"right"}}>{this.state.infoOrder.totalBerat}</Text>
                        </View>

                        <View style={{flex:1,flexDirection:"row"}}>
                            <Text style={{flex:1,fontWeight:"bold"}}>Jarak</Text>
                            <Text style={{flex:1,textAlign:"right"}}>{this.state.infoOrder.jarak}</Text>
                        </View>

                        <View style={{flex:1,flexDirection:"row"}}>
                            <Text style={{flex:1,fontWeight:"bold"}}>Ongkir</Text>
                            <Text style={{flex:1,textAlign:"right"}}>{this.state.infoOrder.ongkir}</Text>
                        </View>

                        <View style={{flex:1,flexDirection:"row"}}>
                            <Text style={{flex:1,fontWeight:"bold"}}>Biaya Belanja</Text>
                            <Text style={{flex:1,textAlign:"right"}}>{this.state.infoOrder.totalBiaya}</Text>
                        </View>

                        <View style={[{flex:1,flexDirection:"row"},styles.total]}>
                            <Text style={{flex:1,fontWeight:"bold"}}>Total</Text>
                            <Text style={{flex:1,textAlign:"right"}}>{this.state.infoOrder.total}</Text>
                        </View>

                   
                    </View>

                    <Button 
                        backgroundColor="green"
                        color="#fff"
                        text="PESAN"
                        onPress={this._order.bind(this)}
                    />

                    <Button 
                        backgroundColor="red"
                        color="#fff"
                        text="BATALKAN PESANAN"
                    />

                </View>

            </ScrollView>
        );

        else
        return (
            <Loading/>
        );
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
        backgroundColor:"red",
        borderRadius:5,
        alignItems:"center",
        alignSelf:"flex-end"
    },
    total:{
        marginTop:5,
        paddingTop:10,
        borderTopWidth:1,
        borderTopColor:"#bbb"
    }
})