import React from "react";
import {Dimensions,View,Text,StyleSheet,FlatList,TouchableOpacity,Image} from "react-native";
import URL from "../constants/URL";
import Req from "../helper/Req";
import Helper from "../helper/Helper";
import renderif from "render-if";
import Slideshow from 'react-native-slideshow';


export default class Mainmenu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            renderedSlider:false,
            urlSlider:[],

            renderedMainKategori:false,
            mainKategoriView:null,
            dataSourceMainKat:[],
            dimens:Dimensions.get('window')
        }
    }

    static navigationOptions = {
        title: "Tokokota",
    };

    componentWillMount(){
        this._renderSlider();
        this._renderMainKategori();
    }
    
    _renderSlider = () => {
        Req.start(URL.sliderMain,"GET",false,false,(res)=>{
            var slider = res.data.slider;
            var urls = [];
            slider.map((item)=>{
                urls.push({url:Helper.convertUrl(item.path)})
            }); 
            this.setState({urlSlider:urls});
            this.setState({renderedSlider:true});
        })
    }

    _renderMainKategori = () => {
        Req.start(URL.mainKategori,"GET",false,false,(res)=>{
            var kats = res.data.main_kategori;     
            var dataSource = [];      
            kats.map((item)=> {
                dataSource.push( item );
            });
            this.setState({dataSourceMainKat:dataSource})
            this.setState({renderedMainKategori:true})
        })
    }

    _renderItemMainKat = ({item}) => (
        <TouchableOpacity
            onPress={this._onPressItem.bind(this,item)}>
            <View style={styles.mainKatItems}>
                <Image
                    style={[styles.imgKat,{width:this.state.dimens.width/5}]}
                    source={{url:Helper.convertUrl(item.icon)}}
                />
                <Text style={styles.mainKatTitle}>{item.nama}</Text>
            </View>
        </TouchableOpacity>
     ); 

     
    _keyExtractor = (item, index) => item;

    _onPressItem = (item) => {
        this.props.navigation.navigate("DetailMainKat",{mainKatId:item.id,"title":item.nama})
    };

    render(){
        return (
            <View>
                <View>
                    <View style={styles.container}>
                        {renderif(this.state.renderedSlider)(
                            <Slideshow
                                style={{height:200}}
                                dataSource={this.state.urlSlider}
                            />
                        )}
                    </View>
                    
                    {renderif(this.state.renderedMainKategori)(
                        <View style={styles.flatList}>
                            <FlatList
                                data={this.state.dataSourceMainKat}
                                extraData={this.state}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItemMainKat}
                                numColumns={5}
                            />
                        </View>
                    )}
                </View>
               
                
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height:150
    },
    slideContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    slide1: {
        backgroundColor: "rgba(20,20,200,0.3)"
    },
    slide2: {
        backgroundColor: "rgba(20,200,20,0.3)"
    },
    slide3: {
        backgroundColor: "rgba(200,20,20,0.3)"
    },
    imgKat:{
        height:60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgKatCont:{
        borderColor:"#eee",
        borderWidth:1
    },
    flatList:{
        marginTop:200,
        justifyContent: 'center',
        paddingTop: 30,
    },
    mainKatTitle:{
        fontWeight:"bold",
        textAlign:"center"
    },
    mainkatItems:{
        margin:10
    }

});
