import React, {Component} from 'react'
import { createAppContainer, createSwitchNavigator} from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { View, Text, AsyncStorage, TouchableOpacity, StyleSheet, Button} from 'react-native';

// screens
import Project from './src/screens/Menu/Project'
import NoProject from './src/screens/Menu/NoProject'
import Login from './src/screens/Auth/Login'
import Register from './src/screens/Auth/Register'
import Loading from './src/screens/Auth/Loading'
import Account from './src/screens/Menu/Account'
import Report from './src/screens/Menu/Report'
import Team from './src/screens/Menu/Team'
import CreateProject from './src/screens/Project/CreateProject'
import SelectProject from './src/screens/Project/SelectProject'
import CreateSprint from './src/screens/Sprint/CreateSprint'
import DetailSprint from './src/screens/Sprint/DetailSprint'
import DetailProject from './src/screens/Project/DetailProject'
import Sprint from './src/screens/Sprint/Sprint'
import DebugSetting from './src/screens/Auth/DebugSetting'
import CreateTask from './src/screens/Task/CreateTask'
import DetailTask from './src/screens/Task/DetailTask'

const Menu = createStackNavigator(
  {
    Project: {
      screen: Project,
      navigationOptions:{
        header: null
      }
    },
    NoProject: {
      screen: NoProject,
      navigationOptions:{
        header: null
      }
    },
    Report: {
      screen: Report,
      navigationOptions:{
        header: null
      }
    },
    Team: {
      screen: Team,
      navigationOptions:{
        header: null
      }
    },
    Account: {
      screen: Account,
      navigationOptions:{
        header: null
      }
    },
    CreateProject: {
      screen : CreateProject,
      navigationOptions:{
        title: 'Create Project',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#1E5028',
        headerStyle: {
          height: 60, 
        },
        headerTitleAlign: 'center'
      }
    },
    SelectProject: {
      screen : SelectProject,
      navigationOptions:{
        title: 'Select Project',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#1E5028',
        headerStyle: {
          height: 60, 
        },
        headerTitleAlign: 'center'
      }
    },
    CreateSprint: {
      screen : CreateSprint,
      navigationOptions:{
        title: 'Create Sprint',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#1E5028',
        headerStyle: {
          height: 60, 
        },
        headerTitleAlign: 'center'
      }
    },
    DetailSprint: {
      screen : DetailSprint,
      navigationOptions:{
        title: 'Detail Sprint',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#1E5028',
        headerStyle: {
          height: 60, 
        },
        headerTitleAlign: 'center'
      }
    },
    DetailProject: {
      screen : DetailProject,
      navigationOptions:{
        title: 'Detail Project',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#1E5028',
        headerStyle: {
          height: 60, 
        },
        headerTitleAlign: 'center'
      }
    },
    Sprint: {
      screen : Sprint,
      navigationOptions:{
        header : null,
      },
    },
    DebugSetting: {
      screen : DebugSetting,
      navigationOptions:{
        title: "Setting URL"
      }
    },
    CreateTask : {
      screen : CreateTask,
      navigationOptions:{
        title: 'Create Task',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#1E5028',
        headerStyle: {
          height: 60, 
        },
        headerTitleAlign: 'center'
      }
    },
    DetailTask: {
      screen : DetailTask,
      navigationOptions:{
        title: 'Detail Task',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#1E5028',
        headerStyle: {
          height: 60, 
        },
        headerTitleAlign: 'center'
      }
    }
  }
)

const Auth = createStackNavigator(
  {
    Login : {
      screen: Login,
      navigationOptions:{
        header: null
      }
    },
    Register : {
      screen: Register,
      navigationOptions:{
        header: null
      }
    },
    DebugSetting: {
      screen : DebugSetting,
      navigationOptions:{
        title: "Setting URL"
      }
    }
  }
)

const Navigation = createAppContainer(
  createSwitchNavigator(
    {
      Loading:{
        screen: Loading,
        navigationOptions:{
          header: null
        }
      },
      Menu : Menu,
      Auth : Auth
    },
    {
      initialRouteName : 'Loading'
    }
  )
)

export default class App extends Component{
  
  render(){
    return (
      <React.Fragment>
        <Navigation />
      </React.Fragment>
    )
  }
}