/*
* @author Javier JC
* Based on GPC library examples
*/
CITY.PolygonUtils = function(){};
CITY.PolygonUtils.DEBUG = false;

var p = CITY.PolygonUtils.prototype;
var static = CITY.PolygonUtils;

static.setCanvasContext = function(context) {

 this.context = context;

};

//////////Bool OPERATIONS

static.difference = function(e) {

	var diff = poly1.difference(poly2);
	
	
};

static.intersection = function(e) {
	
	var diff = poly1.intersection(poly2);
	
};

static.union = function(e) {

	var diff = poly1.union(poly2);
	
};

static.xor = function(e) {

	var diff = poly1.xor(poly2);
	
};

//////////TRANSFORMATIONS

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
    this.centroid = static.computeCentroid(polygonDefault);
    var centroid = this.centroid;
  }

  //var centreX = Math.abs(boundingBox2D.maxX - boundingBox2D.minX)/2; 
  //var centreY = Math.abs(boundingBox2D.maxY - boundingBox2D.minY)/2; 

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






static.createPoly = function(points) {

  var res  = new PolyDefault();
  for(var i=0 ; i < points.length ; i++) {    
    res.addPoint(new Point(points[i][0],points[i][1]));
  }
  return res;
};

static.createPolySimple = function(points) {
  var res  = new PolySimple();
  for(var i=0 ; i < points.length ; i++) {    
    res.addPoint(new Point(points[i][0],points[i][1]));
  }
  return res;
};

static.getPolygonVertices = function(poly) {
	var vertices=[];
	var numPoints = poly.getNumPoints();
	var i;
	
	for(i=0;i<numPoints;i++) {
		vertices.push([poly.getX(i) , poly.getY(i)]);
	}
	return vertices;
};


static.convertPolygonToVertexArray = function(polygonDefault) {
  if(polygonDefault.getNumInnerPoly > 1){
    
    console.log(polygonDefault);
  }
   
  return static.convertSimplePolygonToVertexArray(static.getPolygonVertices(polygonDefault.getInnerPoly(0)));

};

static.convertSimplePolygonToVertexArray = function(vertices) {
  var i;

  var points = [];
  points.push(new Point(vertices[0][0], vertices[0][1]));

  for(i=1;i<vertices.length;i++) {

    points.push(new Point(vertices[i][0], vertices[i][1])); 
  }
  
  //if(CITY.PolygonUtils.DEBUG)//console.log(points);
  //console.log("POINTS");
  //console.log(points);
  return points;

};



static.extrudePolygonOnPosition = function(polyDefault, height, x, y, z, wallMaterial, roofMaterial, groundfloor, posY){

	var group = CITY.PolygonUtils.extrudePolygon(polyDefault, height, posx, posy, posz, wallMaterial, roofMaterial, groundfloor, posY);
	group.position.x = x;
	group.position.y = y;
	group.position.z = z;

};


function extrudeSidewalks(polygonSet, height, scene){//,pointsLights

  //this.pointsLights = pointsLights;

  var numPolys = polygonSet.getNumInnerPoly();

  buildingGroup = CITY.PolygonUtils.extrudeSideWalkPolygon(polygonSet, height, CITY.sidewalkMaterial,  CITY.sidewalkMaterial, false, 0);

  scene.add(buildingGroup);

  return buildingGroup;
  
  
};


static.extrudeSideWalkPolygon = function(polyDefault, height, wallMaterial, roofMaterial, groundfloor, posY){

  var geometryList = [];

  var startedPosY;

  if(posY === undefined){

    startedPosY = 0;

  }else{

    startedPosY = posY;
  }


  if(groundfloor === undefined){
    groundfloor = false;
  }

  if(polyDefault == undefined || polyDefault.getNumInnerPoly() == 0){

    console.error("Can't extrude an empty polygons list");
    return undefined;

  }else{

   var bufferGeometryList = [];

   var polyStack = [];

   polyStack.push(polyDefault);

   while(polyStack.length > 0){

    var poly = polyStack.pop();
    var numInnerPoly = poly.getNumInnerPoly();

    if(numInnerPoly === 1){
      //To Extrude
       var polySimple = poly.getInnerPoly(0);
       //console.log("Poly typo: %s", poly.type);
       //console.log(poly);
       var vbo = CITY.PolygonUtils._extrudeSideWalkPolyDefault( 
         polySimple, 
         height,
         groundfloor,
         startedPosY,
         poly.type   
       );

      bufferGeometryList.push(vbo);

    }else if(numInnerPoly >= 1){
      for(var i = 0; i < numInnerPoly; i++){

         polyStack.push(polyDefault.getInnerPoly(i));
      }
    }
   }
  }

  var group = CITY.PolygonUtils._groupFromSideWalkBufferGeometryList(bufferGeometryList, wallMaterial, roofMaterial);

  return group;

};



