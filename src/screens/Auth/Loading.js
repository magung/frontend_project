import React, {useEffect} from 'react'
import { ActivityIndicator, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const Loading = props => {
  useEffect(()=>{
    AsyncStorage.getItem('token')
    .then(value => {
      if(value.length > 0){
        props.navigation.navigate('Menu')
      }
    })
    .catch(() => props.navigation.navigate('Auth'))
  }, [])

  return(
    <View style={{justifyContent:'center', alignItems: 'center', margin: '30%'}}>
        <ActivityIndicator size="large" color="#51A2DA" />
    </View>
  )
}
export default Loading
