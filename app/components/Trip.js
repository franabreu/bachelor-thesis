import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  LayoutAnimation,
  TouchableOpacity
} from 'react-native';

/* import * as firebase from 'firebase';
 */
import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

export default class Trip extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
    }

    componentDidMount() {
    }

    render() {
        LayoutAnimation.easeInEaseOut();

        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content'></StatusBar>

                <Text>¡Hola!</Text>

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