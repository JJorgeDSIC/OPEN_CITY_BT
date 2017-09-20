//define classes for GPC
var PolyDefault = gpcas.geometry.PolyDefault ;
var ArrayList = gpcas.util.ArrayList;
var PolySimple = gpcas.geometry.PolySimple;
var Clip = gpcas.geometry.Clip;
var OperationType = gpcas.geometry.OperationType;
var LmtTable = gpcas.geometry.LmtTable;
var ScanBeamTreeEntries = gpcas.geometry.ScanBeamTreeEntries;
var EdgeTable = gpcas.geometry.EdgeTable;
var EdgeNode = gpcas.geometry.EdgeNode;
var ScanBeamTree = gpcas.geometry.ScanBeamTree;
var Rectangle = gpcas.geometry.Rectangle;
var BundleState = gpcas.geometry.BundleState;
var LmtNode = gpcas.geometry.LmtNode;
var TopPolygonNode = gpcas.geometry.TopPolygonNode;
var AetTree = gpcas.geometry.AetTree;
var HState = gpcas.geometry.HState;
var VertexType = gpcas.geometry.VertexType;
var VertexNode = gpcas.geometry.VertexNode;
var PolygonNode = gpcas.geometry.PolygonNode;
var ItNodeTable = gpcas.geometry.ItNodeTable;
var StNode = gpcas.geometry.StNode;
var ItNode = gpcas.geometry.ItNode;
////

var poly1,poly2;

var context;
var canvas;


function drawLayout(polygonSet, height, scene){

	var numPolys = polygonSet.getNumInnerPoly();

	buildingGroup = CITY.PolygonUtils.extrudePolygon(polygonSet, height, new THREE.MeshLambertMaterial({wireframe: true}),  new THREE.MeshLambertMaterial({wireframe: true}));

	scene.add(buildingGroup);

};


