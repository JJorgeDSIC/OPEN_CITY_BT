
// Custom OpenCity class

CITY.OpenCity = function(parameters){

	THREE.Object3D.call(this);

	var scene = parameters.scene;

	if(parameters.polygon !== undefined){
		//TO COMPLETE
		this.polygon = parameters.polygon;
		this.posx = parameters.posX;
		this.posz = parameters.posZ;
		this.width = parameters.width;
		this.depth = parameters.depth;
	}else{
		this.posx = parameters.posX;
		this.posz = parameters.posZ;
		this.width = parameters.width;
		this.depth = parameters.depth;
	}

	var scope = this;

	scope.setUpInteraction(
		scene, 
		parameters.width, 
		parameters.depth, 
		parameters.posX, 
		0,
		parameters.posZ
		);

	scope.setUpCollisions();

	//Store ref. to scene object
	CITY.Scene = scene;	

	//////////////////////
	//	CITY GENERATION //
	//////////////////////


	//var layout = new CITY.Layout();

	var time = Date.now();
	var parameters = {
		streetAnchor: 10,
		avenueAnchor: 10,
		numAvenues: 0,
		radial: true,
		purgeArea: 200,
		gridRotation: 20,
		divisionSize: 200,
		mean: 200,
		stdev: 100
    };


    var districts = drawRoadMap(

			this.width,//Number(document.getElementById("sizeXField").value),
			this.depth,//Number(document.getElementById("sizeZField").value),
			10,//Number(document.getElementById("streetAnchorField").value),
			15,//Number(document.getElementById("avenueAnchorField").value),
			10,//4,
			200,//Number(document.getElementById("minSizeXAxisField").value),
			400,//Number(document.getElementById("maxSizeXAxisField").value),
			100,//Number(document.getElementById("minSizeYAxisField").value),
			400,//Number(document.getElementById("maxSizeYAxisField").value),
			0,//Number(document.getElementById("purgeAreaField").value),
			false,
			false,
			true,
			0,
			0

		);

   //drawLayout(districts,  5 , scene);

   //console.log("END DISTRICTS");

   var finalLayout = new gpcas.geometry.PolyDefault();


   for(var i = 0; i < districts.getNumInnerPoly(); i++){

   	   var poly = districts.getInnerPoly(i);
   	   //console.log("DISTRICT");
   	   //console.log(poly);
	   drawRoadMap2InitialPoly(

					poly.getBounds().w,
					poly.getBounds().h,
					5,
					5,
					2,
					50,
					50,
					50,
					50,
					300,
					/*
					Number(document.getElementById("maxSizeXAxisField").value),
					Number(document.getElementById("minSizeYAxisField").value),
					Number(document.getElementById("maxSizeYAxisField").value),
					Number(document.getElementById("purgeAreaField").value),
					*/				
					false,
					false,
					true,
					poly,
					poly.getBounds().x,
					poly.getBounds().y,
					finalLayout,
					poly.type

		);
	   //finalLayout.addPoly(road);
   }

   //console.log("finalLayout");
   //console.log(finalLayout);
   extrudeSidewalks(finalLayout,  0.2 , scene);
   var numBuildings = finalLayout.getNumInnerPoly();
   CITY.PolygonUtils.scalePolygon(finalLayout, 0.8, 0.8);
   CITY.PolygonUtils.translatePolygon(finalLayout, this.width/2, this.depth/2);

   var triangulos = 10 * numBuildings + 8 * numBuildings + 10 * numBuildings;
   var time2 = Date.now();
   var totalTime = (time2 - time)/1000;
   alert("Se han generado " +numBuildings+ " edificios, aproximadamente "+ triangulos+ " triangulos. Dimensiones "+this.width+" por "+this.depth+", junto con los elementos decorativos, tiempo: "+totalTime);
   //Decoration elements
   /*
	var tree = new CITY.TreeBillBoard();
	tree.create(7, 5, 0, 0, 0, CITY.treeTextures[THREE.Math.randInt(0, CITY.numTreeTextures - 1)]);

	scene.add(tree);
	*/



	var xPlane = this.posx;
	var yPlane = 0;
	var zPlane = this.posz;

	var planeGeometry = new CITY.PlaneBufferGeometry();

	planeGeometry.create(this.width * 2 + 20, 0, this.depth * 2 + 20, xPlane - 20, yPlane, zPlane - 20);

	//console.log("Triangles: %f, Cubes: %s\n", cubes * 10, cubes);

	var planeMesh = new THREE.Mesh( planeGeometry, CITY.groundMaterial );

	planeMesh.receiveShadow = CITY.SHADOWS;

	scene.add( planeMesh );


	var billboardMaterial = new THREE.MeshBasicMaterial( 
		{ 	map: CITY.cloud, 
			alphaTest: 0.8, 
			side: THREE.DoubleSide 
		} );
/*
	var cloudPlaneGeometry = new CITY.CloudBufferGeometry();

	cloudPlaneGeometry.create(this.width * 2 + 20, 0, this.depth * 2 + 20, xPlane - 20, yPlane, zPlane - 20);

	//console.log("Triangles: %f, Cubes: %s\n", cubes * 10, cubes);

	var cloudPlaneMesh = new THREE.Mesh( cloudPlaneGeometry, billboardMaterial );

	cloudPlaneMesh.position.y = 300;


	cloudPlaneMesh.receiveShadow = false;

	scene.add( cloudPlaneMesh );
*/

/*
	var geometry = new THREE.Geometry();

	var texture = THREE.ImageUtils.loadTexture( 'images/cloud10.png', null );
	texture.magFilter = THREE.LinearMipMapLinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;

	var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );

	material = new THREE.ShaderMaterial( {

		uniforms: {

			"map": { type: "t", value: texture },
			"fogColor" : { type: "c", value: fog.color },
			"fogNear" : { type: "f", value: fog.near },
			"fogFar" : { type: "f", value: fog.far },

		},
		vertexShader: document.getElementById( 'vs' ).textContent,
		fragmentShader: document.getElementById( 'fs' ).textContent,
		depthWrite: false,
		depthTest: true,
		transparent: true

	} );

	var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );

	for ( var i = 0; i < 1000; i++ ) {

		plane.position.x = Math.random() * this.width - 500;//500
		plane.position.y =  Math.random() * Math.random() * this.depth - 0;//200
		plane.position.z = 400 + THREE.Math.randInt(10,30);
		//plane.rotation.z = Math.random() * Math.PI * 2;

		plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

		THREE.GeometryUtils.merge( geometry, plane );

	}



	mesh = new THREE.Mesh( geometry, material );
	mesh.rotation.x = 90 *  Math.PI/180 ;
	mesh.position.x = this.width/2;
	mesh.position.y = 400;
	//mesh.position.z = this.depth/2 ;
	scene.add( mesh );

	mesh = new THREE.Mesh( geometry, material );
	mesh.position.z = - 8000;
	scene.add( mesh );

*/































	


};