static._extrudeSideWalkPolyDefault = function(polyDefault, height, groundfloor, posY, type){
  //console.log(polyDefault);
  var vertexs = static.convertPolygonToVertexArray(polyDefault);

  if(vertexs == undefined || vertexs.length == 0){
    console.error("Can't extrude an empty vertex polygon list");
    return undefined;
  }

        //Is it necessary?
        //static.sortPointsCounterClockwise(vertexs);
        //console.log(polySimple.getArea());
        var isHole = polyDefault.isHole();

        var area = polyDefault.getArea();
        var centroid = CITY.PolygonUtils.computeCentroid(polyDefault);

        if(!isHole || area < 0){//Clockwise
          vertexs.reverse();
        }

        //ARREGLAR LA TEXTURACION
        //if(CITY.PolygonUtils.DEBUG)
        //console.log(vertexs);
        var geometry = new THREE.BufferGeometry();
        var numOfVertexs =  vertexs.length;

        //Closing the path
        if( vertexs[0].x != vertexs[ numOfVertexs - 1 ].x || 
          vertexs[0].y != vertexs[ numOfVertexs - 1 ].y){

         vertexs.push(new Point( vertexs[0].x, vertexs[0].y ));
          numOfVertexs++;
        }

        //console.log(vertexs);

        //if(CITY.PolygonUtils.DEBUG)
        //console.log(vertexs);

        var triangles = 2 * (numOfVertexs - 1);

        geometry.addAttribute( 'index', new THREE.Int16Attribute( triangles * 3 , 1 ));
        geometry.addAttribute( 'position', new THREE.Float32Attribute( triangles * 3, 3 ));
        geometry.addAttribute( 'normal', new THREE.Float32Attribute( triangles * 3, 3 ));
        geometry.addAttribute( 'color', new THREE.Float32Attribute( triangles * 3, 3 ));
        geometry.addAttribute( 'uv', new THREE.Float32Attribute( triangles * 3, 2 ));

        var indices = geometry.getAttribute( 'index' ).array;
        var positions = geometry.getAttribute( 'position' ).array;
        var normals = geometry.getAttribute( 'normal' ).array;
        var colors = geometry.getAttribute( 'color' ).array;
        var uvs = geometry.getAttribute( 'uv' ).array;

        var color = new THREE.Color();

        //var Hfactor = Math.round(height/CITY.TEXTURE_WIDTH);
        var Vfactor, Hfactor;

        var startedPosY;

        if(posY === undefined){

          startedPosY = 0;

        }else{

          startedPosY = posY;
        }

        //Generate roof...with Shape?
        var roofPoints = [];

        var lamposts = true;
        //Generate walls

        for(var i = 0, desp = 0, despUV = 0, p = 0; p < numOfVertexs - 1; i += 6, desp += 18, despUV += 12, p += 1){

          var vertex2DA = vertexs[p]; //x,y
          var vertex2DB = vertexs[p + 1]; //x,y

          /*

          A - B - C
          A - C - D

          C   <-  B
          | \ |
          D   ->   A


          */


          var x = vertex2DA.x;
          var y = startedPosY;
          var z = vertex2DA.y;

          var xp = vertex2DB.x;
          var yp = startedPosY;
          var zp = vertex2DB.y;

          var ax = xp;
          var ay = y;
          var az = zp;

          var bx = xp;
          var by = y + height;
          var bz = zp;

          var cx = x;
          var cy = y + height;
          var cz = z;

          var dx = x;
          var dy = y;
          var dz = z;

          var x2 = (x - xp) *  (x - xp);
          var z2 = (z - zp) *  (z - zp);

          var width = Math.sqrt(x2 + z2);

          if(!isHole){roofPoints.push( new THREE.Vector2 ( dx, dz) );}

          if(lamposts && vertexs.length != 4){
            //Una farola en cada vértice?
            var lampost = new CITY.LampostBillBoard();
            lampost.create(10, 5, 0, 0, 0,  CITY.lampost1);
            lampost.position.x = dx - 0.5;//dx - 0.5;
            lampost.position.z = dz + 0.5;//dz + 1;
            lampost.position.y = 0.2;

            pointsLights.push( new THREE.Vector3( lampost.position.x + 0.2, 10.0, lampost.position.z + 0.2) );
            pointsLights.push( new THREE.Vector3( lampost.position.x - 0.2, 10.0, lampost.position.z - 0.2) );
            //pointsLights.push( new THREE.Vector3( lampost.position.x, 10.0, lampost.position.z ) );

            CITY.Scene.add(lampost);
            lamposts = false;
          }
          //A

          indices[i] = i;

          //B

          indices[i + 1] = i + 1;

          //C

          indices[i + 2] = i + 2;

          //A
          
          indices[i + 3] = i + 3;

          //C

          indices[i + 4] = i + 4;

          //D

          indices[i + 5] = i + 5;

          

          //A

          positions[ desp + 0 ] = ax;
          positions[ desp + 1 ] = ay;
          positions[ desp + 2 ] = az;

          //B

          positions[ desp + 3 ] = bx;
          positions[ desp + 4 ] = by;
          positions[ desp + 5 ] = bz;

          //C

          positions[ desp + 6 ] = cx;
          positions[ desp + 7 ] = cy;
          positions[ desp + 8 ] = cz;

          //A
          
          positions[ desp + 9 ] = ax;
          positions[ desp + 10 ] = ay;
          positions[ desp + 11 ] = az;

          //C

          positions[ desp + 12 ] = cx;
          positions[ desp + 13 ] = cy;
          positions[ desp + 14 ] = cz;

          //D

          positions[ desp + 15 ] = dx;
          positions[ desp + 16 ] = dy;
          positions[ desp + 17 ] = dz;

          var res = CITY.GeometryUtils.calulateNormals(ax,ay,az,bx,by,bz,cx,cy,cz);

          var nx = res[0];
          var ny = res[1];
          var nz = res[2];

          normals[ desp + 0 ] = nx;
          normals[ desp + 1 ] = ny;
          normals[ desp + 2 ] = nz;

          normals[ desp + 3 ] = nx;
          normals[ desp + 4 ] = ny;
          normals[ desp + 5 ] = nz;

          normals[ desp + 6 ] = nx;
          normals[ desp + 7 ] = ny;
          normals[ desp + 8 ] = nz;
          
          normals[ desp + 9 ] = nx;
          normals[ desp + 10 ] = ny;
          normals[ desp + 11 ] = nz;

          normals[ desp + 12 ] = nx;
          normals[ desp + 13 ] = ny;
          normals[ desp + 14 ] = nz;

          normals[ desp + 15 ] = nx;
          normals[ desp + 16 ] = ny;
          normals[ desp + 17 ] = nz;

          Vfactor = width/CITY.Vsize;// * CITY.Vrepetitions;

          Hfactor = height/CITY.Hsize;// * CITY.Hrepetitions;

          uvs[ despUV + 0 ]  = 1.0 * Vfactor;  
          uvs[ despUV + 1 ] = 0.0;

          uvs[ despUV + 2 ] = 1.0 * Vfactor;  
          uvs[ despUV + 3 ] = 1.0 * Hfactor;

          uvs[ despUV + 4 ] = 0.0;  
          uvs[ despUV + 5 ] = 1.0 * Hfactor;

          uvs[ despUV + 6 ] = 1.0 * Vfactor;  
          uvs[ despUV + 7 ] = 0.0;

          uvs[ despUV + 8 ] = 0.0;  
          uvs[ despUV + 9 ] = 1.0 * Hfactor;

          uvs[ despUV + 10 ] = 0.0;  
          uvs[ despUV + 11 ] = 0.0;

        }
    var rectangle;

    if(polyDefault.getPoints().length === 4){

      var points = polyDefault.getPoints();

      //console.log("4 sides, 4 + 1 points to close the path");

      //Perform scalar product to test if this polygon is square or rectangle
      // A - B
      // |   |
      // D - C

      var a = points[0];
      var b = points[1];
      var c = points[2];
      var d = points[3];

      var abx = b.x - a.x;
      var aby = b.y - a.y;

      var adx = d.x - a.x;
      var ady = d.y - a.y;

      var cbx = b.x - c.x;
      var cby = b.y - c.y;  

      var cdx = d.x - c.x;
      var cdy = d.y - c.y;

      //console.log(points);
      //console.log("Values 1: %s %s", a.x, a.y);
      //console.log("Values 2: %s %s", b.x, b.y);
      //console.log("Values 3: %s %s", c.x, c.y);
      //console.log("Values 4: %s %s", d.x, d.y);

      
      //If polygon is regular ab . cd = 0 && ca . db
      var result = (abx * adx + aby * ady) + (cbx * cdx + cby * cdy);

      rectangle = (result === 0);

      

    }else{

      rectangle = false;

    } //Is not regular
      



  if(!isHole && !groundfloor){

    roofPoints.push( new THREE.Vector2 ( vertexs[p].x, vertexs[p].y ) );

    //if(CITY.PolygonUtils.DEBUG) 
    //console.log(roofPoints);

    var roofShape = new THREE.Shape( roofPoints );

    var roofGeometry = new THREE.ShapeGeometry(roofShape);

    if(roofGeometry === undefined){
      console.log(roofPoints);
      console.log(roofShape);
    }

    roofGeometry.applyMatrix(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1,0,0), 90 * Math.PI/180));

    roofGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, height + startedPosY, 0));

    var invert = true;

    var roofBufferGeometry = geometryToBufferGeometryCustom( roofGeometry, invert );
    //var roofBufferGeometry = geometryToBufferGeometry( roofGeometry );
    return [geometry, roofBufferGeometry, rectangle, area, centroid, vertexs, polyDefault, type];

  }else{


    return [geometry, undefined, rectangle, area, centroid, vertexs, polyDefault, type];
  }
  
};




