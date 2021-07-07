import * as React from 'react';
import { View } from 'react-native';

export default function Navbar(props) {
	return (
		<View style={[props.style, {width: '100%'}]}>
			{props.children}
		</View>
	);
}