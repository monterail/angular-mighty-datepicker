(function() {
  var options, pickerTemplate;

  angular.module("mightyDatepicker", ["pasvaz.bindonce"]);

  angular.module("mightyDatepicker").directive("mightyDatepicker", [
    "$compile", function($compile) {}, pickerTemplate = "<div class=\"mighty-picker__wrapper\">\n  <button type=\"button\" class=\"mighty-picker__prev-month\"\n    ng-click=\"moveMonth(-1)\">\n    &#21E6;\n  </button>\n  <div class=\"mighty-picker__month\"\n    bindonce ng-repeat=\"month in months track by $index\">\n    <div class=\"mighty-picker__month-name\" ng-bind=\"month.name\"></div>\n    <table class=\"mighty-picker-calendar\">\n      <tr class=\"mighty-picker-calendar__days\">\n        <th bindonce ng-repeat=\"day in month.weeks[1]\"\n          class=\"mighty-picker-calendar__weekday\"\n          bo-text=\"day.date.format('dd')\">\n        </th>\n      </tr>\n      <tr bindonce ng-repeat=\"week in month.weeks\">\n        <td\n            bo-class='{\n              \"mighty-picker-calendar__day\": day,\n              \"mighty-picker-calendar__day--selected\": day.selected,\n              \"mighty-picker-calendar__day--disabled\": day.disabled,\n              \"mighty-picker-calendar__day--in-range\": day.inRange,\n              \"mighty-picker-calendar__day--marked\": day.marker\n            }'\n            ng-repeat=\"day in week track by $index\" ng-click=\"select(day)\">\n            <div class=\"mighty-picker-calendar__day-wrapper\"\n              bo-text=\"day.date.date()\"></div>\n            <div class=\"mighty-picker-calendar__day-marker-wrapper\">\n              <div class=\"mighty-picker-calendar__day-marker\"\n                ng-if=\"day.marker\"\n                ng-bind-template=\"\">\n              </div>\n            </div>\n        </td>\n      </tr>\n    </table>\n  </div>\n  <button type=\"button\" class=\"mighty-picker__next-month\"\n    ng-click=\"moveMonth(1)\">\n    &#21E8;\n  </button>\n</div>", options = {
      mode: "simple",
      months: 1,
      start: null,
      filter: void 0,
      callback: void 0,
      markerTemplate: "{{ day.marker }}",
      template: pickerTemplate,
      firstWeekDayIsMonday: 0
    }, {
      restrict: "AE",
      replace: true,
      template: '<div class="mighty-picker__holder"></div>',
      scope: {
        model: '=ngModel',
        options: '=',
        markers: '=',
        after: '=',
        before: '=',
        rangeFrom: '=',
        rangeTo: '='
      },
      link: function($scope, $element, $attrs) {
        var _bake, _build, _buildMonth, _buildWeek, _getMarker, _indexMarkers, _indexOfMoment, _isInRange, _isSelected, _prepare, _setup, _withinLimits;
        _bake = function() {
          var domEl;
          domEl = $compile(angular.element($scope.options.template))($scope);
          return $element.append(domEl);
        };
        _indexOfMoment = function(array, element, match) {
          var key, value;
          for (key in array) {
            value = array[key];
            if (element.isSame(value, match)) {
              return key;
            }
          }
          return -1;
        };
        _indexMarkers = function() {
          var marker;
          return $scope.markerIndex = $scope.markers ? (function() {
            var i, len, ref, results;
            ref = $scope.markers;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              marker = ref[i];
              results.push(marker.day);
            }
            return results;
          })() : void 0;
        };
        _withinLimits = function(day, month) {
          var withinLimits;
          withinLimits = true;
          if ($scope.before) {
            withinLimits && (withinLimits = day.isSameOrBefore($scope.before, 'day'));
          }
          if ($scope.after) {
            withinLimits && (withinLimits = day.isSameOrAfter($scope.after, 'day'));
          }
          return withinLimits;
        };
        _getMarker = function(day) {
          var ix;
          ix = _indexOfMoment($scope.markerIndex, day, 'day');
          if (ix > -1) {
            return $scope.markers[ix].marker;
          } else {
            return void 0;
          }
        };
        _isSelected = function(day) {
          switch ($scope.options.mode) {
            case "multiple":
              return _indexOfMoment($scope.model, day, 'day') > -1;
            default:
              return $scope.model && day.isSame($scope.model, 'day');
          }
        };
        _isInRange = function(day) {
          if ($scope.options.rangeMode) {
            if ($scope.options.rangeMode === "from") {
              return;
              return moment.range($scope.model, $scope.before).contains(day) || day.isSame($scope.before, 'day');
            } else {
              return;
              return moment.range($scope.after, $scope.model).contains(day) || day.isSame($scope.after, 'day');
            }
          } else {
            return false;
          }
        };
        _buildWeek = function(time, month) {
          var days, filter, start, week;
          days = [];
          filter = true;
          start = time.startOf('week');
          week = $scope.options['firstWeekDayIsMonday'] ? [1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 5, 6];
          days = week.map(function(d) {
            var day, withinLimits, withinMonth;
            day = moment(start).add(d, 'days');
            withinMonth = day.month() === month;
            withinLimits = _withinLimits(day, month);
            if ($scope.options.filter) {
              filter = $scope.options.filter(day);
            }
            return {
              date: day,
              selected: _isSelected(day) && withinMonth,
              inRange: _isInRange(day),
              disabled: !(withinLimits && withinMonth && filter),
              marker: withinMonth ? _getMarker(day) : void 0
            };
          });
          return days;
        };
        _buildMonth = function(time) {
          var calendarEnd, calendarStart, start, w, weeks, weeksInMonth;
          weeks = [];
          calendarStart = moment(time).startOf('month');
          calendarEnd = moment(time).endOf('month');
          weeksInMonth = 5;
          start = time.startOf('month');
          weeks = (function() {
            var i, ref, results;
            results = [];
            for (w = i = 0, ref = weeksInMonth; 0 <= ref ? i <= ref : i >= ref; w = 0 <= ref ? ++i : --i) {
              results.push(_buildWeek(moment(start).add(w, 'weeks'), moment(start).month()));
            }
            return results;
          })();
          return {
            weeks: weeks,
            name: time.format("MMMM YYYY")
          };
        };
        _setup = function() {
          var attr, dates, ref, start, tempOptions, v;
          tempOptions = {};
          for (attr in options) {
            v = options[attr];
            tempOptions[attr] = v;
          }
          if ($scope.options) {
            ref = $scope.options;
            for (attr in ref) {
              v = ref[attr];
              tempOptions[attr] = $scope.options[attr];
            }
          }
          $scope.options = tempOptions;
          $scope.$on('mighty-datepicker-reload', function() {
            return _prepare();
          });
          switch ($scope.options.mode) {
            case "multiple":
              if ($scope.model && Array.isArray($scope.model) && $scope.model.length > 0) {
                if ($scope.model.length === 1) {
                  start = moment($scope.model[0]);
                } else {
                  dates = $scope.model.slice(0);
                  start = moment(dates.sort().slice(-1)[0]);
                }
              } else {
                $scope.model = [];
              }
              break;
            default:
              if ($scope.model) {
                start = moment($scope.model);
              }
          }
          $scope.options.start = $scope.options.start || start || moment().startOf('day');
          if ($scope.rangeFrom) {
            $scope.options.rangeMode = "from";
          } else if ($scope.rangeTo) {
            $scope.options.rangeMode = "to";
          }
          _indexMarkers();
          return $scope.options.template = $scope.options.template.replace('ng-bind-template=""', 'ng-bind-template="' + $scope.options.markerTemplate + '"');
        };
        _prepare = function() {
          var m;
          $scope.months = [];
          return $scope.months = (function() {
            var i, ref, results;
            results = [];
            for (m = i = 0, ref = $scope.options.months; 0 <= ref ? i < ref : i > ref; m = 0 <= ref ? ++i : --i) {
              results.push(_buildMonth(moment($scope.options.start).add(m, 'months')));
            }
            return results;
          })();
        };
        _build = function() {
          _prepare();
          return _bake();
        };
        $scope.on('mighty-datepicker-reload', function() {
          return _prepare();
        });
        $scope.moveMonth = function(step) {
          $scope.options.start.add(step, 'month');
          _prepare();
        };
        $scope.select = function(day) {
          var ix;
          if (!day.disabled) {
            switch ($scope.options.mode) {
              case "multiple":
                if (day.selected) {
                  ix = _indexOfMoment($scope.model, day.date, 'day');
                  $scope.model.splice(ix, 1);
                } else {
                  $scope.model.push(moment(day.date));
                }
                break;
              default:
                $scope.model = day.date;
            }
            if ($scope.options.callback) {
              $scope.options.callback(day.date);
            }
            return _prepare();
          }
        };
        $scope.$watchCollection('markers', function(newMarkers, oldMarkers) {
          _indexMarkers();
          return _prepare();
        });
        _setup();
        _build();
        switch ($scope.options.mode) {
          case "multiple":
            $scope.$watchCollection('model', function(newVals, oldVals) {
              return _prepare();
            });
            break;
          case "simple":
            $scope.$watch('model', function(newVal, oldVal) {
              if (!moment.isMoment(newVal)) {
                newVal = moment(newVal);
              }
              if (!oldVal || oldVal && !newVal.isSame(oldVal, 'day')) {
                $scope.model = newVal;
                if (oldVal) {
                  $scope.options.start = moment(newVal);
                }
                return _prepare();
              }
            });
        }
        $scope.$watch('before', function(newVal, oldVal) {
          if (newVal) {
            if (!moment.isMoment(newVal)) {
              newVal = moment(newVal);
            }
            if (!newVal.isSame(oldVal, 'day')) {
              return _prepare();
            }
          }
        });
        return $scope.$watch('after', function(newVal, oldVal) {
          if (newVal) {
            if (!moment.isMoment(newVal)) {
              newVal = moment(newVal);
            }
            if (!newVal.isSame(oldVal, 'day')) {
              return _prepare();
            }
          }
        });
      }
    }
  ]);

}).call(this);