static.extrudePolygon = function(polyDefault, height, wallMaterial, roofMaterial, groundfloor, posY){

	var geometryList = [];

	var startedPosY;

	if(posY === undefined){

		startedPosY = 0;

	}else{

		startedPosY = posY;
	}


	if(groundfloor === undefined){
		groundfloor = false;
	}

	if(polyDefault == undefined || polyDefault.getNumInnerPoly() == 0){

    console.error("Can't extrude an empty polygons list");
    return undefined;

  }else{

   var bufferGeometryList = [];

   var polyStack = [];

   polyStack.push(polyDefault);

   while(polyStack.length > 0){

    var poly = polyStack.pop();
    var numInnerPoly = poly.getNumInnerPoly();

    if(numInnerPoly === 1){
      //To Extrude
       var polySimple = poly.getInnerPoly(0);
       //console.log("Poly");
       //console.log(poly);
       var vbo = CITY.PolygonUtils._extrudePolyDefault( 
         polySimple, 
         height,
         groundfloor,
         startedPosY   
       );

      bufferGeometryList.push(vbo);

    }else if(numInnerPoly > 1){
      for(var i = 0; i < numInnerPoly; i++){

         polyStack.push(poly.getInnerPoly(i));
      }
    }
   }
  }

  var group = CITY.PolygonUtils._groupFromBufferGeometryList(bufferGeometryList, wallMaterial, roofMaterial);

  return group;

};



static._groupFromBufferGeometryList = function(bufferGeometryList, wallMaterial, roofMaterial){
  //RENDER GEOMETRY
  if(bufferGeometryList === undefined){
    console.error("Error on extrusion process, Can't extrude geometry");
    return undefined;
  }

  var group = new THREE.Object3D();

  var numBGeometries = bufferGeometryList.length;

  for(var g = 0; g < numBGeometries; g++){

    //[geometry, roofBufferGeometry, rectangle, area, centroid, vertexs, polyDefault];

    if(bufferGeometryList[g][1] === undefined){



      bufferGeometryList[g][0].computeVertexNormals();
      mesh = new THREE.Mesh( bufferGeometryList[g][0], wallMaterial );  
      //mesh = new THREE.Mesh( bufferGeometryList[g][0] ); 
      mesh.castShadow = mesh.receiveShadow = CITY.SHADOWS;

     //O AQUI
      group.add(mesh);




    

    }else{

            
      
      bufferGeometryList[g][0].computeVertexNormals();
      mesh = new THREE.Mesh( bufferGeometryList[g][0], wallMaterial ); 
      //mesh = new THREE.Mesh( bufferGeometryList[g][0] ); 
      mesh.castShadow = mesh.receiveShadow = CITY.SHADOWS;  

      group.add(mesh);
      bufferGeometryList[g][1].computeVertexNormals();  
      mesh = new THREE.Mesh( bufferGeometryList[g][1], roofMaterial );   
      //mesh = new THREE.Mesh( bufferGeometryList[g][1] );   
      mesh.castShadow = mesh.receiveShadow = CITY.SHADOWS;
      group.add(mesh);
      

    }

  }

  return group;
}



