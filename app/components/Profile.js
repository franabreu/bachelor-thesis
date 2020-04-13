import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar
} from 'react-native';

/* import * as firebase from 'firebase';
 */
import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

export default class Profile extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content'></StatusBar>

                <Text>Mi perfil</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
});