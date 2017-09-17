// CollisionDetector class

CITY.CollisionDetector = function (  ) {


	THREE.Object3D.call(this);
	
}

CITY.CollisionDetector.prototype = new THREE.Object3D();

CITY.CollisionDetector.prototype.create = function(flyControls, fpsControls, myPosition, distances, collidableMesh){

		this.flyControls = flyControls; 
		this.fpsControls = fpsControls;

		this.caster =  new THREE.Raycaster(); 
		this.casterfar = 50;
		this.directions = 6;
		this.distances = distances;

		this.frontDirection = new THREE.Vector3();
		this.backDirection = new THREE.Vector3();
		this.rightDirection = new THREE.Vector3();
		this.leftDirection = new THREE.Vector3();
		this.upDirection = new THREE.Vector3();
		this.downDirection = new THREE.Vector3();

		this.obstacles = collidableMesh;


		
}

CITY.CollisionDetector.prototype.setObstacles = function(collidableMesh){
	
		//collidableMesh.push(this.mesh);
		//this.obstacles = collidableMesh; 
		//console.log(this.collidableMesh);
		//this.obstacles = this.collidableMesh;
				
}

CITY.CollisionDetector.prototype.detect = function(switchCamera){


	var target, position;

	var directions = [];

	frontDirection =this.frontDirection;
	backDirection = this.backDirection;
	rightDirection = this.rightDirection;
	leftDirection = this.leftDirection;
	upDirection = this.upDirection;
	downDirection = this.downDirection;


	//Collisions for Fly controls
	if(CITY.switchCamera){

		//if(CITY.DEBUG_COLLISIONS)console.log("Camera Fly");

		target = this.flyControls.orientation;

		position = this.flyControls.object.position;

		frontDirection.subVectors( target, position );

		frontDirection.normalize();

		backDirection.copy(frontDirection);

		backDirection.multiplyScalar(-1);

		directions.push(frontDirection);
		directions.push(backDirection);

		rightDirection.crossVectors(frontDirection, this.flyControls.object.up);

		leftDirection.copy(rightDirection);
		leftDirection.multiplyScalar(-1);
		
		directions.push(rightDirection);
		directions.push(leftDirection);

	
	}else{

		//if(CITY.DEBUG_COLLISIONS)console.log("Camera FPS");
	
		position = this.fpsControls.getObject().position;

		this.fpsControls.getDirection(frontDirection);

		frontDirection.y = 0.0;
		
		backDirection.copy(frontDirection);

		backDirection.multiplyScalar(-1);

		downDirection.set(0, -1, 0);

		directions.push(frontDirection);
		directions.push(backDirection);

		rightDirection.crossVectors(frontDirection, this.fpsControls.getObject().up);

		leftDirection.copy(rightDirection);
		leftDirection.multiplyScalar(-1);

		directions.push(rightDirection);
		directions.push(leftDirection);

		directions.push(downDirection);

	
	}


	var detectedCollisions = [];

	detectedCollisions[0] = false; //Front
	detectedCollisions[1] = false; //Back
	detectedCollisions[2] = false; //Right
	detectedCollisions[3] = false; //Left
	detectedCollisions[4] = false; //Down
	

	for(var i = 0; i < directions.length; i++){

		this.caster.set(position, directions[i]);

		var collisions = this.caster.intersectObjects(this.obstacles, true);

		if (collisions.length > 0 && collisions[0].distance <= this.distances[i]) {
			

		
			//if(i!=4){
				//if(CITY.DEBUG_COLLISIONS)console.log("Collision on direction %s \n",i);
				//if(CITY.DEBUG_COLLISIONS)console.log( directions[i]);
			//}
			detectedCollisions[i] = true;
		}
	}
	
	return detectedCollisions;
}