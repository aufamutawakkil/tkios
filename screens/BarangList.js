import React from "react";
import { View,Text,StyleSheet,FlatList,Image,TouchableOpacity,Dimensions} from "react-native";
import URL from "../constants/URL";
import Req from "../helper/Req";
import Helper from "../helper/Helper";
import renderif from "render-if";
import DB from "../db/DB";

export default class BarangList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource:[],
            rendered:false,
            dimens:Dimensions.get("window")
        }
    }
    
    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return { 
          title: `${state.params.title}`,
        };
    };

    componentWillMount(){
        DB.profile((r)=>{
            this._render(this.props.navigation.state.params.katId,r.id);
        });
    }

    _render = (id,userId) => {
        var post = JSON.stringify({
            sort: "terbaru",
        });
        Req.start(URL.baseUrl + "barang/sort/" + id + "?page=" + 1 + "&user_id=" + userId + "&filter=" + "Semua" ,"POST",false,post,(res)=>{
            var datas = res.data.barang;     
            var dataSource = [];
            datas.map((item)=> {
                dataSource.push( item );
            });

            this.setState({dataSource:dataSource})
            this.setState({rendered:true})

        })
    }

    _renderItems = ({item}) => (
        <TouchableOpacity
            onPress={this._onPressItem.bind(this,item)}>
            <View style={styles.items}>
                <Image
                    style={[styles.img,{width:this.state.dimens.width/2}]}
                    source={{url:Helper.convertUrl(item.photo)}}
                />
                <Text> {item.nama}</Text>
                <Text >{Helper.formatCurrency(item.harga)}</Text>
                <Text style={{fontSize:10}}>Toko : { Helper.isTimeInRange(item.date_mulai,item.date_akhir) ? "Buka" : "Tutup" } </Text>
                <Text style={{fontSize:10}}>Kondisi : {item.kondisi} </Text>
                <Text style={{fontSize:10,fontWeight:"bold"}}>{item.nama_toko} </Text>
                <Text style={{fontSize:10}}>{item.alamat} </Text>
            </View>
        </TouchableOpacity>
    );

    _keyExtractor = (item, index) => item;

    _onPressItem = (item) => {
        this.props.navigation.navigate("BarangDetail",{id:item.id,"title":item.nama})
    };

    render(){
        return (
            <View>
                {
                    renderif(this.state.rendered)(
                        <View>
                            <View  >
                                <View style={styles.flatList}>
                                    <FlatList
                                        data={this.state.dataSource}
                                        extraData={this.state}
                                        keyExtractor={this._keyExtractor}
                                        renderItem={this._renderItems}
                                        numColumns={2}
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
        padding:5
    }

});


