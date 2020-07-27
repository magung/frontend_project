import React, {Component} from 'react'
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, Modal, TouchableHighlight} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios'
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment'
class DetailReport extends Component{
  state = {
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
      reports: []
  }
  
  componentDidMount = async () => {
    let token = await AsyncStorage.getItem('token')
    this.setState({token})
    let server_url = await AsyncStorage.getItem('debug');
    if (server_url) {
      this.setState({url : server_url})
    }
    let pr_id = this.props.navigation.getParam('pr_id');
    if(pr_id){
      this.setState({pr_id : pr_id})
    }
    await Axios.get(`${this.state.url}/report?sort=asc&pr_id=`+pr_id, {headers : {Authorization : token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({reports: res.data.data})
      }
    })
    await Axios.get(`${this.state.url}/project/progress?pr_id=`+ pr_id, {headers : {Authorization : token}})
    .then( async res => {
      if(res.data.status == 200) {
        let data = res.data.data[0]
        console.log(data.pr_id)
        this.setState({
          progress: data,
          project_name: data.pr_name,
          total_sprints: data.sprints.length,
          total_tasks: this.totalTasks(data.sprints).total_task,
          total_ongoing: this.totalTasks(data.sprints).ongoing,
          total_onprocess: this.totalTasks(data.sprints).onprocess,
          total_done: this.totalTasks(data.sprints).done,
          total_achive: this.totalTasks(data.sprints).achived,
          total_deploy: this.totalTasks(data.sprints).deployed,
          total_members: data.members.length,
          members: data.members,
          sprints: data.sprints
        })
        // this.getSprintProject()
        this.getAllTask()
      }
    })

  }

  submitSprintId = async (sp_id, sp_name) => {
    await AsyncStorage.setItem('pr_id', "" + this.state.pr_id)
    await AsyncStorage.setItem('pr_name', "" + this.state.project_name)
    await AsyncStorage.setItem('sp_id', "" + sp_id)
    await AsyncStorage.setItem('sp_name', "" + sp_name)
    this.props.navigation.navigate('TeamTask') 
  }

