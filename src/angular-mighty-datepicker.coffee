angular.module "mightyDatepicker", ["pasvaz.bindonce"]

angular.module("mightyDatepicker").directive "mightyDatepicker", ["$compile", ($compile) ->
  pickerTemplate = """
    <div class="mighty-picker__wrapper">
      <button type="button" class="mighty-picker__prev-month"
        ng-click="moveMonth(-1)">
        <<
      </button>
      <div class="mighty-picker__month"
        bindonce ng-repeat="month in months track by $index">
        <div class="mighty-picker__month-name" ng-bind="month.name"></div>
        <table class="mighty-picker-calendar">
          <tr class="mighty-picker-calendar__days">
            <th bindonce ng-repeat="day in month.weeks[1]"
              class="mighty-picker-calendar__weekday"
              bo-text="day.date.format('dd')">
            </th>
          </tr>
          <tr bindonce ng-repeat="week in month.weeks">
            <td
                bo-class='{
                  "mighty-picker-calendar__day": day,
                  "mighty-picker-calendar__day--selected": day.selected,
                  "mighty-picker-calendar__day--selected-to": day.selectedTo,
                  "mighty-picker-calendar__day--disabled": day.disabled,
                  "mighty-picker-calendar__day--in-range": day.inRange,
                  "mighty-picker-calendar__day--marked": day.marker
                }'
                ng-repeat="day in week track by $index" ng-click="select(day)">
                <div class="mighty-picker-calendar__day-wrapper"
                  bo-text="day.date.date()"></div>
                <div class="mighty-picker-calendar__day-marker-wrapper">
                  <div class="mighty-picker-calendar__day-marker"
                    ng-if="day.marker"
                    ng-bind-template="">
                  </div>
                </div>
            </td>
          </tr>
        </table>
      </div>
      <button type="button" class="mighty-picker__next-month"
        ng-click="moveMonth(1)">
        >>
      </button>
    </div>
  """
  options =
    mode: "simple"
    months: 1
    start: null
    filter: undefined
    callback: undefined
    markerTemplate: "{{ day.marker }}"
    template: pickerTemplate
  restrict: "AE"
  replace: true
  template: '<div class="mighty-picker__holder"></div>'
  scope:
    model: '=ngModel'
    options: '='
    markers: '='
    after: '='
    before: '='
    rangeFrom: '='
    rangeTo: '='

  link: ($scope, $element, $attrs) ->
    _bake = ->
      domEl = $compile(angular.element($scope.options.template))($scope)
      $element.append(domEl)

    _indexOfMoment = (array, element, match) ->
      for key, value of array
        return key if element.isSame(value, match)
      -1

    _indexMarkers = ->
      $scope.markerIndex = (marker.day for marker in $scope.markers) if $scope.markers

    _withinLimits = (day, month) ->
      withinLimits = true
      withinLimits &&= day.isBefore($scope.before) if $scope.before
      withinLimits &&= day.isAfter($scope.after) if $scope.after
      withinLimits

    _getMarker = (day) ->
      ix = _indexOfMoment($scope.markerIndex, day, 'day')
      if ix > -1
        return $scope.markers[ix].marker
      else
        return undefined

    _isSelected = (day) ->
      switch $scope.options.mode
        when "multiple"
          return _indexOfMoment($scope.model, day, 'day') > -1
        when "range"
          if $scope.model
            return day.isSame($scope.model.start, 'day')
        else
          return $scope.model && day.isSame($scope.model, 'day')

    _isSelectedTo = (day) ->
      switch $scope.options.mode
        when "range"
          if $scope.model
            return day.isSame($scope.model.end, 'day')
        else
          return false

    _isInRange = (day) ->
      switch $scope.options.mode
        when "multiple"
          if $scope.options.rangeMode
            if $scope.options.rangeMode == "from"
              return moment.range($scope.model, $scope.before).contains(day) ||
                  day.isSame($scope.before, 'day')
            else
              return moment.range($scope.after, $scope.model).contains(day) ||
                  day.isSame($scope.after, 'day')
          else
            return false
        when "range"
          if $scope.model.start
            return $scope.model.contains(day)
          else
            return false

    _buildWeek = (time, month) ->
      days = []
      filter = true
      start = time.startOf('week')
      days = [0 .. 6].map (d) ->
        day = moment(start).add('days', d)
        withinMonth = day.month() == month
        withinLimits = _withinLimits(day, month)
        filter = $scope.options.filter(day) if $scope.options.filter
        date: day
        selected: _isSelected(day) && withinMonth
        selectedTo: _isSelectedTo(day) && withinMonth
        inRange: _isInRange(day)
        disabled: !(withinLimits && withinMonth && filter)
        marker: _getMarker(day) if withinMonth
      days

    _buildMonth = (time) ->
      weeks = []
      calendarStart = moment(time).startOf('month')
      calendarEnd = moment(time).endOf('month')
      weeksInMonth = 5
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
          if $scope.model && Array.isArray($scope.model) && $scope.model.length>0
            if $scope.model.length == 1
              start = moment($scope.model[0])
            else
              dates = $scope.model.slice(0)
              start = moment(dates.sort().slice(-1)[0])
          else
            $scope.model = []

        when "range"
          if $scope.model && $scope.model.start
            if $scope.model.start.isValid()
              start = $scope.model.start
          else
            $scope.model = moment.range()

        else
          start = moment($scope.model) if $scope.model

      $scope.options.start =
        $scope.options.start || start || moment().startOf('day')

      if $scope.rangeFrom
        $scope.options.rangeMode = "from"
      else if $scope.rangeTo
        $scope.options.rangeMode = "to"

      _indexMarkers()
      $scope.options.template = $scope.options.template.replace('ng-bind-template=""',
        'ng-bind-template="' + $scope.options.markerTemplate + '"')

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

          when "range"
            startValid = $scope.model.start.isValid()
            endValid = $scope.model.end.isValid()

            # if the start date and end date are both valid or invalid
            # reset the dates.
            if (startValid && endValid) || (!startValid && !endValid)
              $scope.model = moment.range(moment(day.date), moment(null))

            # if the end date is invalid
            # set the end date.
            else if startValid && !endValid
              # push back the start date if the selected day is before
              if moment(day.date).isSameOrBefore($scope.model.start, 'day')
                $scope.model.start = moment(day.date)
              else
                $scope.model.end = moment(day.date)

          else
            $scope.model = day.date
        $scope.options.callback day.date if $scope.options.callback
        _prepare()

    $scope.$watchCollection 'markers', (newMarkers, oldMarkers) ->
      _indexMarkers()
      _prepare()

    _setup()
    _build()

    switch $scope.options.mode
      when "multiple"
        $scope.$watchCollection 'model', (newVals, oldVals) ->
          _prepare()

      when "range"
        $scope.$watch 'model', (newVal, oldVal) ->
          _prepare()

      when "simple"
        $scope.$watch 'model', (newVal, oldVal) ->
          newVal = moment(newVal) unless moment.isMoment(newVal)
          if !oldVal || oldVal && !newVal.isSame(oldVal, 'day')
            $scope.model = newVal
            if oldVal
              $scope.options.start = moment(newVal)
            _prepare()

    $scope.$watch 'before', (newVal, oldVal) ->
      if newVal
        newVal = moment(newVal) unless moment.isMoment(newVal)
        unless newVal.isSame(oldVal, 'day')
          _prepare()

    $scope.$watch 'after', (newVal, oldVal) ->
      if newVal
        newVal = moment(newVal) unless moment.isMoment(newVal)
        unless newVal.isSame(oldVal, 'day')
          _prepare()
]