var drawRoadMap = function(sizeX, sizeZ, streetAnchor, avenueAnchor, numAvenues, minSizeXAxis, maxSizeXAxis, minSizeYAxis, maxSizeYAxis, purgeArea, stepByStep, stepByStepDepthMode, radial, posx, posy, stdev){

	clearScreen();

	var time = Date.now();

	var paddingX = 10;
	var paddingZ = 10;

	var biggerSize = sizeX - sizeZ > 0? sizeX * 2: sizeZ * 2;

	var time = Date.now();

	var city = [
		[paddingX,			paddingZ],	
		[paddingX,			paddingZ + sizeZ],	
		[paddingX + sizeX,	paddingZ + sizeZ],	
		[paddingX + sizeX, 	paddingZ]	
	];

	var cityPoly = createPoly(city);

	if(stepByStep){
		drawPoly(cityPoly,"green",0,0);
		alert("Initial state");
	}

	var mean = minSizeXAxis;

	//var stdev = st;
	var midStreetAnchor = streetAnchor/2;

	var bounds = cityPoly.getBounds();

	var remaining = sizeX;

	var lowerY = bounds.y - 10;

	var upperY = bounds.y + bounds.h + 10;

	var roll; 

	var step = bounds.x;

	var polygonCuts = new gpcas.geometry.PolyDefault();



	while(remaining > minSizeXAxis){

		//roll = THREE.Math.randInt(minSizeXAxis,maxSizeXAxis); //add porb.disttribution?
		roll = rnd(mean, stdev);
		
		var rollCut = [

					[roll  - midStreetAnchor + step,					lowerY],	
					[roll  - midStreetAnchor + step,					upperY],	
					[roll  + midStreetAnchor + step,					upperY],	
					[roll  + midStreetAnchor + step, 					lowerY]

		];

		remaining = remaining - roll - midStreetAnchor;

		step += roll + midStreetAnchor;

		var rollPoly = createPoly(rollCut);

		polygonCuts.addPoly(rollPoly);

	}

	if(remaining < midStreetAnchor) polygonCuts.m_List._array.splice(polygonCuts.getNumInnerPoly() - 1, 1);

	if(stepByStep){
		drawPoly(polygonCuts,"green",0,0);
		alert("Cortes, sobrante: "  + remaining);
	}

	
	var diff = cityPoly.difference(polygonCuts);

	if(stepByStep){
		clearScreen();
		drawPoly(diff,"green",0,0);
		alert("Cortes en X");
	}

	//if(true) return;

	mean = (maxSizeYAxis + minSizeYAxis)/2;

	stdev = 5;

	var lowerX = bounds.x - 10;

	var upperX = bounds.x + bounds.w + 10;

	var roll; 

	var step = bounds.y;

	remaining = sizeZ;

	var polygonCuts = new gpcas.geometry.PolyDefault();

	while(remaining > minSizeYAxis){

		//roll = THREE.Math.randInt(minSizeYAxis,maxSizeYAxis); //add porb.disttribution?
		roll = rnd(mean, stdev);
		
		var rollCut = [

					[lowerX, 	roll  - midStreetAnchor + step],	
					[lowerX, 	roll  + midStreetAnchor + step],	
					[upperX, 	roll  + midStreetAnchor + step],	
					[upperX, 	roll  - midStreetAnchor + step]

		];

		remaining = remaining - roll - midStreetAnchor;

		step += roll + midStreetAnchor;

		var rollPoly = createPoly(rollCut);

		polygonCuts.addPoly(rollPoly);

		if(stepByStep){
			drawPoly(rollPoly,"green",0,0);
			alert("Cortes en Y");
		}

		

	}

	if(stepByStep){
		drawPoly(polygonCuts,"green",0,0);
		alert("Cortes, sobrante: "  + remaining);
	}


	var diff = diff.difference(polygonCuts);

	if(stepByStep){
		clearScreen();
		drawPoly(diff,"green",0,0);
		alert("Cortes en Y");
	}

 	

 	if(remaining < midStreetAnchor) polygonCuts.m_List._array.splice(polygonCuts.getNumInnerPoly() - 1, 1);

	var avenue = [
		[0,				-biggerSize],	
		[avenueAnchor,	-biggerSize],	
		[avenueAnchor,	biggerSize],	
		[0, 			biggerSize]	
	];

	var avenuePolygon = createPoly(avenue);

	//To configure operations

	//PolygonUtils.rotatePolygon(avenuePolygon, 30);

	//PolygonUtils.scalePolygon(avenuePolygon, 2,2);

	PolygonUtils.translatePolygon(avenuePolygon, sizeX/2,0);
	//Example of random transformations
	
	var angle = 15;
	var grad = 360/angle;

	var angleIterations = 0;

	for(var i = 0; i < numAvenues; i++){
		//alert("cut");
		diff = diff.difference(avenuePolygon);
	
		if(radial){
			PolygonUtils.translatePolygon(avenuePolygon,THREE.Math.randInt(0,sizeX/2),0);
			PolygonUtils.rotatePolygon(avenuePolygon,THREE.Math.randInt(0,360), new Point(sizeX/2 + paddingX, sizeZ/2 + paddingZ));
		}else{
			PolygonUtils.translatePolygon(avenuePolygon,THREE.Math.randInt(0,sizeX),0);
		}
		angleIterations += angle;
	}

	var roadMap = new gpcas.geometry.PolyDefault();
	
	//Clean result, purge here by Area or sizes?
	for(var i = 0; i < diff.getNumInnerPoly(); i++){
		
		var poly = diff.getInnerPoly(i);
	
		if(poly.getArea() >= purgeArea ){
		//if(poly.getNumPoints(0) < 4){
			poly.type = THREE.Math.randInt(0,1);
			//poly.type = 0;
			roadMap.addPoly(poly);
	
		}

	}

	return roadMap;


}

function rnd_snd() {
	return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}

