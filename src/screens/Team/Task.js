import React, {Component} from 'react'
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios'
import { NavigationEvents } from 'react-navigation'
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
class TeamTask extends Component{
  state = {
    url : URL,
    token : '',
    tasks : [],
    canCreate : false,
    sprint_name: "Sprint 1",
    sp_id: 0,
    sprint: [
      {
        task_ongoing : 0,
        task_onprocess : 0,
        task_done : 0,
        task_achived : 0,
        task_unachived : 0,
        task_deployed : 0,
        p_ongoing : 0,
        p_onprocess : 0,
        p_done : 0,
        p_achived : 0,
        p_unachived : 0,
        p_deployed : 0,
        total_task: 0
      }
    ]
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
    let sp_id = await AsyncStorage.getItem('sp_id');
    if(sp_id){
      this.setState({sp_id : sp_id})
    }
    let sp_name = await AsyncStorage.getItem('sp_name');
    if(sp_name){
      this.setState({sprint_name : sp_name})
    }
    await Axios.get(this.state.url + "/task/sprint/" + this.state.sp_id, {headers : {Authorization : token}})
    .then(res => {
      if(res.data.data.length !== 0){
        this.setState({
          tasks: res.data.data
        })
      }
    })
    let pr_id = await AsyncStorage.getItem('pr_id');
    await Axios.get(`${this.state.url}/sprint/progress/${pr_id}?sp_id=`+sp_id, {headers : {Authorization : token}})
    .then(async result => {
      this.setState({sprint : result.data.data})
    })
  }

