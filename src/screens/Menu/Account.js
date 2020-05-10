import React, {Component} from 'react'
import { View, Text, Image, AsyncStorage, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput} from 'react-native';


class Account extends Component {

    state = {
        debug : '',
        debugUrl : '',
        edit: false
    }

    removeItem = async () => {
        let keys = ['token', 'user_data']
        await AsyncStorage.multiRemove(keys, (err) => {
            this.props.navigation.navigate('Auth')
        })
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

    buttonFooter = () => {
        return (
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Project')} style={styles.button} >
                    <View style={styles.icon}>
                    <Image source={require('../../../assets/project02.png')} style={styles.iconImage}/>
                    </View>
                    <Text style={styles.buttonText}>Projects</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Report')} style={styles.button} >
                    <View style={styles.icon}>
                    <Image source={require('../../../assets/report02.png')} style={styles.iconImage}/>
                    </View>
                    <Text style={styles.buttonText}>Report</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Team')} style={styles.button} >
                    <View style={styles.icon}>
                    <Image source={require('../../../assets/team02.png')} style={styles.iconImage}/>
                    </View>
                    <Text style={styles.buttonText}>Team</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Account')} style={styles.button} >
                    <View style={styles.icon}>
                    <Image source={require('../../../assets/account01.png')} style={styles.iconImage}/>
                    </View>
                    <Text style={styles.buttonTextOn}>Account</Text>
                </TouchableOpacity>
            </View>
        )
      }

    render() {

        return(
          <View style={styles.container}>
                {this.header()}
                {this.state.edit ? this.editView() : null}
                {this.buttonFooter()}
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
        bottom:0,
        backgroundColor:'#FFFFFF',
        width: '100%'
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
  