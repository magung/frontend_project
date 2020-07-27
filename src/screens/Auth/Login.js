import React, { Component } from 'react';
import Toast from 'react-native-root-toast';
import Axios from 'axios';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Image, ActivityIndicator } from 'react-native';
import {URL} from '../../publics/config';
import AsyncStorage from '@react-native-community/async-storage';
class Login extends Component {
  state = {
    email : '',
    password : '',
    loggedIn : false
  }
  
  handleSubmit = async (email, password) => {
    if(!email){
      Alert.alert('Warning', 'Email is required',
        [
          {text: 'OK'},
        ],
        {cancelable: false},)
      // Toast.show('Email is required', {
      //       duration: Toast.durations.LONG,
      //       position: 0,
      //       shadow: true,
      //       animation: true,
      //       hideOnPress: true,
      //       delay: 0,})
    } else if(!password){
      Alert.alert('Warning', 'Password is required',
        [
          {text: 'OK'},
        ],
        {cancelable: false},)
      // Toast.show('Password is required', {
      //       duration: Toast.durations.LONG,
      //       position: 0,
      //       shadow: true,
      //       animation: true,
      //       hideOnPress: true,
      //       delay: 0,})
    } else {
      this.setState({loggedIn : true})
      const data = {
        email : email,
        password : password
      }
      let url = URL
      let urldebug = await AsyncStorage.getItem('debug');
      if (urldebug) {
        url = urldebug
      }
      
      await Axios.post(`${url}/user/login`, data)
          .then(async res => {
                // console.log(res)
                if(res.data.status == 200) {
                  let user = {
                    user_id : res.data.data.user_id,
                    usr_level_id : res.data.data.usr_level_id
                  }
                  let setdata = [
                    ["user_data", JSON.stringify(user)],
                    ["token", res.data.token]
                  ]
                  await AsyncStorage.multiSet(setdata, (err) => {
                    this.setState({loggedIn : false})
                    Alert.alert('Success', 'success login',
                      [
                        {text: 'OK'},
                      ],
                      {cancelable: false},)
                    // Toast.show('Success to login', {
                    //   duration: Toast.durations.LONG,
                    //   position: 0,
                    //   shadow: true,
                    //   animation: true,
                    //   hideOnPress: true,
                    //   delay: 0,})
                      this.props.navigation.navigate('Project')
                  })

                } else {
                  this.setState({loggedIn : false})
                  Alert.alert('Failed', 'Email or Password is wrong',
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},)
                  // Toast.show('Email or Password is wrong', {
                  //   duration: Toast.durations.LONG,
                  //   position: 0,
                  //   shadow: true,
                  //   animation: true,
                  //   hideOnPress: true,
                  //   delay: 0,})
                }

          })
          .catch(function (err) {
            console.log(err)
            this.setState({loggedIn : false})
              Alert.alert('Failed Login', 'server not connection',
              [
                {text: 'OK'},
              ],
              {cancelable: false},)
          })
    }
  }

  isLoading = () => {
    return (
      <ActivityIndicator size="large" color="#51A2DA" />
    )
  }

  textLogin = () => {
    return (
      <Text style={styles.buttonText}>Login</Text>
    )
  }

  render() {
    return(
      <View style={styles.containerLogin}>
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
          <Image source={require('../../../assets/logo.png')} style={styles.iconImage}/>
          <Text style={{fontSize: 20, color: '#ffffff', fontWeight: 'bold'}}>LOGIN ACCOUNT</Text>
          <View style={styles.box}>
            <Text style={styles.Text}>Email</Text>
            <TextInput
                style={styles.inputBox}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder="enter your email"
                placeholderTextColor = "#AEAEAE"
                selectionColor="#2FB675"
                keyboardType="email-address"
                onChangeText={(email) => this.setState({email})}
                onSubmitEditing={()=> this.password.focus()}
            />
          </View>
          <View style={styles.box}>
            <Text style={styles.Text}>Password</Text>
            <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="enter your password"
            secureTextEntry={true}
            placeholderTextColor = "#AEAEAE"
            onChangeText={(password) => this.setState({password})}
            ref={(input) => this.password = input}
            />
          </View>
          <TouchableOpacity type='submit'  onPress={() => this.handleSubmit(this.state.email, this.state.password)} style={styles.button}>
            {this.state.loggedIn ? this.isLoading() : this.textLogin()}
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('DebugSetting')}><Text style={styles.signupButton}>Setting</Text></TouchableOpacity>
        <View style={styles.signupTextCont}>
            <Text style={styles.signupText}>Do not have Account click here to </Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}><Text style={styles.signupButton}> Register</Text></TouchableOpacity>
        </View>
      </View>
    )
  }

}
export default Login


const styles = StyleSheet.create({
    container : {
        flexGrow: 1,
        justifyContent:'center',
        alignItems: 'center'
    },
    containerLogin : {
        backgroundColor:'#2FB675',
        flex: 1,
        alignItems:'center',
        justifyContent :'center',
        height:700
    },
    box:{
        marginHorizontal: "2%",
        marginVertical: 13
    },
    inputBox: {
        width:344,
        backgroundColor:'#FFFFFF',
        borderRadius: 10,
        paddingHorizontal:10,
        fontSize:20,
        color:'#000000',
        paddingVertical: 15,
    },
    button: {
        width:175,
        backgroundColor:'#ffffff',
        borderRadius: 10,
        marginTop:20,
        marginVertical: 5,
        paddingVertical: 5
    },
    Text: {
        fontSize:20,
        fontWeight: 'bold',
        color:'#FFFFFF',
        textAlign:'left'
    },
    buttonText: {
        fontSize:20,
        fontWeight:'bold',
        color:'#1E5028',
        textAlign:'center'
    },
    signupTextCont : {
        flexGrow: 1,
        alignItems:'flex-end',
        justifyContent :'center',
        paddingVertical:16,
        flexDirection:'row'
    },

    signupText: {
        color:'#ffffff',
        fontSize:16
    },

    signupButton: {
        color:'#ffffff',
        fontSize:16,
        fontWeight:'bold'
    },
    iconImage: {
      height: 150,
      resizeMode: 'contain'
    },

});
