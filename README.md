AngularJS Tablesort
===================

Allow tables to be sorted by clicking their headings.

Web site: [http://mattiash.github.io/angular-tablesort](http://mattiash.github.io/angular-tablesort)

Background
----------

When you use jquery to build your web-pages, it is very easy to add sorting-functionality to your tables - include [tablesorter](http://tablesorter.com) and annotate your column headings slightly to tell it what type of data your table contains.

The goal with this module is to make it just as easy to add sorting to AngularJS tables, but with proper use of angular features and not jquery.

Click once on a heading to sort ascending, twice for descending. Use shift-click to sort on more than one column.

Additionally, these directives also makes it easy to add a default row that is shown in empty tables to make
it explicit that the table is intentionally empty and not just broken.

Usage
-----

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

The `ts-default` attribute can be set on one or more columns to sort on them in ascending order by default.
To sort in descending order, set ts-default to "descending"

The `ts-repeat` attribute must be set on the element with ng-repeat.

CSS
---

All table headings that can be sorted on is styled with css-class `tablesort-sortable`. The table headings that the table is currently sorted on is styled with `tablesort-asc` or `tablesort-desc` classes depending on the sort-direction. A stylesheet is included to show that it works, but you probably want to build your own.

The content and look of the default data for empty tables is controlled via css. It is inserted as one empty `<td>` spanning
all columns and placed inside a `<tr>` with class `showIfLast` The `<tr>` is placed at the top of each table.
