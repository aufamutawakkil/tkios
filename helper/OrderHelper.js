import {AsyncStorage} from "react-native"
const issetOrder  = (id,cb) => {
    AsyncStorage.getItem("order",(err,o)=>{
        if( o!==undefined && o!=null){
            var orders = JSON.parse(o);
            for( var i in orders.id ){
                if( orders.id[i] == id  ){
                    return cb(orders,i); /** i = index */
                }
            }
        } 

        return cb(false);
    })
}

const saveOrder  = (order,cb) => {
    AsyncStorage.setItem("order",JSON.stringify(order),(err,o)=>{
        return cb(true);
    })
}

const findIndex = (order,cb) =>{
    AsyncStorage.getItem("order",(e,r)=>{
        var orders = JSON.parse(r);
        for( var i in orders.id ){
            if( orders.id[i] == order.id ){
               return cb(i);
            }
        }
        
    })
}

const updateOrder  = (order,cb) => {
    findIndex(order, (index) => {
        AsyncStorage.getItem("order",(e,r)=>{
            var orders = JSON.parse(r);
            orders.qty[index] = order.qty;
            orders.note[index] = order.catatan;
            orders.priceTotal[index] = (Number(order.qty) * Number(order.priceSatuan));
            orders.priceSatuan[index] = order.priceSatuan;
            
            AsyncStorage.mergeItem("order",JSON.stringify(orders),(e)=>{
                return cb(true);
            });
            
        })
    });
}

const getInfoOrder =  (cb) => {
    AsyncStorage.getItem("order",(e,o)=>{
        o = JSON.parse(o);
        let data = {
            jarak:o.jarak,
            lat:o.lat,
            lng:o.lng,
            ket:o.ket,
            address:o.address,
            voucherKode:o.voucherKode,
            voucherNominal:o.voucherNominal,
            voucherTipe:o.voucherTipe,
            totalBiaya:o.totalBiaya,
            totalBerat:o.totalBerat,
            ongkir:o.ongkir
        }

         //find total belanjan
         let totalBelanja=0;
         for(var i in o.priceTotal){
             totalBelanja += Number(o.priceTotal[i])
         }
         data.totalBiaya = totalBelanja;
 
         //find total berat
         let totalBerat=0;
         for(var i in o.berat){
             totalBerat+=Number(o.berat[i]);
         }
         data.totalBerat = totalBerat;


        return cb(data);
    })
}

const setInfoOrder = (info,cb) => {
    AsyncStorage.getItem("order",(e,o)=>{
        let orders = JSON.parse(o);
        for( var i in info ){
            for( var keys in info[i] ){
                orders[ keys ] = info[i][keys];
            }
        }

        AsyncStorage.mergeItem("order",JSON.stringify(orders),(e)=>{
            return cb(true);
        })
    })
}

const reset = (cb) => {
    AsyncStorage.removeItem("order",(e)=>{
        return cb(e);
    })
}

const get = (cb) => {
    var data = [];
    AsyncStorage.getItem("order",(e,d) => {
        d = JSON.parse(d);
        for( var i in d.id ){
            data.push({
                id:d.id[i],
                nama:d.nama[i],
                qty:d.qty[i],
                priceTotal:d.priceTotal[i],
                priceSatuan:d.priceSatuan[i],
                berat:d.berat[i],
                note:d.note[i],
                photo:d.photo[i],
                tokoAlamatGmap:d.tokoAlamatGmap[i],
                tokoId:d.tokoId[i],
                tokoNama:d.tokoNama[i]
            });
        }
        return cb(data);
    });
}

export default{
    issetOrder,
    saveOrder,
    updateOrder,
    findIndex,
    reset,
    get,
    setInfoOrder,
    getInfoOrder
}
