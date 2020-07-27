import React, { Component } from 'react';
import Toast from 'react-native-root-toast';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Picker} from 'react-native';
import Axios from 'axios'
import {URL} from '../../publics/config';
import AsyncStorage from '@react-native-community/async-storage';
class Register extends Component {
  state = {
    name : '',
    email : '',
    password : '',
    currentPassword : '',
    url: URL,
    list_position: [],
    position: "",
    usr_level: 0,
    level: []
  }

  componentDidMount = async () => {
    let server_url = await AsyncStorage.getItem('debug');
    if (server_url) {
      this.setState({url : server_url})
    }
    
    await Axios.get(`${this.state.url}/level`)
    .then( async res => {
      let positionList = []
      let data = res.data.data
      for(let key = 0; key < data.length; key++){
        positionList.push(data[key].level)
      }
      this.setState({list_position: positionList, level: data})
    })
    .catch( err => {
      Toast.show('Failed get position', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
    })
    
  }

  handleSubmit = async (name, email, position, password, currentPassword) => {
    if(!name){
      Toast.show('enter your name', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
    }else if(!email){
      Toast.show('enter your email', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
    }else if(position == ""){
      Toast.show('select your position', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
    }else if(!password){
      Toast.show('enter your password', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
    }else if(!currentPassword){
        Toast.show('enter your current password', {
          duration: Toast.durations.LONG,
          position: 0,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,})
    }else if(currentPassword !== password){
        Toast.show("password and current password not match", {
          duration: Toast.durations.LONG,
          position: 0,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,})
    }else {
      const data = {
        name : this.state.name,
        username : this.state.username,
        email : this.state.email,
        password : this.state.password,
        level : this.state.usr_level
      }
      await Axios.post(`${this.state.url}/user/register`, data)
      .then( async res => {
        let data_login = {
          email : this.state.email,
          password : this.state.password,
        }
        await Axios.post(`${this.state.url}/user/login`, data_login)
          .then(async res => {
               
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
                    Toast.show('Register success', {
                      duration: Toast.durations.LONG,
                      position: 0,
                      shadow: true,
                      animation: true,
                      hideOnPress: true,
                      delay: 0,})
                      this.props.navigation.navigate('Project')
                  })
                }
          })
      })
      .catch(function (error) {
          Toast.show('Failed Register', {
            duration: Toast.durations.LONG,
            position: 0,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,})
      })
    }
  }

  positionList = () => {
    return ( 
      this.state.list_position.map((x, i) => {
        return (<Picker.Item label={x} key={i} value={x} />)
      })
    );
  }

  render() {
    return(
      <View style={styles.containerSignup}>
        <ScrollView>
        <View style={styles.container} behavior="padding" enabled>
          <Text style={{fontSize: 20, color: '#ffffff', fontWeight: 'bold'}}>REGISTER</Text>
              <View style={styles.Box}>
                <Text style={styles.Text}>Name</Text>
                <TextInput style={styles.inputBox}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder="enter your name"
                  placeholderTextColor = "#AEAEAE"
                  selectionColor="#fff"
                  onChangeText={text => this.setState({name : text})}
                  onSubmitEditing={()=> this.email.focus()}
                />
              </View>
              
              <View style={styles.Box}>
              <Text style={styles.Text}>Email</Text>
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="enter your email"
                    placeholderTextColor = "#AEAEAE"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onChangeText={text => this.setState({email : text})}
                    onSubmitEditing={()=> this.password.focus()}
                />
              </View>

              <View style={styles.Box}>
              <Text style={styles.Text}>Position</Text>
                <View style={styles.formSelect}>
                  <Picker
                    selectedValue={this.state.position}
                    onValueChange={(value, id) => {
                      this.setState({position: value})
                      for(let key= 0; key < this.state.level.length; key++){
                        if(value == this.state.level[key].level){
                          this.setState({usr_level : this.state.level[key].usr_level_id})
                         
                        }
                      } 
                    }}
                  >
                    <Picker.Item value="" label="Select Position" key={0}/>
                    { this.positionList() }
                  </Picker>
                </View>
              </View>

              <View style={styles.Box}>
              <Text style={styles.Text}>Password</Text>
                <TextInput style={styles.inputBox}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder="enter your password"
                  secureTextEntry={true}
                  placeholderTextColor = "#AEAEAE"
                  onChangeText={text => this.setState({password : text})}
                  ref={(input) => this.password = input}
                />
              </View>

              <View style={styles.Box}>
              <Text style={styles.Text}>Current Password</Text>
                <TextInput style={styles.inputBox}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder="enter your current password"
                  secureTextEntry={true}
                  placeholderTextColor = "#AEAEAE"
                  onChangeText={text => this.setState({currentPassword : text})}
                  ref={(input) => this.currentPassword = input}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={() => this.handleSubmit(this.state.name, this.state.email, this.state.usr_level, this.state.password, this.state.currentPassword)} >
               <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
        </View>
        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}><Text style={styles.signupButton}>Login</Text></TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    )
  }
}
export default Register


const styles = StyleSheet.create({
    container : {
        flexGrow: 1,
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor:'#1E5028',
    },
    containerSignup : {
        backgroundColor:'#1E5028',
        alignItems:'center',
        justifyContent :'center',
        flex:1,
        paddingTop: '10%',
        height: '100%'
    },
    Box : {
      marginHorizontal: "2%",
      marginVertical: 5,
      height: 80
    },
    Text: {
        fontSize:20,
        fontWeight: 'bold',
        color:'#FFFFFF',
        textAlign:'left'
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
    formSelect:{
      width:344,
      backgroundColor:'#FFFFFF',
      borderRadius: 10,
      paddingHorizontal:10,
      fontSize:20,
      color:'#000000',
    }

});
