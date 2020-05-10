import React, {Component} from 'react'
import { FlatList, View, Text, Image, AsyncStorage, TouchableOpacity, StyleSheet} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios'
import { NavigationEvents } from 'react-navigation'
class Project extends Component{
  state = {
      create: false
  }
  
  componentDidMount = async () => {
  }

  createReport = () => {
    return (
      <View style={styles.create}>
        {
          this.state.create ? 
          <TouchableOpacity style={styles.buttonCreateReport} >
            <Text style={styles.buttonTextSprint}>Create New Report</Text>
          </TouchableOpacity>
          : null
        }
        <TouchableOpacity style={styles.buttonCreate} onPress={() => { this.state.create ? this.setState({create : false}) : this.setState({create : true})}} >
          <Image source={require('../../../assets/create.png')} style={styles.iconCreate} />
        </TouchableOpacity>
      </View>
    )
  }

  headerReport = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerName}>Daily Report</Text>
        { this.searchButton() }
      </View>
    )
  }

  searchButton = () => {
    return (
      <TouchableOpacity style={styles.buttonsearch} >
        <Image source={require('../../../assets/search.png')} style={styles.iconEdit} />
      </TouchableOpacity>
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
              <Image source={require('../../../assets/report01.png')} style={styles.iconImage}/>
              </View>
              <Text style={styles.buttonTextOn}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Team')} style={styles.button} >
              <View style={styles.icon}>
              <Image source={require('../../../assets/team02.png')} style={styles.iconImage}/>
              </View>
              <Text style={styles.buttonText}>Team</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Account')} style={styles.button} >
              <View style={styles.icon}>
              <Image source={require('../../../assets/account02.png')} style={styles.iconImage}/>
              </View>
              <Text style={styles.buttonText}>Account</Text>
          </TouchableOpacity>
      </View>
    )
  }

 
  render() {
    return(
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()}/>
          {this.headerReport()}
          {this.buttonFooter()}
          {this.createReport()}
      </View>
    )

  }
}
export default Project



const styles = StyleSheet.create({
    container : {
      flexGrow: 1,
      alignItems: 'center'
    },
    sprintBoard : {
      width: '100%',
      alignItems: 'center',
      position: 'absolute',
      top: 60,
      bottom: 80
    },
    logoText : {
      marginVertical: 15,
      fontSize:20,
      color:'#51A2DA'
    },
    buttonCreateReport: {
      width:185,
      height: 35,
      backgroundColor:'#1E5028',
      justifyContent: 'center',
      borderRadius: 10,
      elevation: 5,
      alignItems: 'center',
      marginVertical: 5,
    },
    buttonTextSprint:{
      color:'#FFFFFF',
      fontSize:16,
      fontWeight:'bold',
      textAlign:'center',
    },
    buttonTextProject:{
      color:'#1E5028',
      fontSize:16,
      fontWeight:'bold',
      textAlign:'center',
    },
    buttonProject:{
      color:'#1E5028',
      fontSize:20,
      fontWeight:'bold',
      textAlign:'center',
    },
    button: {
      width:100,
      height: 80,
      backgroundColor:'#ffffff',
      paddingVertical: 13,
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
      textAlign:'center',
      bottom:3
    },
    footer:{
        flexDirection: 'row', 
        position: 'absolute', 
        bottom:0,
        backgroundColor:'#FFFFFF',
        width: '100%'
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
      alignItems: 'center'
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
    board: {
      width: '95%',
      height: 90,
      backgroundColor:'#FFFFFF',
      borderRadius: 20,
      elevation: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical : 5
    },
    boardSprint: {
      marginHorizontal: 5,
      width: '95%',
      height: 90,
      backgroundColor:'#FFFFFF',
      borderRadius: 20,
      elevation: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical : 5,
      marginHorizontal: 10
    },
    TextBoard: {
      color:'#AEAEAE',
      fontSize:16,
      fontWeight:'bold',
      textAlign:'center',
    },
    headerName: {
      color:'#1E5028',
      fontSize:25,
      fontWeight:'bold',
      textAlign:'center',
      marginLeft: 20
    },
    TextBoardSprint: {
      color:'#1E5028',
      fontSize:20,
      fontWeight:'bold',
      textAlign:'center',
    },
    buttonEdit: {
      height: 40,
      width: 40,
      borderRadius: 20,
      left: 10
    },
    iconEdit: {
      height: 40,
      width: 40,
      resizeMode: 'contain'
    },
    create:{
      position: 'absolute', 
      bottom: 90,
      alignItems: 'flex-end',
      right: 10
    },
    buttonCreate:{
      height: 65,
      width: 65,
    },
    iconCreate: {
      height: 65,
      width: 65,
      resizeMode: 'contain'
    },
    buttonsearch: {
      height: 40,
      width: 40,
      borderRadius: 20,
      position: 'absolute',
      right: 10
    },
    editView:{
      position: 'absolute',
      top: 60,
      left:10
    }
  
  });
  