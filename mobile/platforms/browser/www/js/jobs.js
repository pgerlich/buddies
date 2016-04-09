//If we need angular stuff. Not sure yet
angular.module("myApp", ['ngAnimate', 'ui.bootstrap']);
angular.module("myApp").controller("mainCtrl", function($scope, $uibModal){
    //Job status constants
    const STATUS_UNCLAIMED = 0;
    const STATUS_CLAIMED = 1;
    const STATUS_COMPLETE = 2;

   //Initialize Parse
    Parse.$ = jQuery;
    Parse.initialize("Nw7LzDSBThSKyvym6Q7TwDWcRcz44aOddL75efLL", "ZQPEog0nlJgVwBSbHRfgiGeWNTczY8Lr7PXeUWMU");

    $scope.allJobs = [];
    $scope.myJobs = [];
    $scope.completedJobs = [];

    $scope.user = Parse.User.current();

    if (!$scope.user){
        window.location.assign("login");
    } else if ($scope.user.get("role") == 0) {
    	window.location.assign("schedule");
    } else {
        getAllJobs();
        getMyJobs();
        getMyCompletedJobs();
    }

    function getAllJobs(){
        //Setup query to grab the washes associated with this user
        var query = new Parse.Query("Jobs");
        query.equalTo("status", STATUS_UNCLAIMED); 
        query.include("vehicle");

        //Grab vehicles
        query.find({
          success: function(results) {
          	$scope.allJobs = [];

            for(var i = 0; i < results.length; i++ ) {
                var job = {date: results[i].get("date"), time: results[i].get("time"), notes: results[i].get("notes"), latitude: results[i].get("latitude"), longitude: results[i].get("longitude"), pointer: results[i]}
                $scope.allJobs.push(job)
            }

            $scope.$apply();

            setTimeout(getAllJobs, 2000); // Do every two seconds to ensure concurrency
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message); //TODO: Error handling
          }
        });
    }

    function getMyJobs(){
        //Setup query to grab the washes associated with this user
        var query = new Parse.Query("Jobs");
        query.equalTo("employee", {
                __type: "Pointer",
                className: "_User",
                objectId: $scope.user.id
            });
        query.equalTo("status", STATUS_CLAIMED);
        query.include("vehicle");

        query.find({
          success: function(results) {
            for(var i = 0; i < results.length; i++ ) {
                var job = {date: results[i].get("date"), time: results[i].get("time"), notes: results[i].get("notes"), latitude: results[i].get("latitude"), longitude: results[i].get("longitude"), pointer: results[i], vehicle: {make: "Chevy", model: "Lumina", color: "Grey", license: "NO H20"}}
                $scope.myJobs.push(job)
            }

            $scope.$apply();
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message); //TODO: Error handling
          }
        });
    }

    function getMyCompletedJobs(){
        //grab the completed washes associated with this user
        var query = new Parse.Query("Jobs");
        query.equalTo("employee", {
                __type: "Pointer",
                className: "_User",
                objectId: $scope.user.id
            });
        query.equalTo("status", STATUS_COMPLETE);

        query.find({
          success: function(results) {
            for(var i = 0; i < results.length; i++ ) {
                var job = {date: results[i].get("date"), time: results[i].get("time"), rating: results[i].get("rating"), tip: results[i].get("tip")}
                $scope.completedJobs.push(job)
            }

            $scope.$apply();
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message); //TODO: Error handling
          }
        });
    }

    //Claim a job
    $scope.claimJob = function(job){
    	job.pointer.set("employee", $scope.user);
    	job.pointer.set("status", 1);

    	job.pointer.save(null, {
		  success: function(newJob) {
		    $scope.myJobs.push(job);
			$scope.allJobs.splice($scope.allJobs.indexOf(job), 1); //Remove from local view
			$scope.$apply();
		  },
		  error: function(newJob, error) {
		    alert('Failed to claim job, with error code: ' + error.message + ' Please try again later.');
		  }
		});

    }

    //Job completion
    $scope.completeJob = function (size) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'completeJob.html',
          controller: 'completeJobCtrl',
          size: size
        });

        //Upon pressing save, save the vehicle (after validating input below)
        modalInstance.result.then(function (vehicle) {
            //Save job, change status, move to completed
        }, function () {
            //Modal was closed
        });
    };


});

//Controller for vehicle modal
angular.module('myApp').controller('completeJobCtrl', function ($scope, $uibModalInstance) {

  $scope.beforePicture = "";
  $scope.afterPicture = "";
  $scope.customerNotes = "";

  $scope.ok = function () {
    //TODO: Validate inputs
    //TODO: Add file objects and notes to job
    $uibModalInstance.close(vehicle);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});