CITY.OpenCity.prototype = new THREE.Object3D();


CITY.OpenCity.prototype.drawGround = function(x,z,width,depth){

	var xPlane = x;
	var yPlane = 0;
	var zPlane = z;

	var planeGeometry = new CITY.PlaneBufferGeometry();

	planeGeometry.create(width + 20, 0, depth + 20, xPlane - 20, yPlane, zPlane - 20);

	//console.log("Triangles: %f, Cubes: %s\n", cubes * 10, cubes);
			
	var planeMesh = new THREE.Mesh( planeGeometry, CITY.groundMaterial );

	planeMesh.receiveShadow = CITY.SHADOWS;

	this.add( planeMesh );

}




CITY.OpenCity.prototype.setUpCollisions = function(){

	var scope = this;

	this.distances = [];
	this.distances[0] = 3;
	this.distances[1] = 2;
	this.distances[2] = 2;
	this.distances[3] = 2;
	this.distances[4] = 2.5;
	this.distances[5] = 2;

	this.cDetector = new CITY.CollisionDetector();

	this.cDetector.create(
		 this.flyControls, 			//FirstPersonControls
		 this.fpsControls, 			//PointerLockControls
		 this.flyCamera.position,	//Position of flyCam, workaround...
		 this.distances           	//Distances, to calculate collisions
		 );

	//Keyboard interaction method
	var onKeyDown = function ( event ) {

		switch( event.keyCode ) {
				
			case 67: //c
				//Toggle cameras
				if(CITY.DEBUG_COLLISIONS)console.log("Toggle camera");
				if(CITY.DEBUG_COLLISIONS)console.log("prev %s ",CITY.switchCamera);

				CITY.switchCamera = !CITY.switchCamera;

				if(CITY.DEBUG_COLLISIONS)console.log("post %s ", CITY.switchCamera);
				break;
			case 79: //o
				//Toggle cameras
				if(CITY.DEBUG_COLLISIONS)console.log("Toggle camera - ort");

				CITY.mapCam = !CITY.mapCam;
			break;

		}

	};

	//Binding to document
	document.addEventListener( 'keydown', onKeyDown, false );
};


