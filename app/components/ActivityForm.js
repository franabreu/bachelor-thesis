import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Picker,
    Button
} from 'react-native';

import { CheckBox, SearchBar } from 'react-native-elements'

import DateTimePicker from '@react-native-community/datetimepicker';

import ValidationComponent from 'react-native-form-validator';

import { uploadActivity, updateActivity } from '../server/DaysAPI';

/* import * as firebase from 'firebase'; */

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';

import 'moment/locale/es'
var moment = require('moment');

const categoryEnum = ['Transporte', 'Atracción', 'Museo', 'Comida', 'Fiesta', 'Otro'];

export default class ActivityForm extends ValidationComponent {
    static navigationOptions = {
        headerShown: false
    };

    deviceLocale = "es"

    state = {
        tripID: '',
        dayID: '',
        activityID: null,
        name: '',
        note: '',
        time: new Date(),
        category: 'Transporte',
        errorMessage: null
    }

    componentDidMount() {
        const tripID = this.props.navigation.state.params.tripID
        const dayID = this.props.navigation.state.params.dayID
        const time = this.props.navigation.state.params.date
        this.setState({ tripID: tripID });
        this.setState({ dayID: dayID });
        this.setState({ time: time });

        var activity = this.props.navigation.state.params.activity;
        if (activity != null) {
            this.setState({ activityID: activity.activityID, name: activity.name, note: activity.note, time: activity.time, category: activity.category });
        }
    }

    handleSubmit = () => {

        var data = {
            name: this.state.name,
            note: this.state.note,
            time: this.state.time,
            category: this.state.category
        }

        this.validate({
            name: { minlength: 1, maxlength: 40, required: true },
            note: { minlength: 1, maxlength: 500, required: false },
            time: { required: true },
            category: { required: true }
        });

        if (this.isFormValid()) {
            if (this.state.activityID == null) {
                uploadActivity(data, this.state.tripID, this.state.dayID);
            } else {
                updateActivity(data, this.state.tripID, this.state.dayID, this.state.activityID);
            }
            this.props.navigation.navigate('ActivitiesList', { tripID: this.state.tripID, dayID: this.state.dayID });
        }
    }

    render() {
        return (
            <ScrollView
                keyboardShouldPersistTaps='always'>
                <View style={StyleSheet.container}>
                    <StatusBar barStyle='light-content'></StatusBar>

                    <Text style={styles.greeting}>
                        {'Añadir actividad'}
                    </Text>

                    <Text style={styles.errorMessage}>
                        {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                    </Text>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.inputTitle}>Nombre</Text>
                            <TextInput style={styles.textInput}
                                autoCapitalize='none'
                                onChangeText={name => this.setState({ name })}
                                value={this.state.name}>
                            </TextInput>
                        </View>

                        <View>
                            <Text style={styles.inputTitle}>Nota</Text>
                            <TextInput style={styles.textInput}
                                autoCapitalize='none'
                                onChangeText={note => this.setState({ note })}
                                value={this.state.note}>
                            </TextInput>
                        </View>

                        <View>
                            <Text style={styles.inputTitle}>Hora</Text>
                            <DateTimePicker
                                value={this.state.time}
                                mode='time'
                                onChange={(event, value) => { this.setState({ time: value }); }}>
                            </DateTimePicker>
                        </View>

                        <View>
                            <Text style={styles.inputTitle}>Categoría</Text>
                            <View>
                                <Picker
                                    selectedValue={this.state.category}
                                    style={styles.picker}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ category: itemValue })
                                    }>
                                    {categoryEnum.map((item, index) => {
                                        return (<Picker.Item label={item} value={item} key={index} />)
                                    })}
                                </Picker>
                            </View>
                        </View>


                        <Text style={styles.error}>
                            {this.getErrorMessages()}
                        </Text>

                        <View style={styles.inputTitle}>
                            <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
                                <Text style={styles.buttonText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>

                        {this.state.activity != null ?
                            <TouchableOpacity onPress={() => Alert.alert(
                                'Dar de baja',
                                '¿Está seguro de que desea eliminar este viaje?',
                                [
                                    { text: 'No', onPress: () => null, style: 'cancel' },
                                    { text: 'Sí', onPress: () => this.deleteActivity(this.state.tripID, this.state.dayID, this.state.activityID) },
                                ]
                            )}>
                                <Text style={styles.text}>Eliminar actividad</Text>
                            </TouchableOpacity>
                            : null
                        }
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
        fontSize: 18,
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
        borderBottomWidth: 1,
        fontSize: 18,
    },
    numericInput: {
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    button: {
        marginTop: 10,
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
    searchBar: {
        backgroundColor: 'white',
    },
    picker: {
        alignSelf: 'center',
        width: 180
    },
    text: {
        fontSize: 18,
        alignSelf: 'center',
        marginBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingVertical: 5,
    },
    rateButton: {
        marginTop: -10,
        marginHorizontal: 70,
        marginBottom: 10,
        backgroundColor: '#cccccc',
        borderRadius: 4,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
});