import React from "react";
import {View,Text,Dimensions,TouchableOpacity} from "react-native";
import TokoList from "./TokoList";
import KategoriList from "./KategoriList";
import BarangList from "./BarangList";
import renderif from "render-if"; 

export default class DetailMainKat extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            dimens:Dimensions.get('window'),
            screenActive:"toko",
            mainKatId:0
        };
    }

    componentWillMount(){
        this.setState({mainKatId:this.props.navigation.state.params.mainKatId});
    }

    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
          title: `${state.params.title}`,
        };
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
                            style={{width:this.state.dimens.width/3,height:50, backgroundColor: '#bbb'}}
                            onPress={_onTabClick.bind(this,"toko")}>
                            <Text> TOKO </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={{width:this.state.dimens.width/3,height:50, backgroundColor: '#bbb'}} 
                            onPress={_onTabClick.bind(this,"kategori")}>
                            <Text> KATEGORI </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={{width:this.state.dimens.width/3,height:50, backgroundColor: '#bbb'}} 
                            onPress={_onTabClick.bind(this,"promo")}>
                            <Text> PROMO </Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{height:this.state.dimens.height - 50,width:this.state.dimens.width,marginTop:50}}>
                        {renderif(this.state.screenActive=="toko")(  
                            <TokoList 
                                mainKatId={this.state.mainKatId}
                            />
                        )}

                        {renderif(this.state.screenActive=="kategori")(  
                            <KategoriList
                                mainKatId={this.state.mainKatId}
                                navigation={this.props.navigation}
                            />
                        )}

                        {renderif(this.state.screenActive=="promo")(  
                            <BarangList 
                                isPromo={false}
                                mainKatId={this.state.mainKatId}
                            />
                        )}
                    </View>
                    
                </View>
           </View>  
        );
    }
}