CITY.OpenCity.prototype.setUpInteraction = function(scene, width, depth, x, y, z){

	/*
	* Interaction: Fly camera and FPS camera configuration
	*/

	
	/*
	<div id="blocker">
		<div id="instructions">
			<span style="font-size: 40px">Click to play</span> <br />(W, A, S, D
			= Move, SPACE = Jump, MOUSE = Look around)
		</div>
	</div>

	*/
	/*
	var node = document.createElement("div");

	node.innerHTML="<div id="blocker">
				<div id="instructions">
					<span style="font-size: 40px">Click to play</span> <br />(W, A, S, D
					= Move, SPACE = Jump, MOUSE = Look around)
					</div>
				</div>";
	*/
	this.blocker = document.getElementById('blocker');
	this.instructions = document.getElementById('instructions');//document.getElementById('instructions');
	
	
	//Map Cam
	this.mapCamera = new THREE.OrthographicCamera( -width/2 , width/2 , depth/2, -depth/2 , 0.2, 1000 );

	this.mapCamera.position.x = width/2;
	this.mapCamera.position.y = 100;
	this.mapCamera.position.z = depth/2;

	this.mapCamera.lookAt( new THREE.Vector3(this.mapCamera.position.x,0 - this.mapCamera.position.y,this.mapCamera.position.z) );

	//Fly camera
	this.flyCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.2, 1000 );
		
	scene.add(this.flyCamera);
	
	this.flyControls = new THREE.FirstPersonControls(this.flyCamera);
	this.flyControls.movementSpeed = 100;
	this.flyControls.lookSpeed = 0.1;

	this.flyCamera.position.set(x, 100, z);
	this.flyCamera.rotation.y = (90 * Math.PI/2);

	//FPS camera
	this.fpsCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.2, 1000 );
	//this.fpsCamera.position.set(1, 1, 40);
	scene.add(this.fpsCamera);
	
	this.fpsControls = new THREE.PointerLockControls(this.fpsCamera);
	scene.add( this.fpsControls.getObject() );
	//fpsControls.getObject().position.set(-10, 1, -40);

	this.fpsControls.getObject().position.set(x, 5, z);
	this.fpsControls.getObject().rotation.y = (90 * Math.PI/2);

	this.enableControls(this.blocker, this.instructions, this.fpsControls);

};


//ADAPTAR PARA ESPECIFICAR UNOS PARÁMETROS POR DEFECTO

CITY.OpenCity.prototype.update = function(delta){



	if(CITY.mapCam){

		this.instructions.style.display = 'none';
		this.fpsControls.enabled = false;

		return this.mapCamera;

	}else{

		var detectedCollisions = [];//this.cDetector.detect(this.switchCamera);

		//console.log(detectedCollisions);

		if(CITY.switchCamera){

			//Fly camera activated
			this.instructions.style.display = 'none';
			this.fpsControls.enabled = false;

			this.flyControls.update( delta, detectedCollisions);

			return this.flyCamera;

		}else{

			//FPS camera activated
			this.instructions.style.display = '';

			this.flyControls.freeze = true;

			this.fpsControls.update( delta, detectedCollisions );

			return this.fpsCamera;
		}
	}





};

CITY.OpenCity.prototype.onWindowResize = function(){

			this.flyCamera.aspect = window.innerWidth / window.innerHeight;
 			this.flyCamera.updateProjectionMatrix();


 			this.flyControls.handleResize();

	
};



CITY.OpenCity.prototype.enableControls = function(blocker, instructions, fpsControls){

			var havePointerLock = 'pointerLockElement' in document
					|| 'mozPointerLockElement' in document
					|| 'webkitPointerLockElement' in document;

			if (havePointerLock) {

				var element = document.body;

				var pointerlockchange = function(event) {

					if (document.pointerLockElement === element
							|| document.mozPointerLockElement === element
							|| document.webkitPointerLockElement === element) {

						fpsControls.enabled = true;

						blocker.style.display = 'none';

					} else {

						fpsControls.enabled = false;

						blocker.style.display = '-webkit-box';
						blocker.style.display = '-moz-box';
						blocker.style.display = 'box';

						instructions.style.display = '';

					}

				}

				var pointerlockerror = function(event) {

					instructions.style.display = '';

				}

				// Hook pointer lock state change events
				document.addEventListener('pointerlockchange',
						pointerlockchange, false);
				document.addEventListener('mozpointerlockchange',
						pointerlockchange, false);
				document.addEventListener('webkitpointerlockchange',
						pointerlockchange, false);

				document.addEventListener('pointerlockerror', pointerlockerror,
						false);
				document.addEventListener('mozpointerlockerror',
						pointerlockerror, false);
				document.addEventListener('webkitpointerlockerror',
						pointerlockerror, false);

				instructions
						.addEventListener(
								'click',
								function(event) {

									instructions.style.display = 'none';

									// Ask the browser to lock the pointer
									element.requestPointerLock = element.requestPointerLock
											|| element.mozRequestPointerLock
											|| element.webkitRequestPointerLock;

									if (/Firefox/i.test(navigator.userAgent)) {

										var fullscreenchange = function(event) {

											if (document.fullscreenElement === element
													|| document.mozFullscreenElement === element
													|| document.mozFullScreenElement === element) {

												document.removeEventListener(
														'fullscreenchange',
														fullscreenchange);
												document.removeEventListener(
														'mozfullscreenchange',
														fullscreenchange);

												element.requestPointerLock();
											}

										}

										document.addEventListener(
												'fullscreenchange',
												fullscreenchange, false);
										document.addEventListener(
												'mozfullscreenchange',
												fullscreenchange, false);

										element.requestFullscreen = element.requestFullscreen
												|| element.mozRequestFullscreen
												|| element.mozRequestFullScreen
												|| element.webkitRequestFullscreen;

										element.requestFullscreen();

									} else {

										element.requestPointerLock();

									}

								}, false);

			} else {

				instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

			}
};

	
