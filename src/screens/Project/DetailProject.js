import React, {Component} from 'react'
import { Alert, ScrollView, FlatList, SafeAreaView, View, Text, TextInput, Picker, AsyncStorage, TouchableOpacity, StyleSheet, KeyboardAvoidingView, RefreshControlBase} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios';
import Toast from 'react-native-root-toast';

class DetailProject extends Component {
  state = {
    member: '',
    members : [],
    membersId : [],
    memberList : [],
    user_id: [],
    name: '',
    description: '',
    url: URL,
    token: '',
    pr_id: 0,
    canUpdate : false,
    canDelete : true
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
    await Axios.get(`${this.state.url}/project/${pr_id}`, {headers : {Authorization : token}})
    .then( async res => {
      if(res.data.status == 200) {
        this.setState({
          name : res.data.data[0].pr_name,
          description : res.data.data[0].pr_description
        })
      }
    })

    let level = await AsyncStorage.getItem('user_data')
    level = JSON.parse(level)
    if(level.usr_level_id == 1){
      this.setState({canUpdate : true})
    }

    let member_selected = []
    let user_id_selected = []
    const user = await AsyncStorage.getItem('user_data');
    await Axios.get(`${this.state.url}/project/members/${pr_id}`, {headers : {Authorization : token}})
    .then( async res => {
      if(res.data.status == 200) {
        for(let key=0; key < res.data.data.length; key++) {
          if(JSON.parse(user).user_id !== res.data.data[key].user_id){
            user_id_selected.push(res.data.data[key].user_id)
            member_selected.push(res.data.data[key].name)
          }
        }
      }
    })
    this.setState({
      members: member_selected, 
      membersId: user_id_selected
    })

    await Axios.get(`${this.state.url}/user`, {headers : {Authorization : token}})
    .then( async res => {
      let memberList = []
      let user_id = []
      for(let key=0; key < res.data.data.length; key++) {
        memberList.push(res.data.data[key].name)
        user_id.push(res.data.data[key].user_id)
      }
      this.setState({
        memberList : memberList, 
        user_id : user_id
      })
      
    })
    .catch( err => {
      Toast.show('Failed get members', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
    })
    
    for(let key=0;key < user_id_selected.length; key++){
      let listMember = this.state.memberList
      let listMemberId = this.state.user_id
      let noSelect = []
      let noSelectId = []
      for(let i = 0; i < listMember.length; i++) {
        if(listMemberId[i] !== user_id_selected[key]){
          noSelect.push(listMember[i])
          noSelectId.push(listMemberId[i])
        }
      }
      this.setState({
        memberList: noSelect, 
        user_id: noSelectId
      })
    }

    let sprint = await Axios.get(`${this.state.url}/sprint/project/${pr_id}`, {headers : {Authorization : token}})
    if(sprint.data.data.length != 0) this.setState({canDelete : false});
  }

  deleteProject = async () => {
    await Axios.delete(`${this.state.url}/project/${this.state.pr_id}`, {headers : {Authorization : this.state.token}})
    .then(async res => {
      Toast.show('Success delete project', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
        await AsyncStorage.setItem('pr_id', "" + 0)
        this.props.navigation.navigate("Project")
    })
    .catch(err => {
      Toast.show('Failed delete project', {
        duration: Toast.durations.LONG,
        position: 0,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,})
    })
  }

  handleDelete= async () => {
    Alert.alert('Warning', 'Do want to delete this Project',
      [
        {text: 'YES', onPress: () => this.deleteProject()},
        {text: 'NO'}
      ],
      {cancelable: false},)
  }

  

  inputMember = (id) => {
    let listMember = this.state.memberList
    let listMemberId = this.state.user_id
    id = Number(id) - 1 
    let selectMembers = this.state.members
    let selectMembersId = this.state.membersId
    let noSelect = []
    let noSelectId = []
    for(let i = 0; i < listMember.length; i++) {
      if(i == id){
        selectMembers.push(listMember[id])
        selectMembersId.push(listMemberId[id])
      }else{
        noSelect.push(listMember[i])
        noSelectId.push(listMemberId[i])
      }
    }
    this.setState({members: selectMembers})
    this.setState({memberList: noSelect})
    this.setState({membersId: selectMembersId})
    this.setState({user_id: noSelectId})
  }

  deleteMember = (id) => {
    let listMember = this.state.members
    let listMemberId = this.state.membersId
    let selectMembers = this.state.memberList
    let selectMembersId = this.state.user_id
    let noSelect = []
    let noSelectId = []
    for(let i = 0; i < listMember.length; i++) {
      if(i == id){
        selectMembers.push(listMember[id])
        selectMembersId.push(listMemberId[id])
      }else{
        noSelect.push(listMember[i])
        noSelectId.push(listMemberId[i])
      }
    }
    this.setState({memberList: selectMembers})
    this.setState({members: noSelect})
    this.setState({membersId: noSelectId})
    this.setState({user_id: selectMembersId})
  }

  editProject = async (name, description, memberID) => {
    if(!name){
      Toast.show('name project is required', {
            duration: Toast.durations.LONG,
            position: 0,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,})
    }else if(!description){
      Toast.show('description project is required', {
            duration: Toast.durations.LONG,
            position: 0,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,})
    }else if(memberID.length <= 0){
      Toast.show('members project is required', {
            duration: Toast.durations.LONG,
            position: 0,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,})
    } else {
      const token = this.state.token
      let data = {
        pr_name : name,
        description : description
      }
      let updateProject = await Axios.put(`${this.state.url}/project/${this.state.pr_id}`, data, {headers : {Authorization : token}})
      if(updateProject){
        let dataMember = {
          user_id : memberID
        }
        let updateMember = await Axios.put(`${this.state.url}/project/members/${this.state.pr_id}`, dataMember, {headers : {Authorization : token}})
        if(updateMember){
          Toast.show('Success update project', {
            duration: Toast.durations.LONG,
            position: 0,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,})
          this.props.navigation.navigate("Project", {pr_id : this.state.pr_id})
        } else {
          Toast.show('Failed update project', {
            duration: Toast.durations.LONG,
            position: 0,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,})
        }
      
        
      } else {
        Toast.show('Failed update project', {
          duration: Toast.durations.LONG,
          position: 0,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,})
      }
    }
  }
  
  memberList = () => {
    return ( this.state.memberList.map((x, i) => {
    return (<Picker.Item label={x} key={i} value={x} />)}));
  }

  buttonUpDel = () => {
    return (
      <>
      <View style={styles.listMember}>
        <TouchableOpacity 
          onPress={()=> this.editProject(this.state.name, this.state.description, this.state.membersId)}
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
        <ScrollView>
          <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView behavior="padding" enabled style={styles.form}>
            <Text style={styles.formText}>Name Project</Text>
            <TextInput
              value={this.state.name}
              style={styles.formInput}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="enter name project"
              placeholderTextColor = "#AEAEAE"
              onChangeText={(name) => this.setState({name})}
              />
            <Text style={styles.formText}>Description</Text>
            <TextInput
              value={this.state.description}
              style={styles.formInput}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="enter description project"
              placeholderTextColor = "#AEAEAE"
              onChangeText={(description) => this.setState({description})}
              />
            <Text style={styles.formText}>Members</Text>
            <View style={this.state.canUpdate ? styles.formInput : styles.formMember}>
              { this.state.canUpdate ?
              <Picker
                selectedValue={this.state.member}
                style={styles.formSelect}
                onValueChange={(value, id) => this.inputMember(id)}
              >
                <Picker.Item value="select" label="Select Member" key={0}/>
                { this.memberList() }
              </Picker>
              : null }
              <View style={styles.selectedMembers}>
              <FlatList
                columnWrapperStyle={styles.listMember}
                numColumns={2}
                data={this.state.members}
                renderItem={({item, index}) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.member}
                    onPress={() => this.state.canUpdate ? this.deleteMember(index) : null}
                  >
                    <Text style={styles.memberText}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                  )}
                  keyExtractor={item => item.user_id}
              />
              </View>
            </View>
            {this.state.canUpdate ? this.buttonUpDel() : null}
          </KeyboardAvoidingView>
          </SafeAreaView>
        </ScrollView>
    )
  }
}
export default DetailProject

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
    formMember: {
      width: "100%",
      backgroundColor:'#FFFFFF',
      borderRadius: 10,
      fontSize:20,
      color:'#000000',
      marginVertical: 4,
      paddingVertical: 5,
      paddingHorizontal: 5,
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
  