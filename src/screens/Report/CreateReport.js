import React, {Component} from 'react'
import { ScrollView, FlatList, Alert, SafeAreaView, View, Text, TextInput, Picker, TouchableOpacity, StyleSheet, KeyboardAvoidingView, RefreshControlBase} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';

class CreateReport extends Component {
  state = {
    report: '',
    url: URL,
    token: '',
    pr_id: 0,
    projects: [],
    sp_id: 0,
    sprints: []
  }

  componentDidMount = async () => {
    const token = await AsyncStorage.getItem('token');
    this.setState({token : token})
    let urldebug = await AsyncStorage.getItem('debug');
    if (urldebug) {
      this.setState({url : urldebug})
    }
    await Axios.get(`${this.state.url}/project`, {headers : {Authorization : token}})
    .then( async res => {
      this.setState({projects : res.data.data})
    })

  }

  getSprints = async (pr_id) => {
    await Axios.get(`${this.state.url}/sprint/project/`+pr_id, {headers : {Authorization : this.state.token}})
    .then( async res => {
      this.setState({sprints : res.data.data})
    })
  }


  createReport = async (pr_id, sp_id, report) => {
    if(!pr_id){
      Toast.show('Project is required', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
        Alert.alert("Warning", 'Project is required');
    }else if(!sp_id){
      Toast.show('Sprint is required', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
        Alert.alert("Warning", 'Sprint is required');
    }else if(!report){
      Toast.show('Report is required', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
        Alert.alert("Warning", 'Report is required');
    } else {
      const token = this.state.token
      let data = {
        pr_id: pr_id,
        sp_id : sp_id,
        report : report
      }
      await Axios.post(`${this.state.url}/report`, data, {headers : {Authorization : token}})
      .then( async result => {
        Toast.show('Success create report', {
          duration: Toast.durations.LONG,
          position: 0,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,})
          Alert.alert("Success", 'success create report');
        this.props.navigation.goBack()
       
      })
      .catch( err => {
        Toast.show('Failed create report', {
          duration: Toast.durations.LONG,
          position: 0,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,})
          Alert.alert("Failed", 'failed create report');
      })
    }
  }


  render(){
    return(
      <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView behavior="padding" enabled style={styles.form}>
            <Text style={styles.formText}>Project</Text>
            <View style={styles.formInput}>
              <Picker
                selectedValue={this.state.pr_id}
                style={styles.formSelect}
                onValueChange={(value) => {
                  this.setState({pr_id: value})
                  this.getSprints(value)
                }}
              >
                <Picker.Item value={0} label="Select Project" key={0}/>
                {
                  this.state.projects.map((x, i) => {
                    return (<Picker.Item label={x.pr_name} key={x.pr_id} value={x.pr_id} />)
                  })
                }
              </Picker>
            </View>
            <Text style={styles.formText}>Sprint</Text>
            <View style={styles.formInput}>
              <Picker
                selectedValue={this.state.sp_id}
                style={styles.formSelect}
                enabled={this.state.pr_id !== 0 && this.state.sprints.length !== 0 ? true : false}
                onValueChange={(value) => {
                  this.setState({sp_id: value})
                }}
                
              >
                <Picker.Item value={0} label="Select Sprint" key={0}/>
                {
                  this.state.sprints.map((x, i) => {
                    return (<Picker.Item label={x.sp_name} key={x.sp_id} value={x.sp_id} />)
                  })
                }
              </Picker>
            </View>
            <Text style={styles.formText}>Report</Text>
            <TextInput
              numberOfLines={1}
              multiline
              style={styles.formInput}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="enter report sprint"
              placeholderTextColor = "#AEAEAE"
              onChangeText={(report) => this.setState({report})}
              />
            <View style={styles.listMember}>
              <TouchableOpacity 
                onPress={()=> this.createReport(this.state.pr_id, this.state.sp_id, this.state.report)}
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
export default CreateReport

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
  