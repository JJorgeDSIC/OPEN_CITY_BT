// Custom BoxBufferGeometry class
//This class extends the BufferGeometry class that provides methods to use buffers to store geomerties.
CITY.BoxBufferGeometry = function(){

	THREE.BufferGeometry.call(this);

}

CITY.BoxBufferGeometry.prototype = new THREE.BufferGeometry();

CITY.BoxBufferGeometry.prototype.create = function(width, height, depth, posx, posy, posz){

		this.width = width;
		this.height = height;
		this.depth = depth;
		
		var triangles = 10;

		this.addAttribute( 'index', new THREE.Int16Attribute( triangles * 3 , 1 ));
        this.addAttribute( 'position', new THREE.Float32Attribute( triangles * 3, 3 ));
        this.addAttribute( 'normal', new THREE.Float32Attribute( triangles * 3, 3 ));
        this.addAttribute( 'color', new THREE.Float32Attribute( triangles * 3, 3 ));
        this.addAttribute( 'uv', new THREE.Float32Attribute( triangles * 3, 2 ));

        var indices = this.getAttribute( 'index' ).array;
        var positions = this.getAttribute( 'position' ).array;
        var normals = this.getAttribute( 'normal' ).array;
        var colors = this.getAttribute( 'color' ).array;
        var uvs = this.getAttribute( 'uv' ).array;

/*
		this.addAttribute( 'index', new Uint16Array( 30 ), 1 );
		this.addAttribute( 'position', new Float32Array( 90 ), 3 );
		this.addAttribute( 'normal', new Float32Array( 90 ), 3 );
		this.addAttribute( 'uv', new Float32Array( 60 ), 2 );
		this.addAttribute( 'color', new Float32Array( 90 ), 3 );
*/
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

		var ax = x;
		var ay = y;
		var az = z;

		var bx = x;
		var by = y + height;
		var bz = z;

		var cx = x;
		var cy = y;
		var cz = z + width;

		var dx = x;
		var dy = y + height;
		var dz = z + width;

		var ex = x + depth;
		var ey = y;
		var ez = z + width;

		var fx = x + depth;
		var fy = y + height;
		var fz = z + width;

		var gx = x + depth;
		var gy = y + height;
		var gz = z;

		var hx = x + depth;
		var hy = y;
		var hz = z;

		var cube = 18;
		var uvCube = 12;

			//Top face

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


		uvs[ 0 ]  = 0.0;  
		uvs[ 1 ] = 1.0 ;

		uvs[ 2 ] = 1.0 ;  
		uvs[ 3 ] = 0.0;

		uvs[ 4 ] = 0.0;  
		uvs[ 5 ] = 0.0;
						
		uvs[ 6 ] = 1.0 ;  
		uvs[ 7 ] = 1.0 ;

		uvs[ 8 ] = 1.0 ;  
		uvs[ 9 ] = 0.0;

		uvs[ 10 ] = 0.0;  
		uvs[ 11 ] = 1.0 ;


		//Top face

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
		
			
		//Front face

		positions[ cube ]     = cx;
		positions[ cube + 1 ] = cy;
		positions[ cube + 2 ] = cz;

		positions[ cube + 3 ] = bx;
		positions[ cube + 4 ] = by;
		positions[ cube + 5 ] = bz;

		positions[ cube + 6 ] = ax;
		positions[ cube + 7 ] = ay;
		positions[ cube + 8 ] = az;
		
		positions[ cube + 9 ] = dx;
		positions[ cube + 10 ] = dy;
		positions[ cube + 11 ] = dz;

		positions[ cube + 12 ] = bx;
		positions[ cube + 13 ] = by;
		positions[ cube + 14 ] = bz;

		positions[ cube + 15 ] = cx;
		positions[ cube + 16 ] = cy;
		positions[ cube + 17 ] = cz;

		uvs[uvCube ]     = 0.0;  //c
		uvs[uvCube + 1 ] = 1.0;

		uvs[uvCube + 2 ] = 1.0;  //b
		uvs[uvCube + 3 ] = 0.0;

		uvs[uvCube + 4 ] = 0.0;  //a
		uvs[uvCube + 5 ] = 0.0;
						
		uvs[uvCube + 6]  = 1.0;  //d
		uvs[uvCube + 7 ] = 1.0;

		uvs[uvCube + 8 ] = 1.0;  //b
		uvs[uvCube + 9 ] = 0.0;

		uvs[uvCube + 10]  = 0.0;  //c
		uvs[uvCube + 11 ] = 1.0;
		
		//Right face
		
		positions[ cube + 18 ] = ex;
		positions[ cube + 19 ] = ey;
		positions[ cube + 20 ] = ez;

		positions[ cube + 21 ] = dx;
		positions[ cube + 22 ] = dy;
		positions[ cube + 23 ] = dz;

		positions[ cube + 24 ] = cx;
		positions[ cube + 25 ] = cy;
		positions[ cube + 26 ] = cz;
		
		positions[ cube + 27 ] = fx;
		positions[ cube + 28 ] = fy;
		positions[ cube + 29 ] = fz;

		positions[ cube + 30 ] = dx;
		positions[ cube + 31 ] = dy;
		positions[ cube + 32 ] = dz;

		positions[ cube + 33 ] = ex;
		positions[ cube + 34 ] = ey;
		positions[ cube + 35 ] = ez;

		uvs[uvCube + 12]  = 0.0;  
		uvs[uvCube + 13 ] = 1.0;

		uvs[uvCube + 14 ] = 1.0;  
		uvs[uvCube + 15 ] = 0.0;

		uvs[uvCube + 16 ] = 0.0;  
		uvs[uvCube + 17 ] = 0.0;
						
		uvs[uvCube + 18 ]  = 1.0;  
		uvs[uvCube + 19 ] = 1.0;

		uvs[uvCube + 20 ] = 1.0;  
		uvs[uvCube + 21 ] = 0.0;

		uvs[uvCube + 22 ]  = 0.0;  
		uvs[uvCube + 23 ] = 1.0;
		
		
		//Left face
		
		positions[ cube + 36 ] = gx;
		positions[ cube + 37 ] = gy;
		positions[ cube + 38 ] = gz;

		positions[ cube + 39 ] = hx;
		positions[ cube + 40 ] = hy;
		positions[ cube + 41 ] = hz;

		positions[ cube + 42 ] = ax;
		positions[ cube + 43 ] = ay;
		positions[ cube + 44 ] = az;
		
		positions[ cube + 45 ] = bx;
		positions[ cube + 46 ] = by;
		positions[ cube + 47 ] = bz;

		positions[ cube + 48 ] = gx;
		positions[ cube + 49 ] = gy;
		positions[ cube + 50 ] = gz;

		positions[ cube + 51 ] = ax;
		positions[ cube + 52 ] = ay;
		positions[ cube + 53 ] = az;


		uvs[uvCube + 24]  = 1.0;  
		uvs[uvCube + 25 ] = 0.0;

		uvs[uvCube + 26 ] = 0.0;  
		uvs[uvCube + 27 ] = 0.0;

		uvs[uvCube + 28 ] = 0.0;  
		uvs[uvCube + 29 ] = 1.0;
						
		uvs[uvCube + 30 ] = 1.0;  
		uvs[uvCube + 31 ] = 1.0;

		uvs[uvCube + 32 ] = 1.0;  
		uvs[uvCube + 33 ] = 0.0;

		uvs[uvCube + 34 ] = 0.0;  
		uvs[uvCube + 35 ] = 1.0;
		
		//Back Face
		
		positions[ cube + 54 ] = hx;
		positions[ cube + 55 ] = hy;
		positions[ cube + 56 ] = hz;

		positions[ cube + 57 ] = gx;
		positions[ cube + 58 ] = gy;
		positions[ cube + 59 ] = gz;

		positions[ cube + 60 ] = fx;
		positions[ cube + 61 ] = fy;
		positions[ cube + 62 ] = fz;
		
		
		positions[ cube + 63 ] = ex;
		positions[ cube + 64 ] = ey;
		positions[ cube + 65 ] = ez;

		positions[ cube + 66 ] = hx;
		positions[ cube + 67 ] = hy;
		positions[ cube + 68 ] = hz;

		positions[ cube + 69 ] = fx;
		positions[ cube + 70 ] = fy;
		positions[ cube + 71 ] = fz;

		uvs[uvCube + 36 ]  = 0.0;  
		uvs[uvCube + 37 ] = 1.0;

		uvs[uvCube + 38 ] = 1.0;  
		uvs[uvCube + 39 ] = 1.0;

		uvs[uvCube + 40 ] = 1.0;  
		uvs[uvCube + 41 ] = 0.0;
						
		uvs[uvCube + 42 ] = 0.0;  
		uvs[uvCube + 43 ] = 0.0;

		uvs[uvCube + 44 ] = 0.0;  
		uvs[uvCube + 45 ] = 1.0;

		uvs[uvCube + 46 ] = 1.0;  
		uvs[uvCube + 47 ] = 0.0;

		//Front face

		normals[ cube ]     = -1;
		normals[ cube + 1 ] = 0;
		normals[ cube + 2 ] = 0;

		normals[ cube + 3 ] = -1;
		normals[ cube + 4 ] = 0;
		normals[ cube + 5 ] = 0;

		normals[ cube + 6 ] = -1;
		normals[ cube + 7 ] = 0;
		normals[ cube + 8 ] = 0;

		normals[ cube + 9 ] = -1;
		normals[ cube + 10 ] = 0;
		normals[ cube + 11 ] = 0;

		normals[ cube + 12 ] = -1;
		normals[ cube + 13 ] = 0;
		normals[ cube + 14 ] = 0;

		normals[ cube + 15 ] = -1;
		normals[ cube + 16 ] = 0;
		normals[ cube + 17 ] = 0;
		
		//Right face
		
		normals[ cube + 18 ] = 0;
		normals[ cube + 19 ] = 0;
		normals[ cube + 20 ] = 1;

		normals[ cube + 21 ] = 0;
		normals[ cube + 22 ] = 0;
		normals[ cube + 23 ] = 1;

		normals[ cube + 24 ] = 0;
		normals[ cube + 25 ] = 0;
		normals[ cube + 26 ] = 1;
		
		normals[ cube + 27 ] = 0;
		normals[ cube + 28 ] = 0;
		normals[ cube + 29 ] = 1;

		normals[ cube + 30 ] = 0;
		normals[ cube + 31 ] = 0;
		normals[ cube + 32 ] = 1;

		normals[ cube + 33 ] = 0;
		normals[ cube + 34 ] = 0;
		normals[ cube + 35 ] = 1;

	
		//Left face
		
		normals[ cube + 36 ] = 0;
		normals[ cube + 37 ] = 0;
		normals[ cube + 38 ] = -1;

		normals[ cube + 39 ] = 0;
		normals[ cube + 40 ] = 0;
		normals[ cube + 41 ] = -1;

		normals[ cube + 42 ] = 0;
		normals[ cube + 43 ] = 0;
		normals[ cube + 44 ] = -1;
		
		normals[ cube + 45 ] = 0;
		normals[ cube + 46 ] = 0;
		normals[ cube + 47 ] = -1;

		normals[ cube + 48 ] = 0;
		normals[ cube + 49 ] = 0;
		normals[ cube + 50 ] = -1;

		normals[ cube + 51 ] = 0;
		normals[ cube + 52 ] = 0;
		normals[ cube + 53 ] = -1;
		
		//Back Face
		
		normals[ cube + 54 ] = 1;
		normals[ cube + 55 ] = 0;
		normals[ cube + 56 ] = 0;

		normals[ cube + 57 ] = 1;
		normals[ cube + 58 ] = 0;
		normals[ cube + 59 ] = 0;

		normals[ cube + 60 ] = 1;
		normals[ cube + 61 ] = 0;
		normals[ cube + 62 ] = 0;
		
		
		normals[ cube + 63 ] = 1;
		normals[ cube + 64 ] = 0;
		normals[ cube + 65 ] = 0;

		normals[ cube + 66 ] = 1;
		normals[ cube + 67 ] = 0;
		normals[ cube + 68 ] = 0;

		normals[ cube + 69 ] = 1;
		normals[ cube + 70 ] = 0;
		normals[ cube + 71 ] = 0;


			/*
		* Roof
		*/

	
		// colors

		var vx = ( x / triangles ) + 0.5;
		var vy = ( y / triangles ) + 0.5;
		var vz = ( z / triangles ) + 0.5;


		color.setRGB( Math.random(), Math.random(), Math.random() );

		colors[ cube ]     = color.r;
		colors[ cube + 1 ] = color.g;
		colors[ cube + 2 ] = color.b;

		colors[ cube + 3 ] = color.r;
		colors[ cube + 4 ] = color.g;
		colors[ cube + 5 ] = color.b;

		colors[ cube + 6 ] = color.r;
		colors[ cube + 7 ] = color.g;
		colors[ cube + 8 ] = color.b;

		colors[ cube + 9 ] = -color.r;
		colors[ cube + 10 ] = color.g;
		colors[ cube + 11 ] = color.b;

		colors[ cube + 12 ] = color.r;
		colors[ cube + 13 ] = color.g;
		colors[ cube + 14 ] = color.b;

		colors[ cube + 15 ] = color.r;
		colors[ cube + 16 ] = color.g;
		colors[ cube + 17 ] = color.b;
		
		//Right face
		
		colors[ cube + 18 ] = color.r;
		colors[ cube + 19 ] = color.g;
		colors[ cube + 20 ] = color.b;

		colors[ cube + 21 ] = color.r;
		colors[ cube + 22 ] = color.g;
		colors[ cube + 23 ] = color.b;

		colors[ cube + 24 ] = color.r;
		colors[ cube + 25 ] = color.g;
		colors[ cube + 26 ] = color.b;
		
		colors[ cube + 27 ] = color.r;
		colors[ cube + 28 ] = color.g;
		colors[ cube + 29 ] = color.b;

		colors[ cube + 30 ] = color.r;
		colors[ cube + 31 ] = color.g;
		colors[ cube + 32 ] = color.b;

		colors[ cube + 33 ] = color.r;
		colors[ cube + 34 ] = color.g;
		colors[ cube + 35 ] = color.b;

	
		//Left face
		
		colors[ cube + 36 ] = color.r;
		colors[ cube + 37 ] = color.g;
		colors[ cube + 38 ] = color.b;

		colors[ cube + 39 ] = color.r;
		colors[ cube + 40 ] = color.g;
		colors[ cube + 41 ] = color.b;

		colors[ cube + 42 ] = color.r;
		colors[ cube + 43 ] = color.g;
		colors[ cube + 44 ] = color.b;
	
		colors[ cube + 45 ] = color.r;
		colors[ cube + 46 ] = color.g;
		colors[ cube + 47 ] = color.b;

		colors[ cube + 48 ] = color.r;
		colors[ cube + 49 ] = color.g;
		colors[ cube + 50 ] = color.b;

		colors[ cube + 51 ] = color.r;
		colors[ cube + 52 ] = color.g;
		colors[ cube + 53 ] = color.b;
	
		//Back Face
		
		colors[ cube + 54 ] = color.r;
		colors[ cube + 55 ] = color.g;
		colors[ cube + 56 ] = color.b;

		colors[ cube + 57 ] = color.r;
		colors[ cube + 58 ] = color.g;
		colors[ cube + 59 ] = color.b;

		colors[ cube + 60 ] = color.r;
		colors[ cube + 61 ] = color.g;
		colors[ cube + 62 ] = color.b;
		
		
		colors[ cube + 63 ] = color.r;
		colors[ cube + 64 ] = color.g;
		colors[ cube + 65 ] = color.b;

		colors[ cube + 66 ] = color.r;
		colors[ cube + 67 ] = color.g;
		colors[ cube + 68 ] = color.b;

		colors[ cube + 69 ] = color.r;
		colors[ cube + 70 ] = color.g;
		colors[ cube + 71 ] = color.b;
		
		this.computeBoundingBox();


	}
