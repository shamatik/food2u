// $.ajax({
//     url: "https://www.food2fork.com/api/get",
//     method: "GET",
//     data:{key:"78ab908614c0e919135f517623c6eecb","rId":"35382"}
// }).then(function(response) {
//     console.log(JSON.parse(response));
// });


//ejemplo de solicitud para request de API, para receta de pollo
//para buscar otra receta cambiar pollo por la variable deseada
//si se requiere cambiar el número de respuestas cambiar el 5 por el número deseado
$.ajax({
    url: "https://test-es.edamam.com/search",
    method: "GET",
    crossDomain: true,
    dataType: 'jsonp',
    data:{"q":"pollo","app_id":"2f70782b","app_key":"f2a56b8d890b625227f5cdcd6bf5780b","from":"0","to":"5"}
}).then(function(response) {
    console.log(response);
});
//fin de ejemplo

//objeto General 

var food2U = {
    //Propiedades y métodos del objeto definir las funciones(métodos), dentro del objeto.

    //sección Edgar
    "actualUser":"",
    "actualUsers":[],
    "logStatus":false,
    "userGet": function() {
        food2U.actualUsers = [];
        dataB.ref("users").once("value").then(function(childSnapshot) {
            // Log everything that's coming out of snapshot
            //console.log(childSnapshot.val());
            var result = childSnapshot.val();
            var newArr = [];
            newArr = Object.getOwnPropertyNames(childSnapshot.val());
            //console.log(newArr);
            $(newArr).each(function(index,element) {
                //console.log(result[element]);
                food2U.actualUsers.push(result[element]);
            });
            
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
    },
    "userCreate": function(usrname,usrpass,usremail) {
        if(!this.logStatus){
            localStorage.removeItem("user");
            var arrayComp = [];
            $(food2U.actualUsers).each(function(index,element){
                //console.log(element.userName);
                arrayComp.push(element.userName);
            });
            
            if(arrayComp.indexOf(usrname) == -1) {
                name = usrname;
                dataB.ref("users/"+name).set({
                    userName: usrname,
                    pass: usrpass,
                    email: usremail,
                    lists: "",
                    date: moment().format("DD-MM-YY")
                });
                localStorage.setItem("user", usrname);
                food2U.logStatus = true;
                food2U.actualUser = usrname;
                food2U.startDOM();

            } else {
                //Bootstrap alert already exist
                console.log("already Exist");
                var alert = $("<div>");
                alert.attr("class","alert alert-danger");
                alert.attr("style","text-align:center;");
                alert.attr("role","alert");
                alert.html("<h3>The Username is already taken!</h3>");
                $("#alertRow").append(alert);
            }
            RPSGame.userGet();
        }
        
    },
    
    //Fin de sección
}
