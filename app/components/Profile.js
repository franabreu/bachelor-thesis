import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    LayoutAnimation,
    TouchableOpacity,
    Picker,
    Alert
} from 'react-native';
/* 
import {Picker} from '@react-native-community/picker' */

import { getCurrency, getUserCurrency, updateUserCurrency } from '../server/ExpensesAPI';

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
        displayName: "",
        photoURL: "",
        currency: "",
        data: [
            {
                code: "EUR"
            },
            {
                code: "USA"
            }
        ],
        currencyList: []
    }

    onCurrencyReceived = (currencyList) => {
        this.setState(prevState => ({
            currencyList: prevState.currencyList = currencyList
        }));
    }

    componentDidMount() {
        const { email, displayName, photoURL } = firebase.auth().currentUser;
        this.setState({ email, displayName, photoURL });
        this.setState({ currency: photoURL })

        getCurrency(this.onCurrencyReceived);
    }

    signOut = () => {
        firebase.auth().signOut();
    }

    deleteUserAlert() {
        Alert.alert(
          'Dar de baja',
          '¿Está seguro de que desea eliminar su usuario?',
          [
            {text: 'Sí', onPress: () => firebase.auth().currentUser.delete()},
            {text: 'No', onPress: () => null, style: 'cancel'},
          ]
        );
      }

    setMainCurrency(code) {
        this.setState({ currency: code })
        updateUserCurrency(code)
    }

    render() {
        LayoutAnimation.easeInEaseOut();

        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content'></StatusBar>
                <View>
                    <Text style={styles.title}>Nombre</Text>
                    <Text style={styles.text}>
                        {this.state.displayName}
                    </Text>
                </View>

                <View>
                    <Text style={styles.title}>Correo electrónico</Text>
                    <Text style={styles.text}>
                        {this.state.email}
                    </Text>
                </View>

                <View>
                    <Text style={styles.title}>Divisa principal</Text>
                    <Picker
                        selectedValue={this.state.currency}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setMainCurrency(itemValue)
                        }>
                        {this.state.currencyList.map(element =>
                            <Picker.Item label={element.symbol} value={element.code} />
                        )}
                    </Picker>
                </View>

                <TouchableOpacity style={styles.signOutButton} onPress={this.signOut}>
                    <Text>Cerrar sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.deleteUserAlert}>
                    <Text style={styles.text}>Dar de baja mi usuario</Text>
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
    },
    signOutButton: {
        paddingHorizontal: 10,
        marginBottom: 20,
        marginHorizontal: 20,
        backgroundColor: '#3399ff',
        borderRadius: 4,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        paddingLeft: 20,
        color: 'gray',
        fontSize: 18,
        textTransform: 'uppercase'
    },
    text: {
        fontSize: 18,
        alignSelf: 'center',
        marginBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingVertical: 5,
    },
});