var loc = new Object();
angular.module('mockbank')
.controller('LocController', ['$scope','$http','$state', function ($scope, $http, $state) {

	$scope.locList = new Object();
	$scope.loc = loc;
	var url = api_url + 'Locations';
	
	$http({
      method: 'GET',
      url: url
    }).then(function successCallback(response) {
      $scope.locList = response.data;
    }, function errorCallback(error) {
      console.log(error);
    });
	
	$scope.latestUploads = function(){
		$scope.count = localStorage.getItem('locCount');
		var url = api_url + 'Locations';
		$http({
          method: 'GET',
          url: url,
          params: {"filter":{"where":{"id":{"gt": $scope.count}}}}
        }).then(function successCallback(response) {
          console.log(response);
          $scope.locList = response.data;
          if(response.data.length == 0 || response.data.length == $scope.count){
          	alert("No new entries to show");
          }
        }, function errorCallback(error) {
          console.log(error);
        });
	}

	$scope.editLoc = function(location){
		loc = location;
		$state.go('layout.addLoc');
	}


    $scope.saveLoc = function(loc){
      $http({
          method: 'GET',
          url: api_url +  'Locations/count',
          params: {"where": {"locationName" : loc.locationName,"locationCode":loc.locationCode}}
        }).then(function successCallback(response) {
         if(response.data.count == 0){
            $scope.locData = loc;
            $scope.locId = loc.id;
            var locUrl = api_url + 'Locations/'+ $scope.locId;

            $http({
              method: 'PUT',
              url: locUrl,
              data: $scope.locData
            }).then(function successCallback(response) {
              alert("Location Added/Editted Successfully");
            }, function errorCallback(error) {
              console.log(error);
              alert("Error occurred- ",error);
            });
          }else{
            alert("Location with the same name and code already exists");
          }
        }, function errorCallback(error) {
            console.log(error);
            alert("Error occurred- ",error);
          });
      }

}]);

