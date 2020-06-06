import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    LayoutAnimation,
    TouchableOpacity,
    Picker
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
        this.setState({ email, displayName, photoURL});
        this.setState({currency: photoURL})

        getCurrency(this.onCurrencyReceived);
    }

    signOut = () => {
        firebase.auth().signOut();
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

                <TouchableOpacity style={styles.signOutButton} onPress={this.signOut}>
                    <Text>Cerrar sesión</Text>
                </TouchableOpacity>

                <Text>Nombre: {this.state.displayName}</Text>
                <Text>Correo electrónico: {this.state.email}</Text>

                <View>
                    <Text>Divisa principal:</Text>
                    <Picker
                        selectedValue={this.state.currency}
                        style={{ height: 10, width: 100 }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setMainCurrency(itemValue)
                            /* this.setState({ currency: itemValue }) */
                        }>
                        {this.state.currencyList.map(element =>
                            <Picker.Item label={element.symbol} value={element.code} />
                        )}
                    </Picker>
                </View>
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
        marginBottom:20,
        marginHorizontal: 20,
        backgroundColor: '#3399ff',
        borderRadius: 4,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center'
    },
});