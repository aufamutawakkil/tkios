import React from "react";
import {StyleSheet,  TouchableOpacity,View,Dimensions,Text} from "react-native";
import ProdukFavorite from './favorite/ProdukFavorite';
import TokoFavorite from './favorite/TokoFavorite';
import renderIf from 'render-if';

export default class Favorite extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dimens:Dimensions.get('window'),
            screenActive:"toko"
        };
    }

    static navigationOptions = {
        title: 'Favorite',
    };


    render(){

        _onTabClick = (screen) =>{
            this.setState({screenActive:screen})
        }
        
        return (
           <View>
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <TouchableOpacity
                            style={{width:this.state.dimens.width/2,height:50, backgroundColor: 'powderblue'}}
                            onPress={_onTabClick.bind(this,"toko")}>
                            <Text> Toko </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={{width:this.state.dimens.width/2,height:50, backgroundColor: 'skyblue'}} 
                            onPress={_onTabClick.bind(this,"produk")}>
                            <Text> Produk </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{height:this.state.dimens.height - 50,width:this.state.dimens.width,marginTop:50}}>
                        {renderIf(this.state.screenActive=="produk")(  
                            <ProdukFavorite/>
                        )}

                        {renderIf(this.state.screenActive=="toko")(  
                            <TokoFavorite/>
                        )}
                    </View>
                    
                </View>
           </View>  

           
        );
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    tab:{
    }
});