function rnd(mean, stdev) {
	return Math.round(rnd_snd()*stdev+mean);
}
					
var drawRoadMap2InitialPoly = function(sizeX, sizeZ, streetAnchor, avenueAnchor, numAvenues, minSizeXAxis, maxSizeXAxis, minSizeYAxis, maxSizeYAxis, purgeArea, stepByStep, stepByStepDepthMode, radial, initialPoly, posx, posy, finalLayout, type){

	var bounds = initialPoly.getBounds();

	var sizeX = bounds.w;
	var sizeZ = bounds.h;
	var Xpos = bounds.x;
	var Zpos = bounds.y;

	var biggerSize = sizeX - sizeZ > 0? sizeX * 2: sizeZ * 2;

	var avenue = [
		[0,				-biggerSize * 10],	
		[avenueAnchor,	-biggerSize * 10],	
		[avenueAnchor,	biggerSize * 10],	
		[0, 			biggerSize * 10]	
	];

	var avenuePolygon = createPoly(avenue);

	var time = Date.now();

	//Review
	var paddingX = 10;
	var paddingZ = 10;



	var cityPoly = initialPoly;

	if(stepByStep){
		drawPoly(cityPoly,"green",0,0);
		alert("Initial state");
	}

	var minSize = minSizeXAxis;

	var maxSize = maxSizeXAxis;

	var polygonStack = [];

	polygonStack.push(cityPoly);

	var stored = [];

	var it = 0;

	var cuts = [];

	while(polygonStack.length > 0){
		
		var poly = polygonStack.pop();

		if(poly == undefined || poly instanceof PolySimple){
			alert("Error on generation");
			continue;
		}

		//Compute bounds
		var bounds = poly.getBounds();

		var lowerY = bounds.y - 10;

		var upperY = bounds.y + bounds.h + 10;

		//With margin

		var size = bounds.x + bounds.w;

		var lowerX = bounds.x + maxSize + streetAnchor;

		var upperX = size - maxSize - streetAnchor;

		var lowerXRoll = lowerX + streetAnchor;

		var upperXRoll = upperX - streetAnchor;


		if(minSize <= bounds.w && bounds.w <= maxSize){
			//Valid polygon
			stored.push(poly);
			continue;
		}

		var midW = bounds.w/2;

		if(midW > minSize + streetAnchor && midW <= maxSize){

			var lowX = bounds.x + midW;
			var upX = lowX + streetAnchor;

			var cutMidVertex = [

				[lowX,	lowerY +  10],	
				[lowX,	upperY - 10],	
				[upX,	upperY - 10],	
				[upX,	lowerY +  10]

			];

			////drawPoly(poly,"green",0,0);

			var cutMid = createPoly(cutMidVertex);

			var diff = poly.difference(cutMid);

			for(var i = 0; i < diff.getNumInnerPoly(); i+=1){
				var polycut = diff.getInnerPoly(i);

				if(stepByStep){
					drawPoly(polycut,"green",0,0);
					alert("cut");
				}

				stored.push(polycut);
			}

			continue;
		}
		

		var vertexs = getPolygonVertices(poly);

		if(upperX - lowerX <= 1){
			stored.push(poly);
			continue;
		}

		//console.log(bounds);

		var rollX = THREE.Math.randInt(lowerXRoll,upperXRoll);

		//console.log("reroll 1 => %s", rollX);

		var rollCounter = 1;

		while(size - rollX < minSize){
			//Danger zone - to review
			if(stepByStepDepthMode){

				var cutVertexsInner = [

					[rollX - streetAnchor,					lowerY],	
					[rollX - streetAnchor,					upperY],	
					[rollX,									upperY],	
					[rollX, 								lowerY]

				];

				var cutInner = createPoly(cutVertexsInner);
				drawPoly(cutInner,"black",0,0);
				alert("roll");
			}
			rollX = THREE.Math.randInt(lowerXRoll,upperXRoll);

		}

		var cutVertexs = [

			[rollX,					lowerY],	
			[rollX,					upperY],	
			[rollX + streetAnchor,	upperY],	
			[rollX + streetAnchor, 	lowerY]

		];

		var cut = createPoly(cutVertexs);

		var diff = poly.difference(cut);

		var numInnerPolys = diff.getNumInnerPoly();

		

		for(var i = 0; i < numInnerPolys; i+=1){
			var polycut = diff.getInnerPoly(i);

			if(stepByStep){
					drawPoly(cut,"black",0,0);
					drawPoly(polycut,"green",0,0);
					alert("cut");
			}

			polygonStack.push(polycut);
		}

	}

	minSize = minSizeYAxis;

	maxSize = maxSizeYAxis;

	var resultPolygonList = [];

	while(stored.length > 0){	

		var poly = stored.pop();

		if(poly == undefined || poly instanceof PolySimple){

			continue;
		}
	
		//Compute bounds

		var bounds = poly.getBounds();

		var lowerX = bounds.x - 10;

		var upperX = bounds.x + bounds.w + 10;

		//With margin

		var size = bounds.h + bounds.y;

		var lowerY = bounds.y + maxSize + streetAnchor;

		var upperY = size - maxSize - streetAnchor;

		//console.log("bounds");
		//console.log(bounds);
		//console.log("Restante %s %s %s", lowerY, upperY, upperY - lowerY);
		//alert("bounds");

		if(minSize <= bounds.h && bounds.h <= maxSize){
			//Valid polygon
			resultPolygonList.push(poly);
			continue;
		}

		var midW = bounds.h/2;

		if(midW > minSize + streetAnchor && midW <= maxSize){

			var lowY = bounds.y + midW;
			var upY = lowY + streetAnchor;

			var cutMidVertex = [

				[lowerX + 10,	lowY],	
				[upperX - 10,	lowY],	
				[upperX - 10,	upY],	
				[lowerX + 10,	upY]

			];

			var cutMid = createPoly(cutMidVertex);

			var diff = poly.difference(cutMid);

			for(var i = 0; i < diff.getNumInnerPoly(); i+=1){

				var polycut = diff.getInnerPoly(i);

				if(stepByStep){
					drawPoly(cutMid,"black",0,0);
					drawPoly(polycut,"green",0,0);
					alert("cut");
				}

				resultPolygonList.push(polycut);
			}

			continue;
		}
		

		var vertexs = getPolygonVertices(poly);

		if(upperY - lowerY <= 1){

			resultPolygonList.push(poly);
			continue;
		}

		var lowerYRoll = lowerY + streetAnchor;
		var upperYRoll = upperY - streetAnchor;

		var rollY = THREE.Math.randInt(lowerYRoll, upperYRoll);

		var rollCounter = 1;

		while((size - rollY) < minSize){
			
			
			rollY = THREE.Math.randInt(lowerYRoll, upperYRoll);
			
		}

		var cutVertexs = [

			[lowerX,	rollY],	
			[upperX,	rollY],	
			[upperX,	rollY + streetAnchor],	
			[lowerX,	rollY + streetAnchor],
		];
		
		var cut = createPoly(cutVertexs);

		var diff = poly.difference(cut);

		var numInnerPolys = diff.getNumInnerPoly();

		for(var i = 0; i < numInnerPolys; i+=1){

			var polycut = diff.getInnerPoly(i);
			if(stepByStep){
					//drawPoly(cut,"black",0,0);
					//drawPoly(polycut,"green",0,0);
					//alert("cut");
			}
			stored.push(polycut);
		}

	

	}

	if(stepByStep){
		
		alert("Screen will be deleted because of paint the result");
		//clearScreen();
	}

	//PrimaryroadMap
	var diff = new gpcas.geometry.PolyDefault();

	
	for(var i = 0; i < resultPolygonList.length; i+=1){
			var polycut = resultPolygonList[i];
			diff.addPoly(polycut);
			
			
	}

	var angle = 15;
	var grad = 360/angle;

	var angleIterations = 0;

	for(var i = 0; i < numAvenues; i++){

		
		
		if(radial){
			PolygonUtils.translatePolygon(avenuePolygon,THREE.Math.randInt(Xpos, Xpos + sizeX),Zpos + sizeZ/2);
			PolygonUtils.rotatePolygon(avenuePolygon,THREE.Math.randInt(0,360), new Point(Xpos +sizeX/2,Zpos +sizeZ/2));
		}else{
			PolygonUtils.translatePolygon(avenuePolygon,THREE.Math.randInt(Xpos, Xpos + sizeX),Zpos + sizeZ/2);
			
		}
		diff = diff.difference(avenuePolygon);

		angleIterations += angle;
	}

	var misSizeX = maxSizeXAxis/2;
	var misSizeZ = maxSizeYAxis/2;
	
	//Clean result, purge here by Area or sizes?
	for(var i = 0; i < diff.getNumInnerPoly(); i++){
		
		var poly = diff.getInnerPoly(i);
		var bounds = poly.getBounds();
		var xSide = bounds.w;
		var zSide = bounds.h;

		//console.log("xSide",xSide);
		//console.log("zSide",zSide);
	
		if(poly.getArea() >= purgeArea && xSide >= misSizeX && zSide >= misSizeZ){
		//if(poly.getNumPoints(0) < 4){
			poly.type = type;
			finalLayout.addPoly(poly);
			
		}
		
			
			//alert("POLY MALO");
	}

	return finalLayout;

}

