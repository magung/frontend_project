import React, {Component} from 'react'
import { View, Text, Image, AsyncStorage, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Button, Alert} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios'
import ImagePicker from 'react-native-image-picker';

class Account extends Component {

    state = {
        url : URL,
        token : '',
        filePath : null,
        user_id: 0,
        image: null
    }

    componentDidMount = async () => {
        const token = await AsyncStorage.getItem('token');
        this.setState({token : token})
        let server_url = await AsyncStorage.getItem('debug');
        if (server_url) {
            this.setState({url : server_url})
        }
        let user_id = this.props.navigation.getParam('user_id');
        this.setState({user_id})
        let image = this.props.navigation.getParam('image');
        this.setState({image})
    }

    uploadImage = async () => {
        const createFormData = (photo) => {
            const data = new FormData();
          
            data.append("image", {
              name: photo.fileName,
              type: photo.type,
              uri:photo.uri
                // Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
            });
            return data;
        };
        await Axios.put(this.state.url + "/user/photo/" + this.state.user_id, createFormData(this.state.filePath), {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            Alert.alert("Success", "upload foto sukses")
        })
        .catch(err=>{
            console.log(err)
        })
    }


    chooseFile = () => {
        var options = {
          title: 'Select Image',
          customButtons: [
            { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
          ],
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, response => {
          console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            alert(response.customButton);
          } else {
            let source = response;
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
            this.setState({
              filePath: source,
            });
          }
        });
    };


    


    render() {

        return(
          <View style={styles.container}>
                <TouchableOpacity style={{width: '100%', minHeight: '50%', borderRadius: 100, marginVertical: 10, alignItems: 'center'}} >
                    
                    {this.state.filePath === null ?
                    this.state.image === null ?
                    <Image source={require('../../../assets/profile01.png')} style={{resizeMode: 'contain', width: '90%', minHeight: '50%'}} />
                    :
                    <Image source={{uri: this.state.url + "/user/image/" + this.state.image}} style={{resizeMode: 'contain', width: '90%', minHeight: '50%'}} />
                    :
                    <Image source={{ uri: this.state.filePath.uri }} style={{resizeMode: 'contain', width: '90%', minHeight: '50%'}} />
                    }
                </TouchableOpacity>
                <Button title="Choose File" onPress={this.chooseFile.bind(this)} />
                <Button title="Upload" onPress={() => this.uploadImage()} />
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
  