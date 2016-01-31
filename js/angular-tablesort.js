/*
 angular-tablesort v1.1.2
 (c) 2013-2015 Mattias Holmlund, http://mattiash.github.io/angular-tablesort
 License: MIT
*/

var tableSortModule = angular.module( 'tableSort', [] );

tableSortModule.directive('tsWrapper', ['$log', '$parse', function( $log, $parse ) {
    'use strict';
    return {
        scope: true,
        controller: ['$scope', function($scope) {
            $scope.sortExpression = [];
            $scope.headings = [];

            var parse_sortexpr = function( expr ) {
                return [$parse( expr ), null, false];
            };

            this.setSortField = function( sortexpr, element ) {
                var i;
                var expr = parse_sortexpr( sortexpr );
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
                }
                else {
                    for( i=0; i<$scope.headings.length; i=i+1 ) {
                        $scope.headings[i]
                            .removeClass( "tablesort-desc" )
                            .removeClass( "tablesort-asc" );
                    }
                    element.addClass( "tablesort-asc" );
                    $scope.sortExpression = [expr];
                }
            };

            this.addSortField = function( sortexpr, element ) {
                var i;
                var toggle_order = false;
                var expr = parse_sortexpr( sortexpr );
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
            };

            this.setTrackBy = function( trackBy ) {
                $scope.trackBy = trackBy;
            };

            this.registerHeading = function( headingelement ) {
                $scope.headings.push( headingelement );
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
        }]
    };
}]);

tableSortModule.directive('tsCriteria', function() {
    return {
        require: "^tsWrapper",
        link: function(scope, element, attrs, tsWrapperCtrl) {
            var clickingCallback = function(event) {
                scope.$apply( function() {
                    if( event.shiftKey ) {
                        tsWrapperCtrl.addSortField(attrs.tsCriteria, element);
                    }
                    else {
                        tsWrapperCtrl.setSortField(attrs.tsCriteria, element);
                    }
                } );
            };
            element.bind('click', clickingCallback);
            element.addClass('tablesort-sortable');
            if( "tsDefault" in attrs && attrs.tsDefault !== "0" ) {
                tsWrapperCtrl.addSortField( attrs.tsCriteria, element );
                if( attrs.tsDefault == "descending" ) {
                    tsWrapperCtrl.addSortField( attrs.tsCriteria, element );
                }
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
            var trackByMatch = repeatExpr.match(/\s+track\s+by\s+\S+?\.(\S+)/);
            if( trackByMatch ) {
                trackBy = trackByMatch[1];
                tsWrapperCtrl.setTrackBy(trackBy);
            }

            if (repeatExpr.search(/tablesort/) != -1) {
                repeatExpr = repeatExpr.replace(/tablesort/,"tablesortOrderBy:sortFun");
            } else {
                repeatExpr = repeatExpr.replace(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(\s+track\s+by\s+[\s\S]+?)?\s*$/,
                    "$1 in $2 | tablesortOrderBy:sortFun$3");
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

            angular.element(element[0]).attr(ngRepeatDirective, repeatExpr);
            $compile(element, null, 1000000)(scope);
        }
    };
}]);

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
