import React from "react";
import {View,Text,StyleSheet,FlatList,Image,TouchableOpacity,Dimensions} from "react-native";
import URL from "../constants/URL";
import Req from "../helper/Req";
import Helper from "../helper/Helper";
import renderif from "render-if";

export default class kategoriList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataSource:[],
            rendered:false,
            dimens:Dimensions.get("window"),
            navigation:null
        }
    }
    
    static navigationOptions = {
        header : null
    };

    componentWillMount(){
        this.setState({navigation:this.props.navigation});
        this._render(this.props.mainKatId);
    }

    _render = (id) => {
        Req.start(URL.baseUrl + "kategori_barang/get_by_main_kat/" + id ,"GET",false,false,(res)=>{
            var datas = res.data.kategori_barang;     
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
                    style={[styles.img,{width:this.state.dimens.width/3}]}
                    source={{url:Helper.convertUrl(item.photo)}}
                />
                <Text style={styles.title}> {item.nama}</Text>
            </View>
        </TouchableOpacity>
    );

    _keyExtractor = (item, index) => item.id;

    _onPressItem = (item) => {
        this.state.navigation.navigate("BarangList",{katId:item.id,"title":item.nama})
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
                                        numColumns={3}
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
    }

});