static._groupFromSideWalkBufferGeometryList = function(bufferGeometryList, wallMaterial, roofMaterial){
	//RENDER GEOMETRY
	if(bufferGeometryList === undefined){
		console.error("Error on extrusion process, Can't extrude geometry");
		return undefined;
	}

	var group = new THREE.Object3D();

	var numBGeometries = bufferGeometryList.length;

  var park = false;

	for(var g = 0; g < numBGeometries; g++){


     //[geometry, roofBufferGeometry, rectangle, area, centroid, vertexs, polyDefault, type];

    park = false;
    var buildingPolyDefault = CITY.PolygonUtils.clonePolyDefault(bufferGeometryList[g][6]);

    //No es un rectangulo
    if(bufferGeometryList[g][2] !== undefined && !bufferGeometryList[g][2]){


        //Es de tipo residencial
        if(bufferGeometryList[g][7] == 1){

          //Triangulo => Parque
          if(bufferGeometryList[g][5].length === 4){
            park = true;
            static.extrudePark(bufferGeometryList, group, g);

          //No es triangulo, que hacer?
          }else{

            //Aqui con cierta probabilidad, podría pegarles un bocado...
            height = THREE.Math.randInt(4,8) * 5;
            CITY.PolygonUtils.scalePolygon(buildingPolyDefault, 0.85, 0.85);
            var material = CITY.residencialMaterials[THREE.Math.randInt(0, CITY.residencialMaterials.length - 1)];
            var roofMaterial = CITY.roofMaterials[THREE.Math.randInt(0, CITY.roofMaterials.length - 1)];

            var bounds = buildingPolyDefault.getBounds();

            var rectangle = new CITY.RectanglePolygon(bounds.w/2, bounds.h, bounds.x/2, bounds.y);

            rectangleMesh = CITY.PolygonUtils.extrudePolygon(
                rectangle, 
                height + 100,
                material,
                roofMaterial,
                false //this is the ground floor
            );

           
            //group.add(rectangleMesh);
            if(Math.random() > 0.7)
              buildingPolyDefault = buildingPolyDefault.difference(rectangle);


             buildingMesh = CITY.PolygonUtils.extrudePolygon(
                buildingPolyDefault, 
                height,
                material,
                roofMaterial,
                false //this is the ground floor
              );

              buildingMesh.position.y += buildingMesh.position.y + 5.2;

              collidableMesh.push(buildingMesh);
              group.add(buildingMesh);

              buildingMesh = CITY.PolygonUtils.extrudePolygon(
                buildingPolyDefault, 
                5,
                CITY.firstFloorMaterials[THREE.Math.randInt(0, CITY.firstFloorMaterials.length - 1)],
                CITY.officeBuildingMaterial,
                true //this is the ground floor
              );

              collidableMesh.push(buildingMesh);
              group.add(buildingMesh);

              buildingMesh.position.y += 0.2;







          }



        //Es de tipo negocios
        }else{

          height = THREE.Math.randInt(20,50) * 5;
          var material = CITY.officeMaterials[THREE.Math.randInt(0, CITY.officeMaterials.length - 1)];
          var roofMaterial = CITY.roofMaterials[THREE.Math.randInt(0, CITY.roofMaterials.length - 1)];
          //Triangulo => ???
          if(bufferGeometryList[g][5].length === 4){
            park = true;
            static.extrudePark(bufferGeometryList, group, g);

          //No es triangulo
          }else{


            var numElevation = THREE.Math.randInt(0,3);
            CITY.PolygonUtils.scalePolygon(buildingPolyDefault, 0.85, 0.85);
            var iter = numElevation !== 0 ? Math.ceil(height/numElevation): height;
            var prev = 5.2;
            //var iter = height;
            var init = 0;

           buildingMesh = CITY.PolygonUtils.extrudePolygon(
              buildingPolyDefault, 
              5.2,
              CITY.firstFloorOfficeMaterials[THREE.Math.randInt(0, CITY.firstFloorOfficeMaterials.length - 1)],
              CITY.officeBuildingMaterial,
              true //this is the ground floor
            );
            collidableMesh.push(buildingMesh);
            group.add(buildingMesh);
          
            for(var i = 0; i < numElevation; i++){
            //Primer piso, etc,...

              
              buildingMesh = CITY.PolygonUtils.extrudePolygon(
                buildingPolyDefault, 
                iter,
                material,
                roofMaterial,
                false //this is the ground floor
              );
              buildingMesh.position.y += prev;
              iter+=init;
              prev+=iter;
              collidableMesh.push(buildingMesh);
              group.add(buildingMesh);

              CITY.PolygonUtils.scalePolygon(buildingPolyDefault, 0.9, 0.9);
             }
             
             buildingMesh = CITY.PolygonUtils.extrudePolygon(
                buildingPolyDefault, 
                iter,
                material,
                roofMaterial,
                false //this is the ground floor
              );
              buildingMesh.position.y += 5.2;

              collidableMesh.push(buildingMesh);
              group.add(buildingMesh);

             

           


            }
          }
     
    //Es un rectangulo
	   }else{

        var bounds = buildingPolyDefault.getBounds();

        var Xsize = bounds.w;
        var Zsize = bounds.h;
        var Xpos = bounds.x;
        var Zpos = bounds.y;
        var peque = Xsize - Zsize > 0 ? Zsize : Xsize;
        //Es de tipo residencial
        if(bufferGeometryList[g][7] == 1){
          height = THREE.Math.randInt(4,8) * 5;
          var material = CITY.residencialMaterials[THREE.Math.randInt(0, CITY.residencialMaterials.length - 1)];
          var roofMaterial =CITY.roofMaterials[THREE.Math.randInt(0, CITY.roofMaterials.length - 1)];

          //L - L invertida
          if(Math.random() > 0.35){


            var clonePolyDefault = CITY.PolygonUtils.clonePolyDefault(bufferGeometryList[g][6]);
            CITY.PolygonUtils.scalePolygon(buildingPolyDefault, 0.5, 1);
            CITY.PolygonUtils.scalePolygon(clonePolyDefault, 1, 0.5);

            //X o no X
            if(Math.random() > 0.25){

            

            //T
            if(Math.random() > 0.5){
              //T o T invertida
              if(Math.random() > 0.5){

                  CITY.PolygonUtils.translatePolygon(buildingPolyDefault, + Xsize/4, 0);

                  if(Math.random() > 0.5){
                    buildingPolyDefault = buildingPolyDefault.union(clonePolyDefault);

                  }else{
                    
                    CITY.PolygonUtils.translatePolygon(clonePolyDefault, - Xsize/6, 0);
                    buildingPolyDefault = buildingPolyDefault.difference(clonePolyDefault);
                    CITY.PolygonUtils.translatePolygon(buildingPolyDefault, - Xsize/4, 0);

                   
                  }
              }else{

                CITY.PolygonUtils.translatePolygon(buildingPolyDefault, - Xsize/4, 0);
                  if(Math.random() > 0.5){
                    buildingPolyDefault = buildingPolyDefault.union(clonePolyDefault);
                    if(Math.random() > 0.6)
                      CITY.PolygonUtils.rotatePolygon(buildingPolyDefault,5 * THREE.Math.randInt(-1,1));
                  }else{
                   
                    CITY.PolygonUtils.translatePolygon(clonePolyDefault, + Xsize/6, 0);

                    //CITY.PolygonUtils.rotatePolygon(clonePolyDefault,15);
                    buildingPolyDefault = buildingPolyDefault.difference(clonePolyDefault);
                    CITY.PolygonUtils.translatePolygon(buildingPolyDefault, + Xsize/4, 0);
                    if(Math.random() > 0.6)
                      CITY.PolygonUtils.rotatePolygon(buildingPolyDefault,5 * THREE.Math.randInt(-1,1));
                      
                  }
              }

              //REVISA ESTO


            //L
            }else{


              //L o L invertida
              if(Math.random() > 0.5){
                CITY.PolygonUtils.translatePolygon(buildingPolyDefault, + Xsize/4, 0);
              }else{
                CITY.PolygonUtils.translatePolygon(buildingPolyDefault, - Xsize/4, 0);
              }

              if(Math.random() > 0.5){
                CITY.PolygonUtils.translatePolygon(clonePolyDefault, 0, + Zsize/4);
              }else{
                CITY.PolygonUtils.translatePolygon(clonePolyDefault, 0, - Zsize/4);
              }

              buildingPolyDefault = buildingPolyDefault.union(clonePolyDefault);
              

            }

            }else{

              buildingPolyDefault = buildingPolyDefault.union(clonePolyDefault);
              
              if(Math.random() > 0.6)
                CITY.PolygonUtils.rotatePolygon(buildingPolyDefault,5 * THREE.Math.randInt(-1,1));
            }
            
           
          

          //H
          }else if(Math.random() > 0.6){

            var clonePolyDefaultX = CITY.PolygonUtils.clonePolyDefault(bufferGeometryList[g][6]);
            var clonePolyDefaultZ = CITY.PolygonUtils.clonePolyDefault(bufferGeometryList[g][6]);

            CITY.PolygonUtils.scalePolygon(buildingPolyDefault, 0.5, 1);
            CITY.PolygonUtils.scalePolygon(clonePolyDefaultX, 1, 0.25);
            CITY.PolygonUtils.scalePolygon(clonePolyDefaultZ, 1, 0.25);
            CITY.PolygonUtils.translatePolygon(clonePolyDefaultX, 0, + Zsize/4);
            CITY.PolygonUtils.translatePolygon(clonePolyDefaultZ, 0, - Zsize/4);

            if(Math.random() > 0.75){
              CITY.PolygonUtils.translatePolygon(buildingPolyDefault, + Xsize/4, 0);
            }

            buildingPolyDefault = buildingPolyDefault.union(clonePolyDefaultX);
            buildingPolyDefault = buildingPolyDefault.union(clonePolyDefaultZ);
            //buildingPolyDefault = clonePolyDefaultZ;
            if(Math.random() > 0.75)
              CITY.PolygonUtils.rotatePolygon(buildingPolyDefault,5 * THREE.Math.randInt(-1,1));

          }else {

            var clonePolyDefaultX = CITY.PolygonUtils.clonePolyDefault(bufferGeometryList[g][6]);
            var clonePolyDefaultZ = CITY.PolygonUtils.clonePolyDefault(bufferGeometryList[g][6]);

            CITY.PolygonUtils.scalePolygon(buildingPolyDefault, 0.5, 1);
            CITY.PolygonUtils.scalePolygon(clonePolyDefaultX, 0.5, 0.25);
            CITY.PolygonUtils.scalePolygon(clonePolyDefaultZ, 0.5, 0.25);
            CITY.PolygonUtils.translatePolygon(clonePolyDefaultX, + Xsize/4, + Zsize/4);
            CITY.PolygonUtils.translatePolygon(clonePolyDefaultZ, - Xsize/4, - Zsize/4);


            if(Math.random() > 0.5){
              buildingPolyDefault = buildingPolyDefault.union(clonePolyDefaultX);

            }else{
              buildingPolyDefault = buildingPolyDefault.difference(clonePolyDefaultX);

            }

            if(Math.random() > 0.5){
              buildingPolyDefault = buildingPolyDefault.union(clonePolyDefaultZ);
            }else{
              buildingPolyDefault = buildingPolyDefault.difference(clonePolyDefaultZ);

            }
            if(Math.random() > 0.6)
              CITY.PolygonUtils.rotatePolygon(buildingPolyDefault,5 * THREE.Math.randInt(-1,1));
           
            //buildingPolyDefault = clonePolyDefaultZ;


          }

          CITY.PolygonUtils.scalePolygon(buildingPolyDefault, 0.9, 0.9);

          buildingMesh = CITY.PolygonUtils.extrudePolygon(
            buildingPolyDefault, 
            height,
            material,
            roofMaterial,
            false //this is the ground floor
          );

          buildingMesh.position.y += buildingMesh.position.y + 5.2;

          collidableMesh.push(buildingMesh);
          group.add(buildingMesh);

          buildingMesh = CITY.PolygonUtils.extrudePolygon(
            buildingPolyDefault, 
            5,
            CITY.firstFloorMaterials[THREE.Math.randInt(0, CITY.firstFloorMaterials.length - 1)],
            CITY.officeBuildingMaterial,
            true //this is the ground floor
          );

          collidableMesh.push(buildingMesh);
          group.add(buildingMesh);

          buildingMesh.position.y += 0.2;
































        //Es de tipo negocios
        }else{

          height = THREE.Math.randInt(20,50) * 5;
          var material = CITY.officeMaterials[THREE.Math.randInt(0, CITY.officeMaterials.length - 1)];
          var roofMaterial =CITY.roofMaterials[THREE.Math.randInt(0, CITY.roofMaterials.length - 1)];
          //Aqui podemos hacer varias cosas....
         
          var figure = buildingPolyDefault;
          //console.log(figure);
          var bounds = buildingPolyDefault.getBounds();

          var Xsize = bounds.w;
          var Zsize = bounds.h;
          var Xpos = bounds.x;
          var Zpos = bounds.y;
          var peque = Xsize - Zsize > 0 ? Zsize : Xsize;
          //Forma pentagonal
          //figure = new CITY.PentagonPolygon(peque/2.5);
          //base, height
          //figure = new CITY.TrianglePolygon(peque, peque * 2);

          //By http://stackoverflow.com/questions/7198144/how-to-draw-a-n-sided-regular-polygon-in-cartesian-coordinates

          if(Math.random() > 0.65){
            var theta = 0;
            var r = peque/2;
            var x_centre = Xpos + Xsize/2;
            var y_centre = Zpos + Zsize/2;

            var points = [];
            var x,y;
            var N = THREE.Math.randInt(3,10);
            if(N === 4) 
              N = 3;
            var pi2 = 2 * Math.PI;

            for(var n = 0; n < N; n++){
              x = r * Math.cos(pi2 * n/N + theta) + x_centre;
              y = r * Math.sin(pi2 * n/N + theta) + y_centre;
              points.push([x,y]);
            }

            figure = new CITY.CustomPolygon(points);
            
            if(N === 3){
              //console.log("PRE");
              //console.log(figure);
              
              //console.log("PRE T");
              //console.log(triangleClone);
              //if(Math.random() > 0.6){
                var triangleClone = CITY.PolygonUtils.clonePolyDefault(figure);
                CITY.PolygonUtils.rotatePolygon(triangleClone, 180);
                //console.log("POST T");
                //console.log(triangleClone);
                figure = figure.union(triangleClone);
              //}
              //console.log("POST");
              //console.log(figure);


            }else if(N === 4){
              //console.log(figure);
              CITY.PolygonUtils.rotatePolygon(figure, 45);
              var squareClone = CITY.PolygonUtils.clonePolyDefault(figure);
              CITY.PolygonUtils.scalePolygon(squareClone, 1.2, 1);
              CITY.PolygonUtils.scalePolygon(squareClone, 0.8, 1);
              figure = figure.union(squareClone);
            }
            
          }else{

              var clonePolyDefault1 = CITY.PolygonUtils.clonePolyDefault(bufferGeometryList[g][6]);
              var clonePolyDefault2 = CITY.PolygonUtils.clonePolyDefault(bufferGeometryList[g][6]);
              var clonePolyDefault3 = CITY.PolygonUtils.clonePolyDefault(bufferGeometryList[g][6]);
              var clonePolyDefault4 = CITY.PolygonUtils.clonePolyDefault(bufferGeometryList[g][6]);


               if(Math.random() > 0.4){

                if(Math.random() > 0.4){
                  CITY.PolygonUtils.scalePolygon(clonePolyDefault1, 0.5, 1);
                  CITY.PolygonUtils.scalePolygon(clonePolyDefault2, 1, THREE.Math.randInt(3,7)/10);
                  figure = clonePolyDefault1.union(clonePolyDefault2);
                }else{
                  CITY.PolygonUtils.scalePolygon(clonePolyDefault1, 1, 0.5);
                  CITY.PolygonUtils.scalePolygon(clonePolyDefault2,  THREE.Math.randInt(3,7)/10,1);
                  figure = clonePolyDefault1.union(clonePolyDefault2);
                }
              }else{

                CITY.PolygonUtils.scalePolygon(clonePolyDefault1, 0.5, 1);

                CITY.PolygonUtils.scalePolygon(clonePolyDefault2, 0.5, 1);
                
                CITY.PolygonUtils.scalePolygon(clonePolyDefault2, 0.75, 0.75);
                CITY.PolygonUtils.scalePolygon(clonePolyDefault1, 0.75, 0.75);  
                CITY.PolygonUtils.translatePolygon(clonePolyDefault1, - Xsize/3, 0);
                CITY.PolygonUtils.translatePolygon(clonePolyDefault2, + Xsize/3, 0);

                //console.log(clonePolyDefault1);
                //console.log(clonePolyDefault2);
                CITY.PolygonUtils.scalePolygon(figure, 0.65, 0.65);

                figure = figure.union(clonePolyDefault1);
                figure = figure.union(clonePolyDefault2);
                //console.log(figure);
                CITY.PolygonUtils.scalePolygon(figure, 0.9, 0.9);
                //figure = clonePolyDefault1;
              }










          }
         
          CITY.PolygonUtils.scalePolygon(figure, 0.9, 0.9);
          //CITY.PolygonUtils.translatePolygon(figure, Xpos + Xsize/2, Zpos + Zsize/2);


          //Elevations?
          if(Math.random() > 0.65){

            var numElevation = THREE.Math.randInt(0,3);
            //CITY.PolygonUtils.scalePolygon(buildingPolyDefault, 0.85, 0.85);
            var iter = numElevation !== 0 ? Math.ceil(height/numElevation): height;
            var prev = 5.2;
            //var iter = height;
            var init = 0;

           buildingMesh = CITY.PolygonUtils.extrudePolygon(
              figure, 
              5.2,
              CITY.firstFloorOfficeMaterials[THREE.Math.randInt(0, CITY.firstFloorOfficeMaterials.length - 1)],
              CITY.officeBuildingMaterial,
              true //this is the ground floor
            );
            collidableMesh.push(buildingMesh);
            group.add(buildingMesh);
          
            for(var i = 0; i < numElevation; i++){
            //Primer piso, etc,...

              
              buildingMesh = CITY.PolygonUtils.extrudePolygon(
                figure, 
                iter,
                material,
                roofMaterial,
                false //this is the ground floor
              );
              buildingMesh.position.y += prev;
              iter+=init;
              prev+=iter;
              collidableMesh.push(buildingMesh);
              group.add(buildingMesh);

              CITY.PolygonUtils.scalePolygon(figure, 0.9, 0.9);
             }
             
             buildingMesh = CITY.PolygonUtils.extrudePolygon(
                figure, 
                iter,
                material,
                roofMaterial,
                false //this is the ground floor
              );
              buildingMesh.position.y += 5.2;

              collidableMesh.push(buildingMesh);
              group.add(buildingMesh);

          //No  elevation
          }else{

            //console.log(figure);
            buildingMesh = CITY.PolygonUtils.extrudePolygon(
              figure, 
              height,
              material,
              roofMaterial,
              false //this is the ground floor
            );
            buildingMesh.position.y += 5.2;

            collidableMesh.push(buildingMesh);
            group.add(buildingMesh);

            buildingMesh = CITY.PolygonUtils.extrudePolygon(
              figure, 
              5,
              CITY.firstFloorOfficeMaterials[THREE.Math.randInt(0, CITY.firstFloorOfficeMaterials.length - 1)],
              CITY.officeBuildingMaterial,
              true //this is the ground floor
            );
            collidableMesh.push(buildingMesh);
            group.add(buildingMesh);

            buildingMesh.position.y += 0.2;
          }

        }

     }

      if(!park){
        sideWalkMesh = CITY.PolygonUtils.extrudePolygon(
                bufferGeometryList[g][6], 
                0.3,
                roofMaterial,
                wallMaterial,
                false //this is the ground floor

        );
        group.add(sideWalkMesh);
      }

  }
	return group;
}


