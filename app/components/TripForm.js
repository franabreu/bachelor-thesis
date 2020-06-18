import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar
} from 'react-native';

import { CheckBox, SearchBar } from 'react-native-elements'

/* import DatePicker from 'react-native-datepicker' */
import DateTimePicker from '@react-native-community/datetimepicker';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PlacesInput from 'react-native-places-input';

import ValidationComponent from 'react-native-form-validator';

import { uploadTrip, uploadDay } from '../server/TripsAPI';

/* import * as firebase from 'firebase'; */

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';

import 'moment/locale/es'
var moment = require('moment');

function City({ name }) {
    return (
        <View >
            <Text>{name}</Text>
        </View>
    );
}

export default class TripForm extends ValidationComponent {
    static navigationOptions = {
        headerShown: false
    };

    deviceLocale = "es"

    state = {
        title: "",
        description: "",
        city: "",
        startDate: new Date(),
        endDate: new Date(),
        public: false,
        userID: '',
        errorMessage: null,
        searchText: null
    }

    handleSubmit = () => {

        var data = {
            title: this.state.title,
            description: this.state.description,
            city: this.state.city,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            public: this.state.public,
            userID: firebase.auth().currentUser.uid,
        }

        this.validate({
            title: { minlength: 2, maxlength: 20, required: true },
            description: { minlength: 3, maxlength: 200, required: true },
            city: { minlength: 3, maxlength: 60, required: true },
            startDate: { required: true },
            endDate: { required: true },
        });

        if (this.isFormValid()) {
            var tripID = uploadTrip(data);
            this.props.navigation.navigate('MyTrips');
        }
    }


    checkBoxPressed = () => {
        if (this.state.public == true) {
            this.setState({ public: false })
        } else {
            this.setState({ public: true })
        }
    }

    render() {
        return (
            <ScrollView
                keyboardShouldPersistTaps="always">
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
                            <Text style={styles.inputTitle}>Ciudad</Text>

                            <GooglePlacesAutocomplete
                                placeholder='Buscar ciudad...'
                                minLength={2} // minimum length of text to search
                                autoFocus={false}
                                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                                listViewDisplayed='auto' // true/false/undefined
                                listViewDisplayed={false}
                                renderDescription={(row) => row.description} // custom description render
                                onPress={(data, details = null) => {
                                    // 'details' is provided when fetchDetails = true
                                    this.setState({ city: data.description })
                                }}
                                getDefaultValue={() => ''}
                                query={{
                                    // available options: https://developers.google.com/places/web-service/autocomplete
                                    key: 'AIzaSyA8ZqUwMZ29hi5E2tpOKxcStU1Xb4EvS4g',
                                    language: 'es', // language of the results
                                    types: '(cities)', // default: 'geocode'
                                }}
                                styles={{
                                    textInputContainer: {
                                        backgroundColor: 'white',
                                        marginBottom: 20,
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        paddingVertical: 0,
                                        width: '100%',
                                        borderTopWidth: 0,
                                        borderBottomWidth: 0,
                                    },
                                    textInput: {
                                        marginLeft: 0,
                                        marginRight: 0,
                                        height: 38,
                                        color: '#5d5d5d',
                                        fontSize: 16,
                                    },
                                    description: {
                                        fontWeight: 'bold',
                                    },
                                    predefinedPlacesDescription: {
                                        color: '#1faadb',
                                    },
                                }}
                                currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                                currentLocationLabel='Current location'
                                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                GooglePlacesSearchQuery={{
                                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                    rankby: 'distance',
                                    type: 'cafe',
                                }}
                                GooglePlacesDetailsQuery={{
                                    // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                                    fields: 'formatted_address',
                                }}
                                filterReverseGeocodingByTypes={[
                                    'locality',
                                    'administrative_area_level_3',
                                ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                enablePoweredByContainer={false}
                            />

                            {/* <Text>{this.state.city}</Text> */}
                        </View>

                        <View>
                            <Text style={styles.inputTitle}>Salida</Text>
                            <DateTimePicker
                                value={this.state.startDate}
                                mode='date'
                                display="calendar"
                                onChange={ (event, value) => {this.setState({startDate: value});}}>
                            </DateTimePicker>
                        </View>

                        <View>
                            <Text style={styles.inputTitle}>Llegada</Text>
                            <DateTimePicker
                                value={this.state.endDate}
                                mode='date'
                                display="calendar"
                                onChange={ (event, value) => {this.setState({endDate: value});}}>
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

                        <Text style={styles.error}>
                            {this.getErrorMessages()}
                        </Text>

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
    searchBar: {
        backgroundColor: 'white',
    },
});