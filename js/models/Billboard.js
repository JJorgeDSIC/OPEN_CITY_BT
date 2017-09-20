//Methods to create objects based on BillBoards: Trees and Lamposts (Clouds TO DO).
CITY.BillBoard = function (  ){

	THREE.Mesh.call(this);

};

CITY.BillBoard.prototype = new THREE.Mesh();

CITY.BillBoard.prototype.create = function(width, height, depth, posx, posy, posz, texture){

		this.width = width;
		this.height = height;
		this.depth = depth;
		
		this.geometry = new CITY.PlaneBufferGeometry();

		this.geometry.create(width, height, depth, posx, posy, posz);

		this.texture = texture;

		var billboardMaterial = new THREE.MeshLambertMaterial( 
		{ 	map: texture, 
			alphaTest: 0.5, 
			side: THREE.DoubleSide 
		} );

		this.material = billboardMaterial;

		
		
};

// Custom TreeBillBoard class
CITY.ElementBillBoard = function (  ){

	THREE.Object3D.call(this);

};

CITY.ElementBillBoard.prototype = new THREE.Object3D();

CITY.ElementBillBoard.prototype.create = function(width, depth, height, posx, posz, map){

	var xz = new CITY.BillBoard();

	xz.create(width, 0, depth, 0, 0, 0, map);
	xz.position.z = - depth/2;
	//xz.rotation.x = Math.PI/4;

	var zx = new CITY.BillBoard();

	zx.create(width, 0, depth, 0, 0, 0, map);

	zx.rotation.x = 90 * Math.PI/180;
	zx.position.y = + depth/2 + height;

	this.add(xz);
	this.add(zx);

	this.rotation.z =  90 * Math.PI/180;

	

			
};


CITY.TreeBillBoard = function (  ){

	THREE.Object3D.call(this);


};

CITY.TreeBillBoard.prototype = new THREE.Object3D();

CITY.TreeBillBoard.prototype.create = function(width, height, elevation, posx, posz, map){

	var xz = new CITY.BillBoard();

	xz.create(width, 0, height, 0, 0, 0, map);
	xz.position.z = - height/2;
	//xz.rotation.x = Math.PI/4;

	var zx = new CITY.BillBoard();

	zx.create(width, 0, height, 0, 0, 0, map);

	zx.rotation.x = 90 * Math.PI/180;
	zx.position.y = + height/2 + elevation;

	this.add(xz);
	this.add(zx);

	this.rotation.z =  90 * Math.PI/180;		
};


CITY.LampostBillBoard = function (  ){

	THREE.Object3D.call(this);


};

CITY.LampostBillBoard.prototype = new THREE.Object3D();

CITY.LampostBillBoard.prototype.create = function(width, height, elevation, posx, posz, map){

	var xz = new CITY.BillBoard();

	xz.create(width, 0, height, 0, 0, 0, map);
	xz.position.z = - height/2;
	//xz.rotation.x = Math.PI/4;

	var zx = new CITY.BillBoard();

	zx.create(width, 0, height, 0, 0, 0, map);

	zx.rotation.x = 90 * Math.PI/180;
	zx.position.y = + height/2 + elevation;

	this.add(xz);
	this.add(zx);

	this.rotation.z =  90 * Math.PI/180;
		
};


CITY.CloudBillboard = function (  ){
	THREE.Object3D.call(this);

};

CITY.CloudBillboard.prototype = new THREE.Object3D();

CITY.CloudBillboard.prototype.create = function(width, depth, height, posx, posz){

	var xz = new CITY.BillBoard();

	xz.create(width, 0, depth, 0, 0, 0, map);
	xz.position.z = - depth/2;
	//xz.rotation.x = Math.PI/4;

	var zx = new CITY.BillBoard();

	zx.create(width, 0, depth, 0, 0, 0, map);

	zx.rotation.x = 90 * Math.PI/180;
	zx.position.y = + depth/2 + height;

	this.add(xz);
	this.add(zx);

	this.rotation.z =  90 * Math.PI/180;
			
};