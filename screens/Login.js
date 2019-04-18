import React from 'react';
import { AlertIOS,AsyncStorage,Alert,ScrollView, StyleSheet,TextInput,Button,View,Text } from 'react-native';
import {buttonStyle} from '../style/buttonStyle.js';
import {commonStyle} from '../style/commonStyle.js';
import URL from '../constants/URL';
import MProfile from '../db/MProfile';
import Req from '../helper/Req';

export default class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username:"",
      password:"",
    }
  }

  static navigationOptions = {
    title: 'Login',
  };

  render() {
    _doLogin = () => {
      
      var post = JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        firebase_token:"xxx" 
      });

      Req.start(URL.login,"POST",false,post,(r)=>{
        if( r.status ){
            var user = r.data.user;
            MProfile.noTelp = user.no_telp; 
            MProfile.nama = user.nama;
            MProfile.alamat = user.alamat;
            MProfile.foto = user.path_thumbnail;
            MProfile.jenisKelamin = user.jenis_kelamin;
            MProfile.id = user.id;
            MProfile.codeInvite = user.code_credit;
            MProfile.provinsiId = user.provinsi_id;
            MProfile.kotaId = user.kota_id;
            MProfile.kotaNama = user.kota_nama;
            MProfile.username = user.username;
            MProfile.password = user.password;
            MProfile.defaultKotaId = user.default_kota_id;
            AsyncStorage.setItem("profile",JSON.stringify(MProfile));
            this.props.navigation.navigate("Home")
        }else{
          AlertIOS.alert("",r.message);
        }
      });
  
    }

    return (
        <View>

          <View style={commonStyle.container}>
              <View>
                  <TextInput style={commonStyle.input}
                      placeholder="username"
                      onChangeText={(text)=>this.setState({username:text})}
                  />
                  <TextInput style={commonStyle.input}
                      placeholder="password"
                      textContentType="password"
                      onChangeText={(text)=>this.setState({password:text})}
                      secureTextEntry={true}
                  />

                  <View style={buttonStyle.base}>
                    <Button 
                        color="white"
                        title="Login"
                        onPress={_doLogin.bind(this)}
                    />
                  </View>

                  <Text style={{ textAlign:"center",marginTop:10 }}> forgot password ? </Text>
              </View>
          </View>
        </View>
 
    );

  }
}
