import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    // Logging Permissions : 
    let Perm = await Pedometer.getPermissionsAsync()
    console.log("Permissions : ", Perm);

    if (!Perm.granted){
      // If Not Granted Ima Try Getting Perms...
     let x = await Pedometer.requestPermissionsAsync();

     console.log("Permission Denied Without Prompting... : " , x);

    //  Hence No Steps are Getting Counted!!!
    }

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }

      return Pedometer.watchStepCount(result => {
        // This Code is Never Executed Due to no Permission...
        console.log("Waiting ... : ", result)
        setCurrentStepCount(result.steps);
      });
    }
  };

  useEffect(() => {

    const subscription = subscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
