app.controller('MainController', [
  '$scope',
  '$timeout',
  '$document',
  
  function($scope, $timeout, $document) {
  
    // issueID is index in scope.issues array
    $scope.issues = [
      {
        "name": 'Race Relations',
        "questions": []
      },
      {
        "name": 'Labor',
        "questions": []
      },
      {
        "name": 'Income Distribution',
        "questions": []
      },
      {
        "name": 'Foreign Affairs',
        "questions": []
      },
      {
        "name": 'Environment',
        "questions": [ 3, 5 ]        // array of questionID's that are related to issues
      },
      {
        "name": 'Immigration',
        "questions": [ 6, 7, 8 ]
      },
      {
        "name": 'Civil Rights',
        "questions": [ 0 ]
      },
      {
        "name": 'Economy',
        "questions": [ 1, 2, 3, 4 ]
      },
      {
        "name": 'Education',
        "questions": [ 1 ]
      },
      {
        "name": 'Health Care',
        "questions": []
      }
    ];

    // questionID is index in scope.questions array
    $scope.questions = [
      {
        text: 'Should same-sex marriage be revoked?',
        description: 'While some argue that and that the rights, inside the Congress, while we stand on religious tolerance',
        relevancy: 1,
        stack: [],
        candidatePositions: ['n', 'n', 'y', 'y']
      },
      {
        text: 'Should taxes be raised for higher-paid Americans?',
        description: 'Some research shows that increased regulation has not helped to curb banking practices. Others argue that the right kind of regulation is necessary and that',
        relevancy: 1,
        stack: [],
        candidatePositions: ['Y', 'y', 'n', 'x']
      },
      {
        text: 'Q2',
        relevancy: 1,
        stack: [],
        candidatePositions: ['y', 'x', 'N', 'y']
      },
      {
        text: 'Should we invest in renewable energy projects at the expense of investing in nonrenewable energy projects?',
        description: 'Many proponents of non-renewable energy projects argue that they create jobs while renewable energy projects, while good, can often take too long to develop useful solutions.',
        relevancy: 1,
        stack: [],
        candidatePositions: ['Y', 'y', 'x', 'n']
      },
      {
        text: 'Q4',
        relevancy: 1,
        stack: [],
        candidatePositions: ['n', 'N', 'y', 'Y']
      },
      {
        text: 'Q5',
        relevancy: 1,
        stack: [],
        candidatePositions: ['x', 'n', 'y', 'x']
      },
      {
        text: 'Q6',
        relevancy: 1,
        stack: [],
        candidatePositions: ['y', 'n', 'N', 'y']
      },
      {
        text: 'Q7',
        relevancy: 1,
        stack: [],
        candidatePositions: ['N', 'y', 'y', 'n']
      },
      {
        text: 'Q8',
        relevancy: 1,
        stack: [],
        candidatePositions: ['x', 'n', 'x', 'y']
      }
    ];

    $scope.display_questions = [];

    // Index in display_questions following the last completed question.
    $scope.refresh_index = 0;

    $scope.updateRefresh_index = function() {
      var last_completed_question_index = -1; // index in display_questions of last completed question
      for ( var i = 0; i < $scope.display_questions.length; i++ ) {
        if ($scope.questions[ $scope.display_questions[i] ].stack.length > 0) {
          last_completed_question_index = i;
        }
      }
      $scope.refresh_index = last_completed_question_index + 1;
    };

    $scope.toggleIssue = function(issue) {
      issue.selected ? $scope.removeIssue(issue) : $scope.addIssue(issue);
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
        if (q.stack.length==0) {
          new_questions.push(i);
        }
      }
      new_questions = new_questions.sort($scope.relevanceCompare);
      
      if (new_questions.length > 10) { new_questions = new_questions.slice(0,10); }

      // add new_questions to display_questions at refresh_index
      $scope.updateRefresh_index();
      console.log( 'Refreshing Questions to display at index ' + $scope.refresh_index );
      $scope.display_questions = $scope.display_questions.slice(0,$scope.refresh_index);
      timer = $timeout( function() {
        $scope.display_questions = $scope.display_questions.concat(new_questions);
      }, 250 );
    };

    // compare function for sorting selected questiosn by relevancy
    $scope.relevanceCompare = function(q1, q2) {
      return $scope.questions[q2].relevancy - $scope.questions[q1].relevancy;
    };
    
    $scope.candidates = [
      {
        id: 0,
        name: 'Bernie Sanders',
        pic: 'img/Bernie_Sanders_icon.png',
        positions: [5, 1, 5, 5, 0, 0, 0, 0, 0],
        color: 'mediumslateblue',
        link: '<a href="berniesanders.com">www.berniesanders.com</a>'
      },
      {
        id: 1,
        name: 'Hillary Clinton',
        pic: 'img/Hillary_Clinton_icon.png',
        positions: [5, 5, 2, 3, 0, 0, 0, 0, 0],
        color: 'mediumslateblue'
      },
      {
        id: 2,
        name: 'Marco Rubio',
        pic: 'img/Marco_Rubio_icon.png',
        positions: [2, 3, 3, 2, 0, 0, 0, 0, 0],
        color: 'darkgoldenrod'
      },
      {
        id: 3,
        name: 'Scott Walker',
        pic: 'img/Scott_Walker_icon.png',
        positions: [0, 1, 1, 1, 0, 0, 0, 0, 0],
        color: 'darkgoldenrod'
      }
    ];
    
    $scope.nudgeRight = false;
    $scope.nudgeLeft = false;
    
    $scope.topicsOn = false;
    $scope.topicsButtonText = "TOPICS";
    
    $scope.toggleTopics = function() {
      $scope.topicsOn = !$scope.topicsOn;
      var blanket = document.querySelector(".blanket");
      var selector = document.querySelector(".selector");
      if ($scope.topicsOn) {
        $scope.topicsButtonText = "Done";
        document.getElementById("search").focus();
        Velocity(blanket, "fadeIn", 250);
        Velocity(selector, {'max-height': '400px'}, 250);
      } else {
        $scope.getQuestions();
        timer = $timeout( function(){ $scope.topicsButtonText = "TOPICS"; }, 250 );
        Velocity(blanket, "fadeOut", 250);
        Velocity(selector, {'max-height': '50px'}, 250);
      }
    }
    
    
    
    $scope.removeEventHandler = function(elem,eventType,handler) {
      if (elem.removeEventListener) {
        elem.removeEventListener (eventType,handler,false);
      } else if (elem.detachEvent) {
        elem.detachEvent ('on'+eventType,handler);
      }
    }
    
    var landing = document.querySelector(".landing");
    
    $scope.pageEntered = false;
    $scope.fixCandidates = false;
    
    $scope.enterPage = function() {
      $scope.pageEntered = true;
      var evt = window.event || e;
      var delta = evt.detail ? evt.detail*(-1) : evt.wheelDelta;
      if (delta < 0) {
        $scope.$apply(function() {
          Velocity(document.querySelector(".landing"), {'margin-top':'-100vh'}, {duration: 750, easing: "ease-in-out"});
          Velocity(document.querySelector(".main"), {'padding-top':0}, {duration: 900, easing: "ease-in-out"});
          Velocity(document.querySelector("#ballot"), {bottom: '-400px'}, {duration: 200});
          timer = $timeout( function() {
            $scope.getQuestions();
            landing.style.display="none";
            document.querySelector(".topics-container").style.position = 'fixed';
            $scope.adjustFlex();
            var outer = document.querySelector('.outer');
            var wrappedQueryResult = angular.element(outer);
            wrappedQueryResult.addClass('normal');
            angular.element(document.querySelector('.footer')).css('display', 'block');
          }, 900);
          
          $scope.removeEventHandler(landing, mousewheelevt, $scope.enterPage);
          $scope.removeEventHandler(landing, 'click', $scope.enterPage);
        });
      }
    }
    
    var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";
    
    if (landing.attachEvent) {//if IE (and Opera depending on user setting)
      landing.attachEvent('on'+mousewheelevt, $scope.enterPage);
      landing.attachEvent('onclick', $scope.enterPage);
    } else if (landing.addEventListener) { //WC3 browsers
      landing.addEventListener(mousewheelevt, $scope.enterPage, false);
      landing.addEventListener('click', $scope.enterPage, false);
    }
    
    $scope.flex = false;
    
    $scope.adjustFlex = function() {
      console.log("adjust called");
      $scope.$apply( function() {
        var w = document.body.clientWidth;
        if (w >= 960) {
          var newWidth = (w - 350) + 'px';
          document.querySelector('.topics-container').style.width = newWidth;
          document.querySelector('.questions').style.width = newWidth;
          document.querySelector('.footer').style.width = newWidth;
          document.querySelector('.candidates').style.width = '350px';
          document.querySelector('.candidates .column').style.height = '100vh';
          if ($scope.pageEntered) {     
            var candidates = document.querySelector('.candidates');
            var wrappedQueryResult = angular.element(candidates);
            wrappedQueryResult.addClass('fixed');
          }

        } else if (w < 960) {
          var newWidth = '100vw';
          document.querySelector('.topics-container').style.width = newWidth;
          document.querySelector('.questions').style.width = newWidth;
          document.querySelector('.footer').style.width = newWidth;
          document.querySelector('.candidates').style.width = '100vw';
          document.querySelector('.candidates .column').style.height = 'auto';
          var candidates = document.querySelector('.candidates');
          var wrappedQueryResult = angular.element(candidates);
          wrappedQueryResult.removeClass('fixed');
        }
      });
    }
    
    window.onload = $scope.adjustFlex;
    window.addEventListener('resize', $scope.adjustFlex);
    
  }
]);