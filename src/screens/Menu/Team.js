import React, {Component} from 'react'
import { FlatList, View, Text, Image, AsyncStorage, TouchableOpacity, StyleSheet} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios'
import { NavigationEvents } from 'react-navigation'
import Toast from 'react-native-root-toast';
class Team extends Component{
  state = {
    url : URL,
    token : '',
    projects : {},
    canCreate : false
  }
  
  componentDidMount = async () => {
    let level = await AsyncStorage.getItem('user_data')
    level = JSON.parse(level)
    if(level.usr_level_id == 1){
      this.setState({canCreate : true})
    }
    const token = await AsyncStorage.getItem('token');
    this.setState({token : token})
    let server_url = await AsyncStorage.getItem('debug');
    if (server_url) {
      this.setState({url : server_url})
    }
    await Axios.get(`${this.state.url}/project`, {headers : {Authorization : token}})
    .then( async res => {
      this.setState({projects : res.data.data})
    })
    .catch( err => {
      Toast.show('Failed get projects', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
    })
  }

  isProject = () => {
    return(
      <View style={styles.containerProject}>
        <FlatList
          style = {{width : "100%"}}
          data = {this.state.projects}
          keyExtractor={({pr_id}, index) => pr_id}
          renderItem = {({item}) =>
          <TouchableOpacity style={styles.board} key={item.pr_id} 
            onPress={() => { this.handleSubmit(item.pr_id)} } >
            <Text style={styles.TextBoardProject}>{item.pr_name.length > 20 ? item.pr_name.substr(0,20)+'...' : item.pr_name}</Text>
            <Text style={styles.TextBoardProjectDesc} ellipsizeMode='tail' numberOfLines={2}>{item.pr_description}</Text>
          </TouchableOpacity>
          }
        />
      </View>
    )
  }
  nothingProject = () => {
    return (
      <TouchableOpacity style={styles.boardNo} >
        <Text style={styles.TextBoard}>No Project was created yet</Text>
      </TouchableOpacity>
    )
  }

  handleSubmit = async (pr_id) => {
    await AsyncStorage.setItem('pr_id', "" + pr_id)
    this.props.navigation.navigate('Project') 
  }

  header = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerName}>Team</Text>
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
              <Image source={require('../../../assets/report02.png')} style={styles.iconImage}/>
              </View>
              <Text style={styles.buttonText}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Team')} style={styles.button} >
              <View style={styles.icon}>
              <Image source={require('../../../assets/team01.png')} style={styles.iconImage}/>
              </View>
              <Text style={styles.buttonTextOn}>Team</Text>
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
          {this.header()}
          { this.state.projects.length ? this.isProject() :  this.nothingProject()}
          {this.buttonFooter()}
      </View>
    )

  }
}
export default Team



const styles = StyleSheet.create({
    container : {
      flexGrow: 1,
      alignItems: 'center'
    },
    containerProject : {
      width : '100%',
      position: 'absolute',
      top: 60,
      bottom: 80
    },
    headerName: {
      color:'#1E5028',
      fontSize:25,
      fontWeight:'bold',
      textAlign:'center',
      marginLeft: 20
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
    buttonsearch: {
      height: 40,
      width: 40,
      borderRadius: 20,
      position: 'absolute',
      right: 10
    },
    iconEdit: {
      height: 40,
      width: 40,
      resizeMode: 'contain'
    },
    footer:{
      flexDirection: 'row', 
      position: 'absolute', 
      bottom:0,
      backgroundColor:'#FFFFFF',
      width: '100%'
    },
    button: {
      width:100,
      height: 80,
      backgroundColor:'#ffffff',
      paddingVertical: 13,
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
    board: {
      width: '95%',
      height: 90,
      backgroundColor:'#FFFFFF',
      elevation: 10,
      alignItems: 'flex-start',
      marginVertical : 5,
      marginHorizontal: 10,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical:10
    },
    boardNo: {
      width: '100%',
      height: 90,
      backgroundColor:'#FFFFFF',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical : 5,
      elevation: 4
    },
    TextBoard: {
      color:'#AEAEAE',
      fontSize:16,
      fontWeight:'bold',
      textAlign:'center'
    },
    TextBoardProject: {
      color:'#1E5028',
      fontSize:20,
      fontWeight:'bold',
      textAlign:'center'
    },
    TextBoardProjectDesc:{
      color:'#1E5028',
      fontSize:14,
      fontWeight:'bold',
      textAlign: 'left'
    }

  
  });
  