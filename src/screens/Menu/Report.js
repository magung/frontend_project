import React, {Component} from 'react'
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, Modal, TouchableHighlight} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios'
import { NavigationEvents } from 'react-navigation'
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
class Report extends Component{
  state = {
      user_id : 0,
      create: false,
      pr_id : 0,
      url : URL,
      token: '',
      project_name : '',
      progress: [],
      modalVisible: false,
      show_sprint: false,
      sprints: [],
      total_sprints: 0,
      show_task: false,
      tasks: [],
      total_tasks: 0,
      show_task_ongoing: false,
      task_ongoing: [],
      total_ongoing: 0,
      show_task_onprocess: false,
      task_onprocess: [],
      total_onprocess: 0,
      show_task_done: false,
      task_done: [],
      total_done: 0,
      show_task_achive: false,
      task_achived: [],
      total_achive: 0,
      show_task_unachive: false,
      task_unachived: [],
      total_unachive: 0,
      show_task_deploy: false,
      task_deployed: [],
      total_deploy: 0,
      show_member: false,
      members: [],
      total_members: 0,
      showReport : false,
      reports : []
  }
  
  componentDidMount = async () => {
    let token = await AsyncStorage.getItem('token')
    this.setState({token})
    let server_url = await AsyncStorage.getItem('debug');
    if (server_url) {
      this.setState({url : server_url})
    }
    let level = await AsyncStorage.getItem('user_data')
    level = JSON.parse(level)
    if(level.usr_level_id == 1 || level.usr_level_id == 2){
      this.setState({showReport : true})
    }
    this.setState({user_id: level.user_id})
    let pr_id = await AsyncStorage.getItem('pr_id');
    if(pr_id){
      this.setState({pr_id : pr_id})
    }
    await Axios.get(`${this.state.url}/project/progress`, {headers : {Authorization : token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({progress: res.data.data})
      }
    })
    await Axios.get(`${this.state.url}/report?sort=asc&pr_id=`+pr_id, {headers : {Authorization : token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({reports: res.data.data})
      }
    })
    // if (this.state.pr_id != 0){
    //   await Axios.get(`${this.state.url}/project/${pr_id}`, {headers : {Authorization : token}})
    //   .then( async res => {
    //     if(res.data.status == 200) {
    //       this.setState({project_name : res.data.data[0].pr_name})
    //     }
    //   })
    // } else{
    //   await Axios.get(`${this.state.url}/project`, {headers : {Authorization : token}})
    //   .then( async res => {
    //     if(res.data.status == 200) {
    //       if(res.data.data.length != 0) {
    //         this.setState({pr_id : res.data.data[0].pr_id})
    //         this.setState({project_name : res.data.data[0].pr_name})
    //       } else {
    //         Alert.alert('Warning', 'Do want to delete this Project',
    //         [
    //           {text: 'OK', onPress: () => this.props.navigation.navigate('NoProject')}
    //         ],
    //         {cancelable: false},)
    //       }
    //     }
    //   })
    // }
  }

  submitSprintId = async (sp_id, sp_name) => {
    await AsyncStorage.setItem('pr_id', "" + this.state.pr_id)
    await AsyncStorage.setItem('pr_name', "" + this.state.project_name)
    await AsyncStorage.setItem('sp_id', "" + sp_id)
    await AsyncStorage.setItem('sp_name', "" + sp_name)
    this.props.navigation.navigate('TeamTask') 
  }

