import React from 'react';
import { Animated,TouchableOpacity,Picker,Alert,ScrollView, 
        StyleSheet,TextInput,Button,View,Text,Dimensions,Keyboard,UIManager } from 'react-native';
import {buttonStyle} from '../style/buttonStyle.js';
import {commonStyle} from '../style/commonStyle.js';
import renderIf from 'render-if';
import RadioForm,{RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const {State : TextInputState} = TextInput;

export default class Register extends React.Component {
  static navigationOptions = {
    title: 'Register',
  };

  constructor(props) {
    super(props);
    this.state = {
        kotaId:"",
        kotaClick:false,
        jenisProp:[
          {label: 'Laki-laki', value: "L" },
          {label: 'Perempuan', value: "P" }
        ],
        jenis:"L",
        shift: new Animated.Value(0),
        textInputFocused:null
    };
  }

  componentWillMount(){
    console.log("componenet will mount")
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow',this.keyboardOnShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide',this.keyboardOnHide);
  }

  componentWillUnmount(){
    console.log("componenet will unmount")
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  keyboardOnHide = () => {
      Animated.timing(
        this.state.shift,{
          toValue:0,
          duration:0,
          useNativeDriver:true
        }
      ).start();
  }

  keyboardOnShow = (event) => {
    const {height:windowHeight} = Dimensions.get("window");
    const keyboardHeight = event.endCoordinates.height;
    const currentlyuFocusedField = TextInputState.currentlyFocusedField();
   
    UIManager.measure(currentlyuFocusedField,(originX,originY,width,height,pageX,pageY)=>{
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
       
      if(gap >= 0) return;

       Animated.timing(
      this.state.shift,{
        toValue:gap,
        duration:0,
        useNativeDriver:true
      }
    ).start();
      
    })
  }

 
  render() {
    const { shift } = this.state;
  
    _doRegister = () => {
        Alert.alert("Login")
    }

    _showPickerKota = () =>{
      this.setState({kotaClick:true});
    }

    _onFocus  = () => {
      console.log("on focus")

    }

    _onBlur  = () => {
      console.log("on bluer")
    }

  
    return (
        <Animated.View style={{transform:[{translateY:shift}]}} >
          <ScrollView>
          <View style={commonStyle.container}>
              <View>
                    <TextInput style={commonStyle.input}
                        placeholder="Nama Lengkap"
                    />

                    <TextInput style={commonStyle.input}
                      placeholder="No. HP"
                    />

                    <TextInput style={commonStyle.input}
                        placeholder="Password"
                        textContentType="password"
                        secureTextEntry={true}
                    />

                    <TextInput style={commonStyle.input}
                      placeholder="Konfirmasi Password"
                      textContentType="password"
                      secureTextEntry={true}
                    />

                    <TextInput style={commonStyle.input}
                      placeholder="Email"
                    />

                    <TouchableOpacity
                      onPress={_showPickerKota.bind(this)}>
                      <View style={commonStyle.input}>
                        <Text> Kota </Text>
                      </View>
                    </TouchableOpacity>

                    {renderIf(this.state.kotaClick)(  
                      <Picker
                          selectedValue={this.state.kotaId}
                          onValueChange={(itemValue, itemIndex) =>
                              this.setState({kotaId: itemValue})
                          }>
                          <Picker.Item label="Tuban" value="Tuban" />
                          <Picker.Item label="Lamongan" value="Lamongan" />
                          <Picker.Item label="Jakarta" value="Jakarta" />
                          <Picker.Item label="Surabaya" value="Surabaya" />

                      </Picker>
                    )}

                    {renderIf(this.state.kotaClick)(  
                       <TextInput style={commonStyle.input}
                          placeholder="render if"
                        />
                    )}    

                    <TextInput style={commonStyle.input}
                      placeholder="Alamat, Nama Jalan"
                    />

                     <TextInput style={commonStyle.input}
                      placeholder="Alamat Lengkap"
                      onFocus={()=>this.setState({textInputFocused:this})}
                    />

                     <View style={commonStyle.input}>
                      <RadioForm
                        radio_props={this.state.jenisProp}
                        initial={0}
                        onPress={(value) => {this.setState({jenis:value})}}
                      />
                    </View>


                    <TextInput style={commonStyle.input}
                      placeholder="Email"
                    />

                  <View style={buttonStyle.base}>
                    <Button 
                        color="white"
                        title="Register"
                        onPress={_doRegister.bind(this)}
                    />
                  </View>

                  <Text style={{ textAlign:"center",marginTop:10 }}> forgot password ? </Text>
              </View>
          </View>
          </ScrollView>
        </Animated.View>
 
    );

  }
}
