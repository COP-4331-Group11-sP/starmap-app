import * as React from 'react';
import { FlatList, TouchableOpacity, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import MenuIcon from '../components/MenuIcon';
import StarInfoCard from '../components/StarInfoCard';
import {Menu} from '../styles/menu_styles';

export default function FavePage({navigation}) {
	const [results, setResults] = React.useState([]);

	async function searchFavorites() {
		let payload = {starId: '.*', userId: '60e7bb316b98f0921db705b7'};

		let response = await fetch(global.baseURL + '/api/search-favorites', {
				method: 'POST',
				headers: {
						'Content-Type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify(payload)
		});
		let data = await response.json();

		if (response.status == 200) {
				return data;
		} 
	}

	navigation.addListener('focus', () => {
		searchFavorites()
		.then(searchResults => {
			setResults(searchResults);
		});
	})

	return (
		<>
			<Header backgroundColor = "#334f59" containerStyle = {Menu.navbar}>
				<TouchableOpacity  onPress={navigation.toggleDrawer}>
					<MenuIcon/>
				</TouchableOpacity>
			</Header>

				<FlatList
					style={{flex: 1, backgroundColor: '#222c33'}}
					contentContainerStyle={{alignItems: 'center', padding: 10 }}
					numColumns={Platform.OS == 'web' ? 3 : 1}
					data={results}
					renderItem={({item}) => {return <StarInfoCard selectedStar={item.starId} faveWindow={true} />}}
					keyExtractor={item => item.starId}
				/>
		</>
	)
}