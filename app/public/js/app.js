var app = angular.module('app', []);
app.controller('main',['$scope','$http', function($scope, $http) {
    $scope.appData = {};
    $scope.appData.name = "myPlayList";
    $scope.appData.trackList = [];
    
    $http({
        method: 'GET',
        url: '/listTrack'
    })
    .then(function(tracks) {
        
        if(tracks && 
           tracks.data && 
           Array.isArray(tracks.data)) {
            tracks.data.forEach(function(ele, index) {
                $scope.appData.trackList.push(ele);
            });
        }
    })
    .catch(function(err) {
        console.log(err);
    });
    
    $scope.setCurrentTrack = function(index) {
        $scope.appData.currentTrack = $scope.appData.trackList[index];
    };
    
}]);