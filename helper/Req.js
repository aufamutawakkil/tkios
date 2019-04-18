const start = (url,method,headers,body,cb) => {
    console.log("url " + url);
    if( !headers){
        headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
        };
    }
    if( !body ) body = "";
    else body = convertURI(body);
    //console.log(body)

    fetch(url, {
        method: method,
        headers: headers,
        body: body,
    }).then((r)=>{
        if( r.status == 200 ){
            var body = r._bodyText;
            return cb(JSON.parse(body));
        }else if (r.status == 500){
            return cb({"status":false,"message":"Server Error"})
        }
    }).catch((error) => {
        //console.log(error)
        return cb({"status":false,"message":JSON.stringify(error)})
    }); 

}

const convertURI = (body) =>{
   var  b =  body.replace('{"',"");
        b =  b.replace('"}',"");

        for( var i=0;i<100;i++){
            b =  b.replace('":"',"=");
            b =  b.replace('","',"&");
        }

    return b;
}

export default{
    start
}