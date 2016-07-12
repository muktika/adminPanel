angular.module('mockbank')
.controller('UploadController', ['$scope','$http','$state', function ($scope, $http, $state) {

	$scope.showResult=0;
  

	$scope.finish = function(){

    $scope.resultObj = new Object();
    $scope.resultset = [];
    $scope.name = [];
    
    $http({
      method: 'GET',
      url: api_url + "Organizations/count"
    }).then(function successCallback(response) {
      localStorage.setItem('orgCount', response.data.count);
    }, function errorCallback(error) {
      console.log(error);
    });

  $http({
      method: 'GET',
      url: api_url + "Locations/count"
    }).then(function successCallback(response) {
      localStorage.setItem('locCount', response.data.count);
    }, function errorCallback(error) {
      console.log(error);
    });

  $http({
      method: 'GET',
      url: api_url + "Jobs/count"
    }).then(function successCallback(response) {
      localStorage.setItem('jobCount', response.data.count);
    }, function errorCallback(error) {
      console.log(error);
    });

	  var job = $('#inputJob').find(":selected").text();
      var bool = $('#inputBool').find(":selected").text();
      var url = api_url;
       var file = $('#file').get(0).files[0];
       var formData = new FormData();
       formData.append('file', file);
      
      $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            async: false,
            success: function (data) {
                $scope.resultData = data;
                if(job == "job"){
                  var key = 'job_status';
                  var i =0;
                  $scope.name = Object.keys($scope.resultData);
                  for (key in $scope.resultData) {
                    if ($scope.resultData.hasOwnProperty(key)) {
                    var val = $scope.resultData[key];
                    $scope.resultObj.status = val.org_match_status;
                    $scope.resultObj.locStatus = val.location_match_status;
                    if(val.job_status.includes("failed")){
                      $scope.resultObj.message = "Failed. Error - " + val.job_status + "," + val.err;
                    }else{
                      $scope.resultObj.message = "Success. ";
                      if(val.job_eligib_status.err){
                        $scope.resultObj.message = $scope.resultObj.message + " Job eligibility err - " + val.job_eligib_status.err + ".";
                      }
                      if(val.job_filter_status.err){
                        $scope.resultObj.message = $scope.resultObj.message + " Job Filter err - " + val.job_filter_status.err + ".";
                      }
                      if(val.job_location_status.err){
                        $scope.resultObj.message = $scope.resultObj.message + " Job location err - " + val.job_location_status.err + ".";
                      }
                      if(val.job_org_status.err){
                        $scope.resultObj.message = $scope.resultObj.message + " Job Org Status err - " + val.job_org_status.err + ".";
                      }
                      if(val.job_langtest_status.err){
                        $scope.resultObj.message = $scope.resultObj.message + " Job Language Test err - " + val.job_langtest_status.err + ".";
                      }
                      if(val.job_lifecycle_status.err){
                        $scope.resultObj.message = $scope.resultObj.message + " Job Lifecycle err - " + val.job_lifecycle_status.err + ".";
                      }
                      if(val.job_postdetail_status.err){
                        $scope.resultObj.message = $scope.resultObj.message + " Job PostDetail err - " + val.job_postdetail_status.err + ".";
                      }
                      if(val.job_references_status.err){
                        $scope.resultObj.message = $scope.resultObj.message + " Job References err - " + val.job_references_status.err + ".";
                      }
                      if(val.job_tags_status.err){
                        $scope.resultObj.message = $scope.resultObj.message + " Job Tags err - " + val.job_tags_status.err + ".";
                      }
                      if(val.job_othercontent_status.err){
                        $scope.resultObj.message = $scope.resultObj.message + " Job Othercontent err - " + val.job_othercontent_status.err + ".";
                      }
                    }
                  }
                  $scope.resultset.push($scope.resultObj);
                }
                $scope.showResult = 1;
              }else if(job == "org"){
                $scope.resultset = data;
                $scope.showResult = 2;
              }else{
                $scope.resultset = data;
                $scope.showResult = 3;
              }
              alert("Please Check the Results for more details.");
            },
            error: function(err){
              alert("Some Error Occurred: ", err);
            },
            cache: false,
            contentType: false,
            processData: false
        });

	}

}]);