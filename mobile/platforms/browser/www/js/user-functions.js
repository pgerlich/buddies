$( document ).ready( initializeMain );

/**
    Initialize Parse and load our UI
*/
function initializeMain(){
    //Initialize JQuery
    Parse.$ = jQuery;
    Parse.initialize("Nw7LzDSBThSKyvym6Q7TwDWcRcz44aOddL75efLL", "ZQPEog0nlJgVwBSbHRfgiGeWNTczY8Lr7PXeUWMU");

    var currentUser = Parse.User.current();

    // if (currentUser) {
    //     //Logged in
    // } else {
    //     //Not logged in
    // }
}

function redirectToProfile(){
    var currentUser = Parse.User.current();

    if (currentUser){
        window.location.assign("profile")
    } 
}

/**
* Function to log a user in to Parse
*/
function login(){
    var email = $("#inputEmail").val();
    var password = $("#inputPassword").val();

    //Validate email meets expectation, or set error message
    //Validate password meets expectation, or set error message

    Parse.User.logIn(email, password, {
        success: function(user) {
            window.location.assign("profile")
        },

        error: function(user, error) {
            //TODO: Error Handling
           alert("Error: " + error.code + " " + error.message);
        }
    });

}

/**
    Used to tokenize the Credit Card payment form
*/
function tokenizeStripe(){
  var $form = $("#payment-form");
  Stripe.card.createToken($form, register);    
}

/**
    Sanitize/validate input and register a user
*/
function register(status, response){
  //Profile information
  var firstName = $("#firstName").val();
  var lastName = $("#lastName").val();
  var phone = $("#phoneNumber").val();
  var email = $("#inputEmail").val();
  var password = $("#inputPassword").val();
  var rpassword = $("#inputPasswordRepeat").val();

  //Token for the credit card entry form
  var ccToken = response.id;

  //Vehicle info
  var make = $("#vehicleMake").val();
  var model = $("#vehicleModel").val();
  var color = $("#vehicleColor").val();
  var license = $("#vehicleLicense").val();
  var vehicle = {make: make, model: model, color: color, license: license}; //Wrap in object for ease of access/passing to our function later

  //TODO: Validate cc/vehicle info -- Also must validate email BEFORE here so it can be used to associate a customer in stripe

    //Need the customer id before we create the stripe account
    $.post( "php/createCustomer.php?TOKEN=" + ccToken + "&EMAIL=" + email, function( data ) {
        //TODO: Differentiate success/failure7 if necessary
        console.log(data);
        var customerID = JSON.parse(data.slice(21, data.len)).id;
      
        //Validate first, last, phone, email, password is there
        if($("#firstName")[0].checkValidity() && $("#lastName")[0].checkValidity() && $("#phoneNumber")[0].checkValidity() && $("#inputEmail")[0].checkValidity() && $("#inputPassword")[0].checkValidity() && $("#inputPasswordRepeat")[0].checkValidity()){
            //validate that passwords match
            //Set attributes of user to match the column name
            var user = new Parse.User();
            user.set("username", email);
            user.set("password", password);
            user.set("email", email);
            user.set("role", 0); //0 --> Customer by default. Employees/Admins are added in admin panel
            user.set("stripeAccount", customerID);
            user.set("firstName", firstName);
            user.set("lastName", lastName);
            user.set("phone", phone);

            //Call parse signup function
            user.signUp(null, {
                success: function(user) {
                    //Create the vehicle object to associate back to this user.
                    createVehicle(user, vehicle);
                },
                error: function(user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        }

    });


}

/**
    Given a user, creates a vehicle and associates the vehicle to the user
*/
function createVehicle(user, vehicle){
    var Vehicle = Parse.Object.extend("Vehicles");
    var parseVehicle = new Vehicle();

    //Setup object
    parseVehicle.set("make", vehicle.make);
    parseVehicle.set("model", vehicle.model);
    parseVehicle.set("color", vehicle.color);
    parseVehicle.set("license", vehicle.license);
    parseVehicle.set("customer", Parse.User.current());

    parseVehicle.save(null, {
      success: function(newVehicle) {
        window.location.assign("profile")
      },
      error: function(gameScore, error) {
        alert('Failed to create new object, with error code: ' + error.message);
      }
    });
}


/**
    Log the user out
*/
function logout(){
    Parse.User.logOut();
    window.location.assign("login")
}