static.extrudePark = function(bufferGeometryList, group, g){

      //Parques
        bufferGeometryList[g][0].computeVertexNormals();
        mesh = new THREE.Mesh( bufferGeometryList[g][0], CITY.grassMaterial ); 
        //mesh = new THREE.Mesh( bufferGeometryList[g][0] ); 
        mesh.castShadow = mesh.receiveShadow = CITY.SHADOWS;  

        collidableMesh.push(mesh);

        group.add(mesh);
        bufferGeometryList[g][1].computeVertexNormals();  
        mesh = new THREE.Mesh( bufferGeometryList[g][1], CITY.grassMaterial );   
        //mesh = new THREE.Mesh( bufferGeometryList[g][1] );   
        mesh.castShadow = mesh.receiveShadow = CITY.SHADOWS;
        collidableMesh.push(mesh);
        group.add(mesh);

        var centroid = bufferGeometryList[g][4];
        //console.log(centroid);
        var numTrees = THREE.Math.randInt(5,10);
        var offset = 0;
        var deltaX, deltaZ;

        var polyDefault = bufferGeometryList[g][6];

        var point = new Point();
        for(var i = 0; i < numTrees; i++){
         
          var randomness = THREE.Math.randInt(1,6);
          switch(randomness){
            case 1:
              point.x = centroid.x + randomness;
              point.y = centroid.y + offset;

            break; 
            case 2:
              point.x = centroid.x + offset;
              point.y = centroid.y + randomness;
            break; 
            case 3:
              point.x = centroid.x + offset;
              point.y = centroid.y + offset;
            break; 
            case 4:
              point.x = centroid.x - offset;
              point.y = centroid.y + randomness; 
            break; 
            case 5:
              point.x = centroid.x + randomness;
              point.y = centroid.y - offset;
            break; 
            case 6:
              point.x = centroid.x - offset;
              point.y = centroid.y - offset;

          }

        
          if(polyDefault.isPointInside(point)){
             var tree = new CITY.TreeBillBoard();
             tree.create(7, 5, 0, 0, 0, CITY.treeTextures[THREE.Math.randInt(0, CITY.numTreeTextures - 1)]);
             tree.position.x = point.x;
             tree.position.z = point.y;
          }


          offset += THREE.Math.randInt(1,6);
          group.add(tree);
        }



}


