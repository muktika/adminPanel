angular.module('mockbank')
.controller('NotificationController', ['$scope','$http','$state', function ($scope, $http, $state) {

      $scope.createdBy;
      $scope.notify = {"title":"","message":"","url":""};
      	 
     

      $scope.notifyMe = function(){
        if($scope.createdBy!="" && $scope.notify.title != "" && $scope.notify.message != "" && $scope.notify.url !=""){
            console.log($scope.createdBy,JSON.stringify(JSON.stringify($scope.notify)));
            var date =  new Date().toJSON().slice(0,10);
            var url= api_url + 'ChannelNotifications';
            $http({
                method: 'POST',
                url: url,
                data: {
                    "id": 0,
                    "notification": JSON.stringify($scope.notify),
                    "channelName": "General",
                    "createdBy": $scope.createdBy,
                    "createdAt": date,
                    "sentOn": date,
                    "isPublished": 1,
                    "isActive": 1
                  },
              }).then(function successCallback(response) {
                alert("Successfully Added to DB. Wait for sent confirmation");
                sendNotifications();
              }, function errorCallback(error) {
                console.log(error);
              });
            //sendNotifications();
        
        }else{
            alert("Please fill all fields");
        }
      }

      function sendNotifications(){
         $scope.regIDs= "";
         $http({
          method: 'GET',
          url: api_url + "UserSubscriptions",
          params: {"filter":{"fields":"channelData"}}
          }).then(function successCallback(response) {
            $scope.results = response.data;
            if($scope.results.length >0){
             for (var i = 0; i < $scope.results.length; i++) {
                  $scope.regIDs+= $scope.results[i].channelData;

                  if(i != ($scope.results.length-1)){
                     $scope.regIDs += ",";
                  }else{
                    postGCM($scope.regIDs);
                  }
             }
           }else{
            alert("Sorry, No Registrations to notify");
           }
          }, function errorCallback(error) {
            console.log(error);
          });
      }
	
      function postGCM(reg){
        var regis = reg;
        var registrationID = [];
        registrationID = regis.split(",");
        console.log("here",registrationID);
        var gcmUrl = "https://android.googleapis.com/gcm/send";
        $http({
          method: 'POST',
          url: gcmUrl,
          headers: {
                'Content-Type': 'application/json',
               // 'Authorization': ''
            },
          data: {
              "collapse_key": "score_update",
              "time_to_live": 108,
              "delay_while_idle": true,
              "data": {
                "score": "4x8"
              },
              "registration_ids": registrationID
            }
        }).then(function successCallback(response) {
          alert("GCM sending success");
          console.log(response);
        }, function errorCallback(error) {
          alert("GCM sending failed.");
        });

      }

      $scope.repost = function(){
          sendNotifications();
      }

}]);