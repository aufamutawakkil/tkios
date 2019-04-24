import {AsyncStorage} from "react-native";

const profile = (cb) => {
    AsyncStorage.getItem("profile",(err,p)=>{
        return cb(JSON.parse(p));
    });
}

const updateOrder = (order,cb) => {
    AsyncStorage.mergeItem("order",JSON.stringify(order),(err,p)=>{
        return cb(true);
    });
}

export default {
    profile,
    updateOrder
}