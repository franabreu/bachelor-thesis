import React from 'react';

import {YellowBox} from 'react-native';

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

import Home from './app/components/Home';
import LoadingScreen from './app/components/LoadingScreen';
import LoginForm from './app/components/LoginForm';
import RegisterForm from './app/components/RegisterForm';

import TripList from './app/components/TripList';
import TripForm from './app/components/TripForm';
import MyTrips from './app/components/MyTrips';
import Profile from './app/components/Profile';

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
/* YellowBox.ignoreWarnings(['-[RCTRootView cancelTouches]', 'Animated: `useNativeDriver`']);
 */
const AppStack = createStackNavigator ({
  Home: Home
})

const AppTabNavigator = createBottomTabNavigator (
  {
    Inicio: {
      screen: Home
    },
    Viajes: {
      screen: TripList
    },
    Crear: {
      screen: TripForm
    },
    MisViajes: {
      screen: MyTrips
    },
    Perfil: {
      screen: Profile
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

const AuthStack = createStackNavigator ({
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