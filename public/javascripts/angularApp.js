var app = angular.module('AsmPortal', ['ui.router','ngMaterial','md.data.table','ngMessages']);

app.config(['$stateProvider','$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('index', {
    url: '/index',
    templateUrl: 'index.html',
    controller: 'MainCtrl',

  });

    $urlRouterProvider.otherwise('index');
  }]);

app.controller('MainCtrl', ['$scope', '$mdToast','$http','$interval','$mdDialog', function($scope,$mdToast,$http,$interval,$mdDialog){

    $scope.isapmavailable = true;
    $scope.isserveravailable = true;

    $scope.serveravailable =  function(){
      $http.get('/getserverstatus').then(function(data){
        if (data.data == "{OK}") {
          console.log("server available");
          $scope.isserveravailable = true;
        } else {
          console.log("server not available");
          $scope.isserveravailable = false;
        }
      });
    }//server available
    $scope.apmavailable =  function(){
      $http.get('/ping').then(function(data){
        if (data.data == "{OK}") {
          console.log("gtm available");
          $scope.isapmavailable = true;
        } else {
          console.log("gtm not available");
          $scope.isapmavailable = false;
        }
      });
    }//apm available
    $scope.apmavailable();
    $scope.mycall = $interval($scope.apmavailable,30000);
    $scope.serveravailable();
    $scope.mycall2 = $interval($scope.serveravailable,5000);

  //md-toast function
  showSimpleToast = function(position,message) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(message)
        .position(position )
        .hideDelay(3000)
    );
  };

  //md-dialog to push to apm
    $scope.showConfirmpush = function(ev) {

      var confirm = $mdDialog.confirm()
            .title('Disable GTM Service')
            .textContent('This will redirect traffic to Silverline')
            .ariaLabel('Redirect')
            .targetEvent(ev)
            .ok("Let's do it!")
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            //if confirm
            $scope.progressbar=false;

            return $http.get('/redirecttosilverline').then(function(data){
              if (data.data != "{KO}") {
                /*angular.copy(data.data.records,nl.networklocations);*/
                showSimpleToast('top right',"Redirect Done");
                $scope.serveravailable();
              } else {
                //something bad happened
                //get working but error code back KO
                  showSimpleToast('top right',"Cannot redirect");
              }
            }, function(data){
                // get no working ?
                showSimpleToast('top right',"Cannot Redirect");
            });



              $scope.progressbar=true;

        }, function() {
            //do nothing on cancel
          });
    }; //end confirm push
    //end md-dialog

}]); //end controller MainCtrl
