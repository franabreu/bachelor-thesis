import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar
} from 'react-native';

import { CheckBox } from 'react-native-elements'

/* import DatePicker from 'react-native-datepicker' */
import DateTimePicker from '@react-native-community/datetimepicker';

import { uploadTrip } from '../server/TripsAPI';

/* import * as firebase from 'firebase'; */

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';

export default class RegisterForm extends React.Component {
    static navigationOptions = {
        headerShown: false
    };

    state = {
        title: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        public: false,
        userID: '',
        errorMessage: null
    }

    handleSubmit = () => {
        var data = {
            title: this.state.title,
            description: this.state.description,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            public: this.state.public,
            userID: firebase.auth().currentUser.uid,
        }
        /* var data = this.state.trip */
        uploadTrip(data);
    }

    checkBoxPressed = () => {
        if (this.state.trip.public == true) {
            this.setState({ public: false })
        } else {
            this.setState({ public: true })
        }
    }

    render() {
        return (
            <ScrollView>
                <View style={StyleSheet.container}>
                    <StatusBar barStyle='light-content'></StatusBar>

                    <Text style={styles.greeting}>
                        {'Comencemos a planificar el próximo viaje'}
                    </Text>

                    <Text style={styles.errorMessage}>
                        {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                    </Text>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.inputTitle}>Título</Text>
                            <TextInput style={styles.textInput}
                                autoCapitalize='none'
                                onChangeText={title => this.setState({ title })}
                                value={this.state.title}>
                            </TextInput>
                        </View>

                        <View>
                            <Text style={styles.inputTitle}>Descripción</Text>
                            <TextInput style={styles.textInput}
                                multiline={true}
                                numberOfLines={3}
                                autoCapitalize='none'
                                onChangeText={description => this.setState({ description })}
                                value={this.state.description}>
                            </TextInput>
                        </View>

                        <View>
                            <Text style={styles.inputTitle}>Salida</Text>
                            <DateTimePicker
                                value={this.state.startDate}
                                mode='date'
                                display="calendar"
                                onDateChange={(startDate) => { this.setState({ startDate: startDate }) }}>
                            </DateTimePicker>
                        </View>

                        <View>
                            <Text style={styles.inputTitle}>Llegada</Text>
                            <DateTimePicker
                                value={this.state.endDate}
                                mode='date'
                                display="calendar"
                                onDateChange={(endDate) => { this.setState({ endDate: endDate }) }}>
                            </DateTimePicker>
                        </View>

                        <View>
                            <Text style={styles.inputTitle}>Público</Text>
                            <CheckBox
                                title='Deseo que otros usuarios puedan ver mi viaje'
                                checked={this.state.public}
                                onPress={() => this.checkBoxPressed()}
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
                            <Text style={styles.buttonText}>Crear</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
        fontSize: 10,
        textTransform: 'uppercase'
    },
    textInput: {
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
    },
    datePicker: {
        width: 250,
        alignSelf: 'stretch',
        marginBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingVertical: 5,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomWidth: 0
    },
});