var randomIntFromInterval =function(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

var createPoly = function(points) {
    var res  = new PolyDefault();
    for(var i=0 ; i < points.length ; i++) {    
        res.addPoint(new Point(points[i][0],points[i][1]));
    }
    return res;
}

var createPolySimple = function(points) {
    var res  = new PolySimple();
    for(var i=0 ; i < points.length ; i++) {    
        res.addPoint(new Point(points[i][0],points[i][1]));
    }
    return res;
}

var getPolygonVertices = function(poly) {
	var vertices=[];
	var numPoints = poly.getNumPoints();
	var i;

	for(i=0;i<numPoints;i++) {
		vertices.push([poly.getX(i) , poly.getY(i)]);
	}
	return vertices;
}

var drawPoly = function(polygon,strokeColor,ox,oy) {
	var num = polygon.getNumInnerPoly();
	var i;
	
	//if more than one poly produced, use multiple color to display
	var colors=["#91ab19","#ab9119","#e5ce35","#ab1998"];
	
	for(i=0;i<num;i++) {
		var poly = polygon.getInnerPoly(i);
		var vertices  = getPolygonVertices(poly);

		if(i==0)	drawSinglePoly(vertices,strokeColor,poly.isHole(),ox,oy);
		else 	drawSinglePoly(vertices,colors[i%num],poly.isHole(),ox,oy);
		
	}
	
	
}


var drawSinglePoly = function(vertices,strokeColor,hole,ox,oy) {
	/*
	var i;
	
	if(ox==undefined)	ox = 0;
	if(oy==undefined)	oy = 0;
	
	context.beginPath();
	context.moveTo(vertices[0][0]+ox, vertices[0][1]+oy);

	for(i=1;i<vertices.length;i++) {
		context.lineTo(vertices[i][0]+ox, vertices[i][1]+oy);
		
	}
	
	
	context.lineWidth = 2;
	context.strokeStyle = strokeColor;
	context.fillStyle = "rgba(255, 0, 0, 0.1)";
	
	if(hole==true) {
		context.fillStyle = "#ffffff";
	}
	context.closePath();
	context.stroke();
	context.fill();
	*/
}

var clearScreen = function() {
	/*
	context.clearRect (
		0,
		0,
		document.getElementById("sizeXField").value * 2,
		document.getElementById("sizeZField").value * 2);
*/
}


/*
* @author Javier JC
* Based on GPC library examples
*/

PolygonUtils = function(){};
PolygonUtils.DEBUG = false;

var p = PolygonUtils.prototype;
var static = PolygonUtils;

 /*

Based on code from Box3@Threejs

*/

static.computeBoundingBox2D = function ( polygonDefault ) {

  var points = polygonDefault.getPoints();

  var point = points[ 0 ];

  var minX = point.x; 
  var maxX = point.x;
  var minY = point.y;
  var maxY = point.y;

  for ( var i = 1, il = points.length; i < il; i ++ ) {

    if ( points[i].x < minX ) {

      minX = points[i].x;

    } else if ( points[i].x > maxX ) {

      maxX = points[i].x;

    }

    if ( points[i].y < minY ) {

      minY = points[i].y;

    } else if ( points[i].y > maxY ) {

      maxY = points[i].y;

    }

  }

  return {minX: minX, maxX: maxX, minY: minY, maxY: maxY};
   
};  


static.computeCentroid = function ( polygonDefault ) {

  var x, y, xSum, ySum;

  xSum = ySum = 0;

  var points = polygonDefault.getPoints();
  
  //Test if the point of the end is not equal than the point of the end
  var nVerts = points.length;

    for(var i = 0; i < nVerts; i++){

      xSum += points[i].x;
      ySum += points[i].y;
    }

   return new Point(xSum/nVerts,ySum/nVerts);
    
  

};

static.translatePolygon = function (polygonDefault, tx, ty ) {

  var points = polygonDefault.getPoints();

  for(var i = 0; i < points.length; i++){

    points[i].x += tx;
    points[i].y += ty;
  }


};

static.rotatePolygon = function ( polygonDefault, angle, centroid ) {

	//this.angle = ((angle/180)*Math.PI);
	angleRad = (angle / 180) * Math.PI;

	var cosAngle = Math.cos(angleRad);
	var sinAngle = Math.sin(angleRad);

	var points = polygonDefault.getPoints();

	var boundingBox2D = static.computeBoundingBox2D(polygonDefault);

	//console.log(centroid);

	if(centroid == undefined){ 
		var centroid = static.computeCentroid(polygonDefault);
	}

	var centreX = Math.abs(boundingBox2D.maxX - boundingBox2D.minX)/2; 
	var centreY = Math.abs(boundingBox2D.maxY - boundingBox2D.minY)/2; 

	for(var i = 0; i < points.length; i++){

		var xt = points[i].x;
		var yt = points[i].y;

		//Default position
		//points[i].x = 500 + (xt - 500)*cosAngle-(yt - 250)*sinAngle;
		//points[i].y = 250 + (xt - 500)*sinAngle+(yt - 250)*cosAngle;

		//Centre position
		//points[i].x = centreX + (xt - centreX)*cosAngle-(yt - centreY)*sinAngle;
		//points[i].y = centreY + (xt - centreX)*sinAngle+(yt - centreY)*cosAngle;

		//Centroid position
		points[i].x = centroid.x + (xt - centroid.x)*cosAngle-(yt - centroid.y)*sinAngle;
		points[i].y = centroid.y + (xt - centroid.x)*sinAngle+(yt - centroid.y)*cosAngle;


		
		}


};

static.scalePolygon = function ( polygonDefault, sx, sy ) {

  var points = polygonDefault.getPoints();

  var centroid = static.computeCentroid(polygonDefault);

  for(var i = 0; i < points.length; i++){

    var xt = points[i].x - centroid.x;
    var yt = points[i].y - centroid.y;

    xt *= sx;
    yt *= sy;

    points[i].x = xt + centroid.x;
    points[i].y = yt + centroid.y;

  }
 
};