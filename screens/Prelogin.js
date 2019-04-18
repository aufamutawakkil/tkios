import React from 'react';
import { Alert,ScrollView, StyleSheet,TextInput,Button,View,Text,Image } from 'react-native';
import {buttonStyle} from '../style/buttonStyle.js';
import {commonStyle} from '../style/commonStyle.js';
import Toolbar from '../components/Toolbar.js';
import Helper from '../helper/Helper';


export default class Login extends React.Component {
  static navigationOptions = {
    title: 'TokoKota',
  };

  componentWillMount(){
    Helper.isLogin( (r) => {
        if(r) this.props.navigation.navigate("Home");
    });
  }

  render() {

    _doLogin = () => {
        Alert.alert("Login")
    }

    return (
        <View>

          <View style={[commonStyle.container,style.container]}>
              <View>
                <Image
                    source={require('../assets/images/tokokota_logo.png')}
                    style={style.logo}
                    resizeMode='center'
                    />

                 
                  <View style={[buttonStyle.base,buttonStyle.gray]}>
                    <Button 
                        color="white"
                        title="LOGIN"
                        onPress={()=>this.props.navigation.navigate("Login")}
                    />
                  </View>

                  <View style={buttonStyle.base}>
                    <Button 
                        color="white"
                        title="DAFTAR"
                        onPress={()=>this.props.navigation.navigate("Register")}
                    />
                  </View>


              </View>
          </View>
        </View>
 
    );

  }
}

const style = StyleSheet.create({
      logo : {
          height:120,
          width:160,
          justifyContent:"center",
          alignItems:"center" 
      },
      container : {
          justifyContent:"center",
          textAlign:"center"
      }
})
