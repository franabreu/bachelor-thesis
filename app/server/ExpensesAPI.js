/* import * as firebase from 'firebase';
import 'firebase/firestore'; */

import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

export async function getCurrency(currencyRetreived) {

  var currencyList = [];

  var snapshot = await firebase.firestore()
    .collection('currency')
    .orderBy('code')
    .get()

  snapshot.forEach((doc) => {
    const currencyItem = doc.data();
    currencyItem.id = doc.id;
    currencyItem.code = doc.data().code;
    currencyItem.name = doc.data().name;
    currencyItem.symbol = doc.data().symbol;
    currencyList.push(currencyItem);
  });

  currencyRetreived(currencyList);
}


export async function updateUserCurrency(code) {

  var user = firebase.auth().currentUser;

  user.updateProfile({
    photoURL: code
  }).then(function () {
    console.log("User successfully updated!");
  }).catch(function (error) {
    console.error("Error updating user: ", error);
  });
}


export async function getExpensesByTripId(tripID, onExpensesReceived) {

  var expensesList = [];

  var snapshot = await firebase.firestore().collection("trip/" + tripID + "/expenses")
    .orderBy('date', 'asc')
    .get();

  snapshot.forEach((doc) => {
    const expenseItem = doc.data();
    expenseItem.expenseID = doc.id;
    expenseItem.name = doc.data().name;
    expenseItem.amount = doc.data().amount;
    expenseItem.currency = doc.data().currency;
    expenseItem.exchangeRate = doc.data().exchangeRate;
    expenseItem.category = doc.data().category;
    expenseItem.date = doc.data().date.toDate();

    expensesList.push(expenseItem);
  });

  onExpensesReceived(expensesList);
}

export async function getExchangeRate(currency) {

  const mainCurrency = firebase.auth().currentUser.photoURL;

  return fetch('https://api.exchangeratesapi.io/latest?base=' + mainCurrency + '&symbols=' + currency)
    .then((response) => response.json())
    .then((json) => {
      var rate = json.rates[currency];
      return rate;
    })
    .catch((error) => {
      console.error(error);
    });
}


export async function uploadExpense(data, tripID) {

  firebase.firestore().collection('trip/' + tripID + '/expenses').doc().set(data)
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });

}

export async function updateExpense(data, tripID, expenseID) {

  firebase.firestore().collection('trip/' + tripID + '/expenses').doc(expenseID).delete().then(function () {
    console.log("Document successfully deleted!");
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });

  firebase.firestore().collection('trip/' + tripID + '/expenses').doc().set(data)
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}