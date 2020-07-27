import React, {Component} from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Button} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios'
import { NavigationEvents } from 'react-navigation'
import AsyncStorage from '@react-native-community/async-storage';
class Account extends Component {

    state = {
        url : URL,
        token : '',
        edit: false,
        name: 'Agung Maulana',
        email: 'agung@gmail.com',
        position: 'Vice President',
        image: null,
        user_id: 0,
        filePath : null
    }

    componentDidMount = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({token : token})
        let server_url = await AsyncStorage.getItem('debug');
        if (server_url) {
            this.setState({url : server_url})
        }
        await Axios.get(this.state.url + "/user/profile", {headers : {Authorization : token}})
        .then(res => {
            console.log(res.data.data)
            this.setState({
                user_id : res.data.data.user_id,
                name : res.data.data.name,
                email: res.data.data.email,
                position: res.data.data.level,
                image: res.data.data.image
            })
        })
    }

    removeItem = async () => {
        let keys = ['token', 'user_data', 'pr_id']
        await AsyncStorage.multiRemove(keys, (err) => {
            this.props.navigation.navigate('Auth')
        })
    }    

    dataProfile = () => {
        return(
            <View style={{width: '90%', height: '80%', position: 'absolute', bottom: 0, backgroundColor: '#FFFFFF', elevation: 10, alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                {this.imageProfile()}
                <View style={{marginTop: 120, backgroundColor: '#FFFFFF', elevation: 10, width: '90%', height: '10%', borderRadius: 10, justifyContent: 'center'}}>
                    <Text style={{position:'absolute', top: -30, color: '#1E5028', fontWeight: 'bold', fontSize: 20}}>Name</Text>
                    <Text style={{color: '#1E5028', fontWeight: 'bold', fontSize: 20, marginLeft: 20}}>{this.state.name.length > 20 ? this.state.name.substr(0,20)+'...' : this.state.name}</Text>
                </View>
                <View style={{marginTop: 35, backgroundColor: '#FFFFFF', elevation: 10, width: '90%', height: '10%', borderRadius: 10, justifyContent: 'center'}}>
                    <Text style={{position:'absolute', top: -30, color: '#1E5028', fontWeight: 'bold', fontSize: 20}}>Email</Text>
                    <Text style={{color: '#1E5028', fontWeight: 'bold', fontSize: 20, marginLeft: 20}}>{this.state.email.length > 20 ? this.state.email.substr(0,20)+'...' : this.state.email}</Text>
                </View>
                <View style={{marginTop: 35, backgroundColor: '#FFFFFF', elevation: 10, width: '90%', height: '10%', borderRadius: 10, justifyContent: 'center'}}>
                    <Text style={{position:'absolute', top: -30, color: '#1E5028', fontWeight: 'bold', fontSize: 20}}>Position</Text>
                    <Text style={{color: '#1E5028', fontWeight: 'bold', fontSize: 20, marginLeft: 20}}>{this.state.position.length > 20 ? this.state.position.substr(0,20)+'...' : this.state.position}</Text>
                </View>
            </View>
        )
    }

    imageProfile = () => {
        return(
            <View style={{position: 'absolute', top: -100}}>
                <NavigationEvents onDidFocus={() => this.componentDidMount()}/>
                <TouchableOpacity style={{width: 200, height: 200, borderRadius: 100}} onPress={() => this.props.navigation.navigate('ImageProfile', {user_id : this.state.user_id, image: this.state.image})}>
                    {this.state.image === null ?
                    <Image source={require('../../../assets/profile01.png')} style={{resizeMode: 'cover', width: 200, height:200, borderRadius: 100}} />
                    :
                    <Image source={{uri: this.state.url + "/user/image/" + this.state.image}} style={{resizeMode: 'cover', width: 200, height:200, borderRadius: 100}} />
                    }
                </TouchableOpacity>
            </View>
        )
    }

    viewAcount = () => {
        return (
            <View style={{width: '100%', position: 'absolute', top: 60, bottom: 80, minHeight: '100%', backgroundColor: '#FFFFFF', alignItems: 'center'}}>
          
                {this.dataProfile()}
            </View>
        )
    }

    editButton = () => {
        return (
            <TouchableOpacity style={styles.buttonEdit} onPress={() => {this.state.edit ? this.setState({edit:false}) : this.setState({edit:true})} }>
            <Image source={require('../../../assets/edit.png')} style={styles.iconEdit} />
            </TouchableOpacity>
        )
    }

    editView = () => {
        return (
            <View style={styles.editView}>
                <TouchableOpacity onPress={() => this.removeItem()} style={styles.buttonLogout} >  
                    <Text style={styles.buttonTextLoout}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("DebugSetting")} style={styles.buttonLogout} >  
                    <Text style={styles.buttonTextLoout}>Setting URL</Text>
                </TouchableOpacity>
            </View>
        )
    }
    

    header = () => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerName}>Account</Text>
                {this.editButton()}
            </View>
        )
    }

    

    render() {

        return(
          <View style={styles.container}>
                {this.header()}
                {this.viewAcount()}
                {this.state.edit ? this.editView() : null}
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
        width:"25%",
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
        bottom:0,
        backgroundColor:'#FFFFFF',
        width: '100%',
        elevation: 10
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
    header:{
        flexDirection: 'row', 
        top:0,
        backgroundColor:'#FFFFFF',
        width: '100%',
        height: 60,
        marginBottom: 5,
        elevation: 5,
        shadowColor: "#000000",
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerName: {
        color:'#1E5028',
        fontSize:25,
        fontWeight:'bold',
        textAlign:'center',
        marginLeft: 20,
    },
    iconEdit: {
        height: 40,
        width: 40,
        resizeMode: 'contain'
    },
    buttonEdit: {
        height: 40,
        width: 40,
        borderRadius: 20,
        right: 10,
        position: 'absolute'
    },
    editView: {
        top: 70,
        right: 10,
        position: "absolute"
    }
  });
  