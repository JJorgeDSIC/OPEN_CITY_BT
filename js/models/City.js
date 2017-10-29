
// Custom OpenCity class

var collidableMesh = [];
var pointsLights = [];

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
		parameters.posZ,
		parameters.renderer
		);




	CITY.Scene = scene;	

	//scene.fog	= new THREE.FogExp2( 0xd0e0f0, 0.0025 );


	//////////////////////
	//	CITY GENERATION //
	//////////////////////


	//var layout = new CITY.Layout();

	var time = Date.now();
	/*
	Default params
	var parameters = {
		streetAnchor: 10,
		avenueAnchor: 30,
		numAvenues: 5,
		radial: true,
		purgeArea: 200,
		gridRotation: 20,
		divisionSize: 200,
		mean: 400,
		stdev: 100
    };
	*/
	console.log(parameters);
    var districts = drawRoadMap(

			this.width,//Number(document.getElementById("sizeXField").value),
			this.depth,//Number(document.getElementById("sizeZField").value),
			parameters.streetAnchor,//Number(document.getElementById("streetAnchorField").value),
			parameters.avenueAnchor,//Number(document.getElementById("avenueAnchorField").value),
			parameters.numAvenues,//4,
			parameters.mean,//Number(document.getElementById("minSizeXAxisField").value),
			parameters.mean + 100,//Number(document.getElementById("maxSizeXAxisField").value),
			parameters.mean,//Number(document.getElementById("minSizeYAxisField").value),
			parameters.mean + 200,//Number(document.getElementById("maxSizeYAxisField").value),
			0,//Number(document.getElementById("purgeAreaField").value),
			false,
			false,
			parameters.radial,
			0,
			0

		);

   //drawLayout(districts,  5 , scene);

   //console.log("END DISTRICTS");

   var finalLayout = new gpcas.geometry.PolyDefault();


   for(var i = 0; i < districts.getNumInnerPoly(); i++){

   	   var poly = districts.getInnerPoly(i);
   	 
	   drawRoadMap2InitialPoly(

					poly.getBounds().w,
					poly.getBounds().h,
					parameters.blockStreetAnchor,//5,
					parameters.blockAvenueAnchor,//5,
					parameters.blockNumAvenues,//2,
					parameters.blockMeanDistrictSize,
					parameters.blockMeanDistrictSize,
					parameters.blockMeanDistrictSize,
					parameters.blockMeanDistrictSize,
					parameters.blockPurgeArea,
					/*
					Number(document.getElementById("maxSizeXAxisField").value),
					Number(document.getElementById("minSizeYAxisField").value),
					Number(document.getElementById("maxSizeYAxisField").value),
					Number(document.getElementById("purgeAreaField").value),
					*/				
					false,
					false,
					parameters.blockRadial,
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

	

	this.particleLights = [];
	var particleGeo = new THREE.Geometry();

	for ( var i = 0, il = pointsLights.length; i < il; i ++ ) {

		var vertex = new THREE.Vertex( pointsLights[ i ] );
		particleGeo.vertices[ i ] = vertex;

	}

	var map = THREE.ImageUtils.loadTexture( "images/lensflare0_alpha.png" );
	var particleMaterial = new THREE.ParticleBasicMaterial( { size: 4, color: 0xffffff, map: map, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false } );

	var particles = new THREE.ParticleSystem( particleGeo, particleMaterial );
	particles.visible = false;
	scene.add( particles );

	this.particleLights.push( particles );

	var billboardMaterial = new THREE.MeshBasicMaterial( 
		{ 	map: CITY.block, 
			alphaTest: 0.5, 
			side: THREE.DoubleSide 
		} );


	var MAX_H = 300;
	var collisionCube = new CITY.BoxBufferGeometry();
	collisionCube.create(this.width, MAX_H, this.depth, this.posx - 15, 0, this.posz - 15);

	var mesh = new THREE.Mesh(collisionCube, billboardMaterial);

	console.log(mesh);
	scene.add(mesh);

	collidableMesh.push(mesh);

	scope.setUpCollisions(collidableMesh);

	//Store ref. to scene object
   var numBuildings = finalLayout.getNumInnerPoly();

   var triangulos = 10 * numBuildings + 8 * numBuildings + 10 * numBuildings;
   var time2 = Date.now();
   var totalTime = (time2 - time)/1000;

	cubePosis = new THREE.Mesh(new THREE.BoxGeometry(10,10,10));

	scene.add(cubePosis);

	cubePosis2 = new THREE.Mesh(new THREE.BoxGeometry(10,10,10));

	scene.add(cubePosis2);

	var xPlane = this.posx;
	var yPlane = 0;
	var zPlane = this.posz;

	var planeGeometry = new CITY.PlaneBufferGeometry();

	planeGeometry.create(this.width * 2 + 20, 0, this.depth * 2 + 20, xPlane - 20, yPlane, zPlane - 20);

	//console.log("Triangles: %f, Cubes: %s\n", cubes * 10, cubes);

	var planeMesh = new THREE.Mesh( planeGeometry, CITY.groundMaterial );

	planeMesh.receiveShadow = CITY.SHADOWS;

	scene.add( planeMesh );

	collidableMesh.push(planeMesh);

	var billboardMaterial = new THREE.MeshBasicMaterial( 
		{ 	map: CITY.cloud, 
			alphaTest: 0.8, 
			side: THREE.DoubleSide 
		} );


};

CITY.OpenCity.prototype = new THREE.Object3D();

var cubePosis;
var cubePosis2;
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

CITY.OpenCity.prototype.setUpCollisions = function(collidableMesh){

	var scope = this;

	this.distances = [];
	this.distances[0] = 5;
	this.distances[1] = 4;
	this.distances[2] = 4;
	this.distances[3] = 4;
	this.distances[4] = 4.5;
	this.distances[5] = 4;

	this.cDetector = new CITY.CollisionDetector();

	this.cDetector.create(
		 this.flyControls, 			//FirstPersonControls
		 this.fpsControls, 			//PointerLockControls
		 this.flyCamera.position,	//Position of flyCam, workaround...
		 this.distances,           	//Distances, to calculate collisions
		 collidableMesh
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
			case 77: //M
				//Toggle cameras
				if(CITY.DEBUG_COLLISIONS)console.log("Toggle camera - ort");

				CITY.mapCam = !CITY.mapCam;
				break;
			case 78: /*N*/   
			vdir *= -1; 



			break;

		}

	};

	//Binding to document
	document.addEventListener( 'keydown', onKeyDown, false );
};


