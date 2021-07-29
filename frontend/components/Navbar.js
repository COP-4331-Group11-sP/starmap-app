import * as React from 'react';
import { View } from 'react-native';
import { Menu } from '../styles/menu_styles';

export default function Navbar(props) {
	return (
		<View style = {Menu.navbar}>
			<View style = {Menu.navbarNav} > {props.children} </View>
		</View>
	);
}