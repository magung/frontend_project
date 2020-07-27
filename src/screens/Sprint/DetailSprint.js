import React, {Component} from 'react'
import { ScrollView, FlatList, SafeAreaView, View, Text, TextInput, Picker, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert, RefreshControlBase} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios';
import Toast from 'react-native-root-toast';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
class DetailSprint extends Component {
  state = {
    name: '',
    description: '',
    url: URL,
    token: '',
    sp_id: 0,
    canUpdate : false,
    canDelete : true,
    deadline: moment().format('YYYY-MM-DD')
  }

  componentDidMount = async () => {
    const token = await AsyncStorage.getItem('token');
    this.setState({token : token})
    let urldebug = await AsyncStorage.getItem('debug');
    if (urldebug) {
      this.setState({url : urldebug})
    }
    let sp_id = this.props.navigation.getParam('sp_id');
    this.setState({sp_id})
    await Axios.get(this.state.url + "/sprint/" + this.state.sp_id, {headers : {Authorization : token}})
    .then(res => {
      this.setState({
        name: res.data.data[0].sp_name,
        description : res.data.data[0].sp_description,
        deadline : moment(res.data.data[0].deadline).format('YYYY-MM-DD')
      })
    })

    let level = await AsyncStorage.getItem('user_data')
    level = JSON.parse(level)
    if(level.usr_level_id == 2){
      this.setState({canUpdate : true})
    }
  }

  handleDelete= async () => {
    Alert.alert('Warning', 'Do want to delete this Sprint',
      [
        {text: 'YES', onPress: () => this.deleteSprint()},
        {text: 'NO'}
      ],
      {cancelable: false},)
  }

  deleteSprint = async () => {
    await Axios.delete(`${this.state.url}/sprint/${this.state.sp_id}`, {headers : {Authorization : this.state.token}})
    .then(res => {
      Toast.show('Success delete sprint', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
        Alert.alert("Success", 'success delete sprint');
        return this.props.navigation.navigate("Project")
    })
    .catch(err => {
      Toast.show('Failed delete sprint', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
        Alert.alert("Failed", 'failed delete sprint');
    })
  }


  updateSprint = async (name, description, deadline) => {
    if(!name){
      Toast.show('name sprint is required', {
            duration: Toast.durations.LONG,
            position: 0,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,})
            Alert.alert("Warning", 'name sprint is required');
    }else if(!description){
      Toast.show('description sprint is required', {
            duration: Toast.durations.LONG,
            position: 0,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,})
            Alert.alert("Warning", 'description sprint is required');
    } else {
      const token = this.state.token
      let data = {
        sp_name : name,
        description : description,
        deadline : deadline
      }
      await Axios.put(`${this.state.url}/sprint/` + this.state.sp_id, data, {headers : {Authorization : token}})
      .then( async result => {
        Toast.show('Success update sprint', {
          duration: Toast.durations.LONG,
          position: 0,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,})
          Alert.alert("Success", 'success update sprint');
        this.props.navigation.goBack()
       
      })
      .catch( err => {
        Toast.show('Failed update sprint', {
          duration: Toast.durations.LONG,
          position: 0,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,})
          Alert.alert("Failed", 'Failed update sprint');
      })
    }
  }

  buttonUpDel = () => {
    return (
      <>
      <View style={styles.listMember}>
        <TouchableOpacity 
          onPress={()=> this.updateSprint(this.state.name, this.state.description, this.state.deadline)}
          style={styles.buttonCreate} 
          >
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
      { this.state.canDelete ? 
      <View style={styles.listMember}>
        <TouchableOpacity 
          onPress={() => this.handleDelete()}
          style={styles.buttonDelete} 
          >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      : null
      }
      </>
    )
  }


  render(){
    return(
      <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView behavior="padding" enabled style={styles.form}>
            <Text style={styles.formText}>Name Sprint</Text>
            <TextInput
              style={styles.formInput}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="enter name sprint"
              placeholderTextColor = "#AEAEAE"
              value = {this.state.name}
              onChangeText={(name) => this.setState({name})}
              />
            <Text style={styles.formText}>Description</Text>
            <TextInput
              numberOfLines={1}
              multiline
              style={styles.formInput}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="enter description sprint"
              placeholderTextColor = "#AEAEAE"
              value = {this.state.description}
              onChangeText={(description) => this.setState({description})}
              />
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
            {this.state.canUpdate ? this.buttonUpDel() : null}
          </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}
export default DetailSprint

const styles = StyleSheet.create({
    container : {
      flexGrow: 1,
      alignItems: 'center'
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
    formSelect:{
      width: "100%",
      minHeight: 60,
    },
    selectedMembers:{
      width: "100%",
      marginBottom: 20
    },
    listMember:{
      justifyContent:'center',
      alignItems:'center'
    },
    member: {
      minWidth:50,
      height: 30,
      backgroundColor:'#1E5028',
      alignItems:'center',
      justifyContent:'center',
      paddingHorizontal: 10,
      borderRadius: 10,
      flexDirection:'row',
      marginVertical: 5,
      marginHorizontal:2
    },
    memberText:{
      fontSize:12,
      fontWeight:'bold',
      color:'#FFFFFF',
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
    buttonDelete: {
      width:200,
      height: 35,
      backgroundColor:'#892020',
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
    }

  });
  