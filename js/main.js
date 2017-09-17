var h, s, v, near, far, intensity, vv = 0, vdir = 1;
var oldFar;


window.onload = function() {

	var scene, gui, renderer;

	var city;

	var sizeX = 1000;
	var sizeZ = 1000;

	window.debug = false;

	var clock = new THREE.Clock();

	var hemiLight;

	var light, light2;

	var camera, trackBallCamera, controls;



var FizzyText = function() {
  this.message = 'dat.gui';
  this.intensity = 0.8;
  this.displayOutline = false;
  this.create = function() { 
  	gui.close();
  	if(!init())animate();



  };
  // Define render logic ...
};


var manipulation = function(){

	this.width = 1000;
	this.depth = 1000;
	this.streetAnchorField = 10;
	this.avenueAnchorField  = 15;
	this.numAvenues = 2;
	this.purgeArea = 300;
	this.meanDistrictSize = 200;
	this.stdevDistrictSize = 10;
	this.radial = 0;

	this.blockStreetAnchor = 5;
	this.blockAvenueAnchor  = 5;
	this.blockNumAvenues = 1;
	this.blockPurgeArea = 300;
	this.blockMeanDistrictSize = 50;
	this.blockStdevDistrictSize = 5;
	this.blockRadial = 0;

	this.shadows = 0;

	


/*
	this.jump = 0.8;
	this.speed = 600;
	this.X = 0.02;
	this.Y = 0.02;
	this.Z = 0.02;
	this.XR = 0.02;
	//this.XCam = sizeX/2;
	this.YCam = 2000;
	//this.ZCam = sizeZ/2;
*/
};

	///////////GUI 
	//Manipulation
	prepareGUI();

	var configDay = {

				//LIGHT_INTENSITY: 3,
				LIGHT_INTENSITY: 1.2,

				//FOG_NEAR: 10,
				//FAR: 400,
				FOG_NEAR : 250,
				FAR : 750,

				FOG_H: 0.59,
				FOG_S: 0.2,
				FOG_V: 0.7

			};

			var configNight = {

				//LIGHT_INTENSITY: 1.7,
				LIGHT_INTENSITY: 1,

				FOG_NEAR: 10,
				FAR: 400,

				FOG_H: 0,
				FOG_S: 0,
				FOG_V: 0.2

			};

	

    /////////////////////////////////////////////////

    ///////START POINT///////////////////////////////

	//if(!init())animate();

	var ambient;
	var instructions = document.getElementById('instructions');
		
	instructions.style.display = 'none';

	function init() {


		if ( true ) {

			LIGHT_INTENSITY = 1.5;

			FOG_NEAR = 250;
			FAR = 750;

			FOG_H = 0.59;
			FOG_S = 0.2;
			FOG_V = 0.7;//1

		} else {

			LIGHT_INTENSITY = 1.2;

			FOG_NEAR = 1;
			FAR = 400;

			FOG_H = 0;
			FOG_S = 0;
			FOG_V = 0.1;

		}



		prepareRenderAndScene();

		//activeTrackBallControls(trackBallCamera);

		prepareEnvironment(scene);


		scene.fog = new THREE.Fog( 0xffffff, FOG_NEAR, FAR );
		scene.fog.color.setHSL( FOG_H, FOG_S, FOG_V );

		// LIGHTS

		ambient = new THREE.AmbientLight( 0xffffff );
		ambient.color.setHSL( 0.1, 0.0, 0.75 );
		//ambient.color.setHSL( 0.0, 0.0, 0.25 );
		scene.add( ambient );


		dirLight = new THREE.DirectionalLight( 0xffffff, LIGHT_INTENSITY );
		//dirLight = new THREE.SpotLight( 0xffffff, LIGHT_INTENSITY );
		//dirLight.position.set( 100, 55, 50 );
		dirLight.position.set( 0, 500, 0 );
		dirLight.target.position.set( sizeX/2, 0, sizeZ/2 );
		//dirLight.position.set( -100, 455, -50 );
		//dirLight.position.set( 200, 105, 100 );

		var pointLightHelper2 = new THREE.PointLightHelper( dirLight, 10);

		scene.add( pointLightHelper2 );


		dirLight.castShadow = true;
		//dirLight.shadowCameraVisible = true;
		/*
		var d = 20;
		dirLight.shadowCameraLeft = -d;
		dirLight.shadowCameraRight = d;
		dirLight.shadowCameraTop = d;
		dirLight.shadowCameraBottom = -d;
		
		dirLight.shadowDarkness = 0.6;
		dirLight.shadowBias = 0.000065;
		//dirLight.shadowCameraFar = 3000;
		
		dirLight.shadowCascade = true;
		dirLight.shadowCascadeCount = 3;


		dirLight.shadowCascadeNearZ = [ -1.000, 0.9, 0.975 ];
		dirLight.shadowCascadeFarZ  = [  0.9, 0.975, 1.000 ];
		dirLight.shadowCascadeWidth = [ 2048, 2048, 2048 ];
		dirLight.shadowCascadeHeight = [ 2048, 2048, 2048 ];
		dirLight.shadowCascadeBias = [ 0.00005, 0.000065, 0.000065 ];

		dirLight.shadowCascadeOffset.set( 0, 0, -10 );
*/


		dirLight.shadowMapWidth = 2048;
		dirLight.shadowMapHeight = 2048;




		dirLight.castShadow = true;
		dirLight.shadowCameraNear = 0;
		dirLight.shadowCameraFar = 3000;
		dirLight.shadowCameraFov = 50;

		//dirLight.shadowCameraVisible = true;

		dirLight.shadowBias = 0.0005;
		dirLight.shadowDarkness = 0.36;

		dirLight.shadowMapWidth = 4096;
		dirLight.shadowMapHeight = 4096;

		scene.add( dirLight );


		//DO THE MAGIC
		//console.log("First renderer");
		//console.log(renderer);

		var parameters = {
			posX: 0,
			posZ: 0,
			width: manipulationInstance.width,
			depth: manipulationInstance.depth,
			scene: scene,
			renderer: renderer,
			streetAnchor: manipulationInstance.streetAnchorField,//10,
			avenueAnchor: manipulationInstance.avenueAnchorField,//30,
			numAvenues: manipulationInstance.numAvenues,//5,
			radial: (manipulationInstance.radial !== 0)? false: true,//true,
			purgeArea: manipulationInstance.purgeArea,//200,

			blockStreetAnchor: manipulationInstance.blockStreetAnchor,//5,
			blockAvenueAnchor: manipulationInstance.blockAvenueAnchor,//5,
			blockNumAvenues: manipulationInstance.blockNumAvenues,//2,
			blockRadial: (manipulationInstance.blockRadial !== 0)? false: true,//true,
			blockPurgeArea: manipulationInstance.blockPurgeArea,//200,
			blockMeanDistrictSize : manipulationInstance.blockMeanDistrictSize,//50;
			blockStdevDistrictSize : manipulationInstance.blockStdevDistrictSize,//5;
			
			gridRotation: 20,
			divisionSize: manipulationInstance.radial,//200,
			mean: manipulationInstance.meanDistrictSize,//400,
			stdev: manipulationInstance.stdevDistrictSize//100
		}


		//console.log(parameters);

		city = new CITY.OpenCity(parameters);


		scene.add(city);


		if(false){

			var size = 4000;
			var step = 10;
			var gridHelper = new THREE.GridHelper(size, step);

			gridHelper.position = new THREE.Vector3(0, 0, 0);
			gridHelper.rotation = new THREE.Euler(15, 0, 0);

			scene.add(gridHelper);

			scene.add(new THREE.AxisHelper(50));

		}












		//prepareStats();
		window.addEventListener('resize', onWindowResize, false);
		document.body.appendChild( renderer.domElement );
	}

	function prepareStats(){

		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';

		//blocker.style.position = 'absolute';
		//blocker.style.top = '50px';

		container.appendChild( stats.domElement );
	}

	function prepareRenderAndScene(){

		if( Detector.webgl ){
			renderer = new THREE.WebGLRenderer({
					antialias		: true	// to get smoother output
					//preserveDrawingBuffer	: true	// to allow screenshot
				});
		}else{
			Detector.addGetWebGLMessage();
			return true;
		}

		renderer.setSize(window.innerWidth, window.innerHeight);
		
		if(manipulationInstance.shadows !== 0){
/*
			renderer.gammaInput = true;
			renderer.gammaOutput = true;

			renderer.shadowMapEnabled = true;
			//renderer.shadowMapDebug = true;
			
			renderer.shadowMapCascade = true;
			renderer.shadowCameraFar = sizeX * 2;
			//renderer.shadowMapType = THREE.PCFShadowMap;
			//renderer.sortObjects = true;
*/
			console.log("SHADOWS ACTIVATED");
			renderer.gammaInput = true;
			renderer.gammaOutput = true;

			renderer.shadowMapEnabled = true;
			renderer.shadowMapType = THREE.PCFShadowMap;
			renderer.shadowMapCullFrontFaces = false;
			renderer.shadowMapEnabled = true;
			renderer.shadowMapSoft = true;


			//renderer.shadowCameraNear = 0.1;
			//renderer.shadowCameraFar = sizeX * 2;
			//renderer.shadowCameraFov = 50;

			//renderer.shadowMapBias = 0.001;
			//renderer.shadowMapDarkness = 0.5;
			//renderer.shadowMapWidth = sizeX * 2;
			//renderer.shadowMapHeight = sizeZ * 2;

		}
		
		scene = new THREE.Scene();


	}
	var text;

	var manipulationInstance;


	function prepareGUI(){


		

		text = new FizzyText();
		 
		manipulationInstance = new manipulation();

		gui = new dat.GUI();
		//gui.add(text, 'message');
		//gui.add(text, 'intensity', 0, 1);
		//gui.add(text, 'displayOutline');
		//gui.add(text, 'explode');
	
		gui.add( manipulationInstance, 'width', 0, 5000 );
		gui.add( manipulationInstance, 'depth', 0, 5000 );
		gui.add( manipulationInstance, 'streetAnchorField').min(5).step(1);
		gui.add( manipulationInstance, 'avenueAnchorField').min(5).step(1);
		gui.add( manipulationInstance, 'numAvenues').min(0).step(1);
		gui.add( manipulationInstance, 'radial').min(0).step(1);
		gui.add( manipulationInstance, 'purgeArea').min(200).step(10);
		gui.add( manipulationInstance, 'meanDistrictSize').min(200).step(10);
		gui.add( manipulationInstance, 'stdevDistrictSize').min(200).step(10);

		gui.add( manipulationInstance, 'blockStreetAnchor').min(5).step(1);
		gui.add( manipulationInstance, 'blockAvenueAnchor').min(5).step(1);
		gui.add( manipulationInstance, 'blockNumAvenues').min(0).step(1);
		gui.add( manipulationInstance, 'blockRadial').min(0).step(1);
		gui.add( manipulationInstance, 'blockPurgeArea').min(200).step(10);
		gui.add( manipulationInstance, 'blockMeanDistrictSize').min(50).step(10);
		gui.add( manipulationInstance, 'blockStdevDistrictSize').min(10).step(10);
		gui.add( manipulationInstance, 'shadows').min(0).step(1);

		gui.add(text, 'create');
		/*
		gui.add( manipulationInstance, 'param1', 0, 1 ).step(0.01);
		gui.add( manipulationInstance, 'param2').min(0).step(1);
		gui.add( manipulationInstance, 'param3').min(0).step(1);
		gui.add( manipulationInstance, 'param4').min(0).step(1);
		gui.add( manipulationInstance, 'param5').min(0).step(1);
		*/
		/*var customContainer = document.getElementById('my-gui-container');
		customContainer.appendChild(gui.domElement);*/

/*
		gui.add( manipulationInstance, 'jump', 0, 1 );
		gui.add( manipulationInstance, 'jump').min(0).step(0.01);
		gui.add( manipulationInstance, 'speed', 0, 500 );

		gui.add( manipulationInstance, 'X', 0, 100 );
		gui.add( manipulationInstance, 'Y', 0, 100 );
		gui.add( manipulationInstance, 'Z', 0, 100 );

		gui.add( manipulationInstance, 'XR', 0, 360 );
/*
		//gui.add( manipulationInstance, 'XCam', 0, 8000 ).step(0.01);
		//gui.add( manipulationInstance, 'YCam', 0, 8000 );
		//gui.add( manipulationInstance, 'ZCam', 0, 8000 ).step(0.01);


		/*
		var FizzyText = function() {
		this.message = 'dat.gu
		i';
		this.speed = 0.8;
		this.displayOutline = false;
		this.explode = function() { ... };
		// Define render logic ...
		};

		window.onload = function() {
		var text = new FizzyText();
		var gui = new dat.GUI();
		gui.add(text, 'message');
		gui.add(text, 'speed', -5, 5);
		gui.add(text, 'displayOutline');
		gui.add(text, 'explode');
		};
		*/


	}

	function activeTrackBallControls(camera){
/*
		camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 3000 );
		
		camera.position.x = 300;
		camera.position.y = 100;
		camera.position.z = 300;

		controls = new THREE.TrackballControls( camera );

		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.8;

		controls.noZoom = false;
		controls.noPan = false;

		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;

		controls.keys = [ 65, 83, 68 ];

		controls.addEventListener( 'change', render );
*/


	}

	function animate() {

		requestAnimationFrame( animate );
		//controls.update();
		//stats.update();
		render();
		


	}

	

	function render() {

		var delta = clock.getDelta(),
		time = clock.getElapsedTime() * 1.0;


		//console.log(vdir);
		// day / night
		/*
		if(vdir < 0){
			dirLight.castShadow = render.shadowMapEnabled = false;
		}else{
			dirLight.castShadow = render.shadowMapEnabled = true;
		}
		*/

		vv = THREE.Math.clamp( vv + 1.5 * delta * vdir, 0, 1 );

		dirLight.intensity = THREE.Math.mapLinear( vv, 0, 1, configNight.LIGHT_INTENSITY, configDay.LIGHT_INTENSITY );

		h = THREE.Math.mapLinear( vv, 0, 1, configNight.FOG_H, configDay.FOG_H );
		s = THREE.Math.mapLinear( vv, 0, 1, configNight.FOG_S, configDay.FOG_S );
		v = THREE.Math.mapLinear( vv, 0, 1, configNight.FOG_V, configDay.FOG_V );

		scene.fog.color.setHSL( h, s, v );
		renderer.setClearColor( scene.fog.color, 1 );

		ambient.color.setHSL( h, s, v );

		near = THREE.Math.mapLinear( vv, 0, 1, configNight.FOG_NEAR, configDay.FOG_NEAR );
		far = THREE.Math.mapLinear( vv, 0, 1, configNight.FAR, configDay.FAR );

		scene.fog.near = near;
		scene.fog.far = far;

		var cityCamera = city.update(delta, vv);
		
		if ( far !== oldFar ) {

			//cityCamera.far = far;
			cityCamera.updateProjectionMatrix();

			oldFar = far;

		}
	




		//light.intensity = hemiLight.intensity = text.intensity;
		//light.position.y = sizeZ/2 + Math.cos( time * 0.5 ) * 50;
		dirLight.position.x = sizeZ/2 + Math.cos( time * 0.5 ) * 50;
		dirLight.position.y = sizeZ/2 + Math.cos( time * 0.5 ) * 50;
		 //Select what camera must be rendered
		//console.log(cityCamera);
		renderer.render( scene, cityCamera );

		//renderer.render( scene, camera );
		//prepareGUI();
		
		
		
	}


	function onWindowResize() {

		//Call for (Tratar con los eventos de redimensionado)
 			
		renderer.setSize( window.innerWidth, window.innerHeight );
		city.onWindowResize();


	}

	function prepareEnvironment(scene){

		camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 3000 );
		
		camera.position.x = 300;
		camera.position.y = 100;
		camera.position.z = 300;

		controls = new THREE.TrackballControls( camera );

		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.8;

		controls.noZoom = false;
		controls.noPan = false;

		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;

		controls.keys = [ 65, 83, 68 ];

		controls.addEventListener( 'change', render );

/*
		hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.8 ); //Cambiar a 0
		hemiLight.color.setHSL( 0.2, 1, 0.2 );
		hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 500, 0 );
		scene.add( hemiLight );

		light = new THREE.DirectionalLight(0xffffff, 1);//Cambiar a 0

		light.position.x = 0;
		light.position.z = -100;
		light.position.y = 100;

		light.target.position.set( sizeX/2, 0, sizeZ/2 );

		light.castShadow = CITY.SHADOWS;

		light.shadowCameraNear = 0;
		light.shadowCameraFar = 3000;
		light.shadowCameraFov = 20;

		light.shadowCameraVisible = true;

		light.shadowBias = 0.0005;
		light.shadowDarkness = 0.36;

		light.shadowMapWidth = 4096;
		light.shadowMapHeight = 4096;


		scene.add(light);
*/
/*
		light = new THREE.PointLight( 0xffffff, 1.2, 100000 );

		light.position.set(sizeX/2,300,sizeZ/2);

		light.castShadow = true;
		*/
//		var pointLightHelper1 = new THREE.PointLightHelper( light, 10 );

		//scene.add( pointLightHelper1 );
/*
		light2 = new THREE.PointLight( 0xffffff, 1.2, 100000 );
		
		light2.position.set(10,30,-30);
*/
//		var pointLightHelper2 = new THREE.PointLightHelper( light2, 10 );

		//scene.add( pointLightHelper2 );

		//scene.add(light2);

		// SKYDOME
/*
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

		var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
		var sky = new THREE.Mesh( skyGeo, skyMat );
		scene.add( sky );
*/

	}

	
	
};

