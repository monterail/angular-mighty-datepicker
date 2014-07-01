# Angular based datepicker with mighty options

Builded with angularJS and momentJS.

```javascript
    angular.module("TestApp", ["mightyDatepicker"]);
    angular.module("TestApp").controller("TestCtrl", function($scope){
      $scope.date = null;
      $scope.options = {
        start: moment().add('month', -1),
        months: 1,
        after: moment()
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

Options for datepicker:
- start: init datepicker starting from this month
- months: number of months used in datepicker
- before: days before this date are enabled to select
- after: days after this date are enabled to select

To support IE8 add those polyfills:
- Array.isArray
