//Angular stuffs
angular.module("myApp", ['ngAnimate', 'ui.bootstrap', 'flow']);
angular.module("myApp").controller("mainCtrl", function($scope, $uibModal){

	 //Initialize Parse
    Parse.$ = jQuery;
    Parse.initialize("Nw7LzDSBThSKyvym6Q7TwDWcRcz44aOddL75efLL", "ZQPEog0nlJgVwBSbHRfgiGeWNTczY8Lr7PXeUWMU");

    $scope.user = Parse.User.current();

    if (!$scope.user){
        window.location.assign("login")
    } else {
    	getEmployees();
    }

     /**
		Gets vehicles associated with a user
	*/
	$scope.getEmployees = function(){

		console.log('test');

		//Setup query to grab the vehicles associated with this customer
		var query = new Parse.Query("User");
		query.equalTo("role", 1);

		var employees = []; //Vehicles array

		//Grab vehicles
		query.find({
		  success: function(results) {
		    for(var i = 0; i < results.length; i++ ) {
		    	console.log(results[i].get('username'));
		    	
		    }


		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message); //TODO: Error handling
		  }
		});
	}

	//Displays vehicle add modal
	$scope.openEmployeeModal = function () {
	    var modalInstance = $uibModal.open({
	      animation: true,
	      templateUrl: 'employeeAdd.html',
	      windowClass: 'adjustModalHeight',
	      controller: 'employeeCreateController'
	    });

	    //Upon pressing save, save the vehicle (after validating input below)
	    modalInstance.result.then(function (employeeInfo) {
	    	alert("WTF");
	    	//Call to stripe.JS to tokenize information
	  //   	Stripe.bankAccount.createToken({
			//   country: 'US',
			//   currency: 'USD',
			//   routing_number: employeeInfo.routing,
			//   account_number: employeeInfo.account,
			//   name: employeeInfo.first + ' ' + employeeInfo.last,
			//   account_holder_type: 'individual'
			// }, $scope.saveBankAcc);

	    }, function () {
	    	//Modal was closed instead of saved
	    });
  	};

  	//Save the bank account
  	$scope.saveBankAcc = function(status, response){
  		
  		if ( response.error ) {
  			console.log(response.error);
  			console.log("TODO: input validation");
  		} else {
			$.get( "http://paulgerlich.com/__projects/buddys/php/addBankToEmployee.php?ACCID=acct_17cqc9A1OaInK8I9&TOKEN=" + response.id, function( data ) {
				console.log(data); 
			});
  		}
  	}	 
	
	/*
		End Employee Portal
	*/

});

//Controller for grabbing bank info
angular.module('myApp').controller('employeeCreateController', function ($scope, $uibModalInstance) {

	$scope.first = "";
	$scope.last = "";
	$scope.email = "";
	$scope.password = "";
	$scope.rpassword = "";
	$scope.routingNumber = "";
	$scope.accountNumber = "";

	console.log('wut')

  $scope.ok = function () {
  	//TODO: Validate inputs
    $uibModalInstance.close({first: $scope.first, last: $scope.last, email: $scope.email, password: $scope.password, rpassword: $scope.rpassword, routing: $scope.routingNumber, account: $scope.accountNumber});
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});