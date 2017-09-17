

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
       console.log("Poly");
       console.log(poly);
       var vbo = CITY.PolygonUtils._extrudePolyDefault( 
         polySimple, 
         height,
         groundfloor,
         startedPosY   
       );

      bufferGeometryList.push(vbo);

    }else if(numInnerPoly >= 1){
      for(var i = 0; i < numInnerPoly; i++){

         polyStack.push(polyDefault.getInnerPoly(i));
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

    if(bufferGeometryList[g][2] !== undefined && !bufferGeometryList[g][2]){


      //Parques
      if(bufferGeometryList[g][5].length === 4 && bufferGeometryList[g][3] > 200){

        bufferGeometryList[g][0].computeVertexNormals();
        mesh = new THREE.Mesh( bufferGeometryList[g][0], CITY.grassMaterial ); 
        //mesh = new THREE.Mesh( bufferGeometryList[g][0] ); 
        mesh.castShadow = mesh.receiveShadow = CITY.SHADOWS;  

        group.add(mesh);
        bufferGeometryList[g][1].computeVertexNormals();  
        mesh = new THREE.Mesh( bufferGeometryList[g][1], CITY.grassMaterial );   
        //mesh = new THREE.Mesh( bufferGeometryList[g][1] );   
        mesh.castShadow = mesh.receiveShadow = CITY.SHADOWS;
        group.add(mesh);

        var centroid = bufferGeometryList[g][4];
        console.log(centroid);
        var numTrees = THREE.Math.randInt(5,10);
        var offset = 0;
        var deltaX, deltaZ;

        var polyDefault = bufferGeometryList[g][6];

        var point = new Point();
        for(var i = 0; i < numTrees; i++){
         
          var randomness = THREE.Math.randInt(1,6);
          switch(randomness){
            case 1:
              point.x = centroid.x;
              point.y = centroid.y + offset;

            break; 
            case 2:
              point.x = centroid.x + offset;
              point.y = centroid.y;
            break; 
            case 3:
              point.x = centroid.x + offset;
              point.y = centroid.y + offset;
            break; 
            case 4:
              point.x = centroid.x - offset;
              point.y = centroid.y; 
            break; 
            case 5:
              point.x = centroid.x;
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


          offset += 1;
          group.add(tree);
        }
       



      }else{


        //Irregular forms....
        var buiildingPolyDefault = CITY.PolygonUtils.clonePolyDefault(bufferGeometryList[g][6]);
  
        //console.log(buiildingPolyDefault);


        CITY.PolygonUtils.scalePolygon(buiildingPolyDefault, 0.8, 0.8);

        //Primer piso, etc,...
        var buildingMesh = CITY.PolygonUtils.extrudePolygon(
          buiildingPolyDefault, 
          100,
          CITY.officeBuildingMaterial,
          CITY.testCheckBoardMaterial,
          false //this is the ground floor
        );

        buildingMesh.position.y += buildingMesh.position.y + 5.2;

        group.add(buildingMesh);

        buildingMesh = CITY.PolygonUtils.extrudePolygon(
          buiildingPolyDefault, 
          5,
          CITY.testCheckBoardMaterial,
          CITY.officeBuildingMaterial,
          true //this is the ground floor
        );

        group.add(buildingMesh);

        buildingMesh.position.y += buildingMesh.position.y + 0.2;

              
        var buildingMesh = CITY.PolygonUtils.extrudePolygon(
          bufferGeometryList[g][6], 
          0.2,
          roofMaterial,
          wallMaterial,
          false //this is the ground floor
        );

        group.add(buildingMesh);

      }






		}else if(bufferGeometryList[g][1] === undefined){




      /*


			bufferGeometryList[g][0].computeVertexNormals();
			mesh = new THREE.Mesh( bufferGeometryList[g][0], wallMaterial );  
			//mesh = new THREE.Mesh( bufferGeometryList[g][0] ); 
			mesh.castShadow = mesh.receiveShadow = CITY.SHADOWS;
			group.add(mesh);

      */



		}else{

       
      
      /*
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
      */

		}

	}

	return group;
}
