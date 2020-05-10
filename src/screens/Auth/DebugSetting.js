import React, {Component} from 'react'
import { View, Text, Image, AsyncStorage, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput} from 'react-native';
import {URL} from '../../publics/config'

class Account extends Component {

    state = {
        debug : '',
        debugUrl : ''
    }

    handleSubmit = async () => {
        await AsyncStorage.setItem('debug', this.state.debug);
    }

    handleDelete = async () => {
        await AsyncStorage.removeItem('debug');
    }

    tesDebug = async () => {
        let debugUrl =  await AsyncStorage.getItem('debug')
        this.setState({debugUrl})
    }

    render() {

        return(
          <View style={styles.container}>
      
              <KeyboardAvoidingView behavior="padding" enabled>
                <View>
                  <Text >Debug</Text>
                  <TextInput
                      style={styles.inputBox}
                      placeholder="url debuging"
                      placeholderTextColor = "#AEAEAE"
                      selectionColor="#2FB675"
                      onChangeText={(debug) => this.setState({debug})}
                  />
                </View>
      
                <TouchableOpacity type='submit'  onPress={() => this.handleSubmit()}>
                  <Text>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity type='submit'  onPress={() => this.handleDelete()}>
                  <Text>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity type='submit'  onPress={() => this.tesDebug()}>
                  <Text>View Url</Text>
                </TouchableOpacity>
                <Text>URL OLD : {URL}</Text>
                <Text>URL NOW : {this.state.debugUrl}</Text>
              </KeyboardAvoidingView>
      
          </View>
        )
    }
}
export default Account

const styles = StyleSheet.create({
    container : {
        flexGrow: 1,
        alignItems: 'center'
    },
    button: {
        width:100,
        height: 80,
        backgroundColor:'#ffffff',
        paddingVertical: 13,
    },
    buttonLogout:{
        width:100,
        backgroundColor:'#892020',
        paddingVertical: 13,
    },
    TextLogout:{
        fontSize:12,
        fontWeight:'500',
        color:'#ffffff',
        textAlign:'center'
    },
    buttonTextOn: {
        color:'#1E5028',
        fontSize:14,
        fontWeight:'bold',
        textAlign:'center',
        bottom:3
    },
    buttonText: {
        fontSize:12,
        fontWeight:'bold',
        color:'#AEAEAE',
        textAlign:'center'
    },
    buttonTextLoout: {
        fontSize:12,
        fontWeight:'bold',
        color:'#FFFFFF',
        textAlign:'center'
    },
    footer:{
        flexDirection: 'row', 
        position: 'absolute', 
        bottom:0
    },
    icon: {
        height: 50,
        alignItems: 'center'
    },
    iconImage: {
        height: 40,
        width: 40,
        resizeMode: 'contain'
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
  });
  