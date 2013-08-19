var myApp = angular.module( 'myApp', ['tableSort' ] );

function ShoppingCartCtrl($scope)  {
    
        $scope.items = [
			{Name: "Soap", Price: "25", Quantity: "10"},
			{Name: "Shaving cream", Price: "50", Quantity: "15"},
			{Name: "Shampoo", Price: "100", Quantity: "5"}
		];
}

var tableSortModule = angular.module( 'tableSort', [] );

tableSortModule.directive('sorttable', function() {
    return {
	scope: true,
	controller: function($scope) {
	    $scope.sortExpression = "";
	    $scope.headings = [];
	    this.setSortField = function( fieldname, element ) {
		var i;
		for( i=0; i<$scope.headings.length; i=i+1 ) {
		    $scope.headings[i].removeClass( "sorttable-desc" );
		}
		element.addClass( "sorttable-desc" );
		$scope.sortExpression = fieldname;
		$scope.$apply();
	    };

	    this.addSortField = function( fieldname, element ) {
		element.addClass( "sorttable-desc" );
		$scope.sortExpression = fieldname;
		$scope.$apply();
	    };

	    this.registerHeading = function( headingelement ) {
		$scope.headings.push( headingelement );
	    };

	    $scope.mySortFunction = function(item) {
		if(isNaN(item[$scope.sortExpression]))
		    return item[$scope.sortExpression];
		return parseInt(item[$scope.sortExpression]);
	    }
	    
	    $scope.sortFun = function( a, b ) {
		return a[$scope.sortExpression] > b[$scope.sortExpression] ? 1 : -1;
	    };
	    
	}
    }
} );

tableSortModule.directive('sort', function() {
    return {
	require: "^sorttable",
	link: function(scope, element, attrs, sortTableCtrl) {
	    var clickingCallback = function(event) {
		if( event.shiftKey ) {
		    sortTableCtrl.addSortField(attrs.sort, element);
		}
		else {
		    sortTableCtrl.setSortField(attrs.sort, element);
		}
	    };
	    element.bind('click', clickingCallback);
	    sortTableCtrl.registerHeading( element );
	}
    } 
});

tableSortModule.directive("sorttablerepeat", function() {
    return {
        priority: 2000,
        compile: function(tElement, tAttrs, transclude) {
            tAttrs.ngRepeat += " | tablesortOrderBy:sortFun";
            console.log(tAttrs);
        }
    };
} );

tableSortModule.filter( 'tablesortOrderBy', function( $parse ){
    return function(array, sortfun ) {
	var arrayCopy = [];
	for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
	
//	console.log(expr);
	
	return arrayCopy.sort( sortfun );
  } 
} );
