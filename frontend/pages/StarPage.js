import * as React from 'react';
import { TouchableOpacity, Platform, View } from 'react-native';
import { Header, SearchBar } from 'react-native-elements';
import MenuIcon from '../components/MenuIcon';
import Starmap from '../star-env/Starmap';
import { Menu } from '../styles/menu_styles';

export default function StarPage({navigation}) {
	const [search, setSearch] = React.useState('');

	return (
		<>
			<Header backgroundColor = "#334f59" containerStyle = {Menu.navbar}>
				<TouchableOpacity style={{padding: 5}} onPress={ navigation.toggleDrawer }>
					<MenuIcon/>
				</TouchableOpacity>
				<SearchBar
					containerStyle={{ backgroundColor: "transparent", borderWidth: 0, borderColor: "transparent"}}
					inputContainerStyle={{ width: Platform.OS == 'web' ? 400 : 250, backgroundColor: "#D8E3E120"}}
					onChangeText={val => setSearch(val)}
					placeholder="Search here..."
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