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
