# Angular based datepicker with mighty options

## Documentation and demo
[http://monterail.github.io/angular-mighty-datepicker/](http://monterail.github.io/angular-mighty-datepicker/)

## Changelog:

0.1.4
- fix problem with selecting 1 day in range picker

0.1.3
- replaced deprecated momentjs function ([#26](https://github.com/monterail/angular-mighty-datepicker/pull/26)) by [@Jaspur](https://github.com/Jaspur)

0.1.2
- fix package.json format

0.1.1
- loosen momentjs dependecy ([#8](https://github.com/monterail/angular-mighty-datepicker/pull/8)) by [@mrodrigues](https://github.com/mrodrigues)

0.1.0
- added explicit dependency ([#9](https://github.com/monterail/angular-mighty-datepicker/pull/9)) by [@Jaspur](https://github.com/Jaspur)
- fixed missing week in January for leap year ([#16](https://github.com/monterail/angular-mighty-datepicker/pull/16)) by [@metrox](https://github.com/metrox)

0.0.18
- when two datepickers are used for range selection, additional parameters (`range-from` and `range-to`) allow to highlight selected time range

0.0.17
- updating model in `simple` mode fixed (not tangling with model anymore)

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
