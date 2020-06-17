import React from 'react';

import { YellowBox, AsyncStorage } from 'react-native';

import {
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';

import {
  createStackNavigator
} from 'react-navigation-stack';

import {
  createBottomTabNavigator
} from 'react-navigation-tabs';

/* import Icon from 'react-native-ionicons'
 */
import Icon from 'react-native-vector-icons/MaterialIcons';

import Home from './app/components/Home';
import LoadingScreen from './app/components/LoadingScreen';
import LoginForm from './app/components/LoginForm';
import RegisterForm from './app/components/RegisterForm';

import TripList from './app/components/TripList';
import Trip from './app/components/Trip';
import TripPublic from './app/components/TripPublic';
import TripForm from './app/components/TripForm';
import MyTrips from './app/components/MyTrips';
import Profile from './app/components/Profile';
import ExpensesList from './app/components/ExpensesList';
import ExpenseForm from './app/components/ExpenseForm';

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

import FontAwesome from 'react-native-vector-icons/FontAwesome'
FontAwesome.loadFont();

/* var firebaseConfig = {
  apiKey: "AIzaSyCfiPhFz_iJ_kLpWkprNl1cokvqP_nSpe4",
  authDomain: "planvi-cf5ef.firebaseapp.com",
  databaseURL: "https://planvi-cf5ef.firebaseio.com",
  projectId: "planvi-cf5ef",
  storageBucket: "planvi-cf5ef.appspot.com",
  messagingSenderId: "5453578324",
  appId: "1:5453578324:web:a3992e1889c2af649f2dc1"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} */

/* import { decode, encode } from 'base-64'
global.crypto = require("@firebase/firestore");
global.crypto.getRandomValues = byteArray => { for (let i = 0; i < byteArray.length; i++) { byteArray[i] = Math.floor(256 * Math.random()); } }
if (!global.btoa) { global.btoa = encode; }
if (!global.atob) { global.atob = decode; } */

// Ignores the warning of a deprecated method thar will be added back
YellowBox.ignoreWarnings(['VirtualizedLists should never be nested inside plain ScrollViews', 'Animated: `useNativeDriver`', 'Picker has been extracted', 'onAnimatedValueUpdate', 'componentWillReceiveProps has been renamed', 'unique "key" prop']);

/* if(__DEV__) {
  import('./ReactotronConfig.js').then(() => console.log('Reactotron Configured'))
} */


const TripStack = createStackNavigator({
  MyTrips: {
    screen: MyTrips,
    navigationOptions: {
      headerShown: false
    },
  },
  Trip: {
    screen: Trip,
    navigationOptions: {
      headerShown: false
    },
  },
  TripPublic: {
    screen: TripPublic,
    navigationOptions: {
      headerShown: false
    },
  },
  ExpensesList: {
    screen: ExpensesList,
    navigationOptions: {
      headerShown: false
    },
  },
  ExpenseForm: {
    screen: ExpenseForm,
    navigationOptions: {
      headerShown: false
    },
  }
})

const AppTabNavigator = createBottomTabNavigator(
  {
    Inicio: {
      screen: TripStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon name="home" size={24} color={tintColor} />
      }
    },
    Crear: {
      screen: TripForm,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon name="add-circle" size={24} color={tintColor} />
      }
    },
    Viajes: {
      screen: TripList,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon name="explore" size={24} color={tintColor} />
      }
    },
    Perfil: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon name="person" size={24} color={tintColor} />
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: '#3399ff',
      inactiveTintColor: '#B8BBC4',
      showlabel: false,
      showIcon: true
    }
  }
)

const AuthStack = createStackNavigator({
  Login: LoginForm,
  Register: RegisterForm
})

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppTabNavigator,
      Auth: AuthStack
    },
    {
      initialRouteName: 'Loading'
    }
  )
)