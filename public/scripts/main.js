require.config({
	baseURL: "../public/"
	,paths: {
		"jquery": "bower_components/jquery/dist/jquery.min"
		,"common": "bower_components/common/common"
		,"shape": "scripts/shape"
	}
});

requirejs(['common','jquery',"shape"] , function(){
	var cvs = document.getElementById("cvs")
		,ctx = cvs.getContext("2d");

	var poly = new Polygon();
	poly.points = poly.getPoints("10, 10, 20, 10, 20, 20, 10, 20");
	poly.stroke(ctx);
});

