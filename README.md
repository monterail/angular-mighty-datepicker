# Angular based datepicker with mighty options

Builded with angularJS and momentJS.

```javascript
    angular.module("TestApp", ["mightyDatepicker"]);
    angular.module("TestApp").controller("TestCtrl", function($scope){
      _callthis = function(day) {
        console.log("call this: ", day);
      }

      _filter = function (day) {
        w = day.weekday();
        return w < 6 && w > 0;
      }

      $scope.date = null;
      $scope.options = {
        start: moment().add('month', -1),
        months: 1,
        filter: _filter,
        callback: _callback
      }

      $scope.multi = [];
      $scope.optionsM = {
        months: 3,
        mode: "multiple",
        after: moment().add('month', -3),
        before: moment().add('month', 3)
      }
    });
```

```html
<body ng-app="TestApp">
  <div ng-controller="TestCtrl">
    <div>
      <h1>Simple date picker</h1>
      <mighty-datepicker ng-model="date" options="options"></mighty-datepicker>
    </div>
    <div>
      <h1>Multiple date picker</h1>
      <mighty-datepicker ng-model="multi" options="optionsM"></mighty-datepicker>
    </div>
  </div>
</body>

```
Attributes:
- ng-model: model for datepicker, momentJS object for 'simple' mode, or array of momentJS objects for 'multiple' mode
- options: object containing options for datepicker
- markers: array of markers, containing additional data for certain days, marker is object: {day: momentObject, marker: markerObject}
- after: days after this date are enabled to select
- before: days before this date are enabled to select

Options for datepicker:
- mode: define mode of datepicker, default: 'simple', possible modes: 'simple', 'multiple'
- start: init datepicker starting from this month
- months: number of months used in datepicker
- filter: function for filtering enabled dates, takes day as param, return true if day is selectable
- callback: callback parameter to fire after selecting day, takes day as parameter
- markerTemplate: template for ng-bind-template, used to display additional data for marked days, default: "{{ day.marker }}", where 'day' is object from markers array
- template: string with custom template of picker directive (see `test/index.html` for example use)

To support IE8 add those polyfills:
- Array.isArray

Changelog:

0.0.16
- cutsom templates fixed

0.0.15
- when updating model in `simple` mode calendar moves to current month of new model

0.0.14
- fix for custom markers in custom templates

0.0.13
- `after`/`before` options moved to attributes (for easy databinding and updating)
- added example with double datepicker for date range
- added changelog in readme section

0.0.12
- fixed datepicker for model that is not momentJS object

0.0.11
- datepicker is updated when model changes (both single and multiple modes)

0.0.10
- option for custom template

0.0.9
- fixed marker styling for Firefox

0.0.8
- watch and reindex markers when changed

0.0.7
- simple markers for calendar days

0.0.6
- fixed typos and readme
- BEM classes fixed

0.0.5
- filter and callback options

0.0.4
- options object fix

0.0.3
- changed classnames for elements

0.0.2
- added before/after limits
- multiple date select

0.0.1
- initial release with simple datepicker functionality