static.clonePolyDefault = function(polyDefault1){

  var clonedPolyDefault = new gpcas.geometry.PolyDefault();

  var points = polyDefault1.getPoints();
  for(var i = 0; i < points.length; i++){

    clonedPolyDefault.addPointXY(points[i].x,points[i].y);

  }


  return clonedPolyDefault;


}

static._extrudePolyDefault = function(polyDefault, height, groundfloor, posY){
  //console.log(polyDefault);
  var vertexs = static.convertPolygonToVertexArray(polyDefault);

  if(vertexs == undefined || vertexs.length == 0){
    console.error("Can't extrude an empty vertex polygon list");
    return undefined;
  }

        //Is it necessary?
        //static.sortPointsCounterClockwise(vertexs);
        //console.log(polySimple.getArea());
        var isHole = polyDefault.isHole();
        var area = polyDefault.getArea();

        if(!isHole || polyDefault.getArea() < 0){//Clockwise
          vertexs.reverse();
        }

        var geometry = new THREE.BufferGeometry();
        var numOfVertexs =  vertexs.length;

        //Closing the path
        if( vertexs[0].x != vertexs[ numOfVertexs - 1 ].x || 
          vertexs[0].y != vertexs[ numOfVertexs - 1 ].y){

         vertexs.push(new Point( vertexs[0].x, vertexs[0].y ));
          numOfVertexs++;
        }

        var triangles = 2 * (numOfVertexs - 1);

        geometry.addAttribute( 'index', new THREE.Int16Attribute( triangles * 3 , 1 ));
        geometry.addAttribute( 'position', new THREE.Float32Attribute( triangles * 3, 3 ));
        geometry.addAttribute( 'normal', new THREE.Float32Attribute( triangles * 3, 3 ));
        geometry.addAttribute( 'color', new THREE.Float32Attribute( triangles * 3, 3 ));
        geometry.addAttribute( 'uv', new THREE.Float32Attribute( triangles * 3, 2 ));

        var indices = geometry.getAttribute( 'index' ).array;
        var positions = geometry.getAttribute( 'position' ).array;
        var normals = geometry.getAttribute( 'normal' ).array;
        var colors = geometry.getAttribute( 'color' ).array;
        var uvs = geometry.getAttribute( 'uv' ).array;

        var color = new THREE.Color();

        //var Hfactor = Math.round(height/CITY.TEXTURE_WIDTH);
        var Vfactor, Hfactor;

        var startedPosY;

        if(posY === undefined){

          startedPosY = 0;

        }else{

          startedPosY = posY;
        }

        //Generate roof...with Shape?
        var roofPoints = [];

        //Generate walls

        for(var i = 0, desp = 0, despUV = 0, p = 0; p < numOfVertexs - 1; i += 6, desp += 18, despUV += 12, p += 1){

          var vertex2DA = vertexs[p]; //x,y
          var vertex2DB = vertexs[p + 1]; //x,y

          /*

          A - B - C
          A - C - D

          C   <-  B
          | \ |
          D   ->   A


          */


          var x = vertex2DA.x;
          var y = startedPosY;
          var z = vertex2DA.y;

          var xp = vertex2DB.x;
          var yp = startedPosY;
          var zp = vertex2DB.y;

          var ax = xp;
          var ay = y;
          var az = zp;

          var bx = xp;
          var by = y + height;
          var bz = zp;

          var cx = x;
          var cy = y + height;
          var cz = z;

          var dx = x;
          var dy = y;
          var dz = z;

          var x2 = (x - xp) *  (x - xp);
          var z2 = (z - zp) *  (z - zp);

          var width = Math.sqrt(x2 + z2);

          if(!isHole){roofPoints.push( new THREE.Vector2 ( dx, dz) );}
          
          //A

          indices[i] = i;

          //B

          indices[i + 1] = i + 1;

          //C

          indices[i + 2] = i + 2;

          //A
          
          indices[i + 3] = i + 3;

          //C

          indices[i + 4] = i + 4;

          //D

          indices[i + 5] = i + 5;

          

          //A

          positions[ desp + 0 ] = ax;
          positions[ desp + 1 ] = ay;
          positions[ desp + 2 ] = az;

          //B

          positions[ desp + 3 ] = bx;
          positions[ desp + 4 ] = by;
          positions[ desp + 5 ] = bz;

          //C

          positions[ desp + 6 ] = cx;
          positions[ desp + 7 ] = cy;
          positions[ desp + 8 ] = cz;

          //A
          
          positions[ desp + 9 ] = ax;
          positions[ desp + 10 ] = ay;
          positions[ desp + 11 ] = az;

          //C

          positions[ desp + 12 ] = cx;
          positions[ desp + 13 ] = cy;
          positions[ desp + 14 ] = cz;

          //D

          positions[ desp + 15 ] = dx;
          positions[ desp + 16 ] = dy;
          positions[ desp + 17 ] = dz;

          var res = CITY.GeometryUtils.calulateNormals(ax,ay,az,bx,by,bz,cx,cy,cz);

          var nx = res[0];
          var ny = res[1];
          var nz = res[2];

          normals[ desp + 0 ] = nx;
          normals[ desp + 1 ] = ny;
          normals[ desp + 2 ] = nz;

          normals[ desp + 3 ] = nx;
          normals[ desp + 4 ] = ny;
          normals[ desp + 5 ] = nz;

          normals[ desp + 6 ] = nx;
          normals[ desp + 7 ] = ny;
          normals[ desp + 8 ] = nz;
          
          normals[ desp + 9 ] = nx;
          normals[ desp + 10 ] = ny;
          normals[ desp + 11 ] = nz;

          normals[ desp + 12 ] = nx;
          normals[ desp + 13 ] = ny;
          normals[ desp + 14 ] = nz;

          normals[ desp + 15 ] = nx;
          normals[ desp + 16 ] = ny;
          normals[ desp + 17 ] = nz;

          Vfactor = width/CITY.Vsize;// * CITY.Vrepetitions;

          Hfactor = height/CITY.Hsize;// * CITY.Hrepetitions;

          uvs[ despUV + 0 ]  = 1.0 * Vfactor;  
          uvs[ despUV + 1 ] = 0.0;

          uvs[ despUV + 2 ] = 1.0 * Vfactor;  
          uvs[ despUV + 3 ] = 1.0 * Hfactor;

          uvs[ despUV + 4 ] = 0.0;  
          uvs[ despUV + 5 ] = 1.0 * Hfactor;

          uvs[ despUV + 6 ] = 1.0 * Vfactor;  
          uvs[ despUV + 7 ] = 0.0;

          uvs[ despUV + 8 ] = 0.0;  
          uvs[ despUV + 9 ] = 1.0 * Hfactor;

          uvs[ despUV + 10 ] = 0.0;  
          uvs[ despUV + 11 ] = 0.0;

        }

  
   
 
  if(!isHole && !groundfloor){

    roofPoints.push( new THREE.Vector2 ( vertexs[p].x, vertexs[p].y ) );

    //if(CITY.PolygonUtils.DEBUG) 
    //console.log(roofPoints);

    var roofShape = new THREE.Shape( roofPoints );

    var roofGeometry = new THREE.ShapeGeometry(roofShape);

    roofGeometry.applyMatrix(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1,0,0), 90 * Math.PI/180));

    roofGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, height + startedPosY, 0));

    var invert = true;

    var roofBufferGeometry = geometryToBufferGeometryCustom( roofGeometry, invert );
    //var roofBufferGeometry = geometryToBufferGeometry( roofGeometry );
    //return [geometry, roofBufferGeometry, undefined, area, centroid, vertexs, polyDefault];
    return [geometry, roofBufferGeometry, undefined, area, undefined, vertexs, polyDefault];

  }else{


    return [geometry, undefined, undefined, area, undefined, vertexs, polyDefault];
  }
  
};



