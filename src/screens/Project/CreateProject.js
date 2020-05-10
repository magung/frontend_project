import React, {Component} from 'react'
import { ScrollView, FlatList, SafeAreaView, View, Text, TextInput, Picker, AsyncStorage, TouchableOpacity, StyleSheet, KeyboardAvoidingView, RefreshControlBase} from 'react-native';
import {URL} from '../../publics/config'
import Axios from 'axios';
import Toast from 'react-native-root-toast';

class CreateProject extends Component {
  state = {
    member: '',
    members : [],
    membersId : [],
    memberList : [],
    user_id: [],
    name: '',
    description: '',
    url: URL,
    token: ''
  }

  componentDidMount = async () => {
    const token = await AsyncStorage.getItem('token');
    this.setState({token : token})
    let urldebug = await AsyncStorage.getItem('debug');
    if (urldebug) {
      this.setState({url : urldebug})
    }
    await Axios.get(`${this.state.url}/user`, {headers : {Authorization : token}})
    .then( async res => {
      let memberList = []
      let user_id = []
      for(let key=0; key < res.data.data.length; key++) {
        memberList.push(res.data.data[key].name)
        user_id.push(res.data.data[key].user_id)
      }
      this.setState({memberList : memberList})
      this.setState({user_id : user_id})
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

  createProject = async (name, description, memberID) => {
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
        project_name : name,
        description : description
      }
      await Axios.post(`${this.state.url}/project`, data, {headers : {Authorization : token}})
      .then( async result => {
        let pr_id = result.data.data.pr_id
        let dataMember = {
          user_id : memberID
        }
        await Axios.post(`${this.state.url}/project/members/${pr_id}`, dataMember, {headers : {Authorization : token}})
        .then( async res => {
          Toast.show('Success create project', {
            duration: Toast.durations.LONG,
            position: 0,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,})
          this.props.navigation.navigate('SelectProject')
        })
        .catch( err => {
          Toast.show('Failed create project', {
            duration: Toast.durations.LONG,
            position: 0,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,})
        })
      })
      .catch( err => {
        Toast.show('Failed create project', {
          duration: Toast.durations.LONG,
          position: 0,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,})
      })
    }
  }
  
  memberList = () => {
    return ( this.state.memberList.map((x, i) => {
        return (<Picker.Item label={x} key={i} value={x} />)}));
  }

  render(){
    return(
      <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView behavior="padding" enabled style={styles.form}>
            <Text style={styles.formText}>Name Project</Text>
            <TextInput
              style={styles.formInput}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="enter name project"
              placeholderTextColor = "#AEAEAE"
              onChangeText={(name) => this.setState({name})}
              />
            <Text style={styles.formText}>Description</Text>
            <TextInput
              style={styles.formInput}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="enter description project"
              placeholderTextColor = "#AEAEAE"
              onChangeText={(description) => this.setState({description})}
              />
            <Text style={styles.formText}>Members</Text>
            <View style={styles.formInput}>
              <Picker
                selectedValue={this.state.member}
                style={styles.formSelect}
                onValueChange={(value, id) => this.inputMember(id)}
              >
                <Picker.Item value="select" label="Select Member" key={0}/>
                { this.memberList() }
              </Picker>
              <View style={styles.selectedMembers}>
              <FlatList
                columnWrapperStyle={styles.listMember}
                numColumns={2}
                data={this.state.members}
                renderItem={({item, index}) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.member}
                    onPress={() => this.deleteMember(index)}
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
            <View style={styles.listMember}>
              <TouchableOpacity 
                onPress={()=> this.createProject(this.state.name, this.state.description, this.state.membersId)}
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
export default CreateProject

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
  