CITY.OpenCity.prototype.setUpInteraction = function(scene, width, depth, x, y, z, renderer){

	this.blocker = document.getElementById('blocker');
	this.instructions = document.getElementById('instructions');//document.getElementById('instructions');
	
	
	//Map Cam
	this.mapCamera = new THREE.OrthographicCamera( -width/2 , width/2 , depth/2, -depth/2 , 0.2, 3000 );

	this.mapCamera.position.x = width/2;
	this.mapCamera.position.y = 2000;
	this.mapCamera.position.z = depth/2;

	this.mapCamera.lookAt( new THREE.Vector3(this.mapCamera.position.x,0 - this.mapCamera.position.y,this.mapCamera.position.z) );

	//Fly camera
	this.flyCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
		
	scene.add(this.flyCamera);
	
	this.flyControls = new THREE.FirstPersonControls(this.flyCamera);
	this.flyControls.movementSpeed = 20;
	this.flyControls.lookSpeed = 0.05;

	this.flyCamera.position.set(x, 250, z);
	this.flyCamera.rotation.y = (45 * Math.PI/2);

	//FPS camera
	this.fpsCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
	//this.fpsCamera.position.set(1, 1, 40);
	scene.add(this.fpsCamera);
	
	this.fpsControls = new THREE.PointerLockControls(this.fpsCamera, renderer.domElement);
	scene.add( this.fpsControls.getObject() );
	//fpsControls.getObject().position.set(-10, 1, -40);

	this.fpsControls.getObject().position.set(x, 1.8, z);
	this.fpsControls.getObject().rotation.y = (45 * Math.PI/2);


	this.enableControls(this.blocker, this.instructions, this.fpsControls);
	this.fpsControls.getObject().rotation.y = (45 * Math.PI/2);

};

var sky;

CITY.OpenCity.prototype.update = function(delta, vv){

	if ( vv < 0.3 ) {

		opacity=  1 - vv / 0.3;

	} else {

		opacity = 0;

	}

	for ( var i = 0; i < this.particleLights.length; i ++ ) {

		this.particleLights[ i ].material.opacity = opacity;
		if ( opacity === 0 ) this.particleLights[ i ].visible = false;
		else 				 this.particleLights[ i ].visible = true;

	}


	
	//else{
		var cam;

		var detectedCollisions = this.cDetector.detect(this.switchCamera);

		//console.log(detectedCollisions);

		if(CITY.switchCamera){

			//Fly camera activated
			
			this.instructions.style.display = 'none';
			this.instructions.style.hidden = '';
			this.instructions.style.visibility = 'hidden';
			this.fpsControls.enabled = false;

			this.flyControls.update( delta, detectedCollisions);
			//sky.position.x =  this.flyControls.object.position.x/2;
			//sky.position.y =  this.flyControls.object.position.y/2;
			//sky.position.z =  this.flyControls.object.position.z/2;
			cubePosis.position.x =  this.flyControls.object.position.x;
			cubePosis.position.y =  this.flyControls.object.position.y;
			cubePosis.position.z =  this.flyControls.object.position.z;
			
			//console.log(sky);
			//return this.flyCamera;
			cam = this.flyCamera;

			this.flyControls.freeze = false;

		}else{

			//FPS camera activated

			this.instructions.style.display = '';
			this.instructions.style.hidden = '';
			this.instructions.style.visibility = '';
			
			this.flyControls.freeze = true;

			cubePosis2.position =  this.fpsControls.yawObject.position;

			this.fpsControls.update( delta, detectedCollisions );
			//sky.position =  this.fpsControls.position;
			//console.log(sky);
			//return this.fpsCamera;
			cam = this.fpsCamera;
		}
	//}


	if(CITY.mapCam){

		//this.instructions.style.display = 'none';
		//this.fpsControls.enabled = false;

		return this.mapCamera;

	}else{
		return cam;
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

	
