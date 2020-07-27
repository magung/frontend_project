import React, {Component} from 'react'
import { ScrollView, FlatList, SafeAreaView, View, Text, TextInput, Picker, TouchableOpacity, StyleSheet, KeyboardAvoidingView, RefreshControlBase} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios';
import Toast from 'react-native-root-toast';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

class CreateTask extends Component {
  state = {
    name: '',
    description: '',
    request_by: 0,
    owned_by: 0,
    label_id: 0,
    type_id: 0,
    priority_id: 0,
    status_id: 0,
    deadline: moment().format('YYYY-MM-DD'),
    url: URL,
    token: '',
    pr_id: 0,
    sp_id: 0,
    members:[],
    data_label:[],
    data_type:[],
    data_priority:[],
    data_status:[],

  }

  componentDidMount = async () => {
    const token = await AsyncStorage.getItem('token');
    this.setState({token : token})
    let urldebug = await AsyncStorage.getItem('debug');
    if (urldebug) {
      this.setState({url : urldebug})
    }
    let user_data = await AsyncStorage.getItem('user_data');
    user_data = JSON.parse(user_data)
    this.setState({request_by: user_data.user_id})
    let pr_id = await AsyncStorage.getItem('pr_id');
    this.setState({pr_id})
    let sp_id = this.props.navigation.getParam('sp_id');
    this.setState({sp_id})

    // get member on project
    await Axios.get(this.state.url + "/project/members/" + this.state.pr_id, {headers : {Authorization : token}})
    .then(res => {
      this.setState({
        members: res.data.data
      })
    })

    // get label
    await Axios.get(this.state.url + "/label", {headers : {Authorization : token}})
    .then(res => {
      this.setState({
        data_label: res.data.data
      })
    })

    // get type
    await Axios.get(this.state.url + "/type", {headers : {Authorization : token}})
    .then(res => {
      this.setState({
        data_type: res.data.data
      })
    })

    // get priority
    await Axios.get(this.state.url + "/priority", {headers : {Authorization : token}})
    .then(res => {
      this.setState({
        data_priority: res.data.data
      })
    })

    // get status
    await Axios.get(this.state.url + "/status", {headers : {Authorization : token}})
    .then(res => {
      this.setState({
        data_status: res.data.data
      })
    })
  }

