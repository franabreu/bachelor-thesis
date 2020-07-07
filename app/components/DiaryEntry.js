import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Picker,
    Button,
    Image,
    FlatList
} from 'react-native';

import { CheckBox, SearchBar } from 'react-native-elements'

import DateTimePicker from '@react-native-community/datetimepicker';

import ValidationComponent from 'react-native-form-validator';

import ImagePicker from 'react-native-image-picker';

import { updateDiary, uploadImagePath, getImagesByDayId } from '../server/DaysAPI';

/* import * as firebase from 'firebase'; */

import { firebase, utils } from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";
import storage from '@react-native-firebase/storage';
import { ScrollView } from 'react-native-gesture-handler';

import 'moment/locale/es'
var moment = require('moment');

const reference = storage().ref();

const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

async function getPathForFirebaseStorage(uri) {
    if (IS_IOS) return uri
    const stat = await RNFetchBlob.fs.stat(uri)
    return stat.path
}

function makeImageName(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function Item({ path }) {

    /* const reference = firebase.storage().ref(path); */
    /* const url = await reference.getDownloadURL(); */
    /* console.log('URL: ' + JSON.stringify(url)) */

    /* const url = firebase.storage()
        .ref(path)
        .getDownloadURL(); */

    return (
        <View style={styles.item}>
            {/* <Image source={ url.toString() }
                style={{ width: 100, height: 100 }}
            /> */}
        </View>
    );
}

export default class DiaryEntry extends ValidationComponent {
    static navigationOptions = {
        headerShown: false
    };

    deviceLocale = "es"

    state = {
        tripID: '',
        dayID: '',
        diaryTitle: '',
        diaryText: '',
        imagesList: [],
        date: null,
        errorMessage: null,
        updateMessage: null,
        uri: {
            uri: ''
        }
    }

    onImagesReceived = (imagesList) => {
        this.setState(prevState => ({
            imagesList: prevState.imagesList = imagesList
        }));
    }

    componentDidMount() {
        const tripID = this.props.navigation.state.params.tripID
        const dayID = this.props.navigation.state.params.dayID
        const date = this.props.navigation.state.params.date
        this.setState({ tripID: tripID });
        this.setState({ dayID: dayID });

        moment.locale('es');
        var dayDate = moment(date).locale('es').format("ll");
        this.setState({ date: dayDate });

        var diaryTitle = this.props.navigation.state.params.diaryTitle;
        var diaryText = this.props.navigation.state.params.diaryText;
        if (diaryTitle != null) {
            this.setState({ diaryTitle: diaryTitle });
        }
        if (diaryText != null) {
            this.setState({ diaryText: diaryText });
        }

        getImagesByDayId(tripID, dayID, this.onImagesReceived)
    }

    handleSubmit = () => {

        var data = {
            diaryTitle: this.state.diaryTitle,
            diaryText: this.state.diaryText,
            date: this.state.date
        }

        this.validate({
            diaryTitle: { minlength: 1, maxlength: 40, required: true },
            diaryText: { minlength: 1, maxlength: 10000, required: true },
            date: { required: true }
        });

        if (this.isFormValid()) {
            var res = updateDiary(data, this.state.tripID, this.state.dayID, this.state.diaryTitle, this.state.diaryText);
            if (res) {
                this.setState({ updateMessage: 'El diario se ha actualizado correctamente' });
            } else {
                this.setState({ errorMessage: 'Ha ocurrido un error al actualizar el diario' });
            }
            /* this.props.navigation.navigate('DiaryEntry', { tripID: this.state.tripID, dayID: this.state.dayID }); */
        }
    }

    pickImage = () => {
        ImagePicker.launchImageLibrary({ title: 'Seleccione una foto', maxWidth: 800, maxHeight: 600 },
            response => {
                if (response.error) {
                    console.log("Se ha producido un error");
                } else {
                    console.log("Uri: " + response.uri)
                    this.setState({ uri: { ...this.state.uri, uri: response.uri } })

                    var imageID = makeImageName(10);
                    let reference = firebase.storage().ref('/images/' + this.state.dayID + '/' + imageID);
                    const pathToFile = `${response.uri}`;
                    const task = reference.putFile(pathToFile);

                    task.on('state_changed', taskSnapshot => {
                        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
                    });

                    task.then(() => {
                        console.log('Image uploaded to the bucket!');
                    });

                    var data = {
                        path: '/images/' + this.state.dayID + '/' + imageID
                    }

                    uploadImagePath(data, this.state.tripID, this.state.dayID);
                }
            }
        )
    }

    render() {
        return (
            <ScrollView
                keyboardShouldPersistTaps='always'>
                <View style={StyleSheet.container}>
                    <StatusBar barStyle='light-content'></StatusBar>

                    <Text style={styles.greeting}>
                        {'Día ' + this.state.date}
                    </Text>

                    <Text style={styles.errorMessage}>
                        {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                    </Text>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.inputTitle}>Título</Text>
                            <TextInput style={styles.textInput}
                                autoCapitalize='none'
                                onChangeText={diaryTitle => this.setState({ diaryTitle })}
                                value={this.state.diaryTitle}>
                            </TextInput>
                        </View>

                        <View>
                            <Text style={styles.inputTitle}>Texto</Text>
                            <TextInput style={styles.textInput}
                                autoCapitalize='none'
                                multiline={true}
                                onChangeText={diaryText => this.setState({ diaryText })}
                                value={this.state.diaryText}>
                            </TextInput>
                        </View>

                        <FlatList
                            data={this.state.imagesList}
                            renderItem={({ item }) => <Item style={styles.item}
                                tripID={this.state.tripID}
                                path={item.path}
                                navigation={this.props.navigation} />}
                            keyExtractor={item => item.id}
                        />

                        <View>
                            <Button title="Añadir imagen"
                                style={styles.btnTxt}
                                onPress={this.pickImage}>
                            </Button>
                        </View>

                        <Text style={styles.error}>
                            {this.getErrorMessages()}
                        </Text>

                        <Text style={styles.update}>
                            {this.state.updateMessage && <Text style={styles.update}>{this.state.updateMessage}</Text>}
                        </Text>

                        <View style={styles.inputTitle}>
                            <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
                                <Text style={styles.buttonText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>

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
    update: {
        color: 'green',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center'
    },
    updateMessage: {
        color: 'green',
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
    btn: {
        borderWidth: 0,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        borderColor: '#3399ff',
        backgroundColor: '#3399ff'
    },
    btnTxt: {
        alignSelf: 'center',
        color: 'black'
    },
});