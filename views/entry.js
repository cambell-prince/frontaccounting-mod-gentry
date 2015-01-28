'use strict';

angular.module('gentry.entry',
    [
      'ui.grid',
      'ui.grid.edit',
    ])
  .controller('EntryCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.gridOptions = {};

    $scope.gridOptions.columnDefs = [
      { name: 'id', enableCellEdit: false },
      { name: 'date', displayName: 'Date' , width:'110', type: 'date', cellFilter: 'date:"yyyy-MM-dd"'},
      { name: 'name', displayName: 'Name of Other Party' },
      { name: 'code' },
      { name: 'reference' },
      { name: 'particulars' },
      { name: 'debit' },
      { name: 'credit' },
      { name: 'balance' },
      { name: 'type' },
      { name: 'party' }
    ];

    $scope.msg = {};

    $scope.gridOptions.onRegisterApi = function(gridApi) {
       //set gridApi on scope
       $scope.gridApi = gridApi;
       gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
         $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
         $scope.$apply();
       });
     };

    $http.get('assets/500_complex.json')
    .success(function(data) {
      for(i = 0; i < data.length; i++){
        data[i].date = new Date(data[i].registered);
        data[i].registered = new Date(data[i].registered);
        data[i].gender = data[i].gender==='male' ? 1 : 2;
        if (i % 2) {
          data[i].pet = 'fish'
          data[i].foo = {bar: [{baz: 2, options: [{value: 'fish'}, {value: 'hamster'}]}]}
        }
        else {
          data[i].pet = 'dog'
          data[i].foo = {bar: [{baz: 2, options: [{value: 'dog'}, {value: 'cat'}]}]}
        }
      }
      //$scope.gridOptions.data = data;
    });

    $scope.onTest = function() {
      console.log('test');
    };

  }])
  .filter('mapGender', function() {
    var genderHash = {
      1: 'male',
      2: 'female'
    };

    return function(input) {
      if (!input){
        return '';
      } else {
        return genderHash[input];
      }
    };
  })
  ;
