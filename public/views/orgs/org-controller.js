var org = new Object();
angular.module('mockbank')
.controller('OrgController', ['$scope','$http','$state', function ($scope, $http, $state) {

	$scope.orgList = new Object();
	$scope.searchOrgCode = "";
	$scope.searchOrgName = "";
	$scope.showList = 0;
	$scope.showUpload = 0;
	$scope.showUrl = 0;
	$scope.organization = org;
	$scope.imgUrl = "";
	$scope.up = {"upUrl":""};

	$scope.searchOrgname = function(){
		var url = api_url + 'Organizations';

		if($scope.searchOrgName != ""){
			$http({
	          method: 'GET',
	          url: url,
	          params: {"filter":{"where":{"name":{"like":"%"+$scope.searchOrgName+"%"}}}}
	        }).then(function successCallback(response) {
	          $scope.orgList = response.data;
	          $scope.showList = 1;
	        }, function errorCallback(error) {
	          console.log(error);
	        });
	    }else{
	    	alert("Please enter Organization name to search by this criteria");
	    }
	}

	$scope.searchOrgcode = function(){
		var url = api_url + 'Organizations';

		if($scope.searchOrgCode != ""){
			$http({
	          method: 'GET',
	          url: url,
	          params: {"filter":{"where":{"orgCode":{"like":"%"+$scope.searchOrgCode+"%"}}}}
	        }).then(function successCallback(response) {
	          $scope.orgList = response.data;
	          $scope.showList = 1;
	        }, function errorCallback(error) {
	          console.log(error);
	        });
	    }else{
	    	alert("Please enter Organization code to search by this criteria");
	    }
	}

	$scope.searchOrg = function(){
		var url = api_url + 'Organizations';

		if($scope.searchOrgName != "" && $scope.searchOrgCode != ""){
			$http({
	          method: 'GET',
	          url: url,
	          params: {"filter":{"where": {"and": [{"name": {"like": "%"+$scope.searchOrgName+"%"}}, {"orgCode": {"like":"%"+$scope.searchOrgCode+"%"}}]}}}
	        }).then(function successCallback(response) {
	          $scope.orgList = response.data;
	          $scope.showList = 1;
	        }, function errorCallback(error) {
	          console.log(error);
	        });
	    }else{
	    	alert("Please enter both Organization name and code to search by this criteria");
	    }
	}

	$scope.latestUploads = function(){
		$scope.count = localStorage.getItem('orgCount');
		var url = api_url + 'Organizations';
		$http({
          method: 'GET',
          url: url,
          params: {"filter":{"where":{"id":{"gt": $scope.count}}}}
        }).then(function successCallback(response) {
          $scope.orgList = response.data;
          $scope.showList = 1;
          if(response.data.length == 0){
          	alert("No new entries to show");
          } 
        }, function errorCallback(error) {
          console.log(error);
          alert("Error occurred- ",error);
        });
	}

	$scope.editOrg = function(organization){
		org = organization;
		$state.go('layout.addOrg');
	}


    $scope.saveOrg = function(org){
        $scope.orgData = org;
        $scope.orgId = org.id;
        var orgUrl = api_url + 'Organizations/'+ $scope.orgId;
        if(Boolean($scope.imgUrl))
        	$scope.orgData.logoUrl = $scope.imgUrl;

        $http({
          method: 'PUT',
          url: api_url + 'Organizations/' + org.id,
          data: org,
        }).then(function successCallback(response) {
        	console.log("saved",org.logoUrl);
			alert("Data Editted/Added Successfully");
			$scope.showUpload = 0;
        },function errorCallback(error) {
			console.log(org.logoUrl,"failed");
			alert("Error occurred- ",error);
        });
      }

      $scope.uploadByImage = function(){
      	$scope.showUpload = 1;
      }

      $scope.uploadByUrl = function(){
      	$scope.showUpload = 2;
      }

      $scope.cancelUp = function(){
        $scope.showUpload = 0;
      }

      $scope.changeLink = function(){
        $scope.showUpload = 3;
      }

      $scope.uploadFile = function(files) {

	    var file = files[0];
	    var type = file.type;
		if(type.includes("image",0))
		{
		    var formData = new FormData();
	        formData.append('file', file);
	        // formData.append('id', org.id);
	        // formData.append('orgCode', org.orgCode);

	        var uploadurl = '/uploadImage';
	      
	      	$.ajax({
	            url: uploadurl,
	            type: 'POST',
	            data: formData,
	            async: false,
	            success: function (data) {
	            	if(data == "Error"){
		            	alert("Some error occurred. Try uploading image again.");
		            }
		            else if(data == "TypeError"){
		            	alert("File uploaded is not an image file. Aborting.");
		            }else{
		            	$scope.imgUrl = "link/"+data;
		            	alert("Image upload successful. Please submit the form to populate data");
		            	$scope.showUrl = 1;
		            }
	            },
	            error: function(returnval) {
		            alert("Some error occurred. Try uploading image again.");
		        },
	            cache: false,
	            contentType: false,
	            processData: false
	        });
	    }else{
	    	alert("File uploaded is not an image file.");
	    }
	    
	}

	$scope.uploadOrgUrl = function(link, orgCode, id) {

        var uploadurl = '/uploadUrl';
        var formData = new FormData();
        formData.append('link', link);
        formData.append('orgCode', orgCode);
        formData.append('id', id);
      
      	$.ajax({
            url: uploadurl,
            type: 'POST',
            data: formData,
            async: false,
            success: function (data) {
            	if(data == "Error"){
		            	alert("Some error occurred. Try uploading image again.");
	            }
	            else if(data == "TypeError"){
	            	alert("File uploaded is not an image file. Aborting.");
	            }else{
	            	$scope.imgUrl = "link/"+data;
	            	alert("Image upload successful. Please submit the form to populate data");
	            	$scope.showUrl = 1;
	            }
            },
            error: function(returnval) {
	            alert("Some error occurred. Try uploading image again. Check if extension exists - (.jpeg .png etc). ");
	        },
            cache: false,
            contentType: false,
            processData: false
        });
	}

	$scope.migrate = function(){
		var url = api_url + 'Organizations';
		$http({
          method: 'GET',
          url: url
        }).then(function successCallback(response) {
          	for (var i = 0; i < response.data.length; i++) {
          		if((Boolean(response.data[i].logoUrl)))
          		   $scope.migrateUrl(response.data[i]);
          	}
        }, function errorCallback(error) {
          console.log(error);
          alert("Error occurred- ",error);
        });
	}

	$scope.migrateUrl = function(org) {

		var link = org.logoUrl;
		var orgCode = org.orgCode;
		var id = org.id;
        var uploadurl = '/uploadUrl';
        var formData = new FormData();
        formData.append('link', link);
        formData.append('orgCode', orgCode);
        formData.append('id', id);
      
      	$.ajax({
            url: uploadurl,
            type: 'POST',
            data: formData,
            async: false,
            success: function (data) {
              if(data == "Error" && data == "TypeError"){
              		console.log(data," : ",link);
	           }else{
	           	    org.logoUrl = "link/" + data;
	           		$scope.migrateOrg(org);
	           }
            },
            error: function(returnval) {
            	console.log("failed - ",link," Error - ",returnval);
	        },
            cache: false,
            contentType: false,
            processData: false
        });
	}

	$scope.migrateOrg = function(org){
        $http({
          method: 'PUT',
          url: api_url + 'Organizations/' + org.id,
          data: org,
        }).then(function successCallback(response) {
        	console.log("saved",org.logoUrl);
        }, function errorCallback(error) {
          	console.log(org.logoUrl,"failed");
        });
      }



}]);



	
