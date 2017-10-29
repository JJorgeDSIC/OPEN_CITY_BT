/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function ( object, domElement ) {

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );

	console.log(domElement);

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.movementSpeed = 1.0;
	this.lookSpeed = 0.005;

	this.lookVertical = true;
	this.autoForward = false;
	// this.invertVertical = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;
	this.phi = 90;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.freeze = false;

	this.mouseDragOn = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;


	//Collisions code

	this.frontCollision = false;

	this.backCollision = false;

	this.rightCollision = false;

	this.leftCollision = false;

	this.upCollision = false;
 
	this.downCollision = false;




	this.orientation = new THREE.Vector3(0,0,0);


	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', -1 );

	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {
		
		if ( this.domElement !== document ) {

			this.domElement.focus();

		}
		
		event.preventDefault();
		//event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;

			}

		}

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		//event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}

		this.mouseDragOn = false;

	};

	this.onMouseMove = function ( event ) {
		
		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;
			/*
			console.log(this.mouseX);
			console.log(this.mouseY);
			*/
		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}

	};

	this.onKeyDown = function ( event ) {

		//event.preventDefault();

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

			case 81: /*Q*/ this.freeze = !this.freeze; break;



			//Simulate collisions keys
			/*
			z 	90
			x 	88
			c 	67
			v 	86
			b 	66
			m 	77
			n 	78
			k 	75
			*/
			case 90:  /*Z*/
				this.frontCollision = !this.frontCollision;
				if(window.debug)console.log("Simulating front collision, status = %s\n", this.frontCollision);
				break;
			case 88: /*X*/ 
				this.backCollision = !this.backCollision;
				if(window.debug)console.log("Simulating back collision, status = %s\n", this.backCollision);
				break;
			case 86: /*V*/ 
				this.rightCollision = !this.rightCollision;
				if(window.debug)console.log("Simulating right collision, status = %s\n",  this.rightCollision);
				break;
			case 66: /*B*/ 
				this.leftCollision = !this.leftCollision;
				if(window.debug)console.log("Simulating left collision, status = %s\n", this.leftCollision);
				break;
			case 78: /*N*/ 
				this.upCollision = !this.upCollision;
				if(window.debug)console.log("Simulating up collision, status = %s\n", this.upCollision);
				break;
			case 77: /*M*/ 
				this.downCollision = !this.downCollision;
				if(window.debug)console.log("Simulating down collision, status = %s\n", this.downCollision);
				break;
		

		}

	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;


		}

	};

	this.update = function( delta, detectedCollisions ) {

		if ( this.freeze ) {

			return;

		}

		if ( this.heightSpeed ) {

			var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
			var heightDelta = y - this.heightMin;

			this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

		} else {

			this.autoSpeedFactor = 0.0;

		}

		this.frontCollision = detectedCollisions[0];
		this.backCollision = detectedCollisions[1];
		
		this.rightCollision = detectedCollisions[2];
		this.leftCollision = detectedCollisions[3];

		var actualMoveSpeed = delta * this.movementSpeed;

		//console.log(actualMoveSpeed);

		//console.log(this.object.position.x);
		//console.log(this.object.position.y);
		//console.log(this.object.position.z);

/*
		var collisionCube = 

		this.frontCollision = this.frontCollision || 
		this.backCollision = this.backCollision ||
		this.leftCollision = this.leftCollision ||
		this.rightCollision = this.rightCollision ||
		this.upCollision = this.upCollision ||
		this.downCollision = this.downCollision ||

		&& this.object.position.z <= this.limitZ
		&& this.object.position.z <= this.limitZ
		&& this.object.position.x <= this.limitX
		&& this.object.position.x <= this.limitX
		&& this.object.position.x <= this.limitX
		&& this.object.position.y <= this.limitY
		&& this.object.position.y >= 0.5
*/
		if ( !this.frontCollision && (this.moveForward || ( this.autoForward && !this.moveBackward )) ) 
			this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );

		if ( !this.backCollision &&  this.moveBackward  ) 
			this.object.translateZ( actualMoveSpeed );

		if ( !this.leftCollision && this.moveLeft ) 
			this.object.translateX( - actualMoveSpeed );

		if ( !this.rightCollision && this.moveRight ) 
			this.object.translateX( actualMoveSpeed );

		if ( !this.upCollision && this.moveUp ) 
			this.object.translateY( actualMoveSpeed );

		if ( !this.downCollision && this.moveDown ) 
			this.object.translateY( - actualMoveSpeed );




		var actualLookSpeed = delta * this.lookSpeed;

		if ( !this.activeLook ) {

			actualLookSpeed = 0;

		}

		var verticalLookRatio = 1;

		if ( this.constrainVertical ) {

			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		}

		this.lon += this.mouseX * actualLookSpeed;

		if( this.lookVertical ) 
			this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		if ( this.constrainVertical ) {

			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 10 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 10 * Math.cos( this.phi );
		targetPosition.z = position.z + 10 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( targetPosition );

		//console.log("Phi %s, Theta %s\n", this.phi, this.theta);
		//console.log("lat %s, lon %s\n", this.lat, this.lon);

		this.orientation.set(targetPosition.x, targetPosition.y,targetPosition.z  );
		
		//this.orientation.subVectors(targetPosition, position);
		//this.orientation.normalize();
	};


	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
	this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
	
	window.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
	window.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.handleResize();

};