static.rnd_snd = function() {
  return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}


static.rnd= function(mean, stdev) {
  return Math.round(rnd_snd()*stdev+mean);
}


/*
* Based on GPCJS code.
*/

static.sortPointsCounterClockwise = function(vertices) {
    var isArrayList  = false;

    if (vertices instanceof ArrayList){
        vertices= vertices.toArray();
        isArrayList=true;
    }

    //point
    var maxTop   = null;
    var maxBottom  = null;
    var maxLeft   = null;
    var maxRight  = null;


    var maxLeftIndex;
    var newVertices = vertices;



    for (var i  = 0; i<vertices.length; i++){
        var vertex  = vertices[i] ;

        if ((maxTop==null)||(maxTop.y>vertex.y)||((maxTop.y==vertex.y)&&(vertex.x<maxTop.x))){
            maxTop=vertex;
        }
        if ((maxBottom==null)||(maxBottom.y<vertex.y)||((maxBottom.y==vertex.y)&&(vertex.x>maxBottom.x))){
            maxBottom=vertex;
        }
        if ((maxLeft==null)||(maxLeft.x>vertex.x)||((maxLeft.x==vertex.x)&&(vertex.y>maxLeft.y))){
            maxLeft=vertex;
            maxLeftIndex=i;
        }
        if ((maxRight==null)||(maxRight.x<vertex.x)||((maxRight.x==vertex.x)&&(vertex.y<maxRight.y))){
            maxRight=vertex;
        }
    }

    if (maxLeftIndex>0){
        newVertices = []
        var j = 0;
        for (var i=maxLeftIndex; i<vertices.length;i++){
            newVertices[j++]=vertices[i];
        }
        for (var i=0; i<maxLeftIndex; i++){
            newVertices[j++]=vertices[i];
        }
        vertices=newVertices;
    }


    var reverse  = false;
    for(var i=0 ; i<vertices.length;i++) {
        var vertex = vertices[i];
        if (equals(vertex, maxBottom)){
            reverse=true;
            break;
        } else if (equals(vertex, maxTop)){
            break;
        }
    }
    if (reverse){
        newVertices=[]
        newVertices[0]=vertices[0];
        var j =1;
        for (var i=vertices.length-1; i>0; i--){
            newVertices[j++]=vertices[i];
        }
        vertices=newVertices;
    }

    //Workaround...
    //vertices.reverse();

    return (isArrayList?(new ArrayList(vertices)):(vertices));
};


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

    //console.log("Centroid %s");
    //console.log(this.centroid);

   return new Point(xSum/nVerts,ySum/nVerts);
    
  

};



