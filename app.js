const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const { name } = require("tar/lib/types")
const app = express()
const https = require("https")

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))


app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req,res){
   var fname = req.body.fName
   var lname = req.body.lName
   var email = req.body.email

   const data = {
    members:[{
        email_address: email,
        status :"subscribed",
        merge_fields:{
            FNAME : fname,
            LNAME: lname
        }

    }]
   }
   const jsonDta = JSON.stringify(data);
   const url = 'https://us21.api.mailchimp.com/3.0/lists/2720e5f498'
   const options ={
    method:"POST",
    auth: "aman:b4cec1536068065d5c94f9cd67dbecc6-us21"
   }
//  const request =  https.request(url,options,function(response){
//      response.on("data",function(data){
//         console.log(JSON.parse(data));
//      })
//    })
//    request.write(jsonDta)
//    request.end()
const request = https.request(url, options, function (response) {
    let chunks = [];
    if(response.statusCode===200)
    {
        res.sendFile(__dirname+"/success.html")
    }else{
        res.sendFile(__dirname+"/failure.html")
    }
    response.on("data", function (data) {
        chunks.push(data);
    });

    response.on("end", function () {
        const responseData = Buffer.concat(chunks);
        console.log(JSON.parse(responseData));
    });
});

request.on("error", function (error) {
    console.error(error);
});

request.write(jsonDta);
request.end();

})

app.post("/failure", function(req,res){
    res.redirect("/")
})


app.listen(3000, function(){
    console.log("server statred in port 3000");
})


// b4cec1536068065d5c94f9cd67dbecc6-us21
// 2720e5f498 audience id