  getSprintProject = async (pr_id) => {
    await Axios.get(`${this.state.url}/sprint/project/` + pr_id, {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({sprints: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })
  }

  getAllTask = async (pr_id) => {
    await Axios.get(`${this.state.url}/task?pr_id=` + pr_id, {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({tasks: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })

    await Axios.get(`${this.state.url}/task?pr_id=` + pr_id + '&status=ongoing', {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({task_ongoing: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })

    await Axios.get(`${this.state.url}/task?pr_id=` + pr_id + '&status=onprocess', {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({task_onprocess: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })

    await Axios.get(`${this.state.url}/task?pr_id=` + pr_id + '&status=done', {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({task_done: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })

    await Axios.get(`${this.state.url}/task?pr_id=` + pr_id + '&status=achived', {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({task_achived: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })

    await Axios.get(`${this.state.url}/task?pr_id=` + pr_id + '&status=unachived', {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({task_unachived: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })

    await Axios.get(`${this.state.url}/task?pr_id=` + this.state.pr_id + '&status=deployed', {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({task_deployed: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })
  }

  otherReport = () => {
    return (
      <View style={styles.otherReport}>
        <View style={styles.otherReportV1}>
          <Image source={require('../../../assets/profile.png')} style={styles.iconReport} />
          <Text style={styles.nameReport}>Mr. Joe</Text>
        </View>
        <View style={styles.otherReportV2}>
          <Text style={styles.projectReport}>Project</Text>
          <Text style={styles.sprintReport}>Sprint</Text>
          <Text style={styles.noteReport}>Report</Text>
        </View>
      </View>
    )
  }

  myReport = () => {
    return (
      <View style={styles.myReport}>
        <View style={styles.myReportV1}>
          <Text style={styles.me}>Me</Text>
          <Image source={require('../../../assets/profile.png')} style={styles.iconReportMe} />
        </View>
        <TouchableOpacity style={styles.myReportV2} onPress={() => this.props.navigation.navigate('DetailReport', {rp_id: 0})}>
          <Text style={styles.meProject}>Project</Text>
          <Text style={styles.meSprint}>Sprint</Text>
          <Text style={styles.meReport}>Report</Text>
        </TouchableOpacity>
      </View>
    )
  }

  createReport = () => {
    return (
      <View style={styles.create}>
        {
          this.state.create ? 
          <TouchableOpacity style={styles.buttonCreateReport} onPress={() => this.props.navigation.navigate('CreateReport')}>
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
        <Text style={styles.headerName}>Report</Text>
        {/* { this.searchButton() } */}
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

  getPersen = (sprint) => {
    let totalSprint = sprint.length
    let persenDeployed = 0
    for (let i =0; i < totalSprint ; i++){
      persenDeployed += sprint[i].p_deployed
    }
    return Math.ceil(persenDeployed / totalSprint);
  }

  reportProject = () => {
    return (
      <FlatList
        style = {{width : "100%", maxHeight: '100%'}}
        data = {this.state.progress}
        keyExtractor={({pr_id}, index) => pr_id}
        renderItem = {({item}) => 
        <TouchableOpacity 
          style={styles.board} 
          key={item.pr_id}
          onPress={() => this.props.navigation.navigate('DetailReport', {pr_id: item.pr_id})}>
          <Text style={{fontSize:20, fontWeight:'bold', marginBottom: 5}}>{item.pr_name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '25%'}}>
              <Text style={{fontSize:10, fontWeight:'bold', marginBottom: 5}}>Owner : </Text>
              <Text style={{fontSize:10, fontWeight:'bold', marginBottom: 5}}>{item.pr_owner_name}</Text>
            </View>
            <View style={{width: '25%'}}>
              <Text style={{fontSize:10, fontWeight:'bold', marginBottom: 5}}>Finished : </Text>
              <Text style={{fontSize:10, fontWeight:'bold', marginBottom: 5}}>{item.sprints.length == 0 ? '-' : this.getPersen(item.sprints) + " %"}</Text>
            </View>
            <View style={{width: '25%'}}>
              <Text style={{fontSize:10, fontWeight:'bold', marginBottom: 5}}>Not Finished : </Text>
              <Text style={{fontSize:10, fontWeight:'bold', marginBottom: 5}}>{item.sprints.length == 0 ? '-' : (100 - this.getPersen(item.sprints)) + " %"}</Text>
            </View>
            <View style={{width: '25%'}}>
              <Text style={{fontSize:10, fontWeight:'bold', marginBottom: 5}}>Deadline : </Text>
              <Text style={{fontSize:10, fontWeight:'bold', marginBottom: 5}}>{moment(item.deadline).format('DD-MMMM-YYYY')}</Text>
            </View>
          </View>
        </TouchableOpacity>
        }
      />
    )
  }


  dailyReport = () => {
    return (
      <>
        <FlatList
          style = {{width : "100%", maxHeight: '100%'}}
          data = {this.state.reports}
          keyExtractor={({rp_id}, index) => rp_id}
          renderItem = {({item}) => 
          <TouchableOpacity 
            style={item.user_id == this.state.user_id ? styles.boardMyReport : styles.boardReport} 
            key={item.rp_id}
            >
            <Text style={{fontSize:20, fontWeight:'bold', marginBottom: 5, color: item.user_id == this.state.user_id ? '#FFFFFF':'#000000'}}>{item.sp_name}</Text>
            <Text style={{fontSize:15, fontWeight:'bold', marginBottom: 5, color: item.user_id == this.state.user_id ? '#FFFFFF':'#000000'}}>{item.report}</Text>
            <Text style={{fontSize:14, fontWeight:'bold', marginBottom: 5, alignSelf: 'flex-end', color: item.user_id == this.state.user_id ? '#FFFFFF':'#000000'}}>Report by {item.name}</Text>
            <Text style={{fontSize:12, fontWeight:'bold', marginBottom: 5, alignSelf: 'flex-end', color: item.user_id == this.state.user_id ? '#FFFFFF':'#000000'}}>{moment(item.created_date).format('DD-MMMM-YYYY HH:mm')}</Text>
          </TouchableOpacity>
          }
        />
        {this.createReport()}
      </>
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()}/>
          {this.headerReport()}
          <SafeAreaView style={{position:'absolute', top: 60, bottom: 0, width: '100%'}}>
            {this.state.showReport ? this.reportProject() : this.dailyReport()}
            
          </SafeAreaView>
      </View>
    )

  }
}
export default Report



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
      width:"25%",
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
        width: '100%',
        elevation: 10
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
      marginHorizontal: 5,
      width: '95%',
      minHeight: 90,
      backgroundColor:'#FFFFFF',
      borderRadius: 10,
      elevation: 10,
      marginVertical : 5,
      marginHorizontal: 10,
      padding: 10
    },
    boardMyReport: {
      marginHorizontal: 5,
      width: '80%',
      minHeight: 90,
      backgroundColor:'#1E5028',
      borderRadius: 10,
      elevation: 10,
      marginVertical : 5,
      marginHorizontal: 10,
      padding: 10,
      alignSelf: 'flex-end'
    },
    boardReport: {
      marginHorizontal: 5,
      width: '80%',
      minHeight: 90,
      backgroundColor:'#FFFFFF',
      borderRadius: 10,
      elevation: 10,
      marginVertical : 5,
      marginHorizontal: 10,
      padding: 10,
      alignSelf: 'flex-start'
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
      bottom: 10,
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
    },
    otherReport:{
      width:'70%', 
      alignItems: 'flex-start', 
      marginBottom: 10
    },
    otherReportV1:{
      justifyContent:'center', 
      height: 50,
      width: '100%'
    },
    otherReportV2:{
      backgroundColor:'#FFFFFF', 
      width: '100%', 
      minHeight: 50, 
      padding: 5, 
      elevation:10
    },
    iconReport:{
      width:50, 
      height: 50, 
      position: 'absolute', 
      left: 0
    },
    nameReport:{
      position: 'absolute', 
      left: 60, 
      fontWeight: 'bold', 
      fontSize: 17, 
      color:'#1E5028'
    },
    projectReport:{
      fontWeight: 'bold', 
      fontSize: 12, 
      color:'#1E5028'
    },
    sprintReport:{
      fontWeight: 'bold', 
      fontSize: 12, 
      color:'#1E5028', 
      marginBottom: 5
    },
    noteReport:{
      fontWeight: 'bold', 
      fontSize: 15, 
      color:'#1E5028'
    },
    myReport:{
      width:'70%', 
      alignItems: 'flex-start', 
      marginBottom: 10, 
      marginLeft: '30%'
    },
    myReportV1:{
      justifyContent:'center', 
      height: 50, 
      right:0, 
      width: '100%'
    },
    myReportV2:{
      backgroundColor:'#2FB675', 
      width: '100%', minHeight: 50, 
      padding: 5, 
      elevation:10
    },
    me:{
      position: 'absolute', 
      right: 60, 
      fontWeight: 'bold', 
      fontSize: 17, 
      color:'#1E5028'
    },
    iconReportMe:{
      width:50, 
      height: 50, 
      position: 'absolute', 
      right: 0
    },
    meProject:{
      fontWeight: 'bold', 
      fontSize: 12, 
      color:'#FFFFFF'
    },
    meSprint:{
      fontWeight: 'bold', 
      fontSize: 12, 
      color:'#FFFFFF', 
      marginBottom: 5
    },
    meReport:{
      fontWeight: 'bold', 
      fontSize: 15, 
      color:'#FFFFFF'
    }
  
  });
  