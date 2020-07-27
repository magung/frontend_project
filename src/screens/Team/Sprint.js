import React, {Component} from 'react'
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios'
import { NavigationEvents } from 'react-navigation'
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
class TeamSprint extends Component{
  state = {
    url : URL,
    token : '',
    sprints : [
        {
            sp_id: 1,
            sp_name: "Sprint 1",
            p_deployed: 100,
            sp_description: "sprint 1 "
        },
        {
            sp_id: 2,
            sp_name: "Sprint 2",
            p_deployed: 80,
            sp_description: "sprint 2 untuk project web"
        },
        {
            sp_id: 3,
            sp_name: "Sprint 3",
            p_deployed: 90,
            sp_description: "sprint 3 untuk project \nmobile"
        }
    ],
    canCreate : false,
    project_name: "Project 1",
    pr_id: 0
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
    let pr_id = await AsyncStorage.getItem('pr_id');
    if(pr_id){
      this.setState({pr_id : pr_id})
    }
    let pr_name = await AsyncStorage.getItem('pr_name');
    if(pr_name){
      this.setState({project_name : pr_name})
    }

    await Axios.get(`${this.state.url}/sprint/progress/${this.state.pr_id}`, {headers : {Authorization : token}})
    .then(async result => {
      this.setState({sprints : result.data.data})
    })
  }

  teamSprint = () => {
    return(
      <View style={styles.containerSprint}>
        <FlatList
          style = {{width : "100%"}}
          data = {this.state.sprints}
          keyExtractor={({sp_id}, index) => sp_id}
          renderItem = {({item}) =>
          <TouchableOpacity style={styles.board} key={item.sp_id} 
            onPress={() => { this.handleSubmit(item.sp_id, item.sp_name)} } >
            <Text style={styles.TextBoardSprint}>{item.sp_name.length > 20 ? item.sp_name.substr(0,20)+'...' : item.sp_name}</Text>
            <Text style={styles.TextBoardSprintDesc} ellipsizeMode='tail' numberOfLines={2}>{item.sp_description.length > 30 ? item.sp_description.substr(0,30)+'...' : item.sp_description}</Text>
            <View style={{position:'absolute', right: 20, top: '20%', alignItems: 'center'}}>
                <Text style={{fontSize:30, fontWeight: 'bold', color: '#1E5028'}}>{item.p_deployed !== null ? item.p_deployed : 0} %</Text>
                <View style={{width:100, height:5, backgroundColor: '#AEAEAE'}}>
                    <View style={{width: (item.p_deployed !== null ? item.p_deployed : 0), height:5, backgroundColor: '#1E5028'}}></View>
                </View>
            </View>
          </TouchableOpacity>
          }
        />
      </View>
    )
  }
  nothingSprint = () => {
    return (
      <TouchableOpacity style={styles.boardNo} >
        <Text style={styles.TextBoard}>No Sprint was created yet</Text>
      </TouchableOpacity>
    )
  }

  handleSubmit = async (sp_id, sp_name) => {
    await AsyncStorage.setItem('sp_id', "" + sp_id)
    await AsyncStorage.setItem('sp_name', "" + sp_name)
    this.props.navigation.navigate('TeamTask') 
  }

  header = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerName}>Team</Text>
        <TouchableOpacity 
            style={{width: 200, height: 35,  borderRadius: 10, borderWidth: 1, borderColor: '#1E5028', position: 'absolute', right: 10, alignItems: 'center'}}
            onPress={() => this.props.navigation.goBack()}>
             <Text style={styles.projectName}>{this.state.project_name.length > 10 ? this.state.project_name.substr(0,10)+'...' : this.state.project_name}</Text>
        </TouchableOpacity>
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

 
  render() {
    return(
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()}/>
          {this.header()}
          {this.state.sprints.length !== 0 ? this.teamSprint() : this.nothingSprint()}
      </View>
    )

  }
}
export default TeamSprint



const styles = StyleSheet.create({
    container : {
      flexGrow: 1,
      alignItems: 'center'
    },
    containerSprint : {
      width : '100%',
      position: 'absolute',
      top: 60
    },
    headerName: {
      color:'#1E5028',
      fontSize:25,
      fontWeight:'bold',
      textAlign:'center',
      marginLeft: 20
    },
    projectName: {
        color:'#1E5028',
        fontSize:25,
        fontWeight:'bold',
        textAlign:'center'
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
      width:"25%",
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
      paddingVertical:'2%'
    },
    boardNo: {
      width: '95%',
      height: 90,
      backgroundColor:'#FFFFFF',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical : 5,
      marginHorizontal: '2%',
      elevation: 4
    },
    TextBoard: {
      color:'#AEAEAE',
      fontSize:16,
      fontWeight:'bold',
      textAlign:'center'
    },
    TextBoardSprint: {
      color:'#1E5028',
      fontSize:20,
      fontWeight:'bold',
      textAlign:'center'
    },
    TextBoardSprintDesc:{
      color:'#1E5028',
      fontSize:14,
      fontWeight:'bold',
      textAlign: 'left'
    }

  
  });
  