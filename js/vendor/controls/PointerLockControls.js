/**
 * @author mrdoob / http://mrdoob.com/
 */
THREE.PointerLockControls = function ( camera ) {

	var scope = this;
	var toggleCam = false;

	var mass = 80;
	
	camera.rotation.set( 0, 0, 0 );

	this.camera = camera;
	
	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );
	
	//pitchObject.position.set(camera.position);

	var yawObject = new THREE.Object3D();
	yawObject.add( pitchObject );

	this.yawObject = yawObject;
	
	//yawObject.position.set(camera.position);

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var run = false;
	
	var isOnObject = false;
	var canJump = false;

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			
			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 400;
				canJump = false;
				break;
			case 16: //shift
				run = true;
				break; 	

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {
			
			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;
			case 16: //shift
				run = false;
				break; 	


		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.getPitchObject = function () {

		return pitchObject;

	};


	

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		//canJump = boolean;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();

	this.update = function (delta, detectedCollisions) {

		if ( scope.enabled === false ) return;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		velocity.y -= 9.8 * mass * delta; // 100.0 = mass

		this.frontCollision = detectedCollisions[0];
		this.backCollision = detectedCollisions[1];
		
		this.rightCollision = detectedCollisions[2];
		this.leftCollision = detectedCollisions[3];

		this.downCollision = detectedCollisions[4];

		isOnObject = this.downCollision;

		if ( moveForward ){
			if(this.frontCollision)
				velocity.z = 0;
			else
				if(run)
					velocity.z -= 1200.0 * delta;
				else
					velocity.z -= 100.0 * delta;
		} 
		if ( moveBackward ){ 
			if(this.backCollision)
				velocity.z = 0;
			else
				if(run)
					velocity.z += 1200.0 * delta;
				else
					velocity.z += 100.0 * delta;
		}

		if ( moveLeft ){ 
			if(this.leftCollision)
				velocity.x = 0;
			else
				if(run)
					velocity.x -= 1200.0 * delta;
				else
					velocity.x -= 100.0 * delta;
		}
		if ( moveRight ){ 
			if(this.rightCollision)
				velocity.x = 0;
			else
				if(run)
					velocity.x += 1200.0 * delta;
				else
					velocity.x += 100.0 * delta;
		}

		if ( isOnObject === true ) {

			velocity.y = Math.max( 0, velocity.y );

		}

		canJump = velocity.y === 0.0;


		yawObject.translateX( velocity.x * delta );
		//yawObject.translateY( velocity.y * delta ); 
		yawObject.translateZ( velocity.z * delta );

		

	

	};

};