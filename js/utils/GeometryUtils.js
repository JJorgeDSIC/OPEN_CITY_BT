CITY.GeometryUtils = function(){};


CITY.GeometryUtils.calulateNormals = function(ax,ay,az,bx,by,bz,cx,cy,cz){

        var ba = [];
        var bc = [];
      
        bc[0] = cx - bx;
        bc[1] = cy - by;
        bc[2] = cz - bz;

        ba[0] = ax - bx;
        ba[1] = ay - by;
        ba[2] = az - bz;

        var res = [];
        
        res[0] = ba[1] * bc[2] - ba[2] * bc[1];
        res[1] = ba[2] * bc[0] - ba[0] * bc[2];
        res[2] = ba[0] * bc[1] - ba[1] * bc[0];

      
        var len = Math.sqrt(res[0] * res[0] + res[1] * res[1] + res[2] * res[2]);

        if (len > 0) {
          res[0] /= len;
          res[1] /= len;
          res[2] /= len;
        }
                
        return res;
};




/**
 * @author spite / http://www.clicktorelease.com/
 * @author mrdoob / http://mrdoob.com/
 */

function geometryToBufferGeometryCustom( geometry, settings ) {

    if ( geometry instanceof THREE.BufferGeometry ) {

      return geometry;

    } 

    //console.log(geometry);

    settings = settings || { 'vertexColors': THREE.NoColors };

    var vertices = geometry.vertices;
    var faces = geometry.faces;
    var faceVertexUvs = geometry.faceVertexUvs;
    var vertexColors = settings.vertexColors;
    var hasFaceVertexUv = faceVertexUvs[ 0 ].length > 0;
    var hasFaceVertexNormals = faces[ 0 ].vertexNormals.length == 3;

    var bufferGeometry = new THREE.BufferGeometry();

    bufferGeometry.addAttribute( 'position', new THREE.Float32Attribute( faces.length * 3, 3 ));
    bufferGeometry.addAttribute( 'normal', new THREE.Float32Attribute( faces.length * 3, 3 ));
 
    var positions = bufferGeometry.attributes.position.array;
    var normals = bufferGeometry.attributes.normal.array;

    bufferGeometry.addAttribute( 'color', new THREE.Float32Attribute( faces.length * 3, 3 ));
    var colors = bufferGeometry.attributes.color.array;

    if ( hasFaceVertexUv === true ) {

      bufferGeometry.addAttribute( 'uv', new THREE.Float32Attribute( faces.length * 3, 2 ));

      var uvs = bufferGeometry.attributes.uv.array;

    }

    for ( var i = 0, i2 = 0, i3 = 0; i < faces.length; i ++, i2 += 6, i3 += 9 ) {

      var face = faces[ i ];

      var a = vertices[ face.a ];
      var b = vertices[ face.b ];
      var c = vertices[ face.c ];

      positions[ i3     ] = c.x;
      positions[ i3 + 1 ] = c.y;
      positions[ i3 + 2 ] = c.z;
      
      positions[ i3 + 3 ] = b.x;
      positions[ i3 + 4 ] = b.y;
      positions[ i3 + 5 ] = b.z;
      
      positions[ i3 + 6 ] = a.x;
      positions[ i3 + 7 ] = a.y;
      positions[ i3 + 8 ] = a.z;

      if ( hasFaceVertexNormals === true ) {



        var na = face.vertexNormals[ 0 ];
        var nb = face.vertexNormals[ 1 ];
        var nc = face.vertexNormals[ 2 ];

        normals[ i3     ] = na.x;
        normals[ i3 + 1 ] = na.y;
        normals[ i3 + 2 ] = na.z;

        normals[ i3 + 3 ] = nb.x;
        normals[ i3 + 4 ] = nb.y;
        normals[ i3 + 5 ] = nb.z;

        normals[ i3 + 6 ] = nc.x;
        normals[ i3 + 7 ] = nc.y;
        normals[ i3 + 8 ] = nc.z;

      } else {

        var n = face.normal;

        normals[ i3     ] = n.x;
        normals[ i3 + 1 ] = n.y;
        normals[ i3 + 2 ] = n.z;

        normals[ i3 + 3 ] = n.x;
        normals[ i3 + 4 ] = n.y;
        normals[ i3 + 5 ] = n.z;

        normals[ i3 + 6 ] = n.x;
        normals[ i3 + 7 ] = n.y;
        normals[ i3 + 8 ] = n.z;

      }

      if ( vertexColors === THREE.FaceColors ) {

        var fc = face.color;

        colors[ i3     ] = fc.r;
        colors[ i3 + 1 ] = fc.g;
        colors[ i3 + 2 ] = fc.b;

        colors[ i3 + 3 ] = fc.r;
        colors[ i3 + 4 ] = fc.g;
        colors[ i3 + 5 ] = fc.b;

        colors[ i3 + 6 ] = fc.r;
        colors[ i3 + 7 ] = fc.g;
        colors[ i3 + 8 ] = fc.b;

      } else if ( vertexColors === THREE.VertexColors ) {

        var vca = face.vertexColors[ 0 ];
        var vcb = face.vertexColors[ 1 ];
        var vcc = face.vertexColors[ 2 ];

        colors[ i3     ] = vca.r;
        colors[ i3 + 1 ] = vca.g;
        colors[ i3 + 2 ] = vca.b;

        colors[ i3 + 3 ] = vcb.r;
        colors[ i3 + 4 ] = vcb.g;
        colors[ i3 + 5 ] = vcb.b;

        colors[ i3 + 6 ] = vcc.r;
        colors[ i3 + 7 ] = vcc.g;
        colors[ i3 + 8 ] = vcc.b;

      }

      if ( hasFaceVertexUv === true ) {



        var uva = faceVertexUvs[ 0 ][ i ][ 0 ];
        var uvb = faceVertexUvs[ 0 ][ i ][ 1 ];
        var uvc = faceVertexUvs[ 0 ][ i ][ 2 ];

        uvs[ i2     ] = uvc.x / CITY.Vsize;
        uvs[ i2 + 1 ] = uvc.y / CITY.Vsize;
      
        uvs[ i2 + 2 ] = uvb.x / CITY.Vsize;
        uvs[ i2 + 3 ] = uvb.y / CITY.Vsize;
      
        uvs[ i2 + 4 ] = uva.x / CITY.Vsize;
        uvs[ i2 + 5 ] = uva.y / CITY.Vsize;

      }

    }

    //bufferGeometry.computeBoundingSphere();

    return bufferGeometry;

};