CITY.SquarePolygon = function ( size, ox, oy ) {

  gpcas.geometry.PolyDefault.call( this );

  if(ox==undefined) ox = 0;
  if(oy==undefined) oy = 0;

  this.size = size;

  var midSize = size/2;

  this.centerX = size/2;
  this.centerY = size/2;

  var points = [

    [-midSize, -midSize ],
    [midSize, -midSize ],
    [midSize, midSize ],
    [-midSize, midSize ],
    [-midSize, -midSize ]
    
  ];



  for(var i=0 ; i < points.length ; i++) {    
    gpcas.geometry.PolyDefault.prototype.addPoint.call( this, new Point(points[i][0] + ox,points[i][1]  + oy) );
  } 

};

CITY.SquarePolygon.prototype = Object.create( gpcas.geometry.PolyDefault.prototype);

CITY.RectanglePolygon = function ( width, height, ox, oy ) {

  gpcas.geometry.PolyDefault.call( this );

  if(ox==undefined) ox = 0;
  if(oy==undefined) oy = 0;

  this.width = width;
  this.height = height;

  var midWidth = width/2;
  var midHeight = height/2;

  this.centerX = midWidth;
  this.centerY = midHeight;

  var points = [

    [-midWidth, -midHeight ],
    [midWidth, -midHeight ],
    [midWidth, midHeight ],
    [-midWidth, midHeight ],
    [-midWidth, -midHeight ]
    
  ];

 
  for(var i=0 ; i < points.length ; i++) {    

    gpcas.geometry.PolyDefault.prototype.addPoint.call( this, new Point(points[i][0] + ox,points[i][1]  + oy) );
    
  } 


};

CITY.RectanglePolygon.prototype = Object.create( gpcas.geometry.PolyDefault.prototype);



CITY.TrianglePolygon = function ( base, height, ox, oy ) {

  gpcas.geometry.PolyDefault.call( this );

  if(ox==undefined) ox = 0;
  if(oy==undefined) oy = 0;

  this.base = base;
  this.height = height;

  var midBase = base/2;
  var midHeight = height/2;

  this.centerX = midBase;
  this.centerY = midHeight;
  
  var points = [

    [-midBase, -midHeight ],
    [midBase, -midHeight ],
    [base, midHeight ],
    [-midBase, -midHeight ]
    
  ];

  for(var i=0 ; i < points.length ; i++) {    
    gpcas.geometry.PolyDefault.prototype.addPoint.call( this, new Point(points[i][0] + ox,points[i][1] + oy) );
    } 
  
   this.minPoint = this.getPoints()[0];
};

CITY.TrianglePolygon.prototype = Object.create( gpcas.geometry.PolyDefault.prototype);

CITY.PentagonPolygon = function ( radio, ox, oy ) {

  gpcas.geometry.PolyDefault.call( this );

  if(ox==undefined) ox = 0;
  if(oy==undefined) oy = 0;

  this.height = radio;

  var sqrtFive = Math.sqrt(5);
  var sqrt10P = Math.sqrt(10 + 2 * sqrtFive);
  var sqrt10M = Math.sqrt(10 - 2 * sqrtFive);

  var c1 = 0.25 * (sqrtFive - 1) * radio;
  var c2 = 0.25 * (sqrtFive + 1) * radio;
  var s1 = 0.25 * sqrt10P * radio;
  var s2 = 0.25 * sqrt10M * radio;

  
  var points = [

    [-s1, c1 ],
    [-s2, -c2 ],
    [s2, -c2 ],
    [s1, c1 ],
    [s1, c1 ],
    [0, radio],
    [-s1, c1 ]
    
  ];

  for(var i=0 ; i < points.length ; i++) {    
    gpcas.geometry.PolyDefault.prototype.addPoint.call( this, new Point(points[i][0] + ox,points[i][1] + oy) );
    } 
  
   this.minPoint = this.getPoints()[0];
};

CITY.PentagonPolygon.prototype = Object.create( gpcas.geometry.PolyDefault.prototype);



CITY.CustomPolygon = function ( points ) {

  gpcas.geometry.PolyDefault.call( this );

  if(points == undefined || points.length == 0){
      console.error("Trying to create an empty CustomPolygon");

  }else{

      //Vertex list mode
      if(points[0][0] != undefined){
        
        for(var i=0 ; i < points.length ; i++) {    
          //console.log("VERTEX MODE %s " , points[i][0]);
          gpcas.geometry.PolyDefault.prototype.addPoint.call( this, new Point(points[i][0],points[i][1]) );
        }
      //Point class mode    
      }else{

        for(var i=0 ; i < points.length ; i++) {    
          gpcas.geometry.PolyDefault.prototype.addPoint.call( this, new Point(points[i].x,points[i].y) );
          }
      }

    }

};

CITY.CustomPolygon.prototype = Object.create( gpcas.geometry.PolyDefault.prototype);
