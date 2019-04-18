//router , not for tab
import Login from "../screens/Login";
import Register from "../screens/Register";
import Prelogin from "../screens/Prelogin";
import HomeScreen from "../screens/HomeScreen";
import { 
  createStackNavigator, createAppContainer
} from "react-navigation";


const Router = createStackNavigator({
    TokoKota:Prelogin,
    Login:Login,
    Register:Register,
    Home:HomeScreen 
  },{
      initialRouteName:"TokoKota"
  });
  
export default createAppContainer(Router);