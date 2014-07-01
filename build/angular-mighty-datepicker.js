(function() {
  angular.module("mightyDatepicker", ['pasvaz.bindonce']);

  angular.module("mightyDatepicker").directive("mightyDatepicker", function($compile) {
    var options, pickerTemplate;
    pickerTemplate = "<div class=\"mighty-picker__wrapper\">\n  <button ng-click=\"moveMonth(-1)\"><<</button>\n  <div class=\"mighty-picker__month\" bindonce ng-repeat=\"month in months track by $index\">\n    <div class=\"mighty-picker__month-name\" ng-bind=\"month.name\"></div>\n    <table class=\"mighty-picker__calendar\">\n      <tr>\n        <th bindonce ng-repeat=\"day in month.weeks[1]\" class=\"mighty-picker__calendar-weekday\" bo-text=\"day.date.format('dd')\">\n        </th>\n      </tr>\n      <tr bindonce ng-repeat=\"week in month.weeks\">\n        <td\n            bo-class='{\n              \"mighty-picker__calendar-day\": day,\n              \"mighty-picker__calendar-day-selected\": day.selected,\n              \"mighty-picker__calendar-day-disabled\": day.disabled,\n              \"mighty-picker__calendar-day-start\": day.start\n            }'\n            ng-repeat=\"day in week track by $index\" ng-click=\"select(day)\">\n            <div class=\"mighty-picker__calendar-day-wrapper\" bo-text=\"day.date.date()\"></div>\n        </td>\n      </tr>\n    </table>\n  </div>\n  <button ng-click=\"moveMonth(1)\">>></button>\n</div>";
    options = {
      mode: "simple",
      after: null,
      before: null,
      months: 1
    };
    return {
      restrict: "AE",
      replace: true,
      template: '<div class="mighty-picker__holder"></div>',
      scope: {
        model: '=ngModel',
        options: '='
      },
      link: function($scope, $element, $attrs) {
        var _bake, _build, _buildMonth, _buildWeek, _prepare, _setup;
        _bake = function() {
          var domEl;
          domEl = $compile(angular.element(pickerTemplate))($scope);
          return $element.append(domEl);
        };
        _buildWeek = function(time, month) {
          var days, start;
          days = [];
          start = time.startOf('week');
          days = [0, 1, 2, 3, 4, 5, 6].map(function(d) {
            var day;
            day = moment(start).add('days', d);
            return {
              date: day,
              selected: $scope.model && day.isSame($scope.model, 'day') && day.month() === month,
              disabled: day.month() !== month
            };
          });
          return days;
        };
        _buildMonth = function(time) {
          var calendarEnd, calendarStart, start, w, weeks, weeksInMonth;
          weeks = [];
          calendarStart = moment(time).startOf('month');
          calendarEnd = moment(time).endOf('month');
          weeksInMonth = calendarEnd.week() - calendarStart.week();
          if (weeksInMonth < 0) {
            weeksInMonth = (calendarStart.weeksInYear() - calendarStart.week()) + calendarEnd.week();
          }
          start = time.startOf('month');
          weeks = (function() {
            var _i, _results;
            _results = [];
            for (w = _i = 0; 0 <= weeksInMonth ? _i <= weeksInMonth : _i >= weeksInMonth; w = 0 <= weeksInMonth ? ++_i : --_i) {
              _results.push(_buildWeek(moment(start).add('weeks', w), moment(start).month()));
            }
            return _results;
          })();
          return {
            weeks: weeks,
            name: time.format("MMMM YYYY")
          };
        };
        _setup = function() {
          var attr, start, v, _ref;
          if ($scope.options) {
            _ref = $scope.options;
            for (attr in _ref) {
              v = _ref[attr];
              options[attr] = $scope.options[attr];
            }
          }
          $scope.options = options;
          switch ($scope.options.mode) {
            case "multiple":
              break;
            default:
              if ($scope.model) {
                start = moment($scope.model);
              }
              return $scope.options.start = $scope.options.start || start || moment().startOf('day');
          }
        };
        _prepare = function() {
          var m;
          $scope.months = [];
          return $scope.months = (function() {
            var _i, _ref, _results;
            _results = [];
            for (m = _i = 0, _ref = $scope.options.months; 0 <= _ref ? _i < _ref : _i > _ref; m = 0 <= _ref ? ++_i : --_i) {
              _results.push(_buildMonth(moment($scope.options.start).add('months', m)));
            }
            return _results;
          })();
        };
        _build = function() {
          _prepare();
          return _bake();
        };
        $scope.moveMonth = function(step) {
          $scope.options.start.add('month', step);
          _prepare();
        };
        $scope.select = function(day) {
          $scope.model = day.date;
          return _prepare();
        };
        _setup();
        return _build();
      }
    };
  });

}).call(this);
