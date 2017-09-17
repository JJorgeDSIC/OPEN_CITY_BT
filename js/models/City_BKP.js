
// Custom OpenCity class


var collidableMesh = [];



CITY.OpenCity = function(parameters){

	this.pointsLights = [];

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

	console.log("Second renderer");
	console.log(parameters.renderer);

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
	var parameters = {
		streetAnchor: 10,
		avenueAnchor: 30,
		numAvenues: 5,
		radial: false,
		purgeArea: 400,
		gridRotation: 20,
		divisionSize: 200,
		mean: 400,
		stdev: 100
    };


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

	
   	
	extrudeSidewalks(finalLayout,  0.2 , scene, this.pointsLights);


	this.particleLights = [];
	var particleGeo = new THREE.Geometry();

	for ( var i = 0, il = this.pointsLights.length; i < il; i ++ ) {

		var vertex = new THREE.Vertex( this.pointsLights[ i ] );
		particleGeo.vertices[ i ] = vertex;

	}

	var map = THREE.ImageUtils.loadTexture( "images/lensflare0_alpha.png" );
	var particleMaterial = new THREE.ParticleBasicMaterial( { size: 3, color: 0xffffff, map: map, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false } );

	var particles = new THREE.ParticleSystem( particleGeo, particleMaterial );
	particles.visible = false;
	mesh.add( particles );

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

	//mesh.position.x = this.posx + this.width/2;
	//mesh.position.z = this.posz + this.depth/2;
	console.log(mesh);
	scene.add(mesh);

	//CITY.BoxBufferGeometry.prototype.create = function(width, height, depth, posx, posy, posz){

	//var collidableMesh = [];


	//collidableMesh.push(buildingGroupExtruding);

	collidableMesh.push(mesh);

	scope.setUpCollisions(collidableMesh);

	//Store ref. to scene object

   var numBuildings = finalLayout.getNumInnerPoly();
   //CITY.PolygonUtils.scalePolygon(finalLayout, 0.8, 0.8);
   //CITY.PolygonUtils.translatePolygon(finalLayout, this.width/2, this.depth/2);

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

	collidableMesh.push(planeMesh);

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

	cloudPlaneMesh.position.y = 200;


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


CITY.OpenCity.prototype.setUpInteraction = function(scene, width, depth, x, y, z, renderer){

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
	//console.log("Third renderer");
	//console.log(renderer.domElement);

	this.blocker = document.getElementById('blocker');
	this.instructions = document.getElementById('instructions');//document.getElementById('instructions');
	
	
	//Map Cam
	this.mapCamera = new THREE.OrthographicCamera( -width/2 , width/2 , depth/2, -depth/2 , 0.2, 2000 );

	this.mapCamera.position.x = width/2;
	this.mapCamera.position.y = 100;
	this.mapCamera.position.z = depth/2;

	this.mapCamera.lookAt( new THREE.Vector3(this.mapCamera.position.x,0 - this.mapCamera.position.y,this.mapCamera.position.z) );

	//Fly camera
	this.flyCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 3000 );
		
	scene.add(this.flyCamera);
	
	this.flyControls = new THREE.FirstPersonControls(this.flyCamera);
	this.flyControls.movementSpeed = 50;
	this.flyControls.lookSpeed = 0.05;

	this.flyCamera.position.set(x, 50, z);
	//this.flyCamera.rotation.y = (45 * Math.PI/2);

	//FPS camera
	this.fpsCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
	//this.fpsCamera.position.set(1, 1, 40);
	scene.add(this.fpsCamera);
	
	this.fpsControls = new THREE.PointerLockControls(this.fpsCamera, renderer.domElement);
	scene.add( this.fpsControls.getObject() );
	//fpsControls.getObject().position.set(-10, 1, -40);

	this.fpsControls.getObject().position.set(x, 1.8, z);
	this.fpsControls.getObject().rotation.y = (90 * Math.PI/2);

	this.enableControls(this.blocker, this.instructions, this.fpsControls);

	// SKYDOME
	/*
	var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 500, 0 );
	scene.add( hemiLight );
	
	var vertexShader = document.getElementById( 'vertexShader' ).textContent;
	var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
	var uniforms = {
		topColor: 	 { type: "c", value: new THREE.Color( 0x0077ff ) },
		bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
		offset:		 { type: "f", value: 400 },
		exponent:	 { type: "f", value: 0.6 }
	}
	uniforms.topColor.value.copy( hemiLight.color );

	//scene.fog.color.copy( uniforms.bottomColor.value );

	var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

	var skyGeo = new THREE.SphereGeometry( 1000, 32, 15 );
	sky = new THREE.Mesh( skyGeo, skyMat );
	scene.add( sky );
	*/

};

var sky;


//ADAPTAR PARA ESPECIFICAR UNOS PARÁMETROS POR DEFECTO

CITY.OpenCity.prototype.update = function(delta, vv){

	if ( vv < 0.3 ) {

		opacity=  1 - vv / 0.3;

	} else {

		opacity = 0;setSpritesOpacity( 0 );

	}

	for ( var i = 0; i < this.particleLights.length; i ++ ) {

		this.particleLights[ i ].material.opacity = opacity;
		if ( opacity === 0 ) this.particleLights[ i ].visible = false;
		else 				 this.particleLights[ i ].visible = true;

	}



	if(CITY.mapCam){

		this.instructions.style.display = 'none';
		this.fpsControls.enabled = false;

		return this.mapCamera;

	}else{

		var detectedCollisions = this.cDetector.detect(this.switchCamera);

		//console.log(detectedCollisions);

		if(CITY.switchCamera){

			//Fly camera activated
			
			this.instructions.style.display = 'none';
			this.instructions.style.hidden = '';
			this.instructions.style.visibility = 'hidden';
			this.fpsControls.enabled = false;

			this.flyControls.update( delta, detectedCollisions);
			sky.position.x =  this.flyControls.object.position.x/2;
			sky.position.y =  this.flyControls.object.position.y/2;
			sky.position.z =  this.flyControls.object.position.z/2;
			//console.log(sky);
			return this.flyCamera;

		}else{

			//FPS camera activated

			this.instructions.style.display = '';
			this.instructions.style.hidden = '';
			this.instructions.style.visibility = '';
			
			this.flyControls.freeze = true;

			this.fpsControls.update( delta, detectedCollisions );
			//sky.position =  this.fpsControls.position;
			//console.log(sky);
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

	
