app.directive('candidateInfo', ['MATCH', function(MATCH) {
  return {
    restrict: 'EA',
    scope: {
      info: '='
    },
    templateUrl: 'js/directives/candidateInfo.html',
    link: function(scope, element, attrs) {
      scope.info["match_numerator"]   = MATCH.NUMERATOR_INIT;
      scope.info["match_denominator"] = MATCH.DENOMINATOR_INIT;
      // console.log( scope.$parent.candidates[0] );
      
      scope.$watchGroup([
        function() { return scope.info["match_numerator"]; },
        function() { return scope.info["match_denominator"]; } ],
        function() {
          var ratio =
            scope.info["match_numerator"] / scope.info["match_denominator"];
          console.log( scope.info.name + ', ratio: ' + ratio );
          var queryResult = element[0].querySelector('.bar');
          var wrappedQueryResult = angular.element(queryResult);
          wrappedQueryResult.css('width', (ratio*100).toString() + '%');
        }
      );
    }
  }
}]);