var myApp = angular.module( 'myApp', ['tableSort' ] );

function ShoppingCartCtrl($scope)  {

        $scope.items = [
			{Name: "Soap", Price: "25", Quantity: "10"},
			{Name: "Shaving cream", Price: "50", Quantity: "15"},
	                {Name: "Shampoo", Price: "100", Quantity: "5"},
			{Name: "Soap", Price: "125", Quantity: "10"},
			{Name: "Shaving cream", Price: "50", Quantity: "15"},
			{Name: "Shampoo", Price: "100", Quantity: "5"}
		];
}

var tableSortModule = angular.module( 'tableSort', [] );

tableSortModule.directive('sorttable', function( $log ) {
    return {
	scope: true,
	controller: function($scope) {
	    $scope.sortExpression = [];
	    $scope.headings = [];

	  var parse_sortexpr = function( expr ) {
	    var e = expr.split(" ");
	    if( e.length > 2 ) {
	      $log.error( "tablesorter: Invalid sort expression " + expr );
	      return [null,null, false];
	    }
	    else if( e.length === 2 ) {
	      e[1] = eval(e[1]);
	      return e.concat([false]);
	    }
	    else {
	      return e.concat( [null, false] );
	    }
	  };

	  this.setSortField = function( sortexpr, element ) {
		var i;
	    var expr = parse_sortexpr( sortexpr );
	      if( $scope.sortExpression.length === 1 && $scope.sortExpression[0][0] === expr[0] ) {
		if( $scope.sortExpression[0][2] ) {
		  element.removeClass( "sorttable-desc" );
		  element.addClass( "sorttable-asc" );
		  $scope.sortExpression[0][2] = false;
		}
		else {
		  element.removeClass( "sorttable-asc" );
		  element.addClass( "sorttable-desc" );
		  $scope.sortExpression[0][2] = true;
		}
	      }
	      else {
		for( i=0; i<$scope.headings.length; i=i+1 ) {
		    $scope.headings[i]
		      .removeClass( "sorttable-desc" )
		      .removeClass( "sorttable-asc" );
		}
		element.addClass( "sorttable-asc" );
  		$scope.sortExpression = [expr];
	      }
		$scope.$apply();
	    };

	    this.addSortField = function( sortexpr, element ) {
	      var i;
	      var toggle_order = false;
              var expr = parse_sortexpr( sortexpr )
		for( i=0; i<$scope.sortExpression.length; i=i+1 ) {
		  if( $scope.sortExpression[i][0] === expr[0] ) {
		    if( $scope.sortExpression[i][2] ) {
		      element.removeClass( "sorttable-desc" );
		      element.addClass( "sorttable-asc" );
		      $scope.sortExpression[i][2] = false;
		    }
		    else {
		      element.removeClass( "sorttable-asc" );
		      element.addClass( "sorttable-desc" );
		      $scope.sortExpression[i][2] = true;
		    }
		    toggle_order = true;
		  }
		}
	      if( !toggle_order ) {
	        element.addClass( "sorttable-asc" );
	        $scope.sortExpression.push( expr );
	      }
              $scope.$apply();
	    };

	    this.registerHeading = function( headingelement ) {
		$scope.headings.push( headingelement );
	    };

	    $scope.sortFun = function( a, b ) {
	      var i, aval, bval, descending;
	      for( i=0; i<$scope.sortExpression.length; i=i+1 ){
		aval = a[$scope.sortExpression[i][0]];
		bval = b[$scope.sortExpression[i][0]];
		if( $scope.sortExpression[i][1] ) {
		  aval = $scope.sortExpression[i][1]( aval );
		  bval = $scope.sortExpression[i][1]( bval );
		}
		filterFun = b[$scope.sortExpression[i][1]];
	        if( filterFun ) {
		  aval = filterFun( aval );
		  bval = filterFun( bval );
		}
		descending = $scope.sortExpression[i][2];
		if( aval > bval ) {
		  return descending ? -1 : 1;
		}
		else if( aval < bval ) {
		  return descending ? 1 : -1;
		}
	      }
	      return 0;
	    };
	}
    };
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
        }
    };
} );

tableSortModule.filter( 'tablesortOrderBy', function( $parse ){
    return function(array, sortfun ) {
	var arrayCopy = [];
	for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
	return arrayCopy.sort( sortfun );
    };
} );
