import React from "react";
import {View,Text,FlatList} from "react-native";

export default class ProdukFavorite extends React.Component{
  

    render(){
        return (
            <View>
                <FlatList
                data={[{key: 'a'}, {key: 'b'}]}
                renderItem={({item}) => <Text>{item.key}</Text>}
                />
            </View>
        );
    }
}