import React, {Component} from 'react'
import { FlatList, View, Text, Image, AsyncStorage, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios'
import { NavigationEvents } from 'react-navigation'
class Sprint extends Component{
  state = {
    sprint_name : '',
    url: URL,
    sprints : [],
    pr_id: 0,
    create: false,
    edit: false,
    sp_id : 0,
    my_task : [],
    data_task: [],
    user_id: 0
  }
  
  componentDidMount = async () => {

    let token = await AsyncStorage.getItem('token')
    if (token !== null) {
      let user_data = await AsyncStorage.getItem('user_data')
      user_data = JSON.parse(user_data)
      this.setState({user_id : user_data.user_id})
    }else{
      this.props.navigation.navigate('Auth')
    }
    let server_url = await AsyncStorage.getItem('debug');
    if (server_url) {
      this.setState({url : server_url})
    }
    let sp_id = this.props.navigation.getParam('sp_id');
    this.setState({sp_id})
    await Axios.get(this.state.url + "/sprint/" + this.state.sp_id, {headers : {Authorization : token}})
    .then(res => {
      this.setState({
        sprint_name: res.data.data[0].sp_name
      })
    })

    // get my task
    await Axios.get(this.state.url + "/task/sprint/" + this.state.sp_id + "?owned_by=" + this.state.user_id , {headers : {Authorization : token}})
    .then(res => {
      if(res.data.data.length !== 0){
        this.setState({
          my_task: res.data.data
        })
      }
    })
    
    // get all task on sprint
    await Axios.get(this.state.url + "/task/sprint/" + this.state.sp_id, {headers : {Authorization : token}})
    .then(res => {
      if(res.data.data.length !== 0){
        this.setState({
          data_task: res.data.data
        })
      }
    })

  }

  createTask = () => {
    return (
      <View style={styles.create}>
        {
          this.state.create ? 
          <TouchableOpacity style={styles.buttonCreateTask} onPress={() => this.props.navigation.navigate('CreateTask', {sp_id : this.state.sp_id})}>
            <Text style={styles.buttonTextWhite}>Create New Task</Text>
          </TouchableOpacity>
          : null
        }
        <TouchableOpacity style={styles.buttonCreate} onPress={() => { this.state.create ? this.setState({create : false}) : this.setState({create : true})}} >
          <Image source={require('../../../assets/create.png')} style={styles.iconCreate} />
        </TouchableOpacity>
      </View>
    )
  }

  detailSprint = () => {
    return(
      <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailSprint', {sp_id : this.state.sp_id})} style={styles.buttonDetailSprint} >
        <Text style={styles.buttonTextGreen}>Detail Sprint</Text>
      </TouchableOpacity>
    )
  }

  editView = () => {
    return (
      <View style={styles.editView}>
        {this.detailSprint()}
      </View>
    )
  }

  nameSprint = () => {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailSprint', {sp_id : this.state.sp_id})}>
        <Text style={styles.sprintName}>{this.state.sprint_name.length > 20 ? this.state.sprint_name.substr(0,20)+'...' : this.state.sprint_name}</Text>
      </TouchableOpacity>
    )
     
  }

  editButton = () => {
    return (
      <TouchableOpacity style={styles.buttonEdit} onPress={() => {this.state.edit ? this.setState({edit:false}) : this.setState({edit:true})} }>
        <Image source={require('../../../assets/edit.png')} style={styles.iconEdit} />
      </TouchableOpacity>
    )
  }

  backButton = () => {
    return (
      <TouchableOpacity style={styles.buttonBack} onPress={() => this.props.navigation.goBack() }>
        <Image source={require('../../../assets/back.png')} style={styles.iconEdit} />
      </TouchableOpacity>
    )
  }

  headerSprint = () => {
    return (
      <View style={styles.header}>
        { this.backButton()}
        { this.nameSprint()}
        { this.editButton()}
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

  noTask = () => {
    return (
      <FlatList
        style = {{width : "100%"}}
        data = {[
          {title : "You not have a task"}
        ]}
        renderItem = {({item}) =>
        <TouchableOpacity style={styles.board} >
          <Text style={styles.TextBoardGrey}>{item.title}</Text>
        </TouchableOpacity>
        }
      />
    )
  }

  myTask = () => {
    return (
      <FlatList
        style = {{width : "100%"}}
        data = {this.state.my_task}
        renderItem = {({item}) =>
        <TouchableOpacity style={styles.boardTask} onPress={() => this.props.navigation.navigate('DetailTask', {task_id : item.task_id})}>
          <Text style={styles.TextBoardGreen}>{item.title}</Text>
        </TouchableOpacity>
        }
      />
    )
  }
 
  render() {
    return(
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()}/>
          {this.headerSprint()}
          {this.state.data_task.length === 0 ? this.noTask() : this.myTask()}
          {this.createTask()}
          {this.state.edit ? this.editView() : null}
      </View>
    )

  }
}
export default Sprint



const styles = StyleSheet.create({
    container : {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent : 'center'
    },
    logoText : {
      marginVertical: 15,
      fontSize:20,
      color:'#51A2DA'
    },
    buttonCreateTask: {
      width:185,
      height: 35,
      backgroundColor:'#1E5028',
      justifyContent: 'center',
      borderRadius: 10,
      elevation: 5,
      alignItems: 'center',
      marginVertical: 5,
    },
    buttonDetailSprint: {
      width:150,
      height: 35,
      backgroundColor:'#FFFFFF',
      borderWidth: 2,
      borderColor: '#1E5028',
      borderRadius: 10,
      elevation: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 5
    },
    buttonTextWhite:{
      color:'#FFFFFF',
      fontSize:16,
      fontWeight:'bold',
      textAlign:'center',
    },
    buttonTextGreen:{
      color:'#1E5028',
      fontSize:16,
      fontWeight:'bold',
      textAlign:'center',
    },
    button: {
      width:100,
      height: 80,
      backgroundColor:'#ffffff',
      paddingVertical: 13,
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
      height: 60,
      backgroundColor:'#FFFFFF',
      borderRadius: 10,
      elevation: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical : 5,
      marginHorizontal : 10
    },
    boardTask: {
      width: '95%',
      height: 60,
      backgroundColor:'#FFFFFF',
      borderRadius: 10,
      elevation: 10,
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginVertical : 5,
      marginHorizontal : 10,
      paddingHorizontal : 10
    },
    TextBoardGrey: {
      color:'#AEAEAE',
      fontSize:16,
      fontWeight:'bold',
      textAlign:'center',
    },
    TextBoardGreen: {
      color:'#1E5028',
      fontSize:20,
      fontWeight:'bold',
      textAlign:'center',
    },
    sprintName: {
      color:'#1E5028',
      fontSize:25,
      fontWeight:'bold',
      textAlign:'center'
    },
    buttonEdit: {
      height: 40,
      width: 40,
      borderRadius: 20,
      right: 10,
      position: 'absolute'
    },
    buttonBack: {
      height: 40,
      width: 40,
      borderRadius: 20,
      left: 10,
      position: 'absolute'
    },
    iconEdit: {
      height: 40,
      width: 40,
      resizeMode: 'contain'
    },
    create:{
      position: 'absolute', 
      bottom: 10,
      alignItems: 'flex-end',
      right: 10,
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
      right: 10,
      
    }
  
  });
  