app.directive('candidateInfo', ['CONSTANTS', function(CONSTANTS) {
  return {
    restrict: 'EA',
    scope: {
      info: '='
    },
    templateUrl: 'js/directives/candidateInfo.html',
    link: function(scope, element, attrs) {
      
      // default ratio
      scope.info.ratio = CONSTANTS.RATIO_INIT;
      
      scope.getPromisePoint = function() {
        scope.counter = 0;
        for (var i = 0; i < scope.$parent.questions.length; i++) {
          var candPos = scope.$parent.questions[i].candidatePositions;
          if (candPos[scope.info.id] == 'N' || candPos[scope.info.id] == 'Y') {
            scope.counter++;
          }
        }
        return CONSTANTS.PROMISE_DIVIDEND / scope.counter;
      }
      
      scope.info.promisePoint = scope.getPromisePoint();
      
      scope.$watch(
        function() { return scope.info.ratio; },
        function() {
          var queryResult = element[0].querySelector('.bar');
          var wrappedQueryResult = angular.element(queryResult);
          wrappedQueryResult.css('width', (scope.info.ratio*100).toString() + '%');
        }
      );
    }
  }
}]);