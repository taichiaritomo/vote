$(document).ready(function() {
  
  // Function to expand and collapse issues menu
  var showMore = false;
  $('#show-more').click(function () {
    if (!showMore) {
      $('.issues-menu.collapse')
        .animate({ height: '100%' }, 500);
      $('#show-more').html('Show Less Issues');
    } else {
      $('.issues-menu.collapse')
        .animate({ height: '125px' }, 500);
      $('#show-more').html('Show More Issues');
    }
    showMore = !showMore;
  });
  
  $('.info-button').click(function () {
    $(this).parent().siblings('.info').slideToggle(250);
  });
    
  // FOR TESTING... Actual arrays will be constructed from csv
  
  /****************************************************************************
  ISSUES AND QUESTIONS
  ****************************************************************************/
  
  var issues = [
    "Environment",
    "Immigration",
    "Civil Rights",
    "Economy",
    "Education",
    "Health Care"
  ];
  
  // Initialize array of issues' selected status
  var selected_issues = [],
      i = 0;
  while (i < issues.length) {
    selected_issues[i++] = false;
  }

  // Array indexed by issue-ID, with each issue referring to an array of question IDs.
  var issue2questions = [
    [ 3, 5 ],       // ISSUE 0 (Environment) relates to Questions 3, 5
    [ 6, 7, 8 ],    //       1 (Immigration) relates to Q         6, 7, 8
    [ 0 ],          //       2 (Civil Rights)
    [ 1, 2, 3, 4 ], //       3 (Economy) has one question in common with I-1,2,3,4
    [ 0, 1 ],
    []
  ];

  // Array indexed by question-ID to access Question text
  var questions = [
    "Q0 Civil Rights",
    "Q1 Environment, Economy",
    "Q2 Economy",
    "Q3 Environment",
    "Q4 Economy",
    "Q5 Environment",
    "Q6 Immigration",
    "Q7 Immigration",
    "Q8 Immigration"
  ];
  
  // Initiate histogram of questions related to user-chosen issues.
  var question_relevancy = [],
      i = 0;
  while (i < questions.length) {
    question_relevancy[i++] = 0;
  }
  
  // List of selected questions for the user, sorted by relevance to user's issues. 
  var selected_questions = [];
  
  var addIssue = function(issueID) {
    selected_issues[issueID] = true;
    for (var i = 0; i < issue2questions[issueID].length; i++) {
      var q = issue2questions[issueID][i];
      if (question_relevancy[q] === 0) {
        selected_questions.push(q);
      }
      question_relevancy[q]++;
    }
  };
  
  var removeIssue = function(issueID) {
    selected_issues[issueID] = false;
    for (var i = 0; i < issue2questions[issueID].length; i++) {
      var q = issue2questions[issueID][i]
      question_relevancy[q]--;
      if (question_relevancy[q] === 0) {
        var index = selected_questions.indexOf(q);
        if (index > -1) {
          selected_questions.splice(index, 1);
        }
      }
    }
  };
  
  // compare function for sorting selected questiosn by relevancy
  var relevanceCompare = function(q1, q2) {
    return question_relevancy[q2] - question_relevancy[q1]
  }
  
  $('.issue')
    .mouseover(function() {
      $(this).find('.issue-icon').css( "background-color", "green" );
  })
    .mouseout(function() {
      $(this).find('.issue-icon').css( "background-color", "darkgray" );
  })
    .click(function() {
      var issueID = parseInt($(this).attr('id').substring(6));
      if (!selected_issues[issueID]) {
        addIssue(issueID);
      } else {
        removeIssue(issueID);
      }
      alert( selected_questions.sort(relevanceCompare) );
  });
  
  /****************************************************************************
  ANSWERS AND CANDIDATE MATCHING
  ****************************************************************************/
  
  // var no = 1;
  var yes = 5;
  
//  var switchAnswer = function(ans) {
//    if (ans === yes) {
//      return 1;
//    } else if (ans === 1) {
//      return yes;
//    }
//  }
  
  // 2D array indexing candidate to question position. 1:No <--> 5:Yes, 0 means no position, unaccounted
  var candidate_positions = [
    [5, 5, 1, 5, 0, 0, 0, 0, 0], // candidate 0's positions
    [2, 1, 5, 0, 0, 0, 0, 0, 0]  // candidate 1's positions
  ];
  
  var candidate_match = [0   , 0   ]; // Candidate Match Ratio is the quantity from top array divided by the
  var candidate_total = [10, 10]; // corresponding quantity from the bottom array.
  
  // initialize array of user's answers by question. 0-unanswered, 1-No, 5-Yes
  var user_answers = [],
      i = 0;
  while (i < questions.length) {
    user_answers[i++] = 0;
  }
  
  // A method to sum the corresponding values of two given arrays
  var sumArrays = function(array1, array2) {
    return array1.map(function (num, index) {
      return num + array2[index];
    });
  }
  
  // function that updates the chart when user answers {ans} (either yes or no) for question {questionID}
  var answerQuestion = function(questionID, ans) {
    if (user_answers[questionID] === ans) {
      return false;
    } else if (user_answers[questionID] === 0) {
      user_answers[questionID] = ans;
      var diff = candidate_positions.map(function(cand) {
        return (yes - 1) - Math.abs(cand[questionID] - ans);
      });
      candidate_match = sumArrays(candidate_match, diff);
      candidate_total = candidate_total.map(function(num) {
        return num + 4;
      });
    } else if (user_answers[questionID] !== ans) {
      // NEED CODE TO RESET OR CHANGE MATCH SCORES
      var diff = candidate_positions.map(function(cand) {
        return Math.abs(cand[questionID] - user_answers[questionID]) - Math.abs(cand[questionID] - ans);
      });
      user_answers[questionID] = ans;
      candidate_match = sumArrays(candidate_match, diff);
    }
  }
  
  var updateChart = function() {
    for (var i = 0; i < candidate_match.length; i++) {
      var match_rate = candidate_match[i]/candidate_total[i],
          candidateID = '#candidate-' + i.toString(),
          barwidth = (match_rate*100).toString() + '%';
      $(candidateID).find('.bar').animate({ width : barwidth }, 300);
    }
  }
  
  $('.btn-group').click(function() {
    var button_class = $(event.target).attr('class');
    var questionID = parseInt($(this).parents().find('.question').attr('id').substring(9));
    if (button_class == 'btn btn-success btn-sm') {
      answerQuestion(questionID, yes);
    } else if (button_class == 'btn btn-danger btn-sm') {
      answerQuestion(questionID, 1);
    } else {
      // skip question
    }
    updateChart();
  });
});
