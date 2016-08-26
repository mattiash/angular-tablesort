AngularJS Tablesort
===================

Allow tables to be sorted by clicking their headings.

Web site: [http://mattiash.github.io/angular-tablesort](http://mattiash.github.io/angular-tablesort)

Background
----------

When you use jquery to build your web-pages, it is very easy to add sorting functionality to your tables - include [tablesorter](http://tablesorter.com) and annotate your column headings slightly to tell it what type of data your table contains.

The goal with this module is to make it just as easy to add sorting to AngularJS tables, but with proper use of angular features and not jquery.

Click once on a heading to sort ascending, twice for descending. Use shift-click to sort on more than one column.

Additionally, these directives also makes it easy to add a default row that is shown in empty tables to make
it explicit that the table is intentionally empty and not just broken.

Installation
------------

    bower install angular-tablesort

or

    npm install angular-tablesort


Usage
-----

Include the script in your markup

```html
<script src="bower_components/angular-tablesort/js/angular-tablesort.js"></script>
```

Include the module in your app

```js
angular.module('myApp', ['tableSort']);
```

The following code generates a table that can be sorted by clicking on the table headings:

```html
<table border="1" ts-wrapper>
  <thead>
    <tr>
      <th ts-criteria="Id">Id</th>
      <th ts-criteria="Name|lowercase" ts-default>Name</th>
      <th ts-criteria="Price|parseFloat">Price</th>
      <th ts-criteria="Quantity|parseInt">Quantity</th>
    </tr>
  </thead>
  <tbody>
    <tr ng-repeat="item in items" ts-repeat>
      <td>{{item.Name}}</td>
      <td>{{item.Price | currency}}</td>
      <td>{{item.Quantity}}</td>
    </tr>
  </tbody>
</table>
```

The `ts-wrapper` attribute must be set on element that surrounds both the headings and the ng-repeat statement.

The `ts-criteria` attribute tells tablesort which expression it should sort on when that element is clicked. Normally, the ts-criteria is the same as the expression that is shown in the column, but it doesn't have to be. The ts-criteria can also be filtered using the normal AngularJS filter syntax. Tablesort includes two filters parseInt and parseFloat that use the javascript functions of the same name, but any filter can be used.

The `ts-name` attribute can be set to declare a unique name for an expression which will be used in the event fired when sorting has changed.

The `ts-default` attribute can be set on one or more columns to sort on them in ascending order by default.
To sort in descending order, set ts-default to "descending"

The `ts-repeat` attribute must be set on the element with ng-repeat.

```html
<tr ng-repeat="item in items" ts-repeat>
```

Alternatively, `ts-repeat-start` and `ts-repeat-end` may be used to compliment the `ng-repeat-start` and `ng-repeat-end` directives.

```html
<tr ng-repeat-start="item in items track by item.Id" ts-repeat-start>
  <td><input type="checkbox" ng-model="item.selected"></td>
  <td>{{ item.Name }}</td>
</tr>
<tr ng-repeat-end data-ts-repeat-end ng-show="item.selected">
  <td colspan="2">{{ item.Description }}</td>
</tr>
```

By default, the sorting will be done as the last operation in the ng-repeat expression. To override this behavior, use an explicit `tablesort` directive as part of your ng-repeat expression. E.g.

```html
<tr ng-repeat="item in items | limitTo: 10" ts-repeat>
```

This will first select the first 10 items in `items` and then sort them. Alternatively, you can insert an explicit tablesort in the pipe:

```html
<tr ng-repeat="item in items | tablesort | limitTo: 10" ts-repeat>
```

This will first sort the rows according to your specification and then only show the first 10 rows.

If the `ng-repeat` expression contains a `track by` statement (which is generally a good idea), that expression will
be used to provide a [stable](http://en.wikipedia.org/wiki/Sorting_algorithm#Stability) sort result.


Events
------

When changing sorting in the table, an event named `tablesort:sortOrder` will be emitted which contains an array of all current sorting definitions.
These sorting definitions could be used to set up sorted data retrieval when using other directives that handle things like pagination or filtering.

```js
$scope.$on('tablesort:sortOrder', (event, sortOrder) => {
  self.sortOrder = sortOrder.map(o => {
   return `${o.name} ${o.order ? 'ASC' : 'DESC'}`;
  });
});
```



 CSS
---

All table headings that can be sorted on is styled with css-class `tablesort-sortable`. The table headings that the table is currently sorted on is styled with `tablesort-asc` or `tablesort-desc` classes depending on the sort-direction. A stylesheet is included to show that it works, but you probably want to build your own.


Empty Tables
---

By default the content for the empty table cell is set to `"No Items"`, however it can be changed via the `noDataText` configuration option (see below). It is inserted as one `<td>` spanning
all columns and placed inside a `<tr class="showIfLast">`, which is placed at the top of each table.

The message can be customized for each table by specifying the `ts-no-data-text` attribute on the same element as the `ts-wrapper`. 
```html
<table ts-wrapper ts-no-data-text="Nothing to see here...">
```

To disable this feature add the attribute `ts-hide-no-data` to the `ts-repeat` row:
```html
<tr ng-repeat="item in items" ts-repeat ts-hide-no-data>
```

Configuring Global Options
---

Several options may be configured globally per-app.


| Property           | Type              | Default                | Description |
|--------------------|-------------------|------------------------|-------------|
|`filterTemplate`    |`string`           |`""`                    |HTML string template for filtering the table. _This will be included **before** the element with `ts-wrapper` specified on it._  See example above.|
|`filterFunction`    |`function`         |`null`                  |A function that will be called for every item being iterated over in the table. This function will be passed the object being iterated over as the first parameter. It should return a `boolean` value as to include the item or not.  _(This can be overridden per-table)_|
|`itemNameSingular`  |`string`           |`"item"`                |The default singular version of the name for the items being iterated over. _(This can be overridden per-table)_|
|`itemNamePlural`    |`string`           |`itemNameSingular + "s"`|The default plural version of the name for the items being iterated over. This just appends `"s"` to the singular name, which should work for most words in English. _(This can be overridden per-table)_|
|`noDataText`        |`string`           |`"No " + itemNamePlural`|The text that displays in the `.showIfLast` cell shown when a table is empty|
|`paginationTemplate`|`string`           |`""`                    |HTML string template for paging the table. _This will be included **after** the element with `ts-wrapper` specified on it._ See example above.|
|`perPageOptions`    |`array` of `number`|`[10, 25, 50, 100]`     |The options for how many items to show on each page of results.  _(This can be overridden per-table)_|
|`perPageDefault`    |`number`           |`perPageOptions[0]`     |The default number of items for show on each page of results. By default it picks the first item in the `perPageOptions` array.  _(This can be overridden per-table)_|

Here's an example of how to change an option
```js
angular
    .module('myApp')
    .config(['tableSortConfigProvider', function(tableSortConfigProvider){
        tableSortConfigProvider.noDataText = "This table has nothing to show!";
    }
]);
```

###Filtering & Pagination Templates

By default table filtering & pagination are supported, but not enabled so that you may use any UI and any 3rd party angular code to do these types of things.

To set up these features, you must provide some configuration HTML string templates.  These will be the default templates for filtering & pagination for all tables use in the same app unless that feature is specifically disabled on a per-table basis.

Here is an example of one way to set up the templates for an app that uses bootstrap and the [Angular-UI Bootstrap pagination directive](http://angular-ui.github.io/bootstrap/#/pagination)

```js
angular
    .module('myApp')
    .config(['tableSortConfigProvider', function(tableSortConfigProvider){
        var filterString = "<div class='row'>";
        filterString +=      "<div class='col-sm-4 col-md-3 col-sm-offset-8 col-md-offset-9'>";
        filterString +=        "<div class='form-group has-feedback'>";
        filterString +=          "<input type='search' class='form-control' placeholder='filter {{ITEM_NAME_PLURAL}}' ng-model='FILTER_STRING'/>";
        filterString +=          "<span class='glyphicon glyphicon-search form-control-feedback' aria-hidden='true'></span>";
        filterString +=        "</div>";
        filterString +=      "</div>";
        filterString +=    "</div>";
        tableSortConfigProvider.filterTemplate = filterString;
        
        var pagerString = "<div class='text-right'>";
        pagerString +=      "<small class='text-muted'>Showing {{CURRENT_PAGE_RANGE}} {{FILTERED_COUNT === 0 ? '' : 'of'}} ";
        pagerString +=        "<span ng-if='FILTERED_COUNT === TOTAL_COUNT'>{{TOTAL_COUNT | number}} {{TOTAL_COUNT === 1 ? ITEM_NAME_SINGULAR : ITEM_NAME_PLURAL}}</span>";
        pagerString +=        "<span ng-if='FILTERED_COUNT !== TOTAL_COUNT'>{{FILTERED_COUNT | number}} {{FILTERED_COUNT === 1 ? ITEM_NAME_SINGULAR : ITEM_NAME_PLURAL}} (filtered from {{TOTAL_COUNT | number}})</span>";
        pagerString +=      "</small>&nbsp;";
        pagerString +=      "<uib-pagination style='vertical-align:middle;' ng-if='ITEMS_PER_PAGE < TOTAL_COUNT' ng-model='CURRENT_PAGE_NUMBER' ";
        pagerString +=        "total-items='FILTERED_COUNT' items-per-page='ITEMS_PER_PAGE' max-size='5' force-ellipses='true'></uib-pagination>&nbsp;";
        pagerString +=      "<div class='form-group' style='display:inline-block;'>";
        pagerString +=        "<select class='form-control' ng-model='ITEMS_PER_PAGE' ng-options='opt as (opt + \" per page\") for opt in PER_PAGE_OPTIONS'></select>";
        pagerString +=      "</div>";
        pagerString +=    "</div>";
        tableSortConfigProvider.paginationTemplate = pagerString;
    }
]);
```

There are several tokens that can be used in the templates which will be replaced with the proper Angular expressions.

| Token                 | Description                                                                                                 |
|-----------------------|-------------------------------------------------------------------------------------------------------------|
| `TOTAL_COUNT`         | The number for the total count of items in the table                                                        |
| `FILTERED_COUNT`      | The number for the total count of items in the table after the filter has been applied                      |
| `FILTER_STRING`       | The string used for the `ng-model` of the text filter                                                       |
| `PER_PAGE_OPTIONS`    | The array of numbers for the various page size options                                                      |
| `ITEMS_PER_PAGE`      | The number for the selected number of items to display per page (the selected item from `PER_PAGE_OPTIONS`) |
| `CURRENT_PAGE_NUMBER` | The number for the page that is currently being viewed                                                      |
| `CURRENT_PAGE_RANGE`  | The number for the current viewable range of pages                                                          |
| `ITEM_NAME_SINGULAR`  | The singular version of the name of the items being iterated over                                           |
| `ITEM_NAME_PLURAL`    | The plural version of the name of the items being iterated over                                             |


###Item Names

The name of the things listed in the table can be displayed in the filtering and pagination templates. They are named `"items"` collectively and `"item"` individually by default, but this can be customized in the global config, and per-table to be more specific as to what is being listed.

On a table just set the `ts-item-name` attribute on the same element as `ts-wrapper`. Set this as the singular version of the word, not the plural.
 
 ```html
<table ts-wrapper ts-item-name="product">
```

The plural version of the word will be automatically generated by adding `"s"` to the end of the singular word. The above example would produce `"product"` and `"products"` This should be fine for many words in English, but in the rare instances where it is not, a `ts-item-name-plural` attribute may also be specified.

```html
<table ts-wrapper ts-item-name="knife" ts-item-name-plural="knives">
```

Changing the item name will also update the "no data" display to be `"No " +  ITEM_NAME_PLURAL` _unless_ the globally configured `noDataText` option is in a format other than the default.

###Table Filtering & Pagination Usage

There are a couple of ways to mark a column as filterable.

One approach is to add the `ts-filter` attribute to the `<th>` element.  The property specified in the `ts-criteria` attribute will be used to filter.

 ```html
<thead>
  <tr>
    <th ts-filter="Id">Id</th>
    <th ts-criteria="Name|lowercase" ts-default ts-filter>Name</th>
    <th ts-criteria="Price|parseFloat" ts-filter>Price</th>
    <th ts-criteria="Quantity|parseInt" ts-filter>Quantity</th>
  </tr>
</thead>
```
**NOTE** that the `ts-filter` attribute is not needed if custom filtering using the `ts-filter-function` attribute.

Another approach is to add the `ts-filter-fields` attribute to the same element as the `ts-wrapper`.  This attribute takes a comma separated list of all the fields to which the filter should be applied.

```html
<table ts-wrapper ts-filter-fields="Name,Price,Quantity">
```

####Customized Pagination Options

Set the `ts-per-page-options` attribute on the same element that `tw-wrapper` is set on to override the options for the number of items available per page.

Set the `ts-per-page-default` attribute on the same element that `tw-wrapper` is set on to override the default number of items available per page.
  
 ```html
<table ts-wrapper ts-per-page-options="[5, 10, 15, 30]" ts-per-page-default="15">
```

If filtering or pagination has been configured globally, but you wish to disable either of these features per table you can set `ts-display-filtering="false"` and/or `ts-display-pagination="false"` on the same element as `ts-wrapper`

 ```html
<table ts-wrapper ts-display-filtering="false" ts-display-pagination="false">
```

####Customized Filtering

To have a custom UI for filtering, build the UI around the table however you want and simply provide the `ts-filter-function` attribute with a function that will return a `boolean` for the item being iterated over.  This attribute must be set on the same element as `ts-wrapper`

If filtering has been globally configured it is probably a good idea to also set `ts-display-filtering="false"`
**NOTE** that the `ts-filter` attribute is not needed for custom filtering.

 ```js
$scope.data = [
   {id:1, name:"Product A", enabled: false},
   {id:2, name:"Product B", enabled: true},
   {id:3, name:"Product C", enabled: true}
 ];
$scope.customFilterValue = "";
$scope.customFilterFn = function(item){
    if($scope.customFilterValue == ""){
        return true;
    } else if($scope.customFilterValue === "false"){
        return !item.enabled
    } else {
        return item.enabled
    }
};
 ```
 
 ```html
<label>Enabled</label>
<select ng-model="customFilterValue">
  <option value="">Show All</option>
  <option value="true">Only Enabled Products</option>
  <option value="false">Only Disabled Products</option>
</select>

<table ts-wrapper ts-display-filtering="false" ts-filter-function="customFilterFn">
      <thead>
        <tr>
            <th ts-criteria="id">Id</th>
            <th ts-criteria="name|lowercase" ts-default>Name</th>
            <th ts-criteria="enabled">enabled</th>
        </tr>
    </thead>
    <tbody>
        <tr ng-repeat="item in data track by item.id" ts-repeat>
            <td>{{item.id}}</td>
            <td>{{item.name}}</td>
            <td>{{item.enabled}}</td>
        </tr>
    </tbody>
</table>
```