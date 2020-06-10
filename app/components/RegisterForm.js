import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar
} from 'react-native';

/* import * as firebase from 'firebase'; */

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

export default class RegisterForm extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        name: "",
        surname: "",
        email: "",
        password: "",
        currency: "EUR",
        errorMessage: null
    }

    handleSignUp = () => {
        const {email, password}  = this.state

        firebase.auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(userCredentials => {
            return userCredentials.user.updateProfile({
                displayName: this.state.name + " " + this.state.surname,
                photoURL: this.state.currency
            });
        })
        .catch(error => this.setState({errorMessage: error.message}))
    }

    render() {
        return (
            <View style={StyleSheet.container}>
                <StatusBar barStyle='light-content'></StatusBar>

                <Text style={styles.greeting}>
                    {'¡Bienvenido!\nRegístrese para comenzar'}
                </Text>

                <Text style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </Text>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>Nombre</Text>
                        <TextInput style={styles.textInput} 
                            autoCapitalize='none'
                            onChangeText={name => this.setState({name})}
                            value={this.state.name}>
                        </TextInput>
                    </View>

                    <View>
                        <Text style={styles.inputTitle}>Apellido</Text>
                        <TextInput style={styles.textInput} 
                            autoCapitalize='none'
                            onChangeText={surname => this.setState({surname})}
                            value={this.state.surname}>
                        </TextInput>
                    </View>

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

                    <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                        <Text style={styles.buttonText}>Registrarme</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.goToRegistration} onPress={() => this.props.navigation.navigate('Login') }>
                        <Text style={styles.textInput}>
                            ¿Ya tienes una cuenta? Iniciar sesión.
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
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 16,
    },
    goToRegistration: {
        alignSelf: 'center',
        marginTop: 32
    },
    backButton: {
        position: 'absolute',
        top: 48,
        left: 32, 
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(21, 22, 48, 0.1)',
        alignItems: 'center',
        justifyContent: 'center'
    }
});