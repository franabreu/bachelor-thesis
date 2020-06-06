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
    expenseItem.id = doc.id;
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



export async function getTripById(tripID, expensesRetreived) {

  var expensesList = [];

  var snapshot = firebase.firestore().collection("trip/" + tripID + "/expenses")
  .orderBy('date', 'asc')
  .get();

  snapshot.forEach((doc) => {
    const expenseItem = doc.data();
    expenseItem.id = doc.id;
    expenseItem.name = doc.data().name;
    expenseItem.amount = doc.data().amount;
    expenseItem.currency = doc.data().currency;
    expenseItem.exchangeRate = doc.data().exchangeRate;
    expenseItem.category = doc.data().category;
    expenseItem.date = doc.data().date.toDate();

    expensesList.push(expenseItem);
  });

  expensesRetreived(expensesList);
}