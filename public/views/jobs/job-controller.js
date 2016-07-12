var identity = 0;
var jobP = new Object();
var jobLC = new Object();
var jobEl = new Object();
var jobT = new Object();
var jobR = new Object();
var jobC = new Object();
var jobLT = new Object();
angular.module('mockbank')
.controller('JobsController', ['$scope','$http','$state','$window', function ($scope, $http, $state, $window) {

     var url= api_url + 'Jobs';
     $scope.jobs = new Object();
     $scope.id=identity;
     $scope.publish = 0;
     $scope.preview = 0;
     $scope.showList = 0;
     $scope.publishIds = [];
     $scope.previewIds = [];
     $scope.jobIds = [];
     $scope.searchJobC = "";
     $scope.searchOrgName = "";
     $scope.searchDesig = "";

     $scope.previewLink = function(id){
        window.open(
          api_url + 'Jobs/' + id + '/generate',
          '_blank' 
        );
     }

     $scope.publishLink = function(id){
      window.open(
          api_url + 'Jobs/publish?id=['+ id +']',
          '_blank' 
        );
     }

    $scope.searchDesignation = function(){
      var uurl = api_url + 'JobPostDetails';
      if($scope.searchDesig != ""){
      $http({
            method: 'GET',
            url: uurl,
            params: {"filter":{"fields":["jobId"],"where":{"designation": {"like": "%"+$scope.searchDesig+"%"}}}}
          }).then(function successCallback(response) {
            for (var i = 0; i < response.data.length; i++) {
               $scope.jobIds.push(response.data[i].jobId);
               if(i == response.data.length - 1)
                searchDes($scope.jobIds);
            }
          }, function errorCallback(error) {
            console.log(error);
          });
      }else{
        alert("Please enter designation to search by this criteria");
      }
    }

    function searchDes(jobIds){
      $http({
            method: 'GET',
            url: url,
            params: {"filter":{"include":{"relation":"postDetail","scope":{"fields":["jobTitle"]}},"where":{"id": {"inq":jobIds}}}}
          }).then(function successCallback(response) {
            $scope.jobs = response.data;
            $scope.showList = 1;
          }, function errorCallback(error) {
            console.log(error);
          });
    }
     
  $scope.searchJobCode = function(){
    if($scope.searchJobC != ""){
      $http({
            method: 'GET',
            url: url,
            params: {"filter":{"include":{"relation":"postDetail","scope":{"fields":["jobTitle"]}},"where":{"jobCode": {"like":"%"+$scope.searchJobC+"%"}}}}
          }).then(function successCallback(response) {
            $scope.jobs = response.data;
            $scope.showList = 1;
          }, function errorCallback(error) {
            console.log(error);
          });
      }else{
        alert("Please enter Job code to search by this criteria");
      }
  }

  $scope.searchEmpName = function(){
    if($scope.searchOrgName != ""){
      $http({
            method: 'GET',
            url: url,
            params: {"filter":{"include":{"relation":"postDetail","scope":{"fields":["jobTitle"]}},"where":{"employerName": {"like":"%"+$scope.searchOrgName+"%"}}}}
          }).then(function successCallback(response) {
            $scope.jobs = response.data;
            $scope.showList = 1;
          }, function errorCallback(error) {
            console.log(error);
          });
      }else{
        alert("Please enter organization name to search by this criteria");
      }
  }

  $scope.searchBoth = function(){
    if($scope.searchOrgName != "" && $scope.desig != ""){
      $http({
            method: 'GET',
            url: url,
            params: {"filter":{"include":{"relation":"postDetail","scope":{"fields":["jobTitle"],"where":{"designation": {"like": "%"+$scope.searchDesig+"%"}}}},"where":{"employerName": {"like":"%"+$scope.searchOrgName+"%"}}}}
          }).then(function successCallback(response) {
            $scope.jobs = [];
            for (var i = 0; i < response.data.length; i++) {
              if(response.data[i].postDetail.length >0)
                $scope.jobs.push(response.data[i]);
            }
            $scope.showList = 1;
          }, function errorCallback(error) {
            console.log(error);
          });
      }else{
        alert("Please enter organization name and desgination both to search by this criteria");
      }
  }

    $scope.latestUploads = function(){
      $scope.count = localStorage.getItem('jobCount');
      $http({
          method: 'GET',
          url: url,
          params: {"filter":{"include":{"relation":"postDetail","scope":{"fields":["jobTitle"]}},"where":{"id":{"gt": $scope.count}}}}
        }).then(function successCallback(response) {
          $scope.jobs = response.data;
          $scope.showList = 1;
          if(response.data.length == 0){
            alert("No new entries to show");
          }
        }, function errorCallback(error) {
          console.log(error);
        });
    }

    $scope.publishedJobs = function(){
        $http({
          method: 'GET',
          url: url,
          params: {"filter":{"where":{"isPublished": true },"include":{"relation":"postDetail","scope":{"fields":["jobTitle"]}}}}
        }).then(function successCallback(response) {
          $scope.jobs = response.data;
          $scope.showList = 1;
          if(response.data.length == 0){
            alert("No new entries to show");
          }
        }, function errorCallback(error) {
          console.log(error);
        });
    }

    $scope.unpublishedJobs = function(){
        $http({
          method: 'GET',
          url: url,
          params: {"filter":{"where":{"isPublished": false},"include":{"relation":"postDetail","scope":{"fields":["jobTitle"]}}}}
        }).then(function successCallback(response) {
          $scope.jobs = response.data;
          $scope.showList = 1;
          if(response.data.length == 0){
            alert("No new entries to show");
          }
        }, function errorCallback(error) {
          console.log(error);
        });
    }

    $scope.showUpload = 0;
    $scope.showUrl = 0;
    $scope.pdfUrl = "";
    $scope.up = {"upUrl":""};
    $scope.uploadByPdf = function(){
        $scope.showUpload = 1;
      }

      $scope.uploadByUrl = function(){
        $scope.showUpload = 2;
      }

      $scope.changeLink = function(){
        $scope.showUpload = 3;
      }

      $scope.uploadFile = function(files) {

      var file = files[0];
      var type = file.type;
      if(type == "application/pdf" || type == "application/msword" || type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || type == "application/vnd.ms-excel" || type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" )
      {
          var filename = file.name;
          var formData = new FormData();
            formData.append('file', file);
            var uploadurl = '/uploadPdf';
          
            $.ajax({
                url: uploadurl,
                type: 'POST',
                data: formData,
                async: false,
                success: function (data) {
                  if(data == "Error"){
                    alert("Some error occurred. Try uploading pdf,excel or word file again.");
                  }else if(data == "TypeError"){
                    alert("File uploaded is not a valid pdf,excel or word file. Aborting.");
                  }else{
                    $scope.pdfUrl = "link/"+data;
                    alert("Upload successful. Please submit the form to populate data");
                    $scope.showUrl = 1;
                  }
                },
                error: function(returnval) {
                  alert("Some error occurred. Try uploading pdf,excel or word file again.");
              },
                cache: false,
                contentType: false,
                processData: false
            });
        }else{
          alert("File uploaded is not a pdf file.");
        }
      
  }

  $scope.uploadPUrl = function(link) {

        var uploadurl = '/uploadPdfUrl';
        var formData = new FormData();
        formData.append('link', link);
        formData.append('id', $scope.id);
      
        $.ajax({
            url: uploadurl,
            type: 'POST',
            data: formData,
            async: false,
            success: function (data) {
              if(data == "Error"){
                alert("Some error occurred. Try uploading pdf,excel or word file again.");
              }else if(data == "TypeError"){
                alert("File uploaded is not a valid pdf,excel or word file. Aborting.");
              }else{
                $scope.pdfUrl = "link/"+data;
                alert("Upload successful. Please submit the form to populate data");
                $scope.showUrl = 1;
              }
            },
            error: function(returnval) {
              alert("Some error occurred. Try uploading pdf,excel or word file again");
          },
            cache: false,
            contentType: false,
            processData: false
        });
  }

      $scope.cancelUp = function(){
        $scope.showUpload = 0;
      }

      $scope.job = new Object();
      $scope.jobFilter = new Object();
      $scope.jobPost = jobP;
      $scope.jobLifecycle = jobLC;
      $scope.jobEli = jobEl;
      $scope.jobTag = jobT;
      $scope.jobRef = jobR;
      $scope.jobCon = jobC;
      $scope.jobLangTest = jobLT;
      $scope.changeO = 0;
      $scope.org = new Object();
      $scope.org.changeOrgTitle = "";
      $scope.orgTitle;
      $scope.addL = 0;
      $scope.loc = new Object();
      $scope.loc.changeLocTitle = "";
      $scope.locTitle;

      $scope.changeOrg = function(){
        $scope.changeO = 1;
      }

      $scope.addLoc = function(){
        $scope.addL = 1;
      }

      $scope.autosearchOrg = function(jobOrgD){
        var jobOrgD = jobOrgD;
        $scope.orgTitle = "";
        var oUrl = api_url + 'Organizations';
        $http({
            method: 'GET',
            url: oUrl,
            params: {"filter":{"where":{"orgCode":{"like":"%"+$scope.org.changeOrgTitle+"%"}},"fields":["orgCode"]}}
          }).then(function successCallback(response) {
            $scope.orgList = [];
            for (var i = 0; i < response.data.length; i++) {
                $scope.orgList.push(response.data[i].orgCode);
            }
          }, function errorCallback(error) {
            console.log(error);
          });

        $( "#search-org" ).autocomplete({
          autoFocus: true,
          source: $scope.orgList,
          select: function(event, ui) { 
            $scope.orgTitle = ui.item.value;
            $(this).autocomplete('widget').zIndex(-1);
            $scope.doneOrg(jobOrgD);
        },
        open: function () {
            $(this).autocomplete('widget').zIndex(1100);
        },
        close: function () {
            $(this).autocomplete('widget').zIndex(-1);
        }
      });

    }

    $scope.autosearchLoc = function(){
        $scope.locTitle = "";
        var lUrl = api_url + 'Locations';
        $http({
            method: 'GET',
            url: lUrl,
            params: {"filter":{"where":{"locationName":{"like":"%"+$scope.loc.changeLocTitle+"%"}},"fields":["locationName"]}}
          }).then(function successCallback(response) {
            $scope.locList = [];
            for (var i = 0; i < response.data.length; i++) {
                $scope.locList.push(response.data[i].locationName);
            }
          }, function errorCallback(error) {
            console.log(error);
          });

        $( "#search-loc" ).autocomplete({
          autoFocus: true,
          source: $scope.locList,
          select: function(event, ui) { 
            $scope.locTitle = ui.item.value;
            $(this).autocomplete('widget').zIndex(-1);
            $scope.saveLoc();
          },
          open: function () {
              $(this).autocomplete('widget').zIndex(1100);
          },
          close: function () {
              $(this).autocomplete('widget').zIndex(-1);
          }
      });

    }

      $scope.saveLoc = function(){
        if(confirm("Do you want to save this location?")){
        var lUrl = api_url + 'Locations/findOne';
        var newLoc = new Object();
        newLoc.jobId = $scope.id;
        newLoc.isPublished = true;
        newLoc.isActive = true;
          $http({
              method: 'GET',
              url: lUrl,
              params: {"filter":{"where":{"locationName":$scope.locTitle},"fields":["id"]}}
            }).then(function successCallback(response) {
                if(response.data.id){
                  newLoc.locationId = response.data.id;
                  createLoc(newLoc);
                  $scope.addL = 1;
                }
            }, function errorCallback(error) {
              console.log(error);
            });
      }
    }

      function createLoc(locObj){
        $http({
          method: 'GET',
          url: api_url + 'JobLocations/count',
          params:{"where":{"and": [{"locationId":locObj.locationId},{"jobId":$scope.id}]}}
          }).then(function successCallback(result) {
            if(result.data.count == 0){
              $http({
                method: 'POST',
                url: api_url + 'JobLocations',
                data: locObj
              }).then(function successCallback(result) {
                  alert("Location Mapping Successfully Added");
                  $scope.addL = 0;
                  $http({
                  method: 'GET',
                  url: api_url + "JobLocations",
                  params: {"filter":{"where":{"jobId":$scope.id},"include":{"relation":"location","scope":{"fields":["locationName"]}}}}
                  }).then(function successCallback(response) {
                    $scope.jobLoc = response.data;
                  }, function errorCallback(error) {
                    console.log(error);
                  });
              }, function errorCallback(error) {
                console.log(error);
                alert("Error - ", error);
              });
            }else{
              alert("This location has already been mapped to this job.");
              $scope.addL = 0;
            }
          }, function errorCallback(error) {
            console.log(error);
            alert("Error - ", error);
          });
      }

      $scope.doneOrg = function(job){
        var oUrl = api_url + 'Organizations/findOne';
        job.orgCode = $scope.orgTitle;
        if(confirm("Do you want to save this organization?")){
          $http({
              method: 'GET',
              url: oUrl,
              params: {"filter":{"where":{"orgCode":$scope.orgTitle},"fields":["displayName"]}}
            }).then(function successCallback(response) {
               if(response.data.displayName){
                  job.employerName = response.data.displayName;
                  upsertOrg(job);
                  $scope.changeO = 0;
                }
            }, function errorCallback(error) {
              console.log(error);
            });
        }
      }

      function upsertOrg(job){
        var jobUrl = api_url + 'Jobs/'+ job.id;
        $http({
          method: 'PUT',
          url: jobUrl,
          data: job,
        }).then(function successCallback(response) {
          alert("Org Code Successfully Editted");
          $scope.job.orgCode = $scope.orgTitle;
          $scope.changeO = 0;
        }, function errorCallback(error) {
          console.log(error);
          alert("Error - ", error);
        });
      }

      $scope.delLoc = function(loc){
        $http({
          method: 'GET',
          url: api_url + 'JobLocations/count',
          params: {"where":{"jobId":$scope.id}}
        }).then(function successCallback(response) {
          if(response.data.count > 1){
            $http({
              method: 'DELETE',
              url: api_url + 'JobLocations/' + loc.id,
            }).then(function successCallback(response) {
              alert("Location Mapping Successfully Deleted");
              $http({
              method: 'GET',
              url: api_url + "JobLocations",
              params: {"filter":{"where":{"jobId":$scope.id},"include":{"relation":"location","scope":{"fields":["locationName"]}}}}
              }).then(function successCallback(response) {
                $scope.jobLoc = response.data;
              }, function errorCallback(error) {
                console.log(error);
              });
            }, function errorCallback(error) {
              console.log(error);
              alert("Error - ", error);
            });
          }else{
            alert("Cannot perform delete operation as there is only one location mapped to this job.")
          }
        }, function errorCallback(error) {
            console.log(error);
            alert("Error - ", error);
          });
      }

      $scope.editJob = function(id){
        $state.go('layout.addJob');
        identity = id;
      }

      $scope.editDetail = function(post){
        $state.go('layout.editDetails');
        jobP = post;
      }

      $scope.editLifecycle = function(lifecycle){
        $state.go('layout.editLifecycles');
        jobLC = lifecycle;
      }

      $scope.editJobEligibility = function(eligibility){
        $state.go('layout.editEli');
        jobEl = eligibility;
      }

      $scope.editJobTag = function(tag){
        $state.go('layout.editTag');
        jobT = tag;
      }

      $scope.addJobTag = function(){
        $state.go('layout.editTag');
        jobT = new Object();
        jobT.id = 0;
        jobT.jobId = $scope.id;
        jobT.isPublished = false;
        jobT.isActive = false;
      }

      $scope.editJobRef = function(reference){
        $state.go('layout.editRef');
        jobR = reference;
      }

      $scope.addJobRef = function(){
        $state.go('layout.editRef');
        jobR = new Object();
        jobR.id = 0;
        jobR.jobId = $scope.id;
        jobR.isPublished = false;
        jobR.isActive = false;
      }

      $scope.editJobCon = function(jobcontent){
        $state.go('layout.editCon');
        jobC = jobcontent;
      }

      $scope.editJobLang = function(joblanguageTest){
        $state.go('layout.editLang');
        jobLT = joblanguageTest;
      }

      $scope.saveJob = function(job){
        $scope.jobData = job;
        $scope.jobId = $scope.jobData.id;
        if(Boolean($scope.pdfUrl))
          $scope.jobData.applyUrl = $scope.pdfUrl;
        var jobUrl = api_url + 'Jobs/'+ $scope.jobId;

        $http({
          method: 'PUT',
          url: jobUrl,
          data: $scope.jobData,
        }).then(function successCallback(response) {
          alert("Data Successfully Editted/Added");
          $scope.showUpload = 0;
        }, function errorCallback(error) {
          console.log(error);
        });
      }

      $scope.publishAll = function(){
        $scope.publish = 1;
      }

      $scope.previewAll = function(){
        $scope.preview = 1;
      }

      $scope.publishIdList = function(){
        $scope.publish = 0;
        console.log($scope.publishIds);
        window.open(
          api_url + 'Jobs/publish?id=['+$scope.publishIds+']',
          '_blank' 
        );
        $state.go('layout.jobs', {}, { reload: true });
      }

      $scope.previewIdList = function(){
        $scope.preview = 0;
        console.log($scope.previewIds);
        window.open(
          api_url + 'Jobs/generateFew?id=['+$scope.previewIds+']',
          '_blank'
        );
        $state.go('layout.jobs', {}, { reload: true });
      }

      $scope.addId = function(jobPublishId){
        var index = $.inArray(jobPublishId, $scope.publishIds);
        if (index != -1) { 
            $scope.publishIds.splice(index, 1);
        } else {
            $scope.publishIds.push(jobPublishId);
        }
      }

      $scope.addIdPreview = function(jobPreviewId){
        var index = $.inArray(jobPreviewId, $scope.previewIds);
        if (index != -1) { 
            $scope.previewIds.splice(index, 1);
        } else {
            $scope.previewIds.push(jobPreviewId);
        }
      }

      $scope.selectAll = function(jobs){
        angular.forEach(jobs, function (job) {
            job.selected = true;
            $scope.publishIds.push(job.id);
        });
      }

      $scope.selectAllPreview = function(jobs){
        angular.forEach(jobs, function (job) {
            job.selected = true;
            $scope.previewIds.push(job.id);
        });
      }

      $scope.saveJobPost = function(jobPost){
        $scope.jobPostData = jobPost;
        $scope.jobId = $scope.jobPostData.id;
        var jobPostUrl = api_url + 'JobPostDetails/'+ $scope.jobId;

        $http({
          method: 'PUT',
          url: jobPostUrl,
          data: $scope.jobPostData,
        }).then(function successCallback(response) {
          alert("Data Successfully Editted/Added");
        }, function errorCallback(error) {
          console.log(error);
          alert("Error occurred- ",error);
        });
      }

      $scope.saveJobFilter = function(jobFilter){
        $scope.jobFilterData = jobFilter;
        $scope.jobId = $scope.jobFilterData.id;
        var jobFilterUrl = api_url + 'JobFilters/'+ $scope.jobId;

        $http({
          method: 'PUT',
          url: jobFilterUrl,
          data: $scope.jobFilterData,
        }).then(function successCallback(response) {
          alert("Data Successfully Editted/Added");
        }, function errorCallback(error) {
          console.log(error);
          alert("Error occurred- ",error);
        });
      }

      $scope.saveJobLifecycle = function(jobLifecycle){
        $scope.jobLifecycleData = jobLifecycle;
        $scope.jobId = $scope.jobLifecycleData.id;
        var jobLifecycleUrl = api_url + 'JobLifecycles/'+ $scope.jobId;

        $http({
          method: 'PUT',
          url: jobLifecycleUrl,
          data: $scope.jobLifecycleData,
        }).then(function successCallback(response) {
          alert("Data Successfully Editted/Added");
        }, function errorCallback(error) {
          console.log(error);
          alert("Error occurred- ",error);
        });
      }

      $scope.saveJobTags = function(jobTag){
        $scope.jobTagData = jobTag;
        $scope.jobId = $scope.jobTagData.id;
        var jobTagUrl = api_url + 'JobTags/'+ $scope.jobId;

        $http({
          method: 'PUT',
          url: jobTagUrl,
          data: $scope.jobTagData,
        }).then(function successCallback(response) {
          alert("Data Successfully Editted");
        }, function errorCallback(error) {
          console.log(error);
          alert("Error occurred- ",error);
        });
      }

      $scope.createJobTag = function(jobTag){
        $scope.jobTagData = jobTag;
        var jobTagUrl = api_url + 'JobTags';

        $http({
          method: 'POST',
          url: jobTagUrl,
          data: $scope.jobTagData,
        }).then(function successCallback(response) {
            alert("Data Successfully Added");
            $http({
            method: 'GET',
            url: api_url + "JobTags",
            params: {"filter":{"where":{"jobId":$scope.id}}}
            }).then(function successCallback(response) {
              $scope.jobTags = response.data;
            }, function errorCallback(error) {
              console.log(error);
            });
        }, function errorCallback(error) {
          console.log(error);
          alert("Error occurred- ",error);
        });
      }

      $scope.saveJobLT = function(jobLanguageTest){
        $scope.jobLangData = jobLanguageTest;
        $scope.jobId = $scope.jobLangData.id;
        var jobLangUrl = api_url + 'JobLanguageTests/'+ $scope.jobId;

        $http({
          method: 'PUT',
          url: jobLangUrl,
          data: $scope.jobLangData,
        }).then(function successCallback(response) {
          alert("Data Successfully Editted/Added");
        }, function errorCallback(error) {
          console.log(error);
          alert("Error occurred- ",error);
        });
      }

      $scope.saveJobRef = function(jobRef){
        $scope.jobRefData = jobRef;
        if(Boolean($scope.pdfUrl))
          $scope.jobRefData.url = $scope.pdfUrl;
        $scope.jobId = $scope.jobRefData.id;
        var jobRefUrl = api_url + 'JobReferences/'+ $scope.jobId;

        $http({
          method: 'PUT',
          url: jobRefUrl,
          data: $scope.jobRefData,
        }).then(function successCallback(response) {
          alert("Data Successfully Editted");
          $scope.showUpload = 0;
        }, function errorCallback(error) {
          console.log(error);
          alert("Error occurred- ",error);
        });

      }

      $scope.createJobRef = function(jobRef){
        $scope.jobRefData = jobRef;
        if(Boolean($scope.pdfUrl))
          $scope.jobRefData.url = $scope.pdfUrl;
        var jobRefUrl = api_url + 'JobReferences';

        $http({
          method: 'POST',
          url: jobRefUrl,
          data: $scope.jobRefData,
        }).then(function successCallback(response) {
            alert("Data Successfully Added");
            $scope.showUpload = 0;
            $http({
            method: 'GET',
            url: api_url + "JobReferences",
            params: {"filter":{"where":{"jobId":$scope.id}}}
            }).then(function successCallback(response) {
              $scope.jobReferences = response.data;
            }, function errorCallback(error) {
              console.log(error);
            });
        }, function errorCallback(error) {
          console.log(error);
          alert("Error occurred- ",error);
        });

      }

      $scope.saveJobContent = function(jobCon){
        $scope.jobConData = jobCon;
        $scope.jobId = $scope.jobConData.id;
        var jobConUrl = api_url + 'JobOtherContents/'+ $scope.jobId;

        $http({
          method: 'PUT',
          url: jobConUrl,
          data: $scope.jobConData,
        }).then(function successCallback(response) {
          alert("Data Successfully Editted/Added");
        }, function errorCallback(error) {
          console.log(error);
          alert("Error occurred- ",error);
        });
      }

      $scope.saveJobEligibility = function(jobEli){
        $scope.jobEligibilityData = jobEli;
        $scope.jobId = $scope.jobEligibilityData.id;
        var jobEligibilityUrl = api_url + 'JobEligibilities/'+ $scope.jobId;

        $http({
          method: 'PUT',
          url: jobEligibilityUrl,
          data: $scope.jobEligibilityData,
        }).then(function successCallback(response) {
          alert("Data Successfully Editted/Added");
        }, function errorCallback(error) {
          console.log(error);
          alert("Error occurred- ",error);
        });
      }

      if($scope.id!=0){
        $http({
          method: 'GET',
          url: api_url + "Jobs",
          params: {"filter":{"where":{"id":$scope.id}}}
          }).then(function successCallback(response) {
            $scope.jobsData = response.data;
            $scope.job = $scope.jobsData[0];
          }, function errorCallback(error) {
            console.log(error);
          });

        $http({
          method: 'GET',
          url: api_url + "JobPostDetails",
          params: {"filter":{"where":{"jobId":$scope.id}}}
          }).then(function successCallback(response) {
            $scope.jobPostDetail = response.data;
          }, function errorCallback(error) {
            console.log(error);
          });

          $http({
          method: 'GET',
          url: api_url + "JobLifecycles",
          params: {"filter":{"where":{"jobId":$scope.id}}}
          }).then(function successCallback(response) {
            $scope.jobLifecycleData = response.data;
          }, function errorCallback(error) {
            console.log(error);
          });

          $http({
          method: 'GET',
          url: api_url + "JobFilters",
          params: {"filter":{"where":{"jobId":$scope.id}}}
          }).then(function successCallback(response) {
            $scope.jobFilterData = response.data;
            $scope.jobFilter = $scope.jobFilterData[0];
          }, function errorCallback(error) {
            console.log(error);
          });

          $http({
          method: 'GET',
          url: api_url + "JobEligibilities",
          params: {"filter":{"where":{"jobId":$scope.id}}}
          }).then(function successCallback(response) {
            $scope.jobEligibilityData = response.data;
          }, function errorCallback(error) {
            console.log(error);
          });

          $http({
          method: 'GET',
          url: api_url + "JobLocations",
          params: {"filter":{"where":{"jobId":$scope.id},"include":{"relation":"location","scope":{"fields":["locationName"]}}}}
          }).then(function successCallback(response) {
            $scope.jobLoc = response.data;
          }, function errorCallback(error) {
            console.log(error);
          });

          $http({
          method: 'GET',
          url: api_url + "JobTags",
          params: {"filter":{"where":{"jobId":$scope.id}}}
          }).then(function successCallback(response) {
            $scope.jobTags = response.data;
          }, function errorCallback(error) {
            console.log(error);
          });

          $http({
          method: 'GET',
          url: api_url + "JobReferences",
          params: {"filter":{"where":{"jobId":$scope.id}}}
          }).then(function successCallback(response) {
            $scope.jobReferences = response.data;
          }, function errorCallback(error) {
            console.log(error);
          });

          $http({
          method: 'GET',
          url: api_url + "JobOtherContents",
          params: {"filter":{"where":{"jobId":$scope.id}}}
          }).then(function successCallback(response) {
            $scope.jobContents = response.data;
          }, function errorCallback(error) {
            console.log(error);
          });

          $http({
          method: 'GET',
          url: api_url + "JobLanguageTests",
          params: {"filter":{"where":{"jobId":$scope.id}}}
          }).then(function successCallback(response) {
            $scope.jobLanguage = response.data;
          }, function errorCallback(error) {
            console.log(error);
          });
      }

}]);

angular.module('mockbank')
.controller('HtmlController', ['$scope','$http','$state', function ($scope, $http, $state) {

      $scope.editText = "";
    
}]);

