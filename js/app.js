var app = angular
            .module('VoteApp', ['ngAnimate'])
            .constant('ANSWERS', {
              'YES'  : 5,
              'NO'   : 1,
              'SKIP' : 0,
              'NONE' :-1
            })
            .constant('MATCH', {
              'NUMERATOR_INIT'   : 0,
              'DENOMINATOR_INIT' : 8
            });