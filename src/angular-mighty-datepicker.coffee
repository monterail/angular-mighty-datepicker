angular.module "mightyDatepicker", ['pasvaz.bindonce']

angular.module("mightyDatepicker").directive "mightyDatepicker", ($compile) ->
  pickerTemplate = """
    <div class="mighty-picker__wrapper">
      <button ng-click="moveMonth(-1)"><<</button>
      <div class="mighty-picker__month"
        bindonce ng-repeat="month in months track by $index">
        <div class="mighty-picker__month-name" ng-bind="month.name"></div>
        <table class="mighty-picker__calendar">
          <tr>
            <th bindonce ng-repeat="day in month.weeks[1]"
              class="mighty-picker__calendar-weekday"
              bo-text="day.date.format('dd')">
            </th>
          </tr>
          <tr bindonce ng-repeat="week in month.weeks">
            <td
                bo-class='{
                  "mighty-picker__calendar-day": day,
                  "mighty-picker__calendar-day-selected": day.selected,
                  "mighty-picker__calendar-day-disabled": day.disabled,
                  "mighty-picker__calendar-day-start": day.start
                }'
                ng-repeat="day in week track by $index" ng-click="select(day)">
                <div class="mighty-picker__calendar-day-wrapper"
                  bo-text="day.date.date()"></div>
            </td>
          </tr>
        </table>
      </div>
      <button ng-click="moveMonth(1)">>></button>
    </div>
  """
  options =
    mode: "simple"
    after: null
    before: null
    months: 1
    start: null
  restrict: "AE"
  replace: true
  template: '<div class="mighty-picker__holder"></div>'
  scope:
    model: '=ngModel'
    options: '='

  link: ($scope, $element, $attrs) ->
    _bake = ->
      domEl = $compile(angular.element(pickerTemplate))($scope)
      $element.append(domEl)

    _indexOfMoment = (array, element, match) ->
      for key, value of array
        return key if element.isSame(value, match)
      -1

    _withinLimits = (day, month) ->
      withinLimits = true
      withinLimits &&= day.isBefore(options.before) if options.before
      withinLimits &&= day.isAfter(options.after) if options.after
      withinLimits

    _isSelected = (day) ->
      switch $scope.options.mode
        when "multiple"
          return _indexOfMoment($scope.model, day, 'day') > -1
        else
          return $scope.model && day.isSame($scope.model, 'day')

    _buildWeek = (time, month) ->
      days = []
      start = time.startOf('week')
      days = [0 .. 6].map (d) ->
        day = moment(start).add('days', d)
        withinMonth = day.month() == month
        withinLimits = _withinLimits(day, month)
        date: day
        selected: _isSelected(day) && withinMonth
        disabled: !(withinLimits && withinMonth)
      days

    _buildMonth = (time) ->
      weeks = []
      calendarStart = moment(time).startOf('month')
      calendarEnd = moment(time).endOf('month')
      weeksInMonth = calendarEnd.week() - calendarStart.week()
      if weeksInMonth < 0 # year edge
        weeksInMonth =
          (calendarStart.weeksInYear()-calendarStart.week())+calendarEnd.week()
      start = time.startOf('month')
      weeks =(
        _buildWeek(moment(start).add('weeks', w), moment(start).month()
        ) for w in [0 .. weeksInMonth])
      weeks: weeks
      name: time.format("MMMM YYYY")

    _setup = ->
      tempOptions = {}
      for attr, v of options
        tempOptions[attr] = v

      if $scope.options
        for attr,v of $scope.options
          tempOptions[attr] = $scope.options[attr]

      $scope.options = tempOptions

      switch $scope.options.mode
        when "multiple"
          # add start based on model
          if $scope.model && Array.isArray($scope.model) &&$scope.model.length>0
            if $scope.model.length == 1
              start = moment($scope.model[0])
            else
              dates = $scope.model.slice(0)
              start = moment(dates.sort().slice(-1))
          else
            $scope.model = []
        else
          start = moment($scope.model) if $scope.model

      $scope.options.start =
        $scope.options.start || start || moment().startOf('day')

    _prepare = ->
      $scope.months = []
      $scope.months = (
        _buildMonth(moment($scope.options.start).add('months', m)
        ) for m in [0 ... $scope.options.months])

    _build = ->
      _prepare()
      _bake()

    $scope.moveMonth = (step) ->
      $scope.options.start.add('month', step)
      _prepare()
      return

    $scope.select = (day) ->
      if !day.disabled
        switch $scope.options.mode
          when "multiple"
            if day.selected
              ix = _indexOfMoment($scope.model, day.date, 'day')
              $scope.model.splice(ix, 1)
            else
              $scope.model.push(moment(day.date))
          else
            $scope.model = day.date
        _prepare()

    _setup()
    _build()
