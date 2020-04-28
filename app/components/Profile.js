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

export default class Profile extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        email: "",
        displayName: ""
    }

    componentDidMount() {
        const {email, displayName} = firebase.auth().currentUser;

        this.setState({email, displayName});
    }

    signOut = () => {
        firebase.auth().signOut();
    }

    render() {
        LayoutAnimation.easeInEaseOut();

        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content'></StatusBar>

                <Text>¡Hola, {this.state.displayName}!</Text>

                <TouchableOpacity style={{marginTop: 32}} onPress={this.signOut}>
                    <Text>Cerrar sesión</Text>
                </TouchableOpacity>
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