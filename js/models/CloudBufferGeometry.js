
// Custom CloudBufferGeometry class

CITY.CloudBufferGeometry = function(){

	THREE.BufferGeometry.call(this);

};

CITY.CloudBufferGeometry.prototype = new THREE.BufferGeometry();

CITY.CloudBufferGeometry.prototype.create = function(width, height, depth, posx, posy, posz){

		this.width = width;
		this.height = height;
		this.depth = depth;
		
		var triangles = 2;

		this.addAttribute( 'index', new THREE.Int16Attribute( triangles * 3, 1 ));
		this.addAttribute( 'position', new THREE.Float32Attribute( triangles * 3, 3 ));
		this.addAttribute( 'normal', new THREE.Float32Attribute( triangles * 3, 3 ));
		this.addAttribute( 'color', new THREE.Float32Attribute( triangles * 3, 3 ));
		this.addAttribute( 'uv', new THREE.Float32Attribute( triangles * 3, 2 ));
	

		var indices = this.getAttribute( 'index' ).array;

		for ( var i = 0; i < indices.length; i ++ ) {

			indices[ i ] = i;

		}

		var positions = this.getAttribute( 'position' ).array;
		var normals = this.getAttribute( 'normal' ).array;
		var colors = this.getAttribute( 'color' ).array;
		var uvs = this.getAttribute( 'uv' ).array;

		var color = new THREE.Color();

		var x = posx;
		var y = posy;
		var z = posz;

		var bx = x;
		var by = y + height;
		var bz = z;

		var dx = x;
		var dy = y + height;
		var dz = z + depth;

		var fx = x + width;
		var fy = y + height;
		var fz = z + depth;

		var gx = x + width;
		var gy = y + height;
		var gz = z;

	
		positions[ 0 ] = fx;
		positions[ 1 ] = fy;
		positions[ 2 ] = fz;

		positions[ 3 ] = bx;
		positions[ 4 ] = by;
		positions[ 5 ] = bz;

		positions[ 6 ] = dx;
		positions[ 7 ] = dy;
		positions[ 8 ] = dz;
		
		positions[ 9 ] = gx;
		positions[ 10 ] = gy;
		positions[ 11 ] = gz;

		positions[ 12 ] = bx;
		positions[ 13 ] = by;
		positions[ 14 ] = bz;

		positions[ 15 ] = fx;
		positions[ 16 ] = fy;
		positions[ 17 ] = fz;


		normals[ 0 ] = 0;
		normals[ 1 ] = 1;
		normals[ 2 ] = 0;

		normals[ 3 ] = 0;
		normals[ 4 ] = 1;
		normals[ 5 ] = 0;

		normals[ 6 ] = 0;
		normals[ 7 ] = 1;
		normals[ 8 ] = 0;
		
		normals[ 9 ] = 0;
		normals[ 10 ] = 1;
		normals[ 11 ] = 0;

		normals[ 12 ] = 0;
		normals[ 13 ] = 1;
		normals[ 14 ] = 0;

		normals[ 15 ] = 0;
		normals[ 16 ] = 1;
		normals[ 17 ] = 0;

		color.setRGB( 0.6, 0.6, 0.6 );
		

		colors[ 0 ] = color.r;
		colors[ 1 ] = color.g;
		colors[ 2 ] = color.b;

		colors[ 3 ] = color.r;
		colors[ 4 ] = color.g;
		colors[ 5 ] = color.b;

		colors[ 6 ] = color.r;
		colors[ 7 ] = color.g;
		colors[ 8 ] = color.b;
		
		colors[ 9 ] = color.r;
		colors[ 10 ] = color.g;
		colors[ 11 ] = color.b;

		colors[ 12 ] = color.r;
		colors[ 13 ] = color.g;
		colors[ 14 ] = color.b;

		colors[ 15 ] = color.r;
		colors[ 16 ] = color.g;
		colors[ 17 ] = color.b;


		uvs[ 0 ]  = 0.0;  
		uvs[ 1 ] = 1.0;

		uvs[ 2 ] = 1.0;  
		uvs[ 3 ] = 0.0;

		uvs[ 4 ] = 0.0;  
		uvs[ 5 ] = 0.0;
						
		uvs[ 6 ] = 1.0;  
		uvs[ 7 ] = 1.0;

		uvs[ 8 ] = 1.0;  
		uvs[ 9 ] = 0.0;

		uvs[ 10 ] = 0.0;  
		uvs[ 11 ] = 1.0;

		
		this.computeBoundingBox();

		
};