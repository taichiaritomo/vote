app.directive('questionInfo', ['ANSWERS', function(ANSWERS) {
  return {
    restrict: 'E',
    scope: {
      index: '='
    },
    templateUrl: 'js/directives/questionInfo.html',
    link: function(scope, element, attrs) {
      
      scope.yes  = ANSWERS.YES;
      scope.no   = ANSWERS.NO;
      scope.skip = ANSWERS.SKIP;
      
      scope.question             = scope.$parent.questions[scope.index];
      scope.question.user_answer = ANSWERS.SKIP; // add new key to question
      
      scope.answer = function(ans) {
        if ( scope.question.user_answer != ans ) {
          scope.question.user_answer = ans;
          scope.question.completed = true;
        } else if ( scope.question.user_answer == ans ) {
          scope.question.user_answer = ANSWERS.SKIP;
          scope.question.completed = false;
          // unanswer question...
        }
      };
      
      scope.skipped = false;
      
      scope.skip = function() {
        if (scope.question.user_answer != ANSWERS.SKIP) {
          scope.question.user_answer = ANSWERS.SKIP;
        } else {
          // skip for the first time / unskip
          scope.question.completed = !scope.question.completed;
        }
        
        // skip animation
        var newWidth = (scope.skipped ? '0' : '100%');
        scope.skipped = !scope.skipped;
        
//        var queryResult = element[0].querySelector('.bar.skip.left');
//        var wrappedQueryResult = angular.element(queryResult);
//        wrappedQueryResult.css('width', newWidth);
//        
//        queryResult = element[0].querySelector('.bar.skip.right');
//        wrappedQueryResult = angular.element(queryResult);
//        wrappedQueryResult.css('width', newWidth);
      };
      
      scope.$watch(
        function() { return scope.question.user_answer; },
        function( new_ans, old_ans ) {
          for (var i = 0; i < scope.$parent.candidates.length; i++) {
            var cand_ans = scope.$parent.candidates[i]["positions"][scope.index];
            if (cand_ans != 0) {
              if (old_ans == 0 && new_ans != 0) {
                scope.$parent.candidates[i]["match_numerator"] +=
                  (scope.yes - 1) - Math.abs(cand_ans - new_ans);
                scope.$parent.candidates[i]["match_denominator"] += scope.yes - 1;
                console.log('new answer');
              } else if (old_ans != 0 && new_ans != 0) {
                scope.$parent.candidates[i]["match_numerator"] +=
                  Math.abs(cand_ans - old_ans) - Math.abs(cand_ans - new_ans);
                console.log('changed answer');
              } else if (old_ans != 0 && new_ans == 0) {
                scope.$parent.candidates[i]["match_numerator"] -=
                  (scope.yes - 1) - Math.abs(cand_ans - old_ans);
                scope.$parent.candidates[i]["match_denominator"] -= scope.yes - 1;
                console.log('removed answer');
              }
            }
          }
        }
      );
      
      scope.highlighted = false;
      
      scope.highlight = function() {
        var newWidth = (scope.highlighted ? '0' : '100%');
        scope.highlighted = !scope.highlighted;
        var queryResult = element[0].querySelector('.highlight-left-bar');
        var wrappedQueryResult = angular.element(queryResult);
        wrappedQueryResult.css('width', newWidth);
        
        queryResult = element[0].querySelector('.highlight-right-bar');
        wrappedQueryResult = angular.element(queryResult);
        wrappedQueryResult.css('width', newWidth);
      }
      
    }
  }
}]);