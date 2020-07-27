import React, {Component} from 'react'
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios'
import { NavigationEvents } from 'react-navigation'
import AsyncStorage from '@react-native-community/async-storage';
class Project extends Component{
  state = {
    project_name : '',
    canCreateProject : false,
    canCreateSprint : false,
    url: URL,
    sprints : [],
    pr_id: 0,
    create: false,
    edit: false
  }
  
  componentDidMount = async () => {

    let token = await AsyncStorage.getItem('token')
    if (token !== null) {
      let level = await AsyncStorage.getItem('user_data')
      level = JSON.parse(level)
      if(level.usr_level_id == 1){
        this.setState({canCreateProject : true})
      }
      if(level.usr_level_id == 2){
        this.setState({canCreateSprint : true})
      }
    }else{
      this.props.navigation.navigate('Auth')
    }
    let server_url = await AsyncStorage.getItem('debug');
    if (server_url) {
      this.setState({url : server_url})
    }
    
    let pr_id = await AsyncStorage.getItem('pr_id');
    if(pr_id){
      this.setState({pr_id : pr_id})
    }
    if (this.state.pr_id != 0){
      await Axios.get(`${this.state.url}/project/${pr_id}`, {headers : {Authorization : token}})
      .then( async res => {
        if(res.data.status == 200) {
          this.setState({project_name : res.data.data[0].pr_name})
          await AsyncStorage.setItem('pr_id', "" + res.data.data[0].pr_id)
          await Axios.get(`${this.state.url}/sprint/project/${pr_id}`, {headers : {Authorization : token}})
          .then(async result => {
            this.setState({sprints : result.data.data})
          })
        }else if (res.data.status == 403) {
          let keys = ['token', 'user_data']
          await AsyncStorage.multiRemove(keys, (err) => {
              this.props.navigation.navigate('Auth')
          })
        }
      })
    } else{
      await Axios.get(`${this.state.url}/project`, {headers : {Authorization : token}})
      .then( async res => {
        if(res.data.status == 200) {
          if(res.data.data.length != 0) {
            this.setState({pr_id : res.data.data[0].pr_id})
            this.setState({project_name : res.data.data[0].pr_name})
            await AsyncStorage.setItem('pr_id', "" + res.data.data[0].pr_id)
            await Axios.get(`${this.state.url}/sprint/project/${res.data.data[0].pr_id}`, {headers : {Authorization : token}})
            .then(async result => {
              this.setState({sprints : result.data.data})
            })
          } else {
            this.props.navigation.navigate('NoProject')
          }
        }else if (res.data.status == 403) {
          let keys = ['token', 'user_data']
          await AsyncStorage.multiRemove(keys, (err) => {
              this.props.navigation.navigate('Auth')
          })
        }
      })
    }

    if(this.state.sprints.length == 0){
      this.setState({sprints: [{sp_id: 0, sp_name: 'No Sprints was created'}]})
    }

  }

  createSprint = () => {
    return (
      <View style={styles.create}>
        {
          this.state.create ? 
          <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateSprint', {pr_id: this.state.pr_id})} style={styles.buttonCreateSprint} >
            <Text style={styles.buttonTextSprint}>Create New Sprint</Text>
          </TouchableOpacity>
          : null
        }
        <TouchableOpacity style={styles.buttonCreate} onPress={() => { this.state.create ? this.setState({create : false}) : this.setState({create : true})}} >
          <Image source={require('../../../assets/create.png')} style={styles.iconCreate} />
        </TouchableOpacity>
      </View>
    )
  }

  createProject = () => {
    return(
      <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateProject')} style={styles.buttonCreateProject} >
        <Text style={styles.buttonTextProject}>Create Project</Text>
      </TouchableOpacity>
    )
  }

  selectProject = () => {
    return(
      <TouchableOpacity onPress={() => this.props.navigation.navigate('SelectProject')} style={styles.buttonCreateProject} >
        <Text style={styles.buttonTextProject}>Select Project</Text>
      </TouchableOpacity>
    )
  }

  detailProject = () => {
    return(
      <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailProject', {pr_id: this.state.pr_id})} style={styles.buttonCreateProject} >
        <Text style={styles.buttonTextProject}>Detail Project</Text>
      </TouchableOpacity>
    )
  }

  nameProject = () => {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailProject', {pr_id: this.state.pr_id})}>
        <Text style={styles.projectName}>{this.state.project_name.length > 20 ? this.state.project_name.substr(0,20)+'...' : this.state.project_name}</Text>
      </TouchableOpacity>
    )
     
  }

  headerProject = () => {
    return (
      <View style={styles.header}>
        { this.state.project_name !== '' ? this.editButton() : null}
        { this.state.project_name !== '' ? this.nameProject() : (this.state.canCreateProject ? this.createProject() : this.selectProject())}
        {/* { this.searchButton() } */}
      </View>
    )
  }

  sprintProject = () => {
    return (
      <View style={styles.sprintBoard}>
        <FlatList
          style = {{width : "100%", maxHeight: '100%'}}
          data = {this.state.sprints}
          keyExtractor={({sp_id}, index) => sp_id}
          renderItem = {({item}) => 
          <TouchableOpacity style={styles.boardSprint} key={item.sp_id}  onPress={()=> item.sp_id != '' ? this.props.navigation.navigate('Sprint', {sp_id : item.sp_id}) : null }>
            <Text style={styles.TextBoardSprint}>{item.sp_name}</Text>
          </TouchableOpacity>
          }
        />
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

  searchButton = () => {
    return (
      <TouchableOpacity style={styles.buttonsearch} >
        <Image source={require('../../../assets/search.png')} style={styles.iconEdit} />
      </TouchableOpacity>
    )
  }

  editView = () => {
    return (
      <View style={styles.editView}>
        {this.detailProject()}
        {this.selectProject()}
        { this.state.canCreateProject ? this.createProject() : null }
      </View>
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()}/>
          { this.headerProject() }
          { this.sprintProject() }
          { this.state.canCreateSprint ? this.createSprint() : null }
          { this.state.edit ? this.editView() : null}
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
      bottom: 0
    },
    logoText : {
      marginVertical: 15,
      fontSize:20,
      color:'#51A2DA'
    },
    buttonCreateSprint: {
      width:185,
      height: 35,
      backgroundColor:'#1E5028',
      justifyContent: 'center',
      borderRadius: 10,
      elevation: 5,
      alignItems: 'center',
      marginVertical: 5,
    },
    buttonCreateProject: {
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
      alignItems: 'center',
      paddingHorizontal:10
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
      width: '95%',
      height: 90,
      backgroundColor:'#FFFFFF',
      borderRadius: 10,
      elevation: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical : 5,
      marginHorizontal: "2%"
    },
    TextBoard: {
      color:'#AEAEAE',
      fontSize:16,
      fontWeight:'bold',
      textAlign:'center',
    },
    projectName: {
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
      borderRadius: 20
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
      left:10,
    }
  
  });
  