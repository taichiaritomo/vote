app.directive('questionInfo', ['CONSTANTS', function(CONSTANTS) {
  return {
    restrict: 'E',
    scope: {
      index: '='
    },
    templateUrl: 'js/directives/questionInfo.html',
    link: function(scope, element, attrs) {
      
      // question selector
      scope.question             = scope.$parent.questions[scope.index];
      
      // retrieve top of answer stack
      scope.top = function() {
        if (scope.question.stack.length > 0) {
          return scope.question.stack[scope.question.stack.length - 1];
        } else {
          return false;
        }
      }
      
      // function to update score (or ratio) for each candidates
      scope.updateScore = function(answer, operator) {
        if (!answer) {
          return false;
        }
        for (var i = 0; i < scope.$parent.candidates.length; i++) {
          var pointChange = 0;
          if (answer == scope.question.candidatePositions[i].toUpperCase()) {
            pointChange += CONSTANTS.POINT;
            if (answer == scope.question.candidatePositions[i]) {
              pointChange += scope.$parent.candidates[i].promisePoint;
            }
            scope.$parent.candidates[i].ratio = operator(scope.$parent.candidates[i].ratio, pointChange);
          }
        }
      }
      
      // update candidate score ratios
      scope.$watch(
        function() { return scope.top(); },
        function(new_ans, old_ans) {
          if (old_ans != new_ans) {
            scope.updateScore(old_ans, function(a, b) { return a - b; });
          }
          scope.updateScore(new_ans, function(a, b) { return a + b; });
        }
      );
      
      /*=============================== UI ===============================*/
      
      // answer (ans) can be (Y)es, (N)o, or (S)kip
      scope.answer = function(ans) {
        if (!scope.top()) {
          scope.question.stack.push(ans);
        } else if (scope.top() == ans) {
          scope.question.stack.pop();
        } else if (scope.top() != ans) {
          var old_ans = scope.question.stack.pop();
          scope.question.stack.push(ans);
        }
      }
      
      // skip or unskip
      scope.skip = function() {
        if (scope.top() != 'S') { // not skipped yet
          scope.question.stack.push('S');
        } else {
          scope.question.stack.pop();
        }
      }
      
    }
  }
}]);