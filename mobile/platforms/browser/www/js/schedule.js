$( document ).ready(  );

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

    $scope.user = Parse.User.current();
    $scope.vehicles = [];
    $scope.jobs = [];

    alert("Display spin.js while waiting");

    if (!$scope.user){
        window.location.assign("login");
    } else {
        getVehiclesForUser();
        getWashesForUser();
    }

     /**
        Gets vehicles associated with a user
    */
    function getVehiclesForUser(){
        //Setup query to grab the vehicles associated with this customer
        var query = new Parse.Query("Vehicles");
        query.equalTo("customer", {
                __type: "Pointer",
                className: "_User",
                objectId: $scope.user.id
            });

        vehicles = []; //Vehicles array

        //Grab vehicles
        query.find({
          success: function(results) {
            for(var i = 0; i < results.length; i++ ) {
                var vehicle = {make: results[i].get("make"), model: results[i].get("model"), year: results[i].get("year"), color: results[i].get("color"), parseId: results[i].id, pointer: results[i]}
                $scope.vehicles.push(vehicle)
            }

            $scope.$apply();
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message); //TODO: Error handling
          }
        });
    }


    function getWashesForUser(){
        //Setup query to grab the washes associated with this user
        var query = new Parse.Query("Jobs");
        query.equalTo("customer", {
                __type: "Pointer",
                className: "_User",
                objectId: $scope.user.id
            });
        query.notEqualTo("status", 3); //If the wash isn't complete

        //Grab vehicles
        query.find({
          success: function(results) {
            for(var i = 0; i < results.length; i++ ) {
                var job = {date: results[i].get("date"), time: results[i].get("time"), status: convertStatusToString(results[i].get("status"))}
                $scope.jobs.push(job)
            }

          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message); //TODO: Error handling
          }
        });
    }

    function convertStatusToString(status){
        if (status == STATUS_UNCLAIMED) { 
            return "Unclaimed";
        } else if ( status == STATUS_CLAIMED ) {
            return "Claimed";
        } 
    }

    //Display schedule a wash if the user doesn't have a wash in progress
    function displayWashSchedule(){
        //For displaying map related errors
        $scope.mapError = document.getElementById("mapError");
        $scope.useMyLocation = false;

        //Values
        $scope.address = "";
        $scope.city = "";
        $scope.zipCode = "";
        $scope.state = "NC"; //TODO: Expand in future?
        $scope.washType = "";
        $scope.washDate = "";
        $scope.washTime = "";
        $scope.washNotes = "";
        $scope.wash = "";

        //Use google maps instead of address block
        $scope.getLocation = function() {
            if (navigator.geolocation) {
                $scope.useMyLocation = true;
                navigator.geolocation.getCurrentPosition(showPosition, showError); //two function pointers (success, failure)
            } else {
                $scope.useMyLocation = false;
                $scope.mapError.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        function showPosition(position) {
            $scope.lat = position.coords.latitude;
            $scope.lon = position.coords.longitude;
            latlon = new google.maps.LatLng($scope.lat, $scope.lon)
            mapholder = document.getElementById('mapHolder')
            mapholder.style.height = '250px';
            mapholder.style.width = '250px';

            var myOptions = {
                center:latlon,zoom:14,
                mapTypeId:google.maps.MapTypeId.ROADMAP,
                mapTypeControl:false,
                navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
            }
            
            var map = new google.maps.Map(document.getElementById("mapHolder"), myOptions);

            //Setup the marker
            //var markerIcon = 'img/B.PNG'; --> TODO: Icon needs to be resized w/ transparent BG
            marker = new google.maps.Marker( {
                position:latlon,
                map:map,
                draggable: true,
                //icon: markerIcon,
                animation: google.maps.Animation.DROP,
                title:"You are here!"
            });

            //On drag, update lat/lon
             marker.addListener('dragend', function() {
                $scope.lat = marker.getPosition().lat();
                $scope.lon = marker.getPosition().lng();
              });

        }

        //Scheduling a wash
        $scope.scheduleWash = function(){
            var JobObject = Parse.Object.extend("Jobs");
            var parseJob = new JobObject();

            //Set vehicle values
            parseJob.set("status", 0);
            parseJob.set("latitude", $scope.lat);
            parseJob.set("longitude", $scope.lon);
            parseJob.set("type", $scope.washType);
            parseJob.set("date", $scope.washDate);
            parseJob.set("time", $scope.washTime);
            parseJob.set("notes", $scope.washNotes);
            parseJob.set("vehicle", $scope.washVehicle.pointer);
            parseJob.set("customer", $scope.user);

            //Persist to Parse
            parseJob.save(null, {
              success: function(newParseJob) {
                alert('Saved succesfully');
                $scope.job = newParseJob;
                $scope.washInProgress = true;
                $scope.$apply();  
                displayPendingWash();
              },
              error: function(vehicle, error) {
                alert('Failed to create new vehicle, with error code: ' + error.message);
              }
            });
        }

        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    $scope.mapError.innerHTML = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    $scope.mapError.innerHTML = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    $scope.mapError.innerHTML = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    $scope.mapError.innerHTML = "An unknown error occurred."
                    break;
            }
        }
    }

    function displayPendingWash(){
        $scope.jobStatus = $scope.job.get("status");
        $scope.jobStatusString = jobStatusToString();
    }

    //Rudimentary for meow
    function jobStatusToString(){
        var statusString = "";
        if ( $scope.jobStatus == 0 ) {
            return "Unclaimed.";
        } else {
            return "Claimed / In Progress.";
        } 
    }

});