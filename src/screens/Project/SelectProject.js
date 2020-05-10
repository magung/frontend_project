import React, {Component} from 'react'
import { View, Text, AsyncStorage, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {URL} from "../../publics/config";
import { NavigationEvents } from 'react-navigation'
import Axios from 'axios';
import Toast from 'react-native-root-toast';

class SelectProject extends Component{
  state = {
    url : URL,
    token : '',
    projects : {},
    canCreate : false
  }
  async componentDidMount() {
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

  isProject = () => {
    return(
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
    )
  }

  buttonCreateProject = () => {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate("CreateProject")} style={styles.buttonCreateProject} >
        <Text style={styles.buttonTextProject}>Create Project</Text>
      </TouchableOpacity>
    )
  }
 
  render() {
    return(
      <View>
          <NavigationEvents onDidFocus={() => this.componentDidMount()}/>
          <View style={this.state.canCreate ? styles.container : styles.containerNoBottom}>
            { this.state.projects.length ? this.isProject() :  this.nothingProject()}
            { this.state.canCreate ? this.buttonCreateProject() : null}
          </View>
      </View>
    )

  }
}
export default SelectProject



const styles = StyleSheet.create({
    container : {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
      marginBottom: 50
    },
    containerNoBottom : {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5
    },
  
    logoText : {
      marginVertical: 15,
      fontSize:20,
      color:'#51A2DA'
    },
    buttonCreateProject: {
      width:200,
      height: 35,
      backgroundColor:'#1E5028',
      justifyContent: 'center',
      borderRadius: 10,
      elevation: 5,
      alignItems: 'center',
      marginVertical: 10,
      position: 'relative'
    },
    buttonTextProject:{
      color:'#FFFFFF',
      fontSize:18,
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
    board: {
      marginHorizontal: 5,
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
  