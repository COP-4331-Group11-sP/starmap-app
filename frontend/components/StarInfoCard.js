import * as React from "react";
import { Touchable } from "react-native";
import { View, Text, Image,TouchableOpacity,TextInput } from 'react-native';
import { Card, ListItem, Button, Icon, } from 'react-native-elements';
import { InfoBox, FavBox } from "../styles/menu_styles";
import MenuIcon from './MenuIcon';
import StarIcon from './StarIcon'
import StarUtils from '../star-env/star-utils';




export default function StarInfoCard(props){
    const [starData, setStarData] = React.useState(null);
    const [favorited, setFavorited] = React.useState(false);

    React.useEffect(() => {
        setFavorited(false);
        console.log(`StarInfoCard->SelectedStar: ${props.selectedStar}`);
        getStarDataById(props.selectedStar);
        if (props.faveWindow) {
            setFavorited(true);
        }
        
    }, [props.selectedStar, props.faveWindow]);

    function getStarDataById(starId) {
        if (starId == null) {
            setStarData(null);
            return;
        }
        let data = {};
        let star = global.stars[starId];
        let time = StarUtils.getUTC(new Date());
        let deltaJ = StarUtils.deltaJ(time);
        let lst = StarUtils.LST(deltaJ, global.longlat.longitude);
        
        let ha = StarUtils.HA(lst, star[global.starIdx.ra]);

        data.starId = star[global.starIdx.id];
        data.displayId = star[global.starIdx.name];
  
        data.ra = StarUtils.degToTime(star[global.starIdx.ra]);
        data.ra = `${data.ra.hours}h ${data.ra.minutes}m${data.ra.seconds}s`;
  
        data.dec = StarUtils.degToGeo(star[global.starIdx.dec]);
        data.dec = `${data.dec.degrees}° ${data.dec.minutes}\' ${data.dec.seconds}\"`;
  
        data.mag = star[global.starIdx.absMag].toString();
        data.dist = `${star[global.starIdx.dist]} parsecs`;
  
        [data.az, data.alt] = StarUtils.azAndAlt(star[global.starIdx.dec], global.longlat.latitude, ha);
  
        data.az = StarUtils.degToGeo(data.az);
        data.az = `${data.az.degrees}° ${data.az.minutes}\' ${data.az.seconds}\"`;
  
        data.alt = StarUtils.degToGeo(data.alt);
        data.alt = `${data.alt.degrees}° ${data.alt.minutes}\' ${data.alt.seconds}\"`;

        data.desc = getDesc(data.displayId);
        setStarData(data);
    }

    async function searchFavorite() {
        let payload = {
            starId: starData.starId, 
            userId: '60e7bb316b98f0921db705b7'
        };

        let response = await fetch(global.baseURL + '/api/search-favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        let result = await response.json();
        if (response.status == 200 && result.length > 0) {
            setFavorited(true);
            return result;
        }
    }

    async function addFavorite() {
        let payload = {
            displayId: starData.displayId, 
            starId: starData.starId.toString(), 
            userId: '60e7bb316b98f0921db705b7'
        };

        let response = await fetch(global.baseURL + '/api/add-favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        if (response.status == 200) {
            setFavorited(true);
        }
    }

    async function removeFavorite() {
        let payload = {
            starId: starData.starId.toString(), 
            userId: '60e7bb316b98f0921db705b7'
        };

        let response = await fetch(global.baseURL + '/api/delete-favorites', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        if (response.status == 200) {
            setFavorited(false);
        }
    }

    
    async function getDesc(displayId) {
        let url = `https://api.wikimedia.org/core/v1/wikipedia/en/page/${displayId}/description`;
        let response = await fetch(url);
        response = await response.json();
        return response;
    }
    
    async function getTheLinks(pageid) {
        let url = `https://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=${pageId}&inprop=url&format=json&origin=*`;
        let response = await fetch(url);
        response = await response.json();
        return response;
    }
    
    return(
        <Card containerStyle = {props.faveWindow ? FavBox.CardContainerStyle : InfoBox.CardContainerStyle}>
            
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                <Text style={{ color: "white", textAlign: 'left', fontWeight: 'bold', fontSize: 22 }}>
                    {starData ? starData.displayId : null}  
                </Text>
                {
                    props.faveWindow ? null : 
                    <TouchableOpacity onPress={() => {console.log('touch triggered, set star to null'); props.setSelectedStar(null);}}>
                        <MenuIcon/>
                    </TouchableOpacity> 
                }
            </View>
            
            {/*
            <Card.FeaturedSubtitle style = {{fontSize: 16}}>
                Other Known Names: 
                <Text style ={{fontSize:12}}>
                </Text>
            </Card.FeaturedSubtitle>
            */}
            <Card.Divider style={{borderBottomWidth: 2, borderBottomColor: '#e1e8ee'}}/>
            
            { starData ?
                <Text style={{color: '#ffffff'}}>
                    Magnitude:{"\t"}{starData.mag} {"\n"}
                    Distance:{"\t\t"}{starData.dist} {"\n"}
                    Ra/Dec:{"\t\t"}{starData.ra}{"\t"}{starData.dec} {"\n"}
                    Az/Alt:{"\t\t"}{starData.az}{"\t"}{starData.alt} {"\n"}
                </Text>
                : null
            }
        
            <Text style={{color:"white", marginTop: 20 }}>
            </Text>
            
            <View style={{position: 'relative', alignItems: 'flex-end'}}>
                <TouchableOpacity onPress={favorited ? removeFavorite : addFavorite}>
                    <StarIcon fill={favorited ? "white" : "black"} height = "30px"  />
                </TouchableOpacity>
            </View>
        </Card>
    );
}