import {AsyncStorage} from "react-native";

const profile = (cb) => {
    AsyncStorage.getItem("profile",(err,p)=>{
        return cb(JSON.parse(p));
    });
}

export default {
    profile
}