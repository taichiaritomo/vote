app.controller('MainController', [
  '$scope',
  '$timeout',
  
  function($scope, $timeout) {
  
    // issueID is index in scope.issues array
    $scope.issues = [
      {
        "name": 'Environment',
        "selected": false,
        "questions": [ 3, 5 ]        // array of questionID's that are related to issues
        // icon: imageurl
      },
      {
        name: 'Immigration',
        selected: false,
        questions: [ 6, 7, 8 ]
      },
      {
        name: 'Civil Rights',
        selected: false,
        questions: [ 0 ]
      },
      {
        name: 'Economy',
        selected: false,
        questions: [ 1, 2, 3, 4 ]
      },
      {
        name: 'Education',
        selected: false,
        questions: [ 1 ]
      },
      {
        name: 'Health Care',
        selected: false,
        questions: []
      }
    ];

    // questionID is index in scope.questions array
    $scope.questions = [
      {
        completed: false,
        text: 'Should same-sex marriage be legalized across the country?',
        relevancy: 1
      },
      {
        completed: false,
        text: 'Should taxes be raised for higher-paid Americans?',
        relevancy: 1
      },
      {
        completed: false,
        text: 'Q2',
        relevancy: 1
      },
      {
        completed: false,
        text: 'Should we invest in renewable energy projects at the expense of investing in nonrenewable energy projects?',
        relevancy: 1
      },
      {
        completed: false,
        text: 'Q4',
        relevancy: 1
      },
      {
        completed: false,
        text: 'Q5',
        relevancy: 1
      },
      {
        completed: false,
        text: 'Q6',
        relevancy: 1
      },
      {
        completed: false,
        text: 'Q7',
        relevancy: 1
      },
      {
        completed: false,
        text: 'Q8',
        relevancy: 1
      }
    ];

    $scope.display_questions = [];

    // Index in display_questions following the last completed question.
    $scope.refresh_index = 0;

    $scope.updateRefresh_index = function() {
      var last_completed_question_index = -1; // index in display_questions of last completed question
      for ( var i = 0; i < $scope.display_questions.length; i++ ) {
        if ($scope.questions[ $scope.display_questions[i] ].completed) {
          last_completed_question_index = i;
        }
      }
      $scope.refresh_index = last_completed_question_index + 1;
    };

    $scope.toggleIssue = function(issue) {
      issue.selected ? $scope.removeIssue(issue) : $scope.addIssue(issue);
//      $scope.getQuestions();
    };

    $scope.addIssue = function(issue) {
      issue.selected = true;
      for ( var i = 0; i < issue.questions.length; i++ ) {
        var q = issue.questions[i];
        $scope.questions[q].relevancy += 1;
      }
    };

    $scope.removeIssue = function(issue) {
      issue.selected = false;
      for ( var i = 0; i < issue.questions.length; i++ ) {
        var q = issue.questions[i];
        $scope.questions[q].relevancy -= 1;
      }
    };

    $scope.getQuestions = function() {
      var new_questions = [];
      for ( var i = 0; i < $scope.questions.length; i++ ) {
        var q = $scope.questions[i];
        if (q.relevancy > 0 && !q.completed) {
          new_questions.push(i);
        }
      }
      new_questions = new_questions.sort($scope.relevanceCompare);

      if (new_questions.length > 5) { new_questions = new_questions.slice(0,5); }

      // add new_questions to display_questions at refresh_index
      $scope.updateRefresh_index();
      console.log( 'Refreshing Questions to display at ' + $scope.refresh_index );
      $scope.display_questions = $scope.display_questions.slice(0,$scope.refresh_index);
      timer = $timeout( function() {$scope.display_questions = $scope.display_questions.concat(new_questions);}, 250 );
    };

    // compare function for sorting selected questiosn by relevancy
    $scope.relevanceCompare = function(q1, q2) {
      return $scope.questions[q2].relevancy - $scope.questions[q1].relevancy;
    };
    
    $scope.candidates = [
      {
        name: 'Bernie Sanders',
        pic: 'img/Bernie_Sanders_icon.png',
        positions: [5, 1, 5, 5, 0, 0, 0, 0, 0],
        color: 'mediumslateblue'
      },
      {
        name: 'Hillary Clinton',
        pic: 'img/Hillary_Clinton_icon.png',
        positions: [5, 5, 2, 3, 0, 0, 0, 0, 0],
        color: 'mediumslateblue'
      },
      {
        name: 'Marco Rubio',
        pic: 'img/Marco_Rubio_icon.png',
        positions: [2, 3, 3, 2, 0, 0, 0, 0, 0],
        color: 'darkgoldenrod'
      },
      {
        name: 'Scott Walker',
        pic: 'img/Scott_Walker_icon.png',
        positions: [0, 1, 1, 1, 0, 0, 0, 0, 0],
        color: 'darkgoldenrod'
      }
    ];
    
    $scope.tinted = true;
    
    $scope.doneIssues = function() {
      var view = angular.element(document.getElementsByClassName('main'));
      view.css('left', '-35vw');
      $scope.tinted = false;
      var cand = angular.element(document.getElementsByClassName('candidates'));
      cand.css('display', 'block');
      timer = $timeout( function(){$scope.getQuestions();}, 300 );
    }
    
    $scope.showIssues = function() {
      var view = angular.element(document.getElementsByClassName('main'));
      view.css('left', '0');
      $scope.tinted = true;
      var cand = angular.element(document.getElementsByClassName('candidates'));
      timer = $timeout( function(){ cand.css('display', 'none'); }, 250 );
    }
    
    $scope.nudgeRight = false;
    $scope.nudgeLeft = false;
    
  }
]);