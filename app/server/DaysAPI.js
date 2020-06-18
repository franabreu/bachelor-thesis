import firebase from '@react-native-firebase/app';
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

export async function getDaysByTripId(tripID, onDaysReceived) {

    var daysList = [];
  
    var snapshot = await firebase.firestore().collection("trip/" + tripID + "/days")
      .orderBy('date', 'asc')
      .get();
  
    snapshot.forEach((doc) => {
      const dayItem = doc.data();
      dayItem.dayID = doc.id;
      dayItem.date = doc.data().date.toDate();
  
      daysList.push(dayItem);
    });
  
    onDaysReceived(daysList);
  }