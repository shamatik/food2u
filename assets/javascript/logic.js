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
        // url: "https://test-es.edamam.com/search",
        url: "https://api.edamam.com/search",
        method: "GET",
        crossDomain: true,
        dataType: 'jsonp',
        data: { "q": "pollo", "app_id": "2f70782b", "app_key": "f2a56b8d890b625227f5cdcd6bf5780b", "from": "0", "to": "5" }
    }).then(function (response) {
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
    "actualUser": "",
    "actualUsers": [],
    "logStatus": false,
    "userGet": function () {
        food2U.actualUsers = [];
        dataB.ref("users").once("value").then(function (childSnapshot) {
            // Log everything that's coming out of snapshot
            //console.log(childSnapshot.val());
            var result = childSnapshot.val();
            var newArr = [];
            newArr = Object.getOwnPropertyNames(childSnapshot.val());
            //console.log(newArr);
            $(newArr).each(function (index, element) {
                //console.log(result[element]);
                food2U.actualUsers.push(result[element]);
            });

        }, function (errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
    },
    "userCreate": function (usrname, usrpass, usremail) {
        if (!this.logStatus) {
            localStorage.removeItem("user2U");
            var arrayComp = [];
            $(food2U.actualUsers).each(function (index, element) {
                //console.log(element.userName);
                arrayComp.push(element.userName);
            });

            if (arrayComp.indexOf(usrname) == -1) {
                name = usrname;
                dataB.ref("users/" + name).set({
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
                alert.attr("class", "alert alert-danger");
                alert.attr("style", "text-align:center;");
                alert.attr("role", "alert");
                alert.html("<h3>The Username is already taken!</h3>");
                $("#alertRow").append(alert);
            }
            food2U.userGet();
        }

    },
    "logStatusRev": function () {
        var localusr = localStorage.getItem("user2U");
        console.log(localusr);
        if (localusr) {
            console.log("logged");
            food2U.logStatus = true;
            food2U.actualUser = localusr;

        } else {
            console.log("not logged");
        }
    },
    "login": function (usr, password) {
        if (!this.logStatus) {
            $(this.actualUsers).each(function (index, element) {
                if (usr == element.userName && password == element.pass) {
                    food2U.logStatus = true;
                    food2U.actualUser = usr;
                    localStorage.setItem("user2U", usr);

                }
            });
            if (food2U.logStatus) {
                console.log("you're logged in");
                //food2U.dashboradDOM();
            } else {
                console.log("Wrong Usr or pass");
                var alert = $("<div>");
                alert.attr("class", "alert alert-danger");
                alert.attr("style", "text-align:center;");
                alert.attr("role", "alert");
                alert.html("<h3>The Username or the Password is Incorrect!</h3>");
                $("#alertRow").append(alert);
            }
        } else {
            console.log("you're already logged in");
        }
    },
    "logout": function () {
        if (this.logStatus) {
            localStorage.removeItem("user2U");
            this.actualUser = "";
            this.logStatus = false;
        } else {
            console.log("You're already logged out!");
        }
        food2U.loginDOM();
    },
    "loginDOM": function () {
        //place to login or create newuser
        var nav = $("#loger");
        nav.empty();
        var navForm = $("<form>");
        navForm.attr("class", "form-inline my-2 my-lg-0");
        var navInput1 = $("<input>");
        navInput1.attr("class", "form-control mr-sm-2");
        navInput1.attr("type", "email");
        navInput1.attr("placeholder", "Username");
        navInput1.attr("id", "usrNameP");
        navForm.append(navInput1);
        var navInput2 = $("<input>");
        navInput2.attr("class", "form-control mr-sm-2");
        navInput2.attr("type", "password");
        navInput2.attr("placeholder", "Password");
        navInput2.attr("id", "usrPassP");
        navForm.append(navInput2);
        var navButton = $("<button>");
        navButton.attr("class", "btn btn-outline-success my-2 my-sm-0");
        navButton.attr("type", "submit");
        navButton.attr("id", "loginBtn");
        navButton.text("Log In");
        navForm.append(navButton);
        nav.append(navForm);

        var target = $("#topRow");
        target.empty();
        target.attr("class","col-md-10 offset-md-1");
        var gralForm = $("form");
        gralForm.attr("style","text-align:left;");
        var divSearch = $("<div>");
        divSearch.attr("class","ow justify-content-center");
        divSearch.attr("id", "searchvar");
        
        //         <form style="text-align:left;">
        //             <!-- search var -->     
        //             <div id="searchvar" class="row justify-content-center" >
        //                         <div class="col-12 col-md-10 col-lg-8">
        //                             <form class="card card-sm">
        //                                 <div class="card-body row no-gutters align-items-center">
        //                                     <div class="col-auto">
        //                                         <i class="fas fa-search h4 text-body"></i>
        //                                     </div>
        //                                     <!--end of col-->
        //                                     <div class="col">
        //                                         <input id="search" class="form-control form-control-lg form-control-borderless" type="search" placeholder="Search for recipes">
        //                                     </div>
        //                                     <!--end of col-->
        //                                     <div class="col-auto">
        //                                         <button class="btn btn-lg btn-success" type="submit" style="background-color:#a8d3cc">Search</button>
        //                                     </div>
        //                                     <!--end of col-->
        //                                 </div>
        //                             </form>
                                             
        //                         </div>

        //                         <!--end of col-->
        //                     </div>
                          
        //             <div class="form-group">
        //                 <label style="margin-left: 65%" for="Email1">Email address</label>
        //                 <input type="email" class="form-control" id="newEmail" aria-describedby="emailHelp" placeholder="Enter email">
        //             </div>
        //             <div class="form-group">
        //                     <label style="margin-left: 65%" for="userName">Username</label>
        //                     <input type="text" class="form-control" id="newUser"  placeholder="Enter a Username">
        //                 </div>
        //             <div class="form-group">
        //                 <label style="margin-left: 65%" for="newPass">Password</label>
        //                 <input type="password" class="form-control" id="newPass" placeholder="Password">
        //             </div>
                    
        //             <div style="text-align:center;">
        //                 <button type="submit" class="btn btn-primary marginBottom" id="createUser">Submit</button>
        //             </div>
                  
        //                     <img class="logo" src="./assets/images/lista1.png" alt="Your Image" id="Lista-1">
                        
        //         </form>
        //     </div>
        
        var title = $("<h1>");
        title.attr("class", "marginTop");
        title.text("Food2U Ingridient List Manager");
        target.append(title);

        var plead = $("<p>");
        plead.attr("class", "lead");
        plead.text("Create your user or search for recipies!");
        target.append(plead);

        var areaF = $("<form>");
        areaF.attr("style", "text-align:left;");

        var div1 = $("<div>");
        div1.attr("class", "form-group");

        var label1 = $("<label>");
        label1.attr("for", "Email1");
        label1.text("Email address");

        var input1 = $("<input>");
        input1.attr("type", "email");
        input1.attr("class", "form-control");
        input1.attr("id", "newEmail");
        input1.attr("aria-describedby", "emailHelp");
        input1.attr("placeholder", "Enter email");

        div1.append(label1);
        div1.append(input1);
        areaF.append(div1);

        var div2 = $("<div>");
        div2.attr("class", "form-group");

        var label2 = $("<label>");
        label2.attr("for", "userName");
        label2.text("Username");

        var input2 = $("<input>");
        input2.attr("type", "text");
        input2.attr("class", "form-control");
        input2.attr("id", "newUser");
        input2.attr("placeholder", "Enter a Username");

        div2.append(label2);
        div2.append(input2);
        areaF.append(div2);

        var div3 = $("<div>");
        div3.attr("class", "form-group");

        var label3 = $("<label>");
        label3.attr("for", "newPass");
        label3.text("Password");

        var input3 = $("<input>");
        input3.attr("type", "password");
        input3.attr("class", "form-control");
        input3.attr("id", "newPass");
        input3.attr("placeholder", "Password");

        div3.append(label3);
        div3.append(input3);
        areaF.append(div3);

        var div4 = $("<div>");
        div4.attr("style", "text-align:center;");

        var subBtn = $("<button>");
        subBtn.attr("type", "submit");
        subBtn.attr("class", "btn btn-primary marginBottom");
        subBtn.attr("id", "createUser");
        subBtn.text("Submit");

        div4.append(subBtn);
        areaF.append(div4);
        target.append(areaF);

        $("#loginBtn").on("click", function () {
            event.preventDefault();
            $("#alertRow").empty();
            var usr = $("#usrNameP").val();
            var pass = $("#usrPassP").val();
            $("#usrNameP").val("");
            $("#usrPassP").val("");
            //console.log(usr+" "+pass);
            food2U.login(usr, pass);

        })

        $("#createUser").on("click", function () {
            event.preventDefault();
            $("#alertRow").empty();
            var Newusr = $("#newUser").val();
            var Newpass = $("#newPass").val();
            var NewMail = $("#newEmail").val();
            $("#newUser").val("");
            $("#newPass").val("");
            $("#newEmail").val("");
            //console.log(Newusr+" "+Newpass+" "+NewMail);
            food2U.userCreate(Newusr, Newpass, NewMail);
        })

    },
    //Fin de sección

    //ejemplo
    "propiedadGenerica1": "",
    "metodoGenerico": function() {

    },

    //recipe search page section

    //search object de la API--USEN ESTE OBJECT PARA HACER PRUEBAS Y NO CAGARLA CON LOS REQUESTS
    "searchObject": "",

    //ajax request que actualiza nuestro searchObject con el request
    "searchAPI": function(search) {
        $.ajax({
            url: "https://api.edamam.com/search",
            method: "GET",
            crossDomain: true,
            dataType: 'jsonp',
            data: { "q": search, "app_id": "2f70782b", "app_key": "f2a56b8d890b625227f5cdcd6bf5780b", "from": "0", "to": "6" }
        }).then(function (response) {
            console.log(response.hits);
            searchObject = response.hits;
        });
    },

    //esto saca la info que se necesita desplegar
    "APIobject": function() {
        console.log(searchObject);

        $("#topContainer").empty();

        food2U.createResultsPageContainers();

        $(searchObject).each(function (index, element) {
            
            var image = element.recipe.image;
            var name = element.recipe.label;
            
            // var index = index;

            food2U.createResultsPageDivs(name, image, index);
        });
    },

    //en este se agregan los resultados y se organizan de acuerdo con los divs
    "createResultsPageDivs": function(main, pic, index) {

        var div = $("<div>");
        div.attr("class", "card");
        div.attr("style", "width: 300px;");

        // var blackBars = $("<div>");
        // blackBars.attr("style", "height: 300px;");
        // blackBars.attr("style", "width: 300px;");
        // blackBars.attr("class", "black");

        var img = $("<img>");

        img.attr("src", pic);
        img.attr("style", "height: auto;");
        img.attr("style", "width: auto;");
        img.attr("style", "border-width: 1px;");
        img.attr("class", "card-img-top");
        img.attr("class", "rounded");
        img.attr("id", index);

        var divCard = $("<div>");
        divCard.attr("class", "card-body");

        var p = $("<p>");

        //eli, aquí se tiene que aplicar la tipografía; sube el TTF file para que todos podamos hacerlo
        p.text(main);
        p.attr("class", "card-text");

        divCard.append(p);
        
        div.append(divCard);

        // blackBars.append(img);

        div.append(img);

        if (index <= 2) {
            $("#leftCol").append(div);
        } else {
            $("#rightCol").append(div);
        }

        food2U.createClickEvents();
    },

    "createClickEvents": function () {
        $("#0").on("click", function () {
            console.log(this);
        });

        $("#1").on("click", function () {
            console.log(this);
        });

        $("#2").on("click", function () {
            console.log(this);
        });

        $("#3").on("click", function () {
            console.log(this);
        });

        $("#4").on("click", function () {
            console.log(this);
        });

        $("#5").on("click", function () {
            console.log(this);
        });
    },

    //este crea los container divs, rows y columns
    "createResultsPageContainers": function() {
        var divContainer = $("<div>");
        divContainer.attr("class", "container");

        var divRow = $("<div>");
        divRow.attr("class", "row");


        var divCol1 = $("<div>");
        divCol1.attr("class", "offset-lg-2 col-lg-3");
        divCol1.attr("id", "leftCol");

        var divCol2 = $("<div>");
        divCol2.attr("class", "offset-lg-2 col-lg-3");
        divCol2.attr("id", "rightCol");

        divRow.append(divCol1);
        divRow.append(divCol2);

        divContainer.append(divRow);

        $("#topContainer").append(divContainer);
    }

};
//fin del Objeto
//-----------------------------------------------------------





//-----------------------------------------------------------
//inicio de document, programación lógica:
food2U.userGet();
food2U.logStatusRev();
$(document).ready(function () {
    $("#loginBtn").on("click", function () {
        event.preventDefault();
        $("#alertRow").empty();
        var usr = $("#usrNameP").val();
        var pass = $("#usrPassP").val();
        $("#usrNameP").val("");
        $("#usrPassP").val("");
        //console.log(usr+" "+pass);
        food2U.login(usr, pass);

    })

    $("#createUser").on("click", function () {
        event.preventDefault();
        $("#alertRow").empty();
        var Newusr = $("#newUser").val();
        var Newpass = $("#newPass").val();
        var NewMail = $("#newEmail").val();
        $("#newUser").val("");
        $("#newPass").val("");
        $("#newEmail").val("");
        //console.log(Newusr+" "+Newpass+" "+NewMail);
        food2U.userCreate(Newusr, Newpass, NewMail);
    })
    // if(food2U.actualUser) {
    //food2U.dashboradDOM();
    // }
});
//fin de document
//-----------------------------------------------------------


