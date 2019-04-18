import React from "react";
import {View,Text,Dimensions,StyleSheet,Image} from "react-native";
import Helper from "../helper/Helper";
import DB from "../db/DB";
import renderif from "render-if"; 

export default class BarangDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            barang : {},
            rendered:false,
            dimens: Dimensions.get("window")
        }
    }
    static navigationOptions =  {
       header : null,
    };

    componentWillMount(){
        DB.profile((r)=>{
            this._render(this.props.navigation.state.params.id,r.id);
        });
    }

    _render = (id,userId) => {
        Req.start(URL.baseUrl + "barang/detail/" + id + "/" + userId ,"GET",false,false,(res)=>{
            this.setState({barang:res.data.barang});
            this.setState({rendered:true})

        })
    }

    render(){
        return (
            <View>
                {
                    renderif(this.state.rendered)( 
                        <Image
                            style={{width:this.state.dimens.width,
                                height:this.state.dimens.width}}
                            source={{url:Helper.convertUrl(this.state.barang.photo)}}
                        />
                    )
                }
                
            </View>
        );
        
    }
}

const styles = StyleSheet.create({
    img:{
        
    }
})