// $.ajax({
//     url: "https://www.food2fork.com/api/get",
//     method: "GET",
//     data:{key:"78ab908614c0e919135f517623c6eecb","rId":"35382"}
// }).then(function(response) {
//     console.log(JSON.parse(response));
// });

//-----------------------------------------------------------
//ejemplo de solicitud para request de API, para receta de pollo
//para buscar otra receta cambiar pollo por la variable deseada
//si se requiere cambiar el número de respuestas cambiar el 5 por el número deseado
function apiUse() {
    $.ajax({
        url: "https://test-es.edamam.com/search",
        method: "GET",
        crossDomain: true,
        dataType: 'jsonp',
        data:{"q":"pollo","app_id":"2f70782b","app_key":"f2a56b8d890b625227f5cdcd6bf5780b","from":"0","to":"5"}
    }).then(function(response) {
        console.log(response);
    });
};
//fin de ejemplo
//-----------------------------------------------------------

//-----------------------------------------------------------
//Inicialización de FireBase
var config = {
    apiKey: "AIzaSyB-rdpy21o-_3Sg2p1kzHD9MzFsgxdin7U",
    authDomain: "food2u-dfedd.firebaseapp.com",
    databaseURL: "https://food2u-dfedd.firebaseio.com",
    projectId: "food2u-dfedd",
    storageBucket: "food2u-dfedd.appspot.com",
    messagingSenderId: "137763401473"
};
//-----------------------------------------------------------

firebase.initializeApp(config);
var dataB = firebase.database();