  updateStatusTask = async (status_id, task_id) => {
    let data = {
      status_id: status_id
    }
     // insert task
    await Axios.put(this.state.url + "/task/" + task_id, data, {headers : {Authorization : this.state.token}})
    .then(res => {
      let msg = "success update status task"
      Toast.show( msg, {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
      this.componentDidMount()
    })
    .catch(err => {
      let msg = "failed update status task"
      Toast.show( msg, {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
    })
  }

  buttonStartStatus = (task_id) => {
    return (
      <TouchableOpacity style={styles.buttonStatusTask} onPress={() => this.updateStatusTask(2, task_id)}>
        <Text style={styles.TextButtonStatus}>
          START
        </Text>
      </TouchableOpacity>
    )
  }
  buttonFinishStatus = (task_id) => {
    return (
      <TouchableOpacity style={styles.buttonStatusTaskFinish} onPress={() => this.updateStatusTask(3, task_id)}>
        <Text style={styles.TextButtonStatusFinish}>
          FINISH
        </Text>
      </TouchableOpacity>
    )
  }
  buttonNeedAchivedStatus = (task_id) => {
    return (
      <View style={styles.buttonNeedAchived}>
        <TouchableOpacity style={styles.buttonStatusTaskAccept} onPress={() => this.updateStatusTask(4, task_id)}>
          <Text style={styles.TextButtonStatusAccept}>
            ACCEPT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStatusTaskReject} onPress={() => this.updateStatusTask(5, task_id)}>
          <Text style={styles.TextButtonStatusReject}>
            REJECT
          </Text>
        </TouchableOpacity>
      </View>
      
    )
  }
  buttonUnAchivedStatus = () => {
    return (
      <View style={styles.buttonStatusTaskUnachived}>
        <Text style={styles.TextButtonStatusUnachived}>
          UNACHIVED
        </Text>
      </View>
    )
  }
  buttonDeployStatus = (task_id) => {
    return (
      <TouchableOpacity style={styles.buttonStatusTaskDeploy} onPress={() => this.updateStatusTask(6, task_id)}>
        <Text style={styles.TextButtonStatusDeploy}>
          DEPLOY
        </Text>
      </TouchableOpacity>
    )
  }
  buttonDeployedStatus = () => {
    return (
      <View style={styles.buttonStatusTaskFinish}>
        <Text style={styles.TextButtonStatusFinish}>
          DEPLOYED
        </Text>
      </View>
    )
  }

  TeamTask = () => {
    return(
      <View style={styles.containerTask}>
        <FlatList
          style = {{width : "100%"}}
          data = {this.state.tasks}
          keyExtractor={({task_id}, index) => task_id}
          renderItem = {({item}) =>
          <TouchableOpacity style={styles.board} key={item.task_id} 
            onPress={() => { this.handleSubmit(item.task_id)} } >
            <Text style={styles.TextBoardTask}>{item.title.length > 20 ? item.title.substr(0,20)+'...' : item.title}</Text>
            <Text style={styles.TextBoardTaskDesc} ellipsizeMode='tail' numberOfLines={2}>{item.owned_by_name}</Text>
            {item.status_id == 1 ? this.buttonStartStatus(item.task_id) : null}
            {item.status_id == 2 ? this.buttonFinishStatus(item.task_id) : null}
            {item.status_id == 3 ? this.buttonNeedAchivedStatus(item.task_id) : null}
            {item.status_id == 4 ? this.buttonDeployStatus(item.task_id) : null}
            {item.status_id == 5 ? this.buttonUnAchivedStatus() : null}
            {item.status_id == 6 ? this.buttonDeployedStatus() : null}
          </TouchableOpacity>
          }
        />
      </View>
    )
  }
  nothingTask = () => {
    return (
      <TouchableOpacity style={styles.boardNo} >
        <Text style={styles.TextBoard}>No Tasks was created yet</Text>
      </TouchableOpacity>
    )
  }

  handleSubmit = async (task_id) => {
    await AsyncStorage.setItem('task_id', "" + task_id)
    // this.props.navigation.navigate('Project') 
  }

  header = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerName}>Team</Text>
        <TouchableOpacity 
            style={{width: 200, height: 35,  borderRadius: 10, borderWidth: 1, borderColor: '#1E5028', position: 'absolute', right: 10, alignItems: 'center'}}
            onPress={() => this.props.navigation.goBack()}>
             <Text style={styles.sprintName}>{this.state.sprint_name.length > 10 ? this.state.sprint_name.substr(0,10)+'...' : this.state.sprint_name}</Text>
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

  footer = () => {
    return (
      <View style={styles.footer}>
        <View style={{width: '50%', height: 90}}>
          <View style={{width: '100%', height: 30, justifyContent: 'center', paddingHorizontal: '2%', backgroundColor: '#FFFFFF'}}>
            <Text style={{color:'#1E5028'}}>ongoing : {this.state.sprint[0].task_ongoing} | {this.state.sprint[0].p_ongoing == null ? 0 : this.state.sprint[0].p_ongoing}% </Text>
          </View>
          <View style={{width: '100%', height: 30, justifyContent: 'center', paddingHorizontal: '2%', backgroundColor: '#1E5028'}}>
            <Text style={{color:'#FFFFFF'}}>onprocess : {this.state.sprint[0].task_onprocess} | {this.state.sprint[0].p_onprocess == null ? 0 : this.state.sprint[0].p_onprocess}% </Text>
          </View>
          <View style={{width: '100%', height: 30, justifyContent: 'center', paddingHorizontal: '2%', backgroundColor: '#D3390B'}}>
            <Text style={{color:'#FFFFFF'}}>done : {this.state.sprint[0].task_done} | {this.state.sprint[0].p_done  == null ? 0 : this.state.sprint[0].p_done}% </Text>
          </View>
        </View>
        <View style={{width: '50%', height: 90}}>
        <View style={{width: '100%', height: 30, justifyContent: 'center', paddingHorizontal: '2%', backgroundColor: '#D3390B'}}>
            <Text style={{color:'#FFFFFF'}}>achived : {this.state.sprint[0].task_achived} | {this.state.sprint[0].p_achived  == null ? 0 : this.state.sprint[0].p_achived}% </Text>
          </View>
          <View style={{width: '100%', height: 30, justifyContent: 'center', paddingHorizontal: '2%', backgroundColor: '#892020'}}>
            <Text style={{color:'#FFFFFF'}}>unachived : {this.state.sprint[0].task_unachived} | {this.state.sprint[0].p_unachived  == null ? 0 : this.state.sprint[0].p_unachived}% </Text>
          </View>
          <View style={{width: '100%', height: 30, justifyContent: 'center', paddingHorizontal: '2%', backgroundColor: '#1E5028'}}>
            <Text style={{color:'#FFFFFF'}}>deployed : {this.state.sprint[0].task_deployed} | {this.state.sprint[0].p_deployed  == null ? 0 : this.state.sprint[0].p_deployed}% </Text>
          </View>
        </View>
      </View>
    )
  }

 
  render() {
    return(
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()}/>
          {this.header()}
          {this.state.tasks.length !== 0 ? this.TeamTask() : this.nothingTask()}
          {this.footer()}
          <View style={{width: '100%', height: 30, justifyContent: 'center', paddingHorizontal: '2%', backgroundColor: '#FFFFFF', position: 'absolute', bottom: 0, alignItems: 'center'}}>
            <Text style={{color:'#1E5028'}}>total : {this.state.sprint[0].total_task} </Text>
          </View>
      </View>
    )

  }
}
export default TeamTask



const styles = StyleSheet.create({
    container : {
      flexGrow: 1,
      alignItems: 'center'
    },
    containerTask : {
      width : '100%',
      position: 'absolute',
      top: 60,
      bottom: 120
    },
    headerName: {
      color:'#1E5028',
      fontSize:25,
      fontWeight:'bold',
      textAlign:'center',
      marginLeft: 20
    },
    sprintName: {
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
      width: '100%',
      height: 90,
      elevation: 10,
      bottom: 30
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
      height: 60,
      backgroundColor:'#FFFFFF',
      elevation: 10,
      alignItems: 'flex-start',
      marginVertical : 5,
      marginHorizontal: 10,
      borderRadius: 10,
      paddingHorizontal: 10,
      justifyContent: 'center'
    },
    boardNo: {
      width: '95%',
      height: 60,
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
    TextBoardTask: {
      color:'#1E5028',
      fontSize:20,
      fontWeight:'bold',
      textAlign:'center'
    },
    TextBoardTaskDesc:{
      color:'#1E5028',
      fontSize:14,
      fontWeight:'bold',
      textAlign: 'left'
    },
    buttonStatusTask:{
        position:'absolute',
        right:20,
        borderColor:'#1E5028',
        borderWidth:1,
        padding:5,
        borderRadius:5
      },
      TextButtonStatus: {
        color:'#1E5028',
        fontSize:16,
        textAlign:'center',
      },
      buttonStatusTaskFinish:{
        position:'absolute',
        right:20,
        borderColor:'#1E5028',
        backgroundColor: '#1E5028',
        borderWidth:1,
        padding:5,
        borderRadius:5
      },
      TextButtonStatusFinish: {
        color:'#FFFFFF',
        fontSize:16,
        textAlign:'center',
      },
      buttonStatusTaskAccept:{
        position:'absolute',
        left:0,
        width: 80,
        marginRight: 10,
        borderColor:'#1E5028',
        backgroundColor: '#1E5028',
        borderWidth:1,
        padding:5,
        borderRadius:5
      },
      TextButtonStatusAccept: {
        color:'#FFFFFF',
        fontSize:16,
        textAlign:'center',
      },
      buttonStatusTaskReject:{
        position:'absolute',
        right:0,
        width: 80,
        borderColor:'#892020',
        backgroundColor: '#892020',
        borderWidth:1,
        padding:5,
        borderRadius:5
      },
      TextButtonStatusReject: {
        color:'#FFFFFF',
        fontSize:16,
        textAlign:'center',
      },
      buttonNeedAchived:{
        position:'absolute',
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: 165
      },
      buttonStatusTaskUnachived:{
        position:'absolute',
        right:20,
        borderColor:'#892020',
        backgroundColor: '#892020',
        borderWidth:1,
        padding:5,
        borderRadius:5
      },
      TextButtonStatusUnachived: {
        color:'#FFFFFF',
        fontSize:16,
        textAlign:'center',
      },
      buttonStatusTaskDeploy:{
        position:'absolute',
        right:20,
        borderColor:'#D3390B',
        backgroundColor: '#D3390B',
        borderWidth:1,
        padding:5,
        borderRadius:5
      },
      TextButtonStatusDeploy: {
        color:'#FFFFFF',
        fontSize:16,
        textAlign:'center',
      },

  
  });
  