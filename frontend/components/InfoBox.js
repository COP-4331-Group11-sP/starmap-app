import * as React from 'react';
import { View } from 'react-native';

export default function InfoBox(props)
{
    return (
        <View style={[props.style]}>

            {props.children}
        </View>
    );
}
