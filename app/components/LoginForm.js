import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  LayoutAnimation
} from 'react-native';

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

export default class LoginForm extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        email: "",
        password: "",
        errorMessage: null
    }

    handleLogin = () => {
        const {email, password}  = this.state

        firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .catch(error => this.setState({errorMessage: error.message}))
    }

    render() {
        LayoutAnimation.easeInEaseOut();

        return (
            <View style={StyleSheet.container}>
                <StatusBar barStyle='light-content'></StatusBar>

                <Text style={styles.greeting}>
                    {'¡Hola de nuevo!'}
                </Text>

                <Text style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </Text>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>Correo electrónico</Text>
                        <TextInput style={styles.textInput} 
                            autoCapitalize='none'
                            onChangeText={email => this.setState({email})}
                            value={this.state.email}>
                        </TextInput>
                    </View>

                    <View>
                        <Text style={styles.inputTitle}>Contraseña</Text>
                        <TextInput style={styles.textInput} 
                            secureTextEntry={true}
                            autoCapitalize='none' 
                            onChangeText={password => this.setState({password})}
                            value={this.state.password}>
                        </TextInput>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                        <Text style={styles.buttonText}>Iniciar sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.goToRegistration} onPress={() => this.props.navigation.navigate('Register') }>
                        <Text style={styles.textInput} >
                            Si no estás registrado, hazlo aquí.
                        </Text>
                    </TouchableOpacity>
                    
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    greeting: {
        marginTop: 80,
        fontSize: 30,
        fontWeight: '400',
        textAlign: 'center'
    },
    error: {
        color: 'red',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center'
    },
    errorMessage: {
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30
    },
    inputTitle: {
        paddingLeft: 20,
        color: 'gray',
        fontSize: 16,
        textTransform: 'uppercase'
    },
    textInput: {
        fontSize: 16,
        alignSelf: 'stretch',
        marginBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingVertical: 5,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomWidth: 1
    },
    button: {
        marginHorizontal: 20,
        backgroundColor: '#3399ff',
        borderRadius: 4,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
    },
    goToRegistration: {
        alignSelf: 'center',
        marginTop: 32,
        fontSize: 16,
    }
});