//-----------------------------------------------------------
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
            localStorage.removeItem("user2U");
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
                localStorage.setItem("user2U", usrname);
                food2U.logStatus = true;
                food2U.actualUser = usrname;
                //food2U.dashboradDOM();

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
            food2U.userGet();
        }
        
    },
    "logStatusRev": function() {
        var localusr = localStorage.getItem("user2U");
        console.log(localusr);
        if(localusr) {
            console.log("logged");
            food2U.logStatus = true;
            food2U.actualUser = localusr;
            
        } else {
            console.log("not logged");
        }
    },
    "login": function(usr,password) {
        if(!this.logStatus) {
            $(this.actualUsers).each(function(index,element) {
                if(usr == element.userName && password == element.pass) {
                    food2U.logStatus = true;
                    food2U.actualUser = usr;
                    localStorage.setItem("user2U", usr);
                    
                }
            });
            if(food2U.logStatus) {
                console.log("you're logged in");
                //food2U.dashboradDOM();
            } else{
                console.log("Wrong Usr or pass");
                var alert = $("<div>");
                alert.attr("class","alert alert-danger");
                alert.attr("style","text-align:center;");
                alert.attr("role","alert");
                alert.html("<h3>The Username or the Password is Incorrect!</h3>");
                $("#alertRow").append(alert);
            }
        } else {
            console.log("you're already logged in");
        }
    },
    "logout": function() {
        if(this.logStatus){
            localStorage.removeItem("user2U");
            this.actualUser="";
            this.logStatus = false;
        } else{
            console.log("You're already logged out!");
        }
        food2U.loginDOM();
    },
    "loginDOM": function(){
        //place to login or create newuser
        var nav = $("#loger");
        nav.empty();
        var navForm = $("<form>");
        navForm.attr("class","form-inline my-2 my-lg-0");
        var navInput1 = $("<input>");
        navInput1.attr("class","form-control mr-sm-2");
        navInput1.attr("type","email");
        navInput1.attr("placeholder","Username");
        navInput1.attr("id","usrNameP");
        navForm.append(navInput1);
        var navInput2 = $("<input>");
        navInput2.attr("class","form-control mr-sm-2");
        navInput2.attr("type","password");
        navInput2.attr("placeholder","Password");
        navInput2.attr("id","usrPassP");
        navForm.append(navInput2);
        var navButton = $("<button>");
        navButton.attr("class","btn btn-outline-success my-2 my-sm-0");
        navButton.attr("type","submit");
        navButton.attr("id","loginBtn");
        navButton.text("Log In");
        navForm.append(navButton);
        nav.append(navForm);
        
        var target = $("#topRow");
        target.empty();
        target.attr("class","col-md-8 offset-md-2");
        var title = $("<h1>");
        title.attr("class","marginTop");
        title.text("Food2U Ingridient List Manager");
        target.append(title);
        var plead = $("<p>");
        plead.attr("class","lead");
        plead.text("Create your user or search for recipies!");
        target.append(plead);
        var areaF = $("<form>");
        areaF.attr("style","text-align:left;");
        var div1 = $("<div>");
        div1.attr("class","form-group");
        var label1 = $("<label>");
        label1.attr("for","Email1");
        label1.text("Email address");
        var input1 = $("<input>");
        input1.attr("type","email");
        input1.attr("class","form-control");
        input1.attr("id","newEmail");
        input1.attr("aria-describedby","emailHelp");
        input1.attr("placeholder","Enter email");
        div1.append(label1);
        div1.append(input1);
        areaF.append(div1);
        var div2 = $("<div>");
        div2.attr("class","form-group");
        var label2 = $("<label>");
        label2.attr("for","userName");
        label2.text("Username");
        var input2 = $("<input>");
        input2.attr("type","text");
        input2.attr("class","form-control");
        input2.attr("id","newUser");
        input2.attr("placeholder","Enter a Username");
        div2.append(label2);
        div2.append(input2);
        areaF.append(div2);
        var div3 = $("<div>");
        div3.attr("class","form-group");
        var label3 = $("<label>");
        label3.attr("for","newPass");
        label3.text("Password");
        var input3 = $("<input>");
        input3.attr("type","password");
        input3.attr("class","form-control");
        input3.attr("id","newPass");
        input3.attr("placeholder","Password");
        div3.append(label3);
        div3.append(input3);
        areaF.append(div3);
        var div4 = $("<div>");
        div4.attr("style","text-align:center;");
        var subBtn = $("<button>");
        subBtn.attr("type","submit");
        subBtn.attr("class","btn btn-primary marginBottom");
        subBtn.attr("id","createUser");
        subBtn.text("Submit");
        div4.append(subBtn);
        areaF.append(div4);
        target.append(areaF);
        $("#loginBtn").on("click",function(){
            event.preventDefault();
            $("#alertRow").empty();
            var usr = $("#usrNameP").val();
            var pass = $("#usrPassP").val();
            $("#usrNameP").val("");
            $("#usrPassP").val("");
            //console.log(usr+" "+pass);
            food2U.login(usr,pass);
    
        })
    
        $("#createUser").on("click",function(){
            event.preventDefault();
            $("#alertRow").empty();
            var Newusr = $("#newUser").val();
            var Newpass = $("#newPass").val();
            var NewMail = $("#newEmail").val();
            $("#newUser").val("");
            $("#newPass").val("");
            $("#newEmail").val("");
            //console.log(Newusr+" "+Newpass+" "+NewMail);
            food2U.userCreate(Newusr,Newpass,NewMail);
        })
                
    },
    //Fin de sección
    
    "propiedadGenerica1": "",
    "MetodoGenerico1": function() {

    },
};
//fin del Objeto
//-----------------------------------------------------------





//-----------------------------------------------------------
//inicio de document, programación lógica:
food2U.userGet();
food2U.logStatusRev();
$(document).ready(function(){
    $("#loginBtn").on("click",function(){
        event.preventDefault();
        $("#alertRow").empty();
        var usr = $("#usrNameP").val();
        var pass = $("#usrPassP").val();
        $("#usrNameP").val("");
        $("#usrPassP").val("");
        //console.log(usr+" "+pass);
        food2U.login(usr,pass);

    })

    $("#createUser").on("click",function(){
        event.preventDefault();
        $("#alertRow").empty();
        var Newusr = $("#newUser").val();
        var Newpass = $("#newPass").val();
        var NewMail = $("#newEmail").val();
        $("#newUser").val("");
        $("#newPass").val("");
        $("#newEmail").val("");
        //console.log(Newusr+" "+Newpass+" "+NewMail);
        food2U.userCreate(Newusr,Newpass,NewMail);
    })
    // if(food2U.actualUser) {
        //food2U.dashboradDOM();
    // }
});
//fin de document
//-----------------------------------------------------------
