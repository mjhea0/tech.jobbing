app.controller('jobsCtrl', ['$scope', '$auth', '$location', '$http', '$uibModal', 'jobDetailService', function ($scope, $auth, $location, $http, $uibModal, jobDetailService) {

  $scope.craigslistData = [];

  var scrapedData = [];

  $scope.searchCraigsList = function () {
    $http.get('/scrape')
        .success(function(data) {
            scrapedData = data;
            limitCraig();
        })
        .error(function(err) {
            console.log(err, 'error');
        });
  };

  // helper function to remove the "found more jobs near denver" links...
  var rawCraigData = [];
  var limitCraig = function () {
      for (var i = 0; i < 60; i ++) {
          rawCraigData.push(scrapedData[i]);
      }
      formatCraig();
  };

  // helper function that takes title and url frag & pushes them into array as a mapped object
  var formatCraig = function () {
      for (var i = 0; i < 60; i ++) {
          // total length of each string. url is always 18 characters, soo...
          var title = rawCraigData[i].slice(0, (rawCraigData[i].length - 20));
          var urlFrag = rawCraigData[i].slice((rawCraigData[i].length - 20), rawCraigData[i].length);
          $scope.craigslistData.push({
              title: title,
              url: 'https://denver.craigslist.org' + urlFrag
          });
      }
  };

  // function to post to the backend the url and bring back some scraped data of the job detail page.

  $scope.searchDetail = function () {
      var payload = {url: this.job.url};
      $http.post('/detail', payload)
          .success(function (data) {
              jobDetailService.jobDetail = data;
              console.log(jobDetailService.jobDetail, 'service');
          })
          .error(function (err) {
              console.log(err, " error");
          });
  };


  $scope.openModal = function () {
      var modalInstance = $uibModal.open({
         templateUrl: 'partials/modalTemplate.html',
         controller: 'modalCtrl',
         size: 'lg',
         backdrop: 'static'
       });
   };


}]);