  getSprintProject = async () => {
    await Axios.get(`${this.state.url}/sprint/project/` + this.state.pr_id, {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({sprints: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })
  }

  getAllTask = async () => {
    await Axios.get(`${this.state.url}/task?pr_id=` + this.state.pr_id, {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({tasks: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })

    await Axios.get(`${this.state.url}/task?pr_id=` + this.state.pr_id + '&status=ongoing', {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({task_ongoing: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })

    await Axios.get(`${this.state.url}/task?pr_id=` + this.state.pr_id + '&status=onprocess', {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({task_onprocess: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })

    await Axios.get(`${this.state.url}/task?pr_id=` + this.state.pr_id + '&status=done', {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({task_done: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })

    await Axios.get(`${this.state.url}/task?pr_id=` + this.state.pr_id + '&status=achived', {headers : {Authorization : this.state.token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({task_achived: res.data.data})
      }
    })
    .catch(err=> {
      console.log(err)
    })

    await Axios.get(`${this.state.url}/task?pr_id=` + this.state.pr_id + '&status=unachived', {headers : {Authorization : this.state.token}})
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

  sprints = () => {
    return (
      <View style={{width:'100%', padding: 5, height: '100%'}}>
        <TouchableOpacity style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'flex-start', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', width: '100%', marginBottom: 5}} >
          <Text style={{fontSize:18, fontWeight:'bold'}}>Sprint ({this.state.total_sprints})</Text>
        </TouchableOpacity>
        <View style={{width:'100%', padding: 10, height: '100%', position: 'relative'}}>
          <FlatList
            style = {{width : "100%", maxHeight: '90%'}}
            data = {this.state.sprints}
            keyExtractor={({sp_id}, index) => sp_id}
            renderItem = {({item}) => 
            <TouchableOpacity 
              style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', marginBottom: 3, width: '100%', minHeight: 90}} 
              key={item.sp_id}
              onPress={() => {
                this.submitSprintId(item.sp_id, item.sp_name) 
                this.setState({modalVisible: false})}} >
              <View style={{width: '70%', alignItems: 'center'}}>
                <Text style={{fontSize:15, fontWeight:'bold', alignSelf: 'center'}}>{item.sp_name}</Text>
                <Text style={{fontSize:12, fontWeight:'bold'}}>owned by {item.sp_owner_name}</Text>
              </View>
              <View style={{position: 'absolute', right: '5%'}}>
                <Text style={{fontSize:10, fontWeight:'bold'}}>Progress : </Text>
                <Text style={{fontSize:10, fontWeight:'bold'}}>{item.p_deployed} %</Text>
                <Text style={{fontSize:10, fontWeight:'bold'}}>Deadline : </Text>
                <Text style={{fontSize:10, fontWeight:'bold'}}>{moment(item.deadline).format('DD-MMMM-YYYY')}</Text>
              </View>
            </TouchableOpacity>
            }
          />
        </View>
      </View>
    )
  }
  tasks = () => {
    return (
      <View style={{width:'100%', padding: 5, height: '100%'}}>
        <TouchableOpacity style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'flex-start', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', width: '100%', marginBottom: 5}} >
          <Text style={{fontSize:18, fontWeight:'bold'}}>All Tasks ({this.state.total_tasks})</Text>
        </TouchableOpacity>
        <View style={{width:'100%', padding: 10, height: '100%', position: 'relative'}}>
          <FlatList
            style = {{width : "100%", maxHeight: '90%'}}
            data = {this.state.tasks}
            keyExtractor={({task_id}, index) => task_id}
            renderItem = {({item}) => 
            
            <TouchableOpacity 
              style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', marginBottom: 3, minHeight: 20, width: '100%', minHeight: 50}} 
              key={item.task_id}
              >
              <Text style={{fontSize:15, fontWeight:'bold'}}>{item.title}</Text>
              <View style={{position: 'absolute', right: 10, top: 5}}>
                <Text style={{fontSize:12, fontWeight:'bold'}}>{item.owned_by_name}</Text>
                <Text style={{fontSize:12, fontWeight:'bold'}}>({item.status})</Text>
              </View>
            </TouchableOpacity>
            
            }
          />
        </View>
      </View>
    )
  }
  task_ongoing = () => {
    return (
      <View style={{width:'100%', padding: 5, height: '100%'}}>
        <TouchableOpacity style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'flex-start', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', width: '100%', marginBottom: 5}} >
          <Text style={{fontSize:18, fontWeight:'bold'}}>Task Ongoing ({this.state.total_ongoing})</Text>
        </TouchableOpacity>
        <View style={{width:'100%', padding: 10, height: '100%', position: 'relative'}}>
          <FlatList
            style = {{width : "100%", maxHeight: '90%'}}
            data = {this.state.task_ongoing}
            keyExtractor={({task_id}, index) => task_id}
            renderItem = {({item}) => 
            
            <TouchableOpacity 
              style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', marginBottom: 3, minHeight: 20, width: '100%', minHeight: 50}} 
              key={item.task_id}
              >
              <Text style={{fontSize:15, fontWeight:'bold'}}>{item.title}</Text>
              <View style={{position: 'absolute', right: 10, top: 5}}>
                <Text style={{fontSize:12, fontWeight:'bold'}}>{item.owned_by_name}</Text>
                <Text style={{fontSize:12, fontWeight:'bold'}}>({item.status})</Text>
              </View>
            </TouchableOpacity>
            
            }
          />
        </View>
      </View>
    )
  }
  task_onprocess = () => {
    return (
      <View style={{width:'100%', padding: 5, height: '100%'}}>
        <TouchableOpacity style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'flex-start', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', width: '100%', marginBottom: 5}} >
          <Text style={{fontSize:18, fontWeight:'bold'}}>Task Onprocess ({this.state.total_onprocess})</Text>
        </TouchableOpacity>
        <View style={{width:'100%', padding: 10, height: '100%', position: 'relative'}}>
          <FlatList
            style = {{width : "100%", maxHeight: '90%'}}
            data = {this.state.task_onprocess}
            keyExtractor={({task_id}, index) => task_id}
            renderItem = {({item}) => 
            
            <TouchableOpacity 
              style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', marginBottom: 3, minHeight: 20, width: '100%', minHeight: 50}} 
              key={item.task_id}
              >
              <Text style={{fontSize:15, fontWeight:'bold'}}>{item.title}</Text>
              <View style={{position: 'absolute', right: 10, top: 5}}>
                <Text style={{fontSize:12, fontWeight:'bold'}}>{item.owned_by_name}</Text>
                <Text style={{fontSize:12, fontWeight:'bold'}}>({item.status})</Text>
              </View>
            </TouchableOpacity>
            
            }
          />
        </View>
      </View>
    )
  }
  task_done = () => {
    return (
      <View style={{width:'100%', padding: 5, height: '100%'}}>
        <TouchableOpacity style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'flex-start', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', width: '100%', marginBottom: 5}} >
          <Text style={{fontSize:18, fontWeight:'bold'}}>Task Done ({this.state.total_done})</Text>
        </TouchableOpacity>
        <View style={{width:'100%', padding: 10, height: '100%', position: 'relative'}}>
          <FlatList
            style = {{width : "100%", maxHeight: '90%'}}
            data = {this.state.task_done}
            keyExtractor={({task_id}, index) => task_id}
            renderItem = {({item}) => 
            
            <TouchableOpacity 
              style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', marginBottom: 3, minHeight: 20, width: '100%', minHeight: 50}} 
              key={item.task_id}
              >
              <Text style={{fontSize:15, fontWeight:'bold'}}>{item.title}</Text>
              <View style={{position: 'absolute', right: 10, top: 5}}>
                <Text style={{fontSize:12, fontWeight:'bold'}}>{item.owned_by_name}</Text>
                <Text style={{fontSize:12, fontWeight:'bold'}}>({item.status})</Text>
              </View>
            </TouchableOpacity>
            
            }
          />
        </View>
      </View>
    )
  }
  task_achive = () => {
    return (
      <View style={{width:'100%', padding: 5, height: '100%'}}>
        <TouchableOpacity style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'flex-start', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', width: '100%', marginBottom: 5}} >
          <Text style={{fontSize:18, fontWeight:'bold'}}>Task Achived ({this.state.total_achive})</Text>
        </TouchableOpacity>
        <View style={{width:'100%', padding: 10, height: '100%', position: 'relative'}}>
          <FlatList
            style = {{width : "100%", maxHeight: '90%'}}
            data = {this.state.task_achived}
            keyExtractor={({task_id}, index) => task_id}
            renderItem = {({item}) => 
            
            <TouchableOpacity 
              style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', marginBottom: 3, minHeight: 20, width: '100%', minHeight: 50}} 
              key={item.task_id}
              >
              <Text style={{fontSize:15, fontWeight:'bold'}}>{item.title}</Text>
              <View style={{position: 'absolute', right: 10, top: 5}}>
                <Text style={{fontSize:12, fontWeight:'bold'}}>{item.owned_by_name}</Text>
                <Text style={{fontSize:12, fontWeight:'bold'}}>({item.status})</Text>
              </View>
            </TouchableOpacity>
            
            }
          />
        </View>
      </View>
    )
  }
  task_unachive = () => {
    return (
      <View style={{width:'100%', padding: 5, height: '100%'}}>
        <TouchableOpacity style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'flex-start', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', width: '100%', marginBottom: 5}} >
          <Text style={{fontSize:18, fontWeight:'bold'}}>Task Unachived ({this.state.total_unachive})</Text>
        </TouchableOpacity>
        <View style={{width:'100%', padding: 10, height: '100%', position: 'relative'}}>
          <FlatList
            style = {{width : "100%", maxHeight: '90%'}}
            data = {this.state.task_unachived}
            keyExtractor={({task_id}, index) => task_id}
            renderItem = {({item}) => 
            
            <TouchableOpacity 
              style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', marginBottom: 3, minHeight: 20, width: '100%', minHeight: 50}} 
              key={item.task_id}
              >
              <Text style={{fontSize:15, fontWeight:'bold'}}>{item.title}</Text>
              <View style={{position: 'absolute', right: 10, top: 5}}>
                <Text style={{fontSize:12, fontWeight:'bold'}}>{item.owned_by_name}</Text>
                <Text style={{fontSize:12, fontWeight:'bold'}}>({item.status})</Text>
              </View>
            </TouchableOpacity>
            
            }
          />
        </View>
      </View>
    )
  }
  task_deploy = () => {
    return (
      <View style={{width:'100%', padding: 5, height: '100%'}}>
        <TouchableOpacity style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'flex-start', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', width: '100%', marginBottom: 5}} >
          <Text style={{fontSize:18, fontWeight:'bold'}}>Task Deployed ({this.state.total_deploy})</Text>
        </TouchableOpacity>
        <View style={{width:'100%', padding: 10, height: '100%', position: 'relative'}}>
          <FlatList
            style = {{width : "100%", maxHeight: '90%'}}
            data = {this.state.task_deployed}
            keyExtractor={({task_id}, index) => task_id}
            renderItem = {({item}) => 
            
            <TouchableOpacity 
              style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', marginBottom: 3, minHeight: 20, width: '100%', minHeight: 50}} 
              key={item.task_id}
              >
              <Text style={{fontSize:15, fontWeight:'bold'}}>{item.title}</Text>
              <View style={{position: 'absolute', right: 10, top: 5}}>
                <Text style={{fontSize:12, fontWeight:'bold'}}>{item.owned_by_name}</Text>
                <Text style={{fontSize:12, fontWeight:'bold'}}>({item.status})</Text>
              </View>
            </TouchableOpacity>
            
            }
          />
        </View>
      </View>
    )
  }
  members = () => {
    return (
      <View style={{width:'100%', padding: 5, height: '100%'}}>
        <TouchableOpacity style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'flex-start', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', width: '100%', marginBottom: 5}} >
          <Text style={{fontSize:18, fontWeight:'bold'}}>Members ({this.state.total_members})</Text>
        </TouchableOpacity>
        <View style={{width:'100%', padding: 10, height: '100%', position: 'relative'}}>
          <FlatList
            style = {{width : "100%", maxHeight: '90%'}}
            data = {this.state.members}
            keyExtractor={({user_id}, index) => user_id}
            renderItem = {({item}) => 
            <TouchableOpacity style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey', flexDirection: 'row', marginBottom: 3}} key={item.user_id} >
              <Image style={{width: 50, height: 50, borderRadius: 25, marginRight: 5}} source={{uri: this.state.url + "/user/image/" + item.image}} />
              <Text style={{fontSize:15, fontWeight:'bold'}}>{item.name}</Text>
              <Text style={{fontSize:12, fontWeight:'bold', position: 'absolute', right: 10, top: 5}}>{item.level}</Text>
            </TouchableOpacity>
            }
          />
        </View>
      </View>
    )
  }



  totalTasks = (sprints) => {
    let total_task = 0
    let total_ongoing = 0
    let total_onprocess = 0
    let total_done = 0
    let total_achive = 0
    let total_unachive = 0
    let total_deploy = 0
    for(let i=0; i<sprints.length;i++){
      total_task += sprints[i].total_task
      total_deploy += sprints[i].task_deployed
      total_ongoing += sprints[i].task_ongoing
      total_onprocess += sprints[i].task_onprocess
      total_done += sprints[i].task_done
      total_achive += sprints[i].task_achived
      total_unachive += sprints[i].task_unachived
    }
    return {
      total_task : total_task, 
      ongoing: total_ongoing,
      done: total_done,
      deployed: total_deploy,
      achived: total_achive,
      unachived: total_unachive,
      onprocess: total_onprocess, 
      total_deploy : total_task !== 0 ? total_deploy / total_task * 100 : 0,
      total_ongoing : total_task !== 0 ? total_ongoing / total_task * 100 : 0,
      total_onprocess : total_task !== 0 ? total_onprocess / total_task * 100 : 0,
      total_achive : total_task !== 0 ? total_achive / total_task * 100 : 0,
      total_done : total_task !== 0 ? total_done / total_task * 100 : 0,
      total_unachive: total_task !== 0 ? total_unachive/ total_task * 100 : 0
    }
  }

  modelView = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={{backgroundColor: '#FFFFFF', width: '90%', height: '90%', position: 'absolute', top: '5%', left: '5%', elevation: 10, borderRadius: 20, padding: 15}}>

          <Text style={{color: '#1E5028', fontWeight: 'bold', fontSize: 20}}>{this.state.project_name}</Text>
          <TouchableHighlight
            style={{ backgroundColor: "#892020", width: 30, height: 30, borderRadius: 15, position: 'absolute', top: 15, right: 15, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => {
              this.setState({modalVisible : false});
            }}
          >
            <Text style={{color: "#FFFFFF", fontWeight: 'bold'}}>X</Text>
          </TouchableHighlight>
          <View style={{width: '100%', height: '90%', position: 'absolute', top: '10%', backgroundColor: '#FFFFFF', elevation: 5, left: '5%', borderRadius: 10}}>
            {this.state.show_sprint ? this.sprints() : null}
            {this.state.show_task ? this.tasks() : null}
            {this.state.show_task_ongoing ? this.task_ongoing() : null}
            {this.state.show_task_onprocess ? this.task_onprocess() : null}
            {this.state.show_task_done ? this.task_done() : null}
            {this.state.show_task_achive ? this.task_achive() : null}
            {this.state.show_task_unachive ? this.task_unachive() : null}
            {this.state.show_task_deploy ? this.task_deploy() : null}
            {this.state.show_member ? this.members() : null}

          </View>
        </View>
      </Modal>
    )
  }


  render() {
    return(
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()}/>
        <ScrollView>
          <SafeAreaView style={{width: '100%'}}>
            {this.modelView()}
            
              <View style={{width:'100%', backgroundColor:'#FFFFFF', minHeight:100, padding:10, borderBottomWidth: 1, borderBottomColor: "#AEAEAE"}}>
                <Text style={{fontSize:30, fontWeight:'bold', marginVertical: 10, textTransform : 'uppercase'}}>{this.state.project_name}</Text>
          
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity 
                    style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, width: '50%', minHeight: 50, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey'}} 
                    onPress={() => this.setState({
                      modalVisible : true,
                      show_sprint: true, 
                      show_task: false, 
                      show_task_ongoing: false, 
                      show_task_onprocess: false, 
                      show_task_done: false,
                      show_task_achive: false,
                      show_task_unachive: false,
                      show_task_deploy: false,
                      show_member: false})}>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>Total Sprints</Text>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>{this.state.total_sprints}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, width: '50%', minHeight: 50, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey'}}
                    onPress={() => 
                      this.setState({
                        modalVisible : true,
                        show_sprint: false, 
                        show_task: true, 
                        show_task_ongoing: false, 
                        show_task_onprocess: false, 
                        show_task_done: false,
                        show_task_achive: false,
                        show_task_unachive: false,
                        show_task_deploy: false,
                        show_member: false })
                      }>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>Total Tasks</Text>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>{this.state.total_tasks} </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity 
                    style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, width: '50%', minHeight: 50, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey'}}
                    onPress={() => 
                      this.setState({
                        modalVisible : true, 
                        show_sprint: false, 
                        show_task: false, 
                        show_task_ongoing: true, 
                        show_task_onprocess: false, 
                        show_task_done: false,
                        show_task_achive: false,
                        show_task_unachive: false,
                        show_task_deploy: false,
                        show_member: false })
                        }>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>Task Ongoing</Text>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>{this.totalTasks(this.state.sprints).total_ongoing} %</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, width: '50%', minHeight: 50, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey'}}
                    onPress={() =>
                      this.setState({
                        modalVisible : true, 
                        show_sprint: false, 
                        show_task: false, 
                        show_task_ongoing: false, 
                        show_task_onprocess: true, 
                        show_task_done: false,
                        show_task_achive: false,
                        show_task_unachive: false,
                        show_task_deploy: false,
                        show_member: false })
                        }>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>Task Onprocess</Text>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>{this.totalTasks(this.state.sprints).total_onprocess} %</Text>
                  </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity 
                    style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, width: '50%', minHeight: 50, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey'}}
                    onPress={() => 
                      this.setState({
                        modalVisible : true, 
                        show_sprint: false, 
                        show_task: false, 
                        show_task_ongoing: false, 
                        show_task_onprocess: false, 
                        show_task_done: true,
                        show_task_achive: false,
                        show_task_unachive: false,
                        show_task_deploy: false,
                        show_member: false })}>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>Task Done</Text>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>{this.totalTasks(this.state.sprints).total_done} %</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, width: '50%', minHeight: 50, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey'}}
                    onPress={() => this.setState({
                      modalVisible : true, 
                      show_sprint: false, 
                      show_task: false, 
                      show_task_ongoing: false, 
                      show_task_onprocess: false, 
                      show_task_done: false,
                      show_task_achive: true,
                      show_task_unachive: false,
                      show_task_deploy: false,
                      show_member: false })}>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>Task Achived</Text>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>{this.totalTasks(this.state.sprints).total_achive} %</Text>
                  </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity 
                    style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, width: '50%', minHeight: 50, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey'}}
                    onPress={() => 
                      this.setState({
                        modalVisible : true, 
                        show_sprint: false, 
                        show_task: false, 
                        show_task_ongoing: false, 
                        show_task_onprocess: false, 
                        show_task_done: false,
                        show_task_achive: false,
                        show_task_unachive: true,
                        show_task_deploy: false,
                        show_member: false })
                      }>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>Task Unachived</Text>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>{this.totalTasks(this.state.sprints).total_unachive} %</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, width: '50%', minHeight: 50, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey'}}
                    onPress={() => 
                      this.setState({
                        modalVisible : true, 
                        show_sprint: false, 
                        show_task: false, 
                        show_task_ongoing: false, 
                        show_task_onprocess: false, 
                        show_task_done: false,
                        show_task_achive: false,
                        show_task_unachive: false,
                        show_task_deploy: true,
                        show_member: false })}>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>Task Deployed</Text>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>{this.totalTasks(this.state.sprints).total_deploy} %</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity 
                    style={{backgroundColor: "#FFFFFF",padding: 5, elevation: 5, width: '100%', minHeight: 50, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: 'grey'}}
                    onPress={() => 
                      this.setState({
                        modalVisible : true, 
                        show_sprint: false, 
                        show_task: false, 
                        show_task_ongoing: false, 
                        show_task_onprocess: false, 
                        show_task_done: false,
                        show_task_achive: false,
                        show_task_unachive: false,
                        show_task_deploy: false,
                        show_member: true, })
                        }>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>Members</Text>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>{this.state.members.length}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{fontSize:20, fontWeight:'bold', marginVertical: 5}}>Daily Report</Text>
                <FlatList
                  style = {{width : "100%"}}
                  data = {this.state.reports}
                  keyExtractor={({rp_id}, index) => rp_id}
                  renderItem = {({item}) => 
                  <TouchableOpacity 
                    style={{width: '100%', minHeight: 100, borderRadius: 5,backgroundColor: '#1E5028', marginVertical: 5, padding: 10}} 
                    key={item.rp_id}
                    >
                    <Text style={{fontSize:20, fontWeight:'bold', marginBottom: 5, color: '#FFFFFF'}}>{item.sp_name}</Text>
                    <Text style={{fontSize:15, fontWeight:'bold', marginBottom: 5, color: '#FFFFFF'}}>{item.report}</Text>
                    <Text style={{fontSize:14, fontWeight:'bold', marginBottom: 5, alignSelf: 'flex-end', color: '#FFFFFF'}}>Report by {item.name}</Text>
                    <Text style={{fontSize:12, fontWeight:'bold', marginBottom: 5, alignSelf: 'flex-end', color: '#FFFFFF'}}>{moment(item.created_date).format('DD-MMMM-YYYY HH:mm')}</Text>
                  </TouchableOpacity>
                  }
                />
              </View>

        
          </SafeAreaView>
          </ScrollView>
      </View>
    )

  }
}
export default DetailReport



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
  