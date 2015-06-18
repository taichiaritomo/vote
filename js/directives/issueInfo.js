app.directive('issueInfo', function() {
  return {
    restrict: 'E',
    scope: {
      info: '='
    },
    templateUrl: 'js/directives/issueInfo.html'
  };
});