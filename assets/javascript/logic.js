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
                    favoriteRecipie: "",
                    date: moment().format("DD-MM-YY")
                });
                localStorage.setItem("user2U", usrname);
                food2U.logStatus = true;
                food2U.actualUser = usrname;
                
                var navTarg = $("#navForm");
                navTarg.empty();

                var navLogout= $("<button class='btn btn-danger my-2 my-sm-0' type='submit' id='logoutBtn'>");
                navLogout.text("Logout");
                navTarg.append(navLogout);
                $(document).delegate('#logoutBtn','click',function(){
                    event.preventDefault();
                    food2U.logout();
                });

                food2U.dashboardDOMgen();


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
            dataB.ref("users").once("value").then(function (childSnapshot) {
                var newArr = [];
                result = childSnapshot.val();
                //console.log(result);
                newArr = Object.getOwnPropertyNames(childSnapshot.val());
                $(newArr).each(function (index, element) {
                    //console.log(result[element].userName);
                    if (localusr == result[element].userName) {
                        food2U.logStatus = true;
                        food2U.actualUser = result[element];

                    }
                });
            }, function (errorObject) {
                console.log("Errors handled: " + errorObject.code);
            });

            var navTarg = $("#navForm");
            navTarg.empty();

            var navLogout= $("<button class='btn btn-danger my-2 my-sm-0' type='submit' id='logoutBtn'>");
            navLogout.text("Logout");
            navTarg.append(navLogout);

            
            $(document).delegate('#logoutBtn','click',function(){
                event.preventDefault();
                food2U.logout();
                
            });

            food2U.dashboardDOMgen();

        } else {
            console.log("not logged");
        }
    },
    "login": function (usr, password) {
        if (!this.logStatus) {
            $(this.actualUsers).each(function (index, element) {
                if (usr == element.userName && password == element.pass) {
                    food2U.logStatus = true;
                    food2U.actualUser = element;
                    localStorage.setItem("user2U", usr);

                }
            });
            if (food2U.logStatus) {
                console.log("you're logged in");
                var navTarg = $("#navForm");
                navTarg.empty();

                var navLogout= $("<button class='btn btn-danger my-2 my-sm-0' type='submit' id='logoutBtn'>");
                navLogout.text("Logout");
                navTarg.append(navLogout);

                

                $(document).delegate('#logoutBtn','click',function(){
                    event.preventDefault();
                    food2U.logout();
                });

                food2U.dashboardDOMgen();

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

            var navTarg = $("#navForm");
            navTarg.empty();

            var inputName = $('<input class="form-control mr-sm-2" type="email" placeholder="Username" id="usrNameP">');
            var inputPass = $('<input class="form-control mr-sm-2" type="password" placeholder="Password" id="usrPassP">');
            var navLogbtn= $('<button class="btn btn-outline-success my-2 my-sm-0" type="submit" id="loginBtn">');
            navLogbtn.text("Log In");
            
            navTarg.append(inputName);
            navTarg.append(inputPass);
            navTarg.append(navLogbtn);
            
            $(document).delegate('#loginBtn','click',function(){
                event.preventDefault();
                $("#alertRow").empty();
                var usr = $("#usrNameP").val();
                var pass = $("#usrPassP").val();
                $("#usrNameP").val("");
                $("#usrPassP").val("");
                //console.log(usr+" "+pass);
                food2U.login(usr, pass);
            });
            food2U.loginDOM();


        } else {
            console.log("You're already logged out!");
        }
        
    },
    "loginDOM": function () {
        //place to login or create newuser
        
        var topC = $("#topContainer");
        topC.empty();

        var target = $("<div id='topRow'>");
        target.attr("class", "col-md-10 offset-md-1");

        var title = $("<h1>");
        title.attr("class", "marginTop");
        title.text("Food2U Ingredient List Manager");
        target.append(title);

        var plead = $("<p>");
        plead.attr("class", "lead");
        plead.text("Create an account or search for recipes!");
        target.append(plead);


        var gralForm = $("<form>");
        gralForm.attr("style", "text-align:left;");

        var divSearch = $("<div>");
        divSearch.attr("class", "row justify-content-center");
        divSearch.attr("id", "searchvar");

        var divcol12 = $("<div>");
        divcol12.attr("class", "col-12 col-md-10 col-lg-8");

        var divCardBody = $("<div>");
        divCardBody.attr("class", "card-body row no-gutters align-items-center");
        var divSearchBar = $("<div>");
        divSearchBar.attr("class", "col");
        var inputSearch = $("<input>");
        inputSearch.attr("class", "form-control form-control-lg form-control-borderless");
        inputSearch.attr("id", "search");
        inputSearch.attr("type", "search");
        inputSearch.attr("placeholder", "Search for recipes");
        divSearchBar.append(inputSearch);

        var divSubBtn = $("<div>");
        divSubBtn.attr("class", "col-auto");
        var subBtn = $("<button>");
        subBtn.attr("class", "btn btn-lg btn-success");
        subBtn.attr("type", "submit");
        subBtn.attr("id", "searchBtn");
        subBtn.attr("style", "background-color:#a8d3cc");
        subBtn.text("Search");
        divSubBtn.append(subBtn);

        divCardBody.append(divSearchBar);
        divCardBody.append(divSubBtn);

        var br = $("<br>");

        divcol12.append(divCardBody);
        divSearch.append(divcol12);
        gralForm.append(divSearch);
        gralForm.append(br);
        target.append(gralForm);

        var div1 = $("<div>");
        div1.attr("class", "form-group");

        var label1 = $("<label>");
        // label1.attr("style", "margin-left: 65%");
        label1.attr("for", "Email1");
        label1.text("Email address");

        var input1 = $("<input>");
        input1.attr("type", "email");
        input1.attr("class", "form-control");
        // input1.attr("id", "newEmail");
        input1.attr("aria-describedby", "emailHelp");
        input1.attr("placeholder", "Enter email");

        div1.append(label1);
        div1.append(input1);
        target.append(div1);

        var div2 = $("<div>");
        div2.attr("class", "form-group");

        var label2 = $("<label>");
        // label2.attr("style", "margin-left: 65%");
        label2.attr("for", "userName");
        label2.text("Username");

        var input2 = $("<input>");
        input2.attr("type", "text");
        input2.attr("class", "form-control");
        // input2.attr("id", "newUser");
        input2.attr("placeholder", "Enter a username");

        div2.append(label2);
        div2.append(input2);
        target.append(div2);

        var div3 = $("<div>");
        div3.attr("class", "form-group");

        var label3 = $("<label>");
        // label3.attr("style", "margin-left: 65%");
        label3.attr("for", "newPass");
        label3.text("Password");

        var input3 = $("<input>");
        input3.attr("type", "password");
        input3.attr("class", "form-control");
        // input3.attr("id", "newPass");
        input3.attr("placeholder", "Enter a password");

        div3.append(label3);
        div3.append(input3);
        target.append(div3);

        var div4 = $("<div>");
        div4.attr("style", "text-align:center;");

        var subBtn = $("<button>");
        subBtn.attr("type", "submit");
        subBtn.attr("class", "btn btn-primary marginBottom");
        subBtn.attr("id", "createUser");
        subBtn.text("Submit");

        div4.append(subBtn);
        target.append(div4);

        topC.append(target);

        $(document).delegate('#createUser','click',function(){
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
        });

        
        $(document).delegate('#searchBtn','click',function(){
            event.preventDefault();
            var recipieSearch = $("#search").val().trim();
            $("#search").val("");
            if (recipieSearch) {
                console.log(recipieSearch);
                food2U.searchAPI(recipieSearch);
            } else {
                console.log("escribe wey!");
            }
        });

    },
    //Fin de sección

    //ejemplo
    "propiedadGenerica1": "",
    "metodoGenerico": function () {

    },

    //recipe search page section

    //search object de la API--USEN ESTE OBJECT PARA HACER PRUEBAS Y NO CAGARLA CON LOS REQUESTS
    "searchObject": "",
    "objectIngredients": "",
    "recipeName": "",

    //ajax request que actualiza nuestro searchObject con el request
    "searchAPI": function (search) {
        $.ajax({
            url: "https://api.edamam.com/search",
            method: "GET",
            crossDomain: true,
            dataType: 'jsonp',
            data: { "q": search, "app_id": "2f70782b", "app_key": "f2a56b8d890b625227f5cdcd6bf5780b", "from": "0", "to": "6" }
        }).then(function (response) {
            console.log(response.hits);
            searchObject = response.hits;
            food2U.APIobject();
        });
    },

    //esto saca la info que se necesita desplegar
    "APIobject": function () {
        //console.log(searchObject);

        $("#topContainer").empty();

        food2U.createResultsPageContainers();

        $(searchObject).each(function (index, element) {

            var image = element.recipe.image;
            var name = element.recipe.label;

            food2U.createResultsPageDivs(name, image, index);
        });

        food2U.createClickEvents();
    },

    //en este se agregan los resultados y se organizan de acuerdo con los divs
    "createResultsPageDivs": function (main, pic, index) {

        var div = $("<div>");
        div.attr("class", "card");
        div.attr("style", "width: 300px;");

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

    },


    //este le asigna click events a cada search result
    "createClickEvents": function () {
        $("#0").on("click", function () {
            console.log(this);
            var fullElem = this;
            food2U.recipePageDisplay(fullElem);
        });

        $("#1").on("click", function () {
            console.log(this);
            var fullElem = this;
            food2U.recipePageDisplay(fullElem);
        });

        $("#2").on("click", function () {
            console.log(this);
            var fullElem = this;
            food2U.recipePageDisplay(fullElem);
        });

        $("#3").on("click", function () {
            console.log(this);
            var fullElem = this;
            food2U.recipePageDisplay(fullElem);
        });

        $("#4").on("click", function () {
            console.log(this);
            var fullElem = this;
            food2U.recipePageDisplay(fullElem);
        });

        $("#5").on("click", function () {
            console.log(this);
            var fullElem = this;
            food2U.recipePageDisplay(fullElem);
        });
    },

    //este crea los container divs, rows y columns
    "createResultsPageContainers": function () {
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
    },


    "dashboardDOMgen": function(){
    $("#topContainer").empty();

        var topRow1 = $("<div>");
        topRow1.attr("class", "col-md-12");
        topRow1.attr("id", "topRow");

        var suggestions = $("<div>");
        suggestions.attr("class", "col-md-3 dashboardCont");
        suggestions.attr("id", "suggestions");
        topRow1.append(suggestions);

        var card1 = $("<div>");
        card1.attr("class","card")
        suggestions.append(card1);

        var cardBody1 = $("<div>");
        cardBody1.attr("class","card-body");
       // cardBody1.attr("id", "fav");
        card1.append(cardBody1);

        var cardBody1tittle = $("<h5>");
        cardBody1tittle.attr("class","card-title");
        cardBody1tittle.text("Recipe of the month!");
        cardBody1.append(cardBody1tittle);

        var hr = $("<hr>");
        cardBody1.append(hr);

        var cardBody1text = $("<p>");
        cardBody1text.attr("class","card-text");
        cardBody1text.text("The all awaited CHECK IT OUT!!!");
        cardBody1.append(cardBody1text);

        var cardBody1btn = $("<a>");
        cardBody1btn.attr("class","btn btn-primary now");
        cardBody1btn.text("now!");
        cardBody1.append(cardBody1btn);


        var fav = $("<div>");
        fav.attr("class", "col-md-3 dashboardCont");
        fav.attr("id", "fav");
        topRow1.append(fav);

        var card2 = $("<div>");
        card2.attr("class","card")
        fav.append(card2);

        var cardBody1 = $("<div>");
        cardBody1.attr("class","card-body");
       // cardBody1.attr("id", "fav");
        card2.append(cardBody1);

        var cardBody1tittle = $("<h5>");
        cardBody1tittle.attr("class","card-title");
        cardBody1tittle.text("Favorite Recipes");
        cardBody1.append(cardBody1tittle);

        var hr = $("<hr>");
        cardBody1.append(hr);

        // var cardBody1text = $("<p>");
        // cardBody1text.attr("class","card-text");
        // cardBody1text.text("The all awaited CHECK IT OUT!!!");
        // cardBody1.append(cardBody1text);

        // var cardBody1btn = $("<a>");
        // cardBody1btn.attr("class","btn btn-primary now");
        // cardBody1btn.text("now!");
        // cardBody1.append(cardBody1btn);

        var lists = $("<div>");
        lists.attr("class", "col-md-3 dashboardCont");
        lists.attr("id", "lists");
        topRow1.append(lists);

        var card3 = $("<div>");
        card3.attr("class","card")
        lists.append(card3);

        var cardBody1 = $("<div>");
        cardBody1.attr("class","card-body");
       // cardBody1.attr("id", "fav");
        card3.append(cardBody1);

        var cardBody1tittle = $("<h5>");
        cardBody1tittle.attr("class","card-title");
        cardBody1tittle.text("List");
        cardBody1.append(cardBody1tittle);

        var hr = $("<hr>");
        cardBody1.append(hr);
        
        var cardBody1btn = $("<a>");
        cardBody1btn.attr("class","btn btn-primary clear");
        cardBody1btn.text("Eliminar");
        cardBody1.append(cardBody1btn);

        $("#topContainer").append(topRow1);
        


    },
    "createRecipePageContainers": function() {
        var divContainer = $("<div>");
        divContainer.attr("class", "container background");

        var divRow = $("<div>");
        divRow.attr("class", "row");

        var divCol1 = $("<div>");
        divCol1.attr("class", "offset-lg-1 col-lg-4 text-center");
        divCol1.attr("id", "leftCol");

        var divCol2 = $("<div>");
        divCol2.attr("class", "offset-lg-1 col-lg-4");
        divCol2.attr("id", "rightCol");

        divRow.append(divCol1);
        divRow.append(divCol2);

        divContainer.append(divRow);

        $("#topContainer").append(divContainer);
    },

    //method to display recipe on recipe page
    "recipePageDisplay": function (prevElement) {
        $("#topContainer").empty();

        food2U.createRecipePageContainers();

        var id = prevElement.id;

        var elemFullObj = searchObject[id];

        var recipe = elemFullObj.recipe;

        // var ingredients = recipe.ingredientLines;

        food2U.objectIngredients = recipe.ingredientLines;

        console.log(food2U.objectIngredients);

        food2U.recipeName = recipe.label;

        var full = recipe.url;

        var h2 = $("<h2>");

        h2.text(food2U.recipeName);

        var ul = $("<ul>");

        var br = $("<br>");

        var br1 = $("<br>");

        $(ul).prepend(br);
        $(ul).prepend(br1);

        $(food2U.objectIngredients).each(function (index, element) {

            var li = $("<li>");

            $(li).text(element);

            $(ul).append(li);
        });

        console.log(food2U.logStatus);

        $("#rightCol").append(ul);
        $("#leftCol").prepend(h2);
        $("#leftCol").append(prevElement);

        if (food2U.logStatus) {
            var btn = $("<button>");

            btn.attr("type", "button");
            btn.attr("class", "btn btn-info customBut");
            btn.attr("id", "add");
            btn.text("Add ingredients to list");
            $("#leftCol").append(btn);

            $("#add").on("click", function () {
                food2U.addCompletelist();

            });

        } else {
            var btn = $("<button>");

            btn.attr("type", "button");
            btn.attr("class", "btn btn-info customBut");
            btn.attr("id", "create");
            btn.text("Create username");

            $("#leftCol").append(btn);

            

            $(document).delegate('#create','click',function(){
                event.preventDefault();
                food2U.loginDOM();
            });
        }

        // console.log(recipe);

    },
    "addCompletelist": function () {
        if (food2U.logStatus) {
            console.log(food2U.actualUser.userName);
            console.log(food2U.recipeName);
            //dataB.ref("users/"+food2U.actualUser.userName+"/lists/").set(food2U.recipeName);
            $(food2U.objectIngredients).each(function (i, ele) {
                dataB.ref().child("/users").child(food2U.actualUser.userName).child("lists").child(food2U.recipeName).child(i).set(ele);
            });
            var btn = $("<button disabled>");

            btn.attr("type", "button");
            btn.attr("class", "btn btn-info customBut");
            btn.attr("id", "add");
            btn.text("Added");
            $("#leftCol").append(btn);
        }

    },

    //ESTE LE AGREGA LA LISTA AL CHECKOUT
    "checkoutPageDOM": function () {
        $("#topContainer").empty();

        food2U.createRecipePageContainers();

        var name = food2U.recipeName;
        var ingredients = food2U.objectIngredients;

        var h2 = $("<h2>");

        h2.text(name);

        var ul = $("<ul>");

        var br = $("<br>");

        var br1 = $("<br>");

        $(ul).prepend(br);
        // $(ul).prepend(br1);

        $(ingredients).each(function (index, element) {

            var li = $("<li>");

            $(li).text(element);

            $(ul).append(li);
        });

        $("#rightCol").prepend(h2);
        $("#rightCol").append(ul);
        

        //DE AQUI SE TIENE QUE LLAMAR
        //food2U.googlePlacesAPI();
    },

    "googlePlacesAPI": function () {
        //api key for places: AIzaSyAYPV7_SOPv-3r1f5BPk4F-tU8PIj3Xq9c

        //maps.googleapis.com/maps/api/place/findplacefromtext/json?input=mongolian%20grill&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,rating&locationbias=circle:2000@47.6918452,-122.2226413&key=AIzaSyAYPV7_SOPv-3r1f5BPk4F-tU8PIj3Xq9c

        //AJAX FAIL
        // $.ajax({
        //     url: "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?",
        //     method: "GET",
        //     crossDomain: true,
        //     dataType: 'json',
        //     data: { "libraries": "places", "input": "supermarket", "inputtype": "textquery", "fields": "photos,formatted_address,name,opening_hours", "key": "AIzaSyAYPV7_SOPv-3r1f5BPk4F-tU8PIj3Xq9c" }
        // }).then(function (response) {
        //     console.log(response);
        // });

        var div = $("<div>");

        div.attr("id", "map");
        div.attr("style", "width: 300px;");
        div.attr("style", "height: 300px;");

        $("#leftCol").append(div);

        //ESTE METODO SI JALA PERO ES CON EL PLUGIN QUE BAJE; ES MUY BASICO
        // $(function () {
        //     $("#map").googleMap({
        //         zoom: 10, // Initial zoom level (optional)
        //         coords: [48.895651, 2.290569], // Map center (optional)
        //         type: "ROADMAP" // Map type (optional)
        //     });
        // });

    }, 

    "generateList": function() {
        if (food2U.logStatus) {
            var yourList = $("<h1 class='marginTop'>");
            yourList.text("Your List");
            var userRecipe = Object.getOwnPropertyNames(food2U.actualUser.lists);
            var target =  $("#topRow");
            target.append(yourList);
            $(userRecipe).each(function (i, ele){
                var recipeName = $("<h4>");
                recipeName.attr("class","recipeName");
                recipeName.text(ele);
                target.append(recipeName);
                console.log(food2U.actualUser.lists[ele]);
                $(food2U.actualUser.lists[ele]).each(function (index, element){
                    var ingredientDiv = $("<div class='custom-control custom-checkbox'>");
                    var inputDiv = $('<input type="checkbox" class="custom-control-input" id="'+index+element+'" checked>');
                    var labelIngredient = $('<label class="custom-control-label" for="'+index+element+'">');
                    labelIngredient.text(element);
                    ingredientDiv.append(inputDiv);
                    ingredientDiv.append(labelIngredient);
                    target.append(ingredientDiv);


                });

            });
            
            var buttonCheckout = $('<button class="btn btn-outline-success my-2 my-sm-0" type="submit" id="loginBtn">');
            buttonCheckout.text("Check Out");
            target.append(buttonCheckout);


            //aqui
            //  <button class="btn btn-outline-success my-2 my-sm-0" type="submit" id="loginBtn">Log In</button>
            var checkOutBtn = $("<button class='btn btn-outline-success my-2 my-sm-0' type='submit' id='checkoutBTN'>");
            checkOutBtn.text("Log In");
            target.append("checkOutBtn");
        }

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

    });

    
    $(document).delegate('#createUser','click',function(){
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
    });
    // if(food2U.actualUser) {
    //food2U.dashboradDOM();
    // }
    $("#searchBtn").on("click", function () {
        event.preventDefault();
        var recipieSearch = $("#search").val().trim();
        $("#search").val("");
        if (recipieSearch) {
            console.log(recipieSearch);
            food2U.searchAPI(recipieSearch);
        } else {
            console.log("escribe wey!");
        }

    });
});
//fin de document
//-----------------------------------------------------------
