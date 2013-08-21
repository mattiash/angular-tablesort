var myApp = angular.module( 'myApp', ['tableSort' ] );

function tableTestCtrl($scope)  {
    $scope.items = [
	{Id: "01", Name: "A", Price: "1.00", Quantity: "1"},
	{Id: "02", Name: "B", Price: "10.00", Quantity: "1"},
	{Id: "04", Name: "C", Price: "9.50", Quantity: "10"},
	{Id: "03", Name: "a", Price: "9.00", Quantity: "2"},
	{Id: "06", Name: "b", Price: "100.00", Quantity: "2"},
	{Id: "05",Name: "c", Price: "1.20", Quantity: "2"},
    ];
}
