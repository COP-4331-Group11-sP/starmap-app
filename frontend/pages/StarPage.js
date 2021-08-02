import * as React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { Header, SearchBar } from 'react-native-elements';
import MenuIcon from '../components/MenuIcon';
import Starmap from '../star-env/Starmap';
import {Menu} from '../styles/menu_styles';

export default function StarPage({navigation}) {
	const [search, setSearch] = React.useState('');

	return (
		<>
			<Header backgroundColor = "#334f59" containerStyle = {Menu.navbar}>
				{/* this is the left component(menu) */}
				<TouchableOpacity  onPress={navigation.toggleDrawer}>
					<MenuIcon/>
				</TouchableOpacity>
				{/* This is the middle component (SearchBar) */}
				<SearchBar
					platform="default"
					containerStyle={{ backgroundColor: "transparent", borderLeftWidth: 1, borderRightWidth: 1, borderRadius: 15, position: "absolute", top: -15, borderBottomColor: "transparent", borderTopColor: "transparent", border: "transparent"}}
					inputContainerStyle={{ maxHeight: 40, width: Platform.OS == 'web' ? 400 : 250, backgroundColor: "#D8E3E120"}}
					inputStyle={{}}
					loadingProps={{}}
					onChangeText={val => setSearch(val)}
					placeholder="Type query here..."
					placeholderTextColor="#888"
					cancelButtonTitle="Cancel"
					cancelButtonProps={{}}
					value={search}
				/>
			</Header>
			<Starmap/>
		</>
	);
}