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

/* import DatePicker from 'react-native-datepicker' */
import DateTimePicker from '@react-native-community/datetimepicker';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import ValidationComponent from 'react-native-form-validator';

import NumericInput from 'react-native-numeric-input'

import { uploadExpense, getCurrency, getExchangeRate, updateExpense } from '../server/ExpensesAPI';

/* import * as firebase from 'firebase'; */

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';

const categoryEnum = ['Transporte', 'Alojamiento', 'Comida', 'Ocio', 'Otro'];

export default class ExpenseForm extends ValidationComponent {
    static navigationOptions = {
        headerShown: false
    };

    deviceLocale = "es"

    state = {
        tripID: '',
        expenseID: null,
        name: '',
        amount: 0,
        currency: 'EUR',
        exchangeRate: 1,
        date: new Date(),
        category: '',
        errorMessage: null,
        currencyList: [],
        mainCurrency: '',
        mainAmount: '0'
    }

    onCurrencyReceived = (currencyList) => {
        this.setState(prevState => ({
            currencyList: prevState.currencyList = currencyList
        }));
    }

    componentDidMount() {
        const tripID = this.props.navigation.state.params.tripID
        this.setState({ tripID: tripID });
        getCurrency(this.onCurrencyReceived);
        this.setState({ mainCurrency: firebase.auth().currentUser.photoURL })

        var expense = this.props.navigation.state.params.expense;
        if (expense != null) {
            this.setState({ expenseID: expense.expenseID, name: expense.name, amount: expense.amount, currency: expense.currency, exchangeRate: expense.exchangeRate,
                date: expense.date, category: expense.category, mainAmount: expense.mainAmount });
        }
    }

    handleCurrencyChange(selected) {
        this.setState({ currency: selected })

        const mainCurrency = firebase.auth().currentUser.photoURL;

        if (mainCurrency != selected) {
            fetch('https://api.exchangeratesapi.io/latest?base=' + selected + '&symbols=' + mainCurrency)
                .then((response) => response.json())
                .then((json) => {
                    var rate = json.rates[mainCurrency];
                    this.setState({ exchangeRate: rate })
                    this.updateMainAmount();
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            this.setState({ exchangeRate: 1 })
            this.updateMainAmount();
        }
    }

    handleExchangeRateChange(exchangeRate) {
        this.setState({ exchangeRate: exchangeRate })
        this.updateMainAmount();
    }

    updateAmount(amount) {
        this.setState({ amount: amount })
        this.updateMainAmount();
    }

    updateMainAmount() {
        var mainAmount = this.state.amount * this.state.exchangeRate;
        var rounded = mainAmount.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
        this.setState({ mainAmount: rounded })
    }

    showHideComponent = () => {
        if (this.state.showExchangeRate == true) {
            this.setState({ showExchangeRate: false });
        } else {
            this.setState({ showExchangeRate: true });
        }
    };

    hideExchangeRateComponent = () => {
        const mainCurrency = firebase.auth().currentUser.photoURL;
        var currency = this.state.currency;

        if (mainCurrency != currency) {
            fetch('https://api.exchangeratesapi.io/latest?base=' + currency + '&symbols=' + mainCurrency)
                .then((response) => response.json())
                .then((json) => {
                    var rate = json.rates[mainCurrency];
                    this.setState({ exchangeRate: rate })
                    this.updateMainAmount();
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            this.setState({ exchangeRate: 1 })
            this.updateMainAmount();
        }

        this.setState({ showExchangeRate: false });
    };

    showExchangeRateComponent = () => {
        this.setState({ showExchangeRate: true });
    };

    handleSubmit = () => {

        var data = {
            name: this.state.name,
            amount: this.state.amount,
            mainAmount: this.state.mainAmount,
            currency: this.state.currency,
            exchangeRate: this.state.exchangeRate,
            date: this.state.date,
            category: this.state.category
        }

        this.validate({
            name: { minlength: 2, maxlength: 40, required: true },
            amount: { required: true },
            currency: { required: true },
            exchangeRate: { required: true },
            date: { required: true },
            category: { required: true },
        });

        if (this.isFormValid()) {
            if (this.state.expenseID == null) {
                uploadExpense(data, this.state.tripID, this.state.expenseID);
            } else {
                updateExpense(data, this.state.tripID, this.state.expenseID);
            }
            this.props.navigation.navigate('ExpensesList', { tripID: this.state.tripID });
        }
    }

    render() {
        return (
            <ScrollView
                keyboardShouldPersistTaps='always'>
                <View style={StyleSheet.container}>
                    <StatusBar barStyle='light-content'></StatusBar>

                    <Text style={styles.greeting}>
                        {'Añadir gasto'}
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
                            <Text style={styles.inputTitle}>Cantidad</Text>
                            <View style={styles.numericInput}>
                                <NumericInput
                                    value={this.state.amount}
                                    onChange={amount => this.updateAmount(amount)}
                                    onLimitReached={(isMax, msg) => console.log(isMax, msg)}
                                    totalWidth={320}
                                    totalHeight={40}
                                    iconSize={15}
                                    step={1}
                                    valueType='real'
                                    rounded
                                    iconStyle={{ color: 'black' }}
                                    rightButtonBackgroundColor='#3399ff'
                                    leftButtonBackgroundColor='#3399ff' />
                            </View>
                        </View>

                        <View>
                            <Text style={styles.inputTitle}>Divisa</Text>
                            <View>
                                <Picker
                                    selectedValue={this.state.currency}
                                    style={styles.picker}
                                    onValueChange={(itemValue, itemIndex) =>
                                        /* this.setState({ currency: itemValue }) */
                                        this.handleCurrencyChange(itemValue)
                                    }>
                                    {this.state.currencyList.map(element =>
                                        <Picker.Item label={element.symbol} value={element.code} />
                                    )}
                                </Picker>
                            </View>
                        </View>

                        {this.state.showExchangeRate ? (
                            <View>
                                <Text style={styles.inputTitle}>Ratio de cambio</Text>
                                <View style={styles.numericInput}>
                                    <NumericInput
                                        value={this.state.exchangeRate}
                                        onChange={exchangeRate => this.handleExchangeRateChange(exchangeRate)}
                                        onLimitReached={(isMax, msg) => console.log(isMax, msg)}
                                        totalWidth={320}
                                        totalHeight={40}
                                        iconSize={15}
                                        step={0.05}
                                        valueType='real'
                                        rounded
                                        iconStyle={{ color: 'black' }}
                                        rightButtonBackgroundColor='#3399ff'
                                        leftButtonBackgroundColor='#3399ff' />
                                </View>

                                <TouchableOpacity style={styles.rateButton} onPress={this.hideExchangeRateComponent}>
                                    <Text style={styles.buttonText}>Ratio de cambio actual</Text>
                                </TouchableOpacity>
                            </View>
                        ) :
                            <View>
                                <Text style={styles.inputTitle}>Ratio de cambio</Text>
                                <Text style={styles.text}>
                                    {this.state.exchangeRate}
                                </Text>

                                <TouchableOpacity style={styles.rateButton} onPress={this.showExchangeRateComponent}>
                                    <Text style={styles.buttonText}>Modificar ratio de cambio</Text>
                                </TouchableOpacity>
                            </View>
                        }

                        <View>
                            <Text style={styles.inputTitle}>Cantidad en {this.state.mainCurrency}</Text>
                            <Text style={styles.text}>
                                {this.state.mainAmount} {this.state.mainCurrency}
                            </Text>
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
                                        return (<Picker.Item label={item} value={index} key={index} />)
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
        backgroundColor: 'grey',
        borderRadius: 4,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
});