(function(window, angular) {
    'use strict';

    angular.module('mightyDatepicker', [])
    .directive('mightyDatepicker', ['$compile', function($compile) {
        var pickerTemplate = [
        '<div class="mighty-picker__wrapper" ng-mousedown="cancelClick($event)">',
            '<div class="mighty-picker__month" ng-repeat="month in months track by $index">',
                '<div class="mighty-picker__month-name">{{month.name}}</div>',
                '<table class="mighty-picker-calendar">',
                    '<tr class="mighty-picker-calendar__days">',
                        '<th ng-repeat="day in month.weeks[1]" class="mighty-picker-calendar__weekday" ng-bind="::day.date.format(\'dd\')"></th>',
                    '</tr>',
                    '<tr ng-repeat="week in month.weeks">',
                        '<td ng-class=\'{ "mighty-picker-calendar__day": day, "mighty-picker-calendar__day--selected": day.selected, "mighty-picker-calendar__day--disabled": day.disabled, "mighty-picker-calendar__day--in-range": day.inRange, "mighty-picker-calendar__day--marked": day.marker }\' ng-repeat="day in week track by $index" ng-mousedown="select(day, $event)">',
                            '<div class="mighty-picker-calendar__day-wrapper" ng-bind="::day.date.date()"></div>',
                            '<div class="mighty-picker-calendar__day-marker-wrapper">',
                                '<div class="mighty-picker-calendar__day-marker" ng-if="day.marker" ng-bind-template=""></div>',
                            '</div>',
                        '</td>',
                    '</tr>',
                '</table>',
            '</div>',
            '<button type="button" class="mighty-picker__prev-month" ng-mousedown="moveMonth(-1, $event)"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" xml:space="preserve" class="icon icon-arrow-left" viewBox="0 0 24 24"><title>Arrow Left</title><path d="M17.8,24a0.6,0.6,0,0,0,.6-0.7,0.5,0.5,0,0,0-.2-0.4L7.3,12,18.2,1.1A0.6,0.6,0,0,0,18.1.2a0.8,0.8,0,0,0-.9,0L5.9,11.5a0.6,0.6,0,0,0,0,.9L17.3,23.8a0.5,0.5,0,0,0,.5.2h0Z" style="fill:#231f20"/></svg></button>',
            '<button type="button" class="mighty-picker__next-month" ng-mousedown="moveMonth(1, $event)"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" xml:space="preserve" class="icon icon-arrow-right" viewBox="0 0 24 24"><title>Arrow Right</title><path d="M6.3,24a0.6,0.6,0,0,1-.6-0.7,0.5,0.5,0,0,1,.2-0.4L16.7,12,5.8,1.1A0.6,0.6,0,0,1,5.9.2a0.8,0.8,0,0,1,.9,0L18.1,11.5a0.6,0.6,0,0,1,0,.9L6.8,23.8a0.6,0.6,0,0,1-.5.2h0Z" style="fill:#231f20"/></svg></button>',
        '</div>'
        ].join('');

        var options = {
            mode: 'simple',
            months: 1,
            start: null,
            filter: undefined,
            callback: undefined,
            markerTemplate: '{{ day.marker }}',
            template: pickerTemplate,
            cancelClick: false
        };

        return {
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
                    if ($scope.markers) {
                        return $scope.markerIndex = (function() {
                            var _i, _len, _ref, _results;
                            _ref = $scope.markers;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                marker = _ref[_i];
                                _results.push(marker.day);
                            }
                            return _results;
                        })();
                    }
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
                            return moment.range($scope.model, $scope.before).contains(day) || day.isSame($scope.before, 'day');
                        } else {
                            return moment.range($scope.after, $scope.model).contains(day) || day.isSame($scope.after, 'day');
                        }
                    } else {
                        return false;
                    }
                };

                _buildWeek = function(time, month) {
                    var days, filter, start;
                    days = [];
                    filter = true;
                    start = time.startOf('week');
                    days = [0, 1, 2, 3, 4, 5, 6].map(function(d) {
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
                        var _i, _results;
                        _results = [];
                        for (w = _i = 0; 0 <= weeksInMonth ? _i <= weeksInMonth : _i >= weeksInMonth; w = 0 <= weeksInMonth ? ++_i : --_i) {
                            _results.push(_buildWeek(moment(start).add(w, 'weeks'), moment(start).month()));
                        }
                        return _results;
                    })();
                    return {
                        weeks: weeks,
                        name: time.format("MMMM YYYY")
                    };
                };

                _setup = function() {
                    var attr, dates, start, tempOptions, v, _ref;
                    tempOptions = {};
                    for (attr in options) {
                        v = options[attr];
                        tempOptions[attr] = v;
                    }
                    if ($scope.options) {
                        _ref = $scope.options;
                        for (attr in _ref) {
                            v = _ref[attr];
                            tempOptions[attr] = $scope.options[attr];
                        }
                    }
                    $scope.options = tempOptions;
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
                        var _i, _ref, _results;
                        _results = [];
                        for (m = _i = 0, _ref = $scope.options.months; 0 <= _ref ? _i < _ref : _i > _ref; m = 0 <= _ref ? ++_i : --_i) {
                            _results.push(_buildMonth(moment($scope.options.start).add(m, 'months')));
                        }
                        return _results;
                    })();
                };

                _build = function() {
                    _prepare();
                    return _bake();
                };

                $scope.moveMonth = function(step, $event) {
                    $scope.options.start.add(step, 'month');
                    _prepare();
                };

                $scope.select = function(day, $event) {
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
                            if ($scope.options.cancelClick) {
                                $event.preventDefault();
                            }
                            $scope.options.callback(day.date);
                        }
                        return _prepare();
                    }
                };

                $scope.cancelClick = function($event) {
                    if ($scope.options.cancelClick) {
                        $event.preventDefault();
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
            };
        }]);
})(window, window.angular);