  insertTask = async () => {
    let name = this.state.name || ''
    let description = this.state.description || ''
    let request_by = this.state.request_by || 0
    let owned_by= this.state.owned_by || 0
    let label_id= this.state.label_id || 0
    let type_id= this.state.type_id || 0
    let priority_id= this.state.priority_id || 0
    let status_id= 1

    let msg = ''
    // msg = status_id == 0 ? 'Status is Requered' : msg
    msg = priority_id == 0 ? 'Priority is Requered' : msg
    msg = label_id == 0 ? 'Label is Requered' : msg
    msg = type_id == 0 ? 'Type is Requered' : msg
    msg = owned_by == 0 ? 'Owned By is Requered' : msg
    // msg = request_by == 0 ? 'Request By is Requered' : msg
    msg = description == '' ? 'Task Description is Requered' : msg
    msg = name == '' ? 'Task Name is Requered' : msg

    if(msg !== '') {
      Toast.show( msg, {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
    } else {
      // let dateP = this.state.deadline.toString()
      let data = {
        sp_id : this.state.sp_id,
        pr_id : this.state.pr_id,
        title : name,
        task_desc : description,
        req_by : request_by,
        owned_by : owned_by,
        label_id : label_id,
        type_id : type_id,
        priority_id : priority_id,
        status_id: status_id,
        deadline : this.state.deadline
      }
      // insert task
      await Axios.post(this.state.url + "/task", data, {headers : {Authorization : this.state.token}})
      .then(res => {
        msg = "success insert data task"
        Toast.show( msg, {
          duration: Toast.durations.LONG,
          position: 0,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,})
        this.props.navigation.goBack()
      })
      .catch(err => {
        msg = "Failed insert data task"
        Toast.show( msg, {
          duration: Toast.durations.LONG,
          position: 0,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,})
      })
    }

  }

  

  render(){
    return(
      <ScrollView>
      <SafeAreaView style={styles.container}>
          <View style={styles.form}>
            <Text style={styles.formText}>Task Name</Text>
            <TextInput
              style={styles.formInput}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="Enter Task Name"
              placeholderTextColor = "#AEAEAE"
              onChangeText={(name) => this.setState({name})}
              />
            <Text style={styles.formText}>Description</Text>
            <TextInput
              numberOfLines={1}
              multiline
              style={styles.formInput}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="Enter Description of Task"
              placeholderTextColor = "#AEAEAE"
              onChangeText={(description) => this.setState({description})}
              />
            {/* <Text style={styles.formText}>Request By</Text>
            <View style={styles.formInput}>
              <Picker
                selectedValue={this.state.request_by}
                style={styles.formSelect}
                onValueChange={(value) => {
                  this.setState({request_by: value})
                }}
              >
                <Picker.Item value="select" label="Select Requester" key={0}/>
                {
                  this.state.members.map((x, i) => {
                    return (<Picker.Item label={x.name} key={x.user_id} value={x.user_id} />)
                  })
                }
              </Picker>
            </View> */}
            <Text style={styles.formText}>Owned By</Text>
            <View style={styles.formInput}>
              <Picker
                selectedValue={this.state.owned_by}
                style={styles.formSelect}
                onValueChange={(value) => {
                  this.setState({owned_by: value})
                }}
              >
                <Picker.Item value="select" label="Select Owner" key={0}/>
                {
                  this.state.members.map((x, i) => {
                    return (<Picker.Item label={x.name} key={x.user_id} value={x.user_id} />)
                  })
                }
              </Picker>
            </View>

            <Text style={styles.formText}>Label</Text>
            <View style={styles.formInput}>
              <Picker
                selectedValue={this.state.label_id}
                style={styles.formSelect}
                onValueChange={(value) => {
                  this.setState({label_id: value})
                }}
              >
                <Picker.Item value={0} label="Select Label" key={0}/>
                {
                  this.state.data_label.map((x, i) => {
                    return (<Picker.Item label={x.label_name} key={x.label_id} value={x.label_id} />)
                  })
                }
              </Picker>
            </View>

            <Text style={styles.formText}>Type</Text>
            <View style={styles.formInput}>
              <Picker
                selectedValue={this.state.type_id}
                style={styles.formSelect}
                onValueChange={(value) => {
                  this.setState({type_id: value})
                }}
              >
                <Picker.Item value="select" label="Select Type" key={0}/>
                {
                  this.state.data_type.map((x, i) => {
                    return (<Picker.Item label={x.type} key={x.type_id} value={x.type_id} />)
                  })
                }
              </Picker>
            </View>

            <Text style={styles.formText}>Priority</Text>
            <View style={styles.formInput}>
              <Picker
                selectedValue={this.state.priority_id}
                style={styles.formSelect}
                onValueChange={(value) => {
                  this.setState({priority_id: value})
                }}
              >
                <Picker.Item value="select" label="Select Priority" key={0}/>
                {
                  this.state.data_priority.map((x, i) => {
                    return (<Picker.Item label={x.priority_name} key={x.priority_id} value={x.priority_id} />)
                  })
                }
              </Picker>
            </View>

            {/* <Text style={styles.formText}>Status</Text>
            <View style={styles.formInput}>
              <Picker
                selectedValue={this.state.status_id}
                style={styles.formSelect}
                onValueChange={(value) => {
                  this.setState({status_id: value})
                }}
              >
                <Picker.Item value="select" label="Select Status" key={0}/>
                {
                  this.state.data_status.map((x, i) => {
                    return (<Picker.Item label={x.status} key={x.status_id} value={x.status_id} />)
                  })
                }
              </Picker>
            </View> */}

            <Text style={styles.formText}>Deadline</Text>
            <View style={styles.formInput}>
            <DatePicker
                style={{marginTop: 10}}
                date={this.state.deadline}
                mode="date"
                display="spinner"
                showIcon={false}
                format="YYYY-MM-DD"
                TouchableComponent={TouchableOpacity}
                onDateChange={(date) => this.setState({deadline : date})}
              />
            </View>
           
            <View style={styles.buttons}>
              <TouchableOpacity 
                style={styles.buttonCreate} 
                onPress={() => this.insertTask()}
                >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
      </SafeAreaView>
      </ScrollView>
    )
  }
}
export default CreateTask

const styles = StyleSheet.create({
    container : {
      flexGrow: 1,
      alignItems: 'center',
      marginBottom: 20
    },
    form: {
      width: "95%"
    },
    formInput: {
      width: "100%",
      minHeight: 60,
      backgroundColor:'#FFFFFF',
      borderRadius: 10,
      fontSize:20,
      color:'#000000',
      marginVertical: 4,
      paddingHorizontal: '5%',
      elevation: 10,
    },
    buttons:{
      justifyContent:'center',
      alignItems:'center'
    },
    buttonCreate: {
      width:200,
      height: 35,
      backgroundColor:'#1E5028',
      borderRadius: 10,
      elevation: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10
    },
    buttonText:{
      color:'#FFFFFF',
      fontSize:18,
      fontWeight:'bold',
      textAlign:'center',
    },
    formText: {
      fontSize:20,
      fontWeight:'bold',
      color:'#1E5028',
      marginTop: 10
    },
    formSelect:{
      width: "100%",
      minHeight: 60,
    },

  });
  