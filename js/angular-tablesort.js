/*
 angular-tablesort v1.1.2 - MODIFIED
 (c) 2013-2015 Mattias Holmlund, http://mattiash.github.io/angular-tablesort
 License: MIT
*/

//TODO: Make paging optional
//TODO: Paging options
//TODO: Make filtering optional & customizable (only certain fields, different UI's, etc.)
//TODO: Add templates & configs for paging & filtering (filtering could be text, dropdown, etc...)
//TODO: Submit PR

var tableSortModule = angular.module( 'tableSort', [] );

tableSortModule.provider('tableSortConfig', function () {

    this.setPaginationTemplate = function (templateString) {
        this.paginationTemplate = templateString;
    };

    this.$get = function () {
        return this;
    };

});

tableSortModule.directive('tsWrapper', ['$parse', '$compile', function( $parse, $compile ) {
    'use strict';
    return {
        scope: true,
        controller: ['$scope', 'tableSortConfig', function($scope, tableSortConfig) {
            $scope.paginationTemplate = "";
            
            $scope.sortExpression = [];
            $scope.headings = [];

            var parse_sortexpr = function( expr, name ) {
                return [$parse( expr ), null, false, name ? name : expr];
            };

            this.setSortField = function( sortexpr, element, name ) {
                var i;
                var expr = parse_sortexpr( sortexpr, name );
                if( $scope.sortExpression.length === 1
                    && $scope.sortExpression[0][0] === expr[0] ) {
                    if( $scope.sortExpression[0][2] ) {
                        element.removeClass( "tablesort-desc" );
                        element.addClass( "tablesort-asc" );
                        $scope.sortExpression[0][2] = false;
                    }
                    else {
                        element.removeClass( "tablesort-asc" );
                        element.addClass( "tablesort-desc" );
                        $scope.sortExpression[0][2] = true;
                    }
                    $scope.$emit('tablesort:sortOrder', [{
                      name: $scope.sortExpression[0][3],
                      order: $scope.sortExpression[0][2]
                    }]);
                }
                else {
                    for( i=0; i<$scope.headings.length; i=i+1 ) {
                        $scope.headings[i]
                            .removeClass( "tablesort-desc" )
                            .removeClass( "tablesort-asc" );
                    }
                    element.addClass( "tablesort-asc" );
                    $scope.sortExpression = [expr];
                    $scope.$emit('tablesort:sortOrder', [{
                      name: expr[3],
                      order: expr[2]
                    }]);
                }
            };

            this.addSortField = function( sortexpr, element, name ) {
                var i;
                var toggle_order = false;
                var expr = parse_sortexpr( sortexpr, name );
                for( i=0; i<$scope.sortExpression.length; i=i+1 ) {
                    if( $scope.sortExpression[i][0] === expr[0] ) {
                        if( $scope.sortExpression[i][2] ) {
                            element.removeClass( "tablesort-desc" );
                            element.addClass( "tablesort-asc" );
                            $scope.sortExpression[i][2] = false;
                        }
                        else {
                            element.removeClass( "tablesort-asc" );
                            element.addClass( "tablesort-desc" );
                            $scope.sortExpression[i][2] = true;
                        }
                        toggle_order = true;
                    }
                }
                if( !toggle_order ) {
                    element.addClass( "tablesort-asc" );
                    $scope.sortExpression.push( expr );
                }

                $scope.$emit('tablesort:sortOrder', $scope.sortExpression.map(function (a) {
                  return {
                    name: a[3],
                    order: a[2]
                  };
                }));

            };

            this.setTrackBy = function( trackBy ) {
                $scope.trackBy = trackBy;
            };

            this.registerHeading = function( headingelement ) {
                $scope.headings.push( headingelement );
            };
            
            this.setDataForPager = function(dataArrayExp){
                $scope.itemsArrayExpression = dataArrayExp;
            }
            
            $scope.itemsArrayExpression = ""; //this will contain the string expression for the array of items in the table
            
            $scope.pagination = {
                 currentPage:1,
                 perPage: 10,
                 perPageOptions:[5, 10, 25, 50, 100]
            };

            $scope.sortFun = function( a, b ) {
                var i, aval, bval, descending, filterFun;
                for( i=0; i<$scope.sortExpression.length; i=i+1 ){
                    aval = $scope.sortExpression[i][0](a);
                    bval = $scope.sortExpression[i][0](b);
                    filterFun = b[$scope.sortExpression[i][1]];
                    if( filterFun ) {
                        aval = filterFun( aval );
                        bval = filterFun( bval );
                    }
                    if( aval === undefined || aval === null ) {
                        aval = "";
                    }
                    if( bval === undefined || bval === null ) {
                       bval = "";
                    }
                    descending = $scope.sortExpression[i][2];
                    if( aval > bval ) {
                        return descending ? -1 : 1;
                    }
                    else if( aval < bval ) {
                        return descending ? 1 : -1;
                    }
                }

                // All the sort fields were equal. If there is a "track by" expression,
                // use that as a tiebreaker to make the sort result stable.
                if( $scope.trackBy ) {
                    aval = a[$scope.trackBy];
                    bval = b[$scope.trackBy];
                    if( aval === undefined || aval === null ) {
                        aval = "";
                    }
                    if( bval === undefined || bval === null ) {
                        bval = "";
                    }
                    if( aval > bval ) {
                        return descending ? -1 : 1;
                    }
                    else if( aval < bval ) {
                        return descending ? 1 : -1;
                    }
                }
                return 0;
            };
            
            $scope.pageLimitFun = function(array){
                //Only return the items that are in the correct index range for the currently selected page
                var begin = ($scope.pagination.currentPage-1) * $scope.pagination.perPage;
                var end = ($scope.pagination.currentPage) * $scope.pagination.perPage;
                var final=[];
                for(var i=0; i < array.length; i++){
                    if(i >= begin && i < end){
                        final.push(array[i]);
                    }
                }
                return final;
            };
           
           $scope.getPageRangeString = function(total){
               return (($scope.pagination.currentPage-1) * $scope.pagination.perPage)+1 +"-"+ Math.min((($scope.pagination.currentPage) * $scope.pagination.perPage), total);
           };
           
           $scope.filtering={
               filterString:"",
               filteredCount:0,
               filterFields:[]
           };
           
           $scope.filterLimitFun = function(array){
                if($scope.filtering.filterString === ""){
                    //Return unfiltered when nothing is being searched
                    $scope.filtering.filteredCount = array.length;
                    return array;
                }
                //run custom filter function here if passed in!
                var filteredArr = array.filter(function(item){
                    var shouldInclude = false;
                    for( var i=0; i<$scope.filtering.filterFields.length; i=i+1 ) {
                        if(!shouldInclude){
                            var str = $scope.filtering.filterFields[i][0](item).toString();
                            shouldInclude = str.indexOf($scope.filtering.filterString) > -1;
                        }
                    }
                    return shouldInclude;
                });
                $scope.filtering.filteredCount = filteredArr.length;
                return filteredArr;
            };
            
            this.addFilterField = function( sortexpr, element, name ) {
                var expr = parse_sortexpr( sortexpr, name );
                $scope.filtering.filterFields.push( expr )
            };
        }],
        link: function($scope, $element){
            //Wrap the table in a new element
            $element.wrap("<div class='ts-container'></div>");
            var $container = $element.parent();
            //==============================
            //Add filtering HTML before the table
            var filterString = "<div class='pull-right'>"
            filterString +=    "  <div class='form-group' style='display:inline-block;'><label class='control-label'>Filter Items</label><input type='search' class='form-control' ng-model='filtering.filterString'/></div>";
            filterString +=    "</div>";
            filterString +=    "<div class='clearfix'></div>";
            var $filter = $compile(filterString)($scope);
            $container.prepend($filter);
            //==============================
            //Add pagination HTML after the table
            if($scope.paginationTemplate !== ""){
                console.info($scope.paginationTemplate)
                //Replace some strings with the proper expressions to be compiled
                var pagerString = $scope.paginationTemplate
                    .replace(/CURRENT_PAGE_RANGE/g,"getPageRangeString(TOTAL_COUNT)")
                    .replace(/TOTAL_COUNT/g, $scope.itemsArrayExpression + ".length")
                    .replace(/PER_PAGE_OPTIONS/g, 'pagination.perPageOptions')
                    .replace(/ITEMS_PER_PAGE/g, 'pagination.perPage')
                    .replace(/FILTERED_COUNT/g,"filtering.filteredCount")
                    .replace(/CURRENT_PAGE_NUMBER/g,"pagination.currentPage")
                    
                var $pager = $compile(pagerString)($scope);
                $container.append($pager);
            }
        }
    };
}]);

tableSortModule.directive('tsCriteria', function() {
    return {
        require: "^tsWrapper",
        link: function(scope, element, attrs, tsWrapperCtrl) {
            var clickingCallback = function(event) {
                scope.$apply( function() {
                    if( event.shiftKey ) {
                        tsWrapperCtrl.addSortField(attrs.tsCriteria, element, attrs.tsName);
                    }
                    else {
                        tsWrapperCtrl.setSortField(attrs.tsCriteria, element, attrs.tsName);
                    }
                } );
            };
            element.bind('click', clickingCallback);
            element.addClass('tablesort-sortable');
            if( "tsDefault" in attrs && attrs.tsDefault !== "0" ) {
                tsWrapperCtrl.addSortField( attrs.tsCriteria, element, attrs.tsName );
                if( attrs.tsDefault == "descending" ) {
                    tsWrapperCtrl.addSortField( attrs.tsCriteria, element, attrs.tsName );
                }
            }
            if( "tsFilter" in attrs) {
                tsWrapperCtrl.addFilterField( attrs.tsCriteria, element, attrs.tsName );
            }
            tsWrapperCtrl.registerHeading( element );
        }
    };
});

tableSortModule.directive("tsRepeat", ['$compile', function($compile) {
    return {
        terminal: true,
        multiElement: true,
        require: "^tsWrapper",
        priority: 1000000,
        link: function(scope, element, attrs, tsWrapperCtrl) {
            var repeatAttrs = ["ng-repeat", "data-ng-repeat", "ng-repeat-start", "data-ng-repeat-start"];
            var ngRepeatDirective = repeatAttrs[0];
            var tsRepeatDirective = "ts-repeat";
            for (var i = 0; i < repeatAttrs.length; i++) {
                 if (angular.isDefined(element.attr(repeatAttrs[i]))) {
                    ngRepeatDirective = repeatAttrs[i];
                    tsRepeatDirective = ngRepeatDirective.replace(/^(data-)?ng/, '$1ts');
                    break;
                }
            }

            var repeatExpr = element.attr(ngRepeatDirective);
            var trackBy = null;
            var repeatExprRegex = /^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(\s+track\s+by\s+[\s\S]+?)?\s*$/;
            var trackByMatch = repeatExpr.match(/\s+track\s+by\s+\S+?\.(\S+)/);
            var repeatInMatch = repeatExpr.match(repeatExprRegex);
            if( trackByMatch ) {
                trackBy = trackByMatch[1];
                tsWrapperCtrl.setTrackBy(trackBy);
            }

            if (repeatExpr.search(/tablesort/) != -1) {
                repeatExpr = repeatExpr.replace(/tablesort/,"tablesortOrderBy:sortFun | tablesortFilterLimit:filterLimitFun | tablesortPageLimit:pageLimitFun");
            } else {
                repeatExpr = repeatExpr.replace(repeatExprRegex, "$1 in $2 | tablesortOrderBy:sortFun | tablesortFilterLimit:filterLimitFun | tablesortPageLimit:pageLimitFun$3");
            }
            
            if (angular.isUndefined(attrs.tsHideNoData)) {
                var noDataRow = angular.element(element[0]).clone();
                noDataRow.removeAttr(ngRepeatDirective);
                noDataRow.removeAttr(tsRepeatDirective);
                noDataRow.addClass("showIfLast");
                noDataRow.children().remove();
                noDataRow.append('<td colspan="' + element[0].childElementCount + '"></td>');
                noDataRow = $compile(noDataRow)(scope);
                element.parent().prepend(noDataRow);
            }
            
            //pass the `itemsList` from `item in itemsList` to the master directive
            tsWrapperCtrl.setDataForPager(repeatInMatch[2])

            angular.element(element[0]).attr(ngRepeatDirective, repeatExpr);
            $compile(element, null, 1000000)(scope);
        }
    };
}]);

tableSortModule.filter( 'tablesortPageLimit', function(){
    return function(array, pageLimitFun) {
       if(!array) return;
       return pageLimitFun(array);
    };
} );

tableSortModule.filter( 'tablesortFilterLimit', function(){
    return function(array, filterLimitFun) {
       if(!array) return;
        return filterLimitFun( array );
    };
} );

tableSortModule.filter( 'tablesortOrderBy', function(){
    return function(array, sortfun ) {
        if(!array) return;
        var arrayCopy = [];
        for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
        return arrayCopy.sort( sortfun );
    };
} );

tableSortModule.filter( 'parseInt', function(){
    return function(input) {
        return parseInt( input ) || null;
    };
} );

tableSortModule.filter( 'parseFloat', function(){
    return function(input) {
        return parseFloat( input ) || null;
    };
} );