import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DeviceMotion } from 'expo-sensors';

export default function App() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _slow = () => {
    DeviceMotion.setUpdateInterval(1000);
  };

  const _fast = () => {
    DeviceMotion.setUpdateInterval(16);
  };

  const _subscribe = () => {
    setSubscription(
      DeviceMotion.addListener(dMot => {
        let rot = dMot.rotation;
        setData({x: dMot.rotation.gamma, y: dMot.rotation.beta, z: dMot.rotation.alpha});
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    _fast();
    return () => _unsubscribe();
  }, []);

  const { x, y, z } = data;
  return (
    <View style={styles.container}>
      <Text /*style={styles.text}*/>Device:</Text>
      <Text /*style={styles.text}*/>
        x: {round(x)} y: {round(y)} z: {round(z)}
      </Text>
      <View /*style={styles.buttonContainer}*/>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} /*style={styles.button}*/>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function round(n) { return n.toFixed(2); } 
const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		top: 50,
		width: 200,
		height: 75,
		backgroundColor: '#ffffff'
	}
}); 