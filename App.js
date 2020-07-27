import React, {Component} from 'react'
import { createAppContainer, createSwitchNavigator} from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs'
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
import CreateReport from './src/screens/Report/CreateReport'
import DetailReport from './src/screens/Report/DetailReport'
import TeamSprint from './src/screens/Team/Sprint'
import TeamTask from './src/screens/Team/Task'
import ImageProfile from './src/screens/Account/ImageProfile'
const MainNavigator = createBottomTabNavigator(
  {
    Project : {
      screen : Project,
      navigationOptions : {
        title : 'Project',
        tabBarIcon: ({focused}) => (
            focused ?
            <View style={styles.icon}><Image source={require('./assets/project01.png')} style={styles.iconImage}/></View>:
            <View style={styles.icon}><Image source={require('./assets/project02.png')} style={styles.iconImage}/></View>
        ),
        tabBarOptions: {
            activeTintColor: '#1E5028',
            keyboardHidesTabBar: true,
            style:{
              height: 60
            }
        },
        

      }
    },
    Report : {
      screen : Report,
      navigationOptions : {
        title : 'Report',
        tabBarIcon: ({focused}) => (
            focused ?
            <View style={styles.icon}><Image source={require('./assets/report01.png')} style={styles.iconImage}/></View>:
            <View style={styles.icon}><Image source={require('./assets/report02.png')} style={styles.iconImage}/></View>
        ),
        tabBarOptions: {
            activeTintColor: '#1E5028',
            keyboardHidesTabBar: true,
            style:{
              height: 60
            }
        }
      }
    },
    Team : {
      screen : Team,
      navigationOptions : {
        title : 'Team',
        tabBarIcon: ({focused}) => (
            focused ?
            <View style={styles.icon}><Image source={require('./assets/team01.png')} style={styles.iconImage}/></View>:
            <View style={styles.icon}><Image source={require('./assets/team02.png')} style={styles.iconImage}/></View>
        ),
        tabBarOptions: {
            activeTintColor: '#1E5028',
            keyboardHidesTabBar: true,
            style:{
              height: 60
            }
        }
      }
    },
    Account : {
      screen : Account,
      navigationOptions : {
        title : 'Account',
        tabBarIcon: ({focused}) => (
            focused ?
            <View style={styles.icon}><Image source={require('./assets/account01.png')} style={styles.iconImage}/></View>:
            <View style={styles.icon}><Image source={require('./assets/account02.png')} style={styles.iconImage}/></View>
        ),
        tabBarOptions: {
            activeTintColor: '#1E5028',
            keyboardHidesTabBar: true,
            style:{
              height: 60
            }
        }
      }
    }
  }
)

const Menu = createStackNavigator(
  {
    Main : {
      screen : MainNavigator,
      navigationOptions:{
        header: null,
      }
    },
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
    ImageProfile: {
      screen : ImageProfile,
      navigationOptions:{
        title: 'Image Profile',
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
    },
    CreateReport: {
      screen : CreateReport,
      navigationOptions:{
        title: 'Create Report',
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
    DetailReport: {
      screen : DetailReport,
      navigationOptions:{
        title: 'Detail Report',
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
    TeamSprint: {
      screen : TeamSprint,
      navigationOptions:{
        header : null,
      }
    },
    TeamTask: {
      screen : TeamTask,
      navigationOptions:{
        header : null,
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


const styles = StyleSheet.create({
  icon: {
    height: 50,
    padding: 10,
    alignItems: 'center'
  },
  iconImage: {
      height: 40,
      width: 40,
      resizeMode: 'contain'
  }

});