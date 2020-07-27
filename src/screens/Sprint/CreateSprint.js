import React, {Component} from 'react'
import { ScrollView, FlatList,Alert, SafeAreaView, View, Text, TextInput, Picker, TouchableOpacity, StyleSheet, KeyboardAvoidingView, RefreshControlBase} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios';
import Toast from 'react-native-root-toast';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
class CreateSprint extends Component {
  state = {
    name: '',
    description: '',
    url: URL,
    token: '',
    pr_id: 0,
    deadline: moment().format('YYYY-MM-DD')
  }

  componentDidMount = async () => {
    const token = await AsyncStorage.getItem('token');
    this.setState({token : token})
    let urldebug = await AsyncStorage.getItem('debug');
    if (urldebug) {
      this.setState({url : urldebug})
    }
    let pr_id = this.props.navigation.getParam('pr_id');
    this.setState({pr_id})
  }


  createSprint = async (name, description, deadline) => {
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
        pr_id: this.state.pr_id,
        sprint_name : name,
        description : description,
        deadline : deadline
      }
      await Axios.post(`${this.state.url}/sprint`, data, {headers : {Authorization : token}})
      .then( async result => {
        Toast.show('Success create sprint', {
          duration: Toast.durations.LONG,
          position: 0,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,})
          Alert.alert("Success", 'Success create sprint');
        this.props.navigation.goBack()
       
      })
      .catch( err => {
        Toast.show('Failed create sprint', {
          duration: Toast.durations.LONG,
          position: 0,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,})
          Alert.alert("Failed", 'Failed create sprint');
      })
    }
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
            <View style={styles.listMember}>
              <TouchableOpacity 
                onPress={()=> this.createSprint(this.state.name, this.state.description, this.state.deadline)}
                style={styles.buttonCreate} 
                >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}
export default CreateSprint

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
  