var app = angular
            .module('VoteApp', ['ngAnimate'])
            .constant('CONSTANTS', {
              'POINT' : 0.1,
              'PROMISE_DIVIDEND' : 0.3,
              'RATIO_INIT'   : 0.1
            })
            .filter('parseHTML', function($sce) {
              return function(val) {
                return $sce.trustAsHtml(val);
              }
            });
//            .animation('.question-animation', [function() {
//              return {
//                enter: function(element, done) {
//                  Velocity(element, "fadeIn", 250);
//                  done();
//                },
//                leave: function(element, done) {
//                  Velocity(element, "fadeOut", 250);
//                  done();
//                }
//              }
//            }]);