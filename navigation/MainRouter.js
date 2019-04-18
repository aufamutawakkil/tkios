//router , not for tab
import DetailMainKat from "../screens/DetailMainKat";
import Mainmenu from "../screens/Mainmenu";
import BarangList from "../screens/BarangList";
import KategoriList from "../screens/KategoriList";
import TokoList from "../screens/TokoList";
import BarangDetail from "../screens/BarangDetail";
import { 
  createStackNavigator, createAppContainer
} from "react-navigation";



const MainRouter = createStackNavigator({
    Mainmenu:Mainmenu,
    DetailMainKat:DetailMainKat ,
    BarangList:BarangList ,
    KategoriList:KategoriList,
    TokoList:TokoList,
    BarangDetail:BarangDetail,
},{
    initialRouteName:"Mainmenu"
});

export default createAppContainer(MainRouter);