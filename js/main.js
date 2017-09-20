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

	alert("Set your params or left them by default and click on 'create'");
	alert("Push Q to start, A,S,D,W and SHIFT provide movement, pushing C changes to one camera to the other and O shows the whole map")



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

		LIGHT_INTENSITY = 1.5;

		FOG_NEAR = 250;
		FAR = 750;

		FOG_H = 0.59;
		FOG_S = 0.2;
		FOG_V = 0.7;//1

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
	
		//gui.add(text, 'Push GENERATE (bottom) to create a new city');
		//gui.add(text, 'Push Key Q to start fliying around');
		//gui.add(text, 'Push Key C to start toggle camera: movement a,w,s,d and shift for running');
		//gui.add(text, 'N -> Toggle night, O -> show the map');

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

	}

	
	
};
