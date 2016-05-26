$(document).ready(main);

function main() {

	// hide jumbotron until navigation bar finishes loading
	$(".jumbotron").hide();
	// load navigation bar
	$("#navbarheader").load("navigationbar.html",function(){
	// show jumbotron after navigation bar loads
		$(".jumbotron").show();
	});
		
};