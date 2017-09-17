/**
 * @author Javier JC
 */

var CITY = { REVISION: '11' };

////////////// Constant declaration ////////////////////////////////////
self.console = self.console || {

	info: function () {},
	log: function () {},
	debug: function () {},
	warn: function () {},
	error: function () {}

};

CITY.TEXTURE_WIDTH = 256;
CITY.TEXTURE_HEIGHT = 256;

CITY.DEBUG_COLLISIONS = true;

CITY.HELPERS = true;

CITY.Vsize = 10;

CITY.Hsize = 10;

CITY.VsizeSW = 1;

CITY.HsizeSW = 1;

CITY.SHADOWS = true;

CITY.rectangular_buildings = 0;

CITY.buildings_generated = 0;

CITY.switchCamera = true; 	//Starting cameras
CITY.mapCam = false; 		//Starting cameras

CITY.Scene = undefined;

CITY.officeBuildingTexture  = THREE.ImageUtils.loadTexture( "images/office_wall_textures/office_building_1.png" );
CITY.officeBuildingTexture.wrapS = CITY.officeBuildingTexture.wrapT = THREE.RepeatWrapping;
	

CITY.officeBuildingTexture1  = THREE.ImageUtils.loadTexture( "images/office_wall_textures/166887_143444202381873_6854875_n.jpg" );
CITY.officeBuildingTexture1.wrapS = CITY.officeBuildingTexture1.wrapT = THREE.RepeatWrapping;

CITY.officeBuildingTexture2  = THREE.ImageUtils.loadTexture( "images/office_wall_textures/HighRiseResidential0144_2_thumblarge.jpg" );
CITY.officeBuildingTexture2.wrapS = CITY.officeBuildingTexture2.wrapT = THREE.RepeatWrapping;

CITY.officeBuildingTexture3  = THREE.ImageUtils.loadTexture( "images/office_wall_textures/167326_143444525715174_5629991_n.jpg" );
CITY.officeBuildingTexture3.wrapS = CITY.officeBuildingTexture3.wrapT = THREE.RepeatWrapping;

CITY.officeBuildingTexture4  = THREE.ImageUtils.loadTexture( "images/office_wall_textures/HighRiseGlass0013_1_thumblarge.jpg" );
CITY.officeBuildingTexture4.wrapS = CITY.officeBuildingTexture4.wrapT = THREE.RepeatWrapping;

CITY.officeBuildingTexture5  = THREE.ImageUtils.loadTexture( "images/office_wall_textures/HighRiseGlass0022_10_thumblarge.jpg" );
CITY.officeBuildingTexture5.wrapS = CITY.officeBuildingTexture5.wrapT = THREE.RepeatWrapping;

CITY.officeBuildingTexture6  = THREE.ImageUtils.loadTexture( "images/office_wall_textures/buildings_modern_6282_9011_Small.jpg" );
CITY.officeBuildingTexture6.wrapS = CITY.officeBuildingTexture6.wrapT = THREE.RepeatWrapping;

CITY.officeBuildingTexture7  = THREE.ImageUtils.loadTexture( "images/office_wall_textures/180113_143414182384875_4400661_n.jpg" );
CITY.officeBuildingTexture7.wrapS = CITY.officeBuildingTexture7.wrapT = THREE.RepeatWrapping;


CITY.officeBuildingTexture8  = THREE.ImageUtils.loadTexture( "images/office_wall_textures/buildings_modern_a23603f690_thumb.jpg" );
CITY.officeBuildingTexture8.wrapS = CITY.officeBuildingTexture8.wrapT = THREE.RepeatWrapping;






CITY.OfficeMaterial = new THREE.MeshPhongMaterial( { 
 ambient: 0xffffff,
 //color: 0xffffff,
 specular: 0x333333,
 shininess: 2 * 25,
 //wireframe: true,
 metal: false,
 map: CITY.officeBuildingTexture

 
 });

CITY.OfficeMaterial1 = new THREE.MeshPhongMaterial( { 
 ambient: 0xffffff,
 //color: 0xffffff,
 specular: 0x333333,
 shininess: 2 * 10,
 //wireframe: true,
 metal: false,
 map: CITY.officeBuildingTexture1

 
 });

CITY.OfficeMaterial2 = new THREE.MeshPhongMaterial( { 
 ambient: 0xffffff,
 //color: 0xffffff,
 specular: 0x333333,
 shininess: 2 * 15,
 //wireframe: true,
 metal: false,
 map: CITY.officeBuildingTexture2

 
 });


CITY.OfficeMaterial3 = new THREE.MeshPhongMaterial( { 
 ambient: 0xffffff,
//color: 0xffffff,
 specular: 0x333333,
 shininess: 2 * 20,
 //wireframe: true,
 metal: false,
 map: CITY.officeBuildingTexture3
 
 });


CITY.OfficeMaterial4 = new THREE.MeshPhongMaterial( { 
 ambient: 0xffffff,
 //color: 0xffffff,
 specular: 0x333333,
 shininess: 2 * 15,
 //wireframe: true,
 metal: false,
 map: CITY.officeBuildingTexture4

 
 });

CITY.OfficeMaterial5 = new THREE.MeshPhongMaterial( { 
	 ambient: 0xffffff,
	 //color: 0xffffff,
	 specular: 0x333333,
	 shininess: 2 * 20,
	 //wireframe: true,
	 metal: false,
	 map: CITY.officeBuildingTexture5

 
 });


CITY.OfficeMaterial6 = new THREE.MeshPhongMaterial( { 
	 ambient: 0xffffff,
	 //color: 0xffffff,
	 specular: 0x333333,
	 shininess: 2 * 10,
	 //wireframe: true,
	 metal: false,
	 map: CITY.officeBuildingTexture6

 
 });



CITY.OfficeMaterial7 = new THREE.MeshPhongMaterial( { 
	 ambient: 0xffffff,
	 //color: 0xffffff,
	 specular: 0x333333,
	 shininess: 2 * 10,
	 //wireframe: true,
	 metal: false,
	 map: CITY.officeBuildingTexture7

 
 });



CITY.OfficeMaterial8 = new THREE.MeshPhongMaterial( { 
	 ambient: 0xffffff,
	 //color: 0xffffff,
	 specular: 0x333333,
	 shininess: 2 * 10,
	 //wireframe: true,
	 metal: false,
	 map: CITY.officeBuildingTexture8

 
 });

CITY.officeMaterials = [];

CITY.officeMaterials.push(CITY.OfficeMaterial);

CITY.officeMaterials.push(CITY.OfficeMaterial1);

CITY.officeMaterials.push(CITY.OfficeMaterial2);

CITY.officeMaterials.push(CITY.OfficeMaterial3);

CITY.officeMaterials.push(CITY.OfficeMaterial4);

CITY.officeMaterials.push(CITY.OfficeMaterial5);

CITY.officeMaterials.push(CITY.OfficeMaterial6);

CITY.officeMaterials.push(CITY.OfficeMaterial7);

CITY.officeMaterials.push(CITY.OfficeMaterial8);







CITY.residencialBuildingTexture  = THREE.ImageUtils.loadTexture( "images/Residencial_tileable.png" );
CITY.residencialBuildingTexture.wrapS = CITY.residencialBuildingTexture.wrapT = THREE.RepeatWrapping;

CITY.residencialBuildingTexture1  = THREE.ImageUtils.loadTexture( "images/residential_wall_textures/HighRiseResidential0052_5_thumblarge.jpg" );
CITY.residencialBuildingTexture1.wrapS = CITY.residencialBuildingTexture1.wrapT = THREE.RepeatWrapping;

CITY.residencialBuildingTexture2  = THREE.ImageUtils.loadTexture( "images/residential_wall_textures/HighRiseResidential0063_1_thumblarge.jpg" );
CITY.residencialBuildingTexture2.wrapS = CITY.residencialBuildingTexture2.wrapT = THREE.RepeatWrapping;

CITY.residencialBuildingTexture3  = THREE.ImageUtils.loadTexture( "images/residential_wall_textures/HighRiseResidential0111_2_thumblarge.jpg" );
CITY.residencialBuildingTexture3.wrapS = CITY.residencialBuildingTexture3.wrapT = THREE.RepeatWrapping;

CITY.residencialBuildingTexture4  = THREE.ImageUtils.loadTexture( "images/residential_wall_textures/HighRiseResidential0134_2_thumblarge.jpg" );
CITY.residencialBuildingTexture4.wrapS = CITY.residencialBuildingTexture4.wrapT = THREE.RepeatWrapping;

CITY.residencialBuildingTexture5  = THREE.ImageUtils.loadTexture( "images/residential_wall_textures/HighRiseResidential0021_1_thumblarge.jpg" );
CITY.residencialBuildingTexture5.wrapS = CITY.residencialBuildingTexture5.wrapT = THREE.RepeatWrapping;

CITY.residencialBuildingTexture6  = THREE.ImageUtils.loadTexture( "images/residential_wall_textures/HighRiseResidential0019_1_thumblarge.jpg" );
CITY.residencialBuildingTexture6.wrapS = CITY.residencialBuildingTexture6.wrapT = THREE.RepeatWrapping;

CITY.residencialBuildingTexture7  = THREE.ImageUtils.loadTexture( "images/residential_wall_textures/HighRiseResidential0139_2_thumblarge.jpg" );
CITY.residencialBuildingTexture7.wrapS = CITY.residencialBuildingTexture7.wrapT = THREE.RepeatWrapping;




CITY.residencialBuildingMaterial = new THREE.MeshLambertMaterial( {
			color: 0xaaaaaa, 
			//side: THREE.DoubleSide,
			side: THREE.FrontSide,
			//transparent: true,
			//overdraw:true 
			map: CITY.residencialBuildingTexture 
	} );

CITY.residencialBuildingMaterial1 = new THREE.MeshLambertMaterial( {
			color: 0xaaaaaa, 
			//side: THREE.DoubleSide,
			side: THREE.FrontSide,
			//transparent: true,
			//overdraw:true 
			map: CITY.residencialBuildingTexture1 
	} );


CITY.residencialBuildingMaterial2 = new THREE.MeshLambertMaterial( {
			color: 0xaaaaaa, 
			//side: THREE.DoubleSide,
			side: THREE.FrontSide,
			//transparent: true,
			//overdraw:true 
			map: CITY.residencialBuildingTexture2 
	} );


CITY.residencialBuildingMaterial3 = new THREE.MeshLambertMaterial( {
			color: 0xaaaaaa, 
			//side: THREE.DoubleSide,
			side: THREE.FrontSide,
			//transparent: true,
			//overdraw:true 
			map: CITY.residencialBuildingTexture3 
	} );

CITY.residencialBuildingMaterial4 = new THREE.MeshLambertMaterial( {
			color: 0xaaaaaa, 
			//side: THREE.DoubleSide,
			side: THREE.FrontSide,
			//transparent: true,
			//overdraw:true 
			map: CITY.residencialBuildingTexture4 
	} );



CITY.residencialBuildingMaterial5 = new THREE.MeshLambertMaterial( {
			color: 0xaaaaaa, 
			//side: THREE.DoubleSide,
			side: THREE.FrontSide,
			//transparent: true,
			//overdraw:true 
			map: CITY.residencialBuildingTexture5
	} );



CITY.residencialBuildingMaterial6 = new THREE.MeshLambertMaterial( {
			color: 0xaaaaaa, 
			//side: THREE.DoubleSide,
			side: THREE.FrontSide,
			//transparent: true,
			//overdraw:true 
			map: CITY.residencialBuildingTexture6 
	} );



CITY.residencialBuildingMaterial7 = new THREE.MeshLambertMaterial( {
			color: 0xaaaaaa, 
			//side: THREE.DoubleSide,
			side: THREE.FrontSide,
			//transparent: true,
			//overdraw:true 
			map: CITY.residencialBuildingTexture7
	} );



CITY.residencialMaterials = [];

CITY.residencialMaterials.push(CITY.residencialBuildingMaterial);

CITY.residencialMaterials.push(CITY.residencialBuildingMaterial1);

CITY.residencialMaterials.push(CITY.residencialBuildingMaterial2);


CITY.residencialMaterials.push(CITY.residencialBuildingMaterial3);

CITY.residencialMaterials.push(CITY.residencialBuildingMaterial4);

CITY.residencialMaterials.push(CITY.residencialBuildingMaterial5);

CITY.residencialMaterials.push(CITY.residencialBuildingMaterial6);

CITY.residencialMaterials.push(CITY.residencialBuildingMaterial7);





CITY.roofTexture  = THREE.ImageUtils.loadTexture( "images/residential_roof_textures/roof.png" );
CITY.roofTexture.wrapS = CITY.roofTexture.wrapT = THREE.RepeatWrapping;

CITY.roofTexture1  = THREE.ImageUtils.loadTexture( "images/residential_roof_textures/3964781798_eed83bdf9c.jpg" );
CITY.roofTexture1.wrapS = CITY.roofTexture1.wrapT = THREE.RepeatWrapping;

CITY.roofTexture2  = THREE.ImageUtils.loadTexture( "images/residential_roof_textures/roofTexture2.jpg" );
CITY.roofTexture2.wrapS = CITY.roofTexture2.wrapT = THREE.RepeatWrapping;

CITY.roofTexture3  = THREE.ImageUtils.loadTexture( "images/residential_roof_textures/rough-texture-2894330.jpg" );
CITY.roofTexture3.wrapS = CITY.roofTexture3.wrapT = THREE.RepeatWrapping;

CITY.roofTexture4  = THREE.ImageUtils.loadTexture( "images/residential_roof_textures/rust-texture-16186744.jpg" );
CITY.roofTexture4.wrapS = CITY.roofTexture4.wrapT = THREE.RepeatWrapping;

CITY.roofTexture5  = THREE.ImageUtils.loadTexture( "images/residential_roof_textures/RooftilesBitumen0021_2_thumblarge.jpg" );
CITY.roofTexture5.wrapS = CITY.roofTexture5.wrapT = THREE.RepeatWrapping;




CITY.roofMaterial = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.roofTexture 
} );


CITY.roofMaterial1 = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.roofTexture1 
} );


CITY.roofMaterial2 = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.roofTexture2 
} );


CITY.roofMaterial3 = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.roofTexture3
} );


CITY.roofMaterial4 = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.roofTexture4
} );


CITY.roofMaterial5 = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.roofTexture5
} );


CITY.roofMaterials = [];

CITY.roofMaterials.push(CITY.roofMaterial);

CITY.roofMaterials.push(CITY.roofMaterial1);
CITY.roofMaterials.push(CITY.roofMaterial2);
CITY.roofMaterials.push(CITY.roofMaterial3);
CITY.roofMaterials.push(CITY.roofMaterial4);
CITY.roofMaterials.push(CITY.roofMaterial5);


CITY.firstFloorTextures  = THREE.ImageUtils.loadTexture( "images/firstFloorTextures/firstFloor1.jpg" );
CITY.firstFloorTextures.wrapS = CITY.firstFloorTextures.wrapT = THREE.RepeatWrapping;

CITY.firstFloorTextures1  = THREE.ImageUtils.loadTexture( "images/firstFloorTextures/FirstFloor2.jpg" );
CITY.firstFloorTextures1.wrapS = CITY.firstFloorTextures1.wrapT = THREE.RepeatWrapping;

CITY.firstFloorTextures2  = THREE.ImageUtils.loadTexture( "images/firstFloorTextures/FirstFloor3.jpg" );
CITY.firstFloorTextures2.wrapS = CITY.firstFloorTextures2.wrapT = THREE.RepeatWrapping;



CITY.firstFloorMaterial = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.firstFloorTextures 
} );


CITY.firstFloorMaterial1 = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.firstFloorTextures1 
} );


CITY.firstFloorMaterial2 = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.firstFloorTextures2 
} );



CITY.firstFloorMaterials = [];

CITY.firstFloorMaterials.push(CITY.firstFloorMaterial);

CITY.firstFloorMaterials.push(CITY.firstFloorMaterial1);
CITY.firstFloorMaterials.push(CITY.firstFloorMaterial2);


CITY.firstFloorOfficeTextures  = THREE.ImageUtils.loadTexture( "images/firstFloorOffice/Pared_Oficina1.jpg" );
CITY.firstFloorOfficeTextures.wrapS = CITY.firstFloorOfficeTextures.wrapT = THREE.RepeatWrapping;

CITY.firstFloorOfficeTextures1  = THREE.ImageUtils.loadTexture( "images/firstFloorOffice/Pared_Oficina2.jpg" );
CITY.firstFloorOfficeTextures1.wrapS = CITY.firstFloorOfficeTextures1.wrapT = THREE.RepeatWrapping;

CITY.firstFloorOfficeTextures2  = THREE.ImageUtils.loadTexture( "images/firstFloorOffice/Pared_Oficina3.jpg" );
CITY.firstFloorOfficeTextures2.wrapS = CITY.firstFloorOfficeTextures2.wrapT = THREE.RepeatWrapping;

CITY.firstFloorOfficeTextures3  = THREE.ImageUtils.loadTexture( "images/firstFloorOffice/Pared_Oficina4.jpg" );
CITY.firstFloorOfficeTextures3.wrapS = CITY.firstFloorOfficeTextures3.wrapT = THREE.RepeatWrapping;


CITY.firstFloorOfficeMaterial = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.firstFloorOfficeTextures 
} );


CITY.firstFloorOfficeMaterial1 = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.firstFloorOfficeTextures1 
} );


CITY.firstFloorOfficeMaterial2 = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.firstFloorOfficeTextures2 
} );

CITY.firstFloorOfficeMaterial3 = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.firstFloorOfficeTextures3
} );





CITY.firstFloorOfficeMaterials = [];

CITY.firstFloorOfficeMaterials.push(CITY.firstFloorOfficeMaterial);

CITY.firstFloorOfficeMaterials.push(CITY.firstFloorOfficeMaterial1);
CITY.firstFloorOfficeMaterials.push(CITY.firstFloorOfficeMaterial2);
CITY.firstFloorOfficeMaterials.push(CITY.firstFloorOfficeMaterial3);	













CITY.roadTexture  = THREE.ImageUtils.loadTexture( "images/rocks.jpg" );//asphalt.jpg

CITY.roadTexture.wrapS = CITY.roadTexture.wrapT = THREE.RepeatWrapping;
CITY.roadTexture.repeat.set( 150, 150 );
/*	
CITY.groundMaterial = new THREE.MeshLambertMaterial( {
	color: 0xaaaaaa, 
	
	side: THREE.FrontSide, 
	map: CITY.roadTexture 
} );
*/
CITY.groundMaterial = new THREE.MeshLambertMaterial( { 
	color: 0x222222, 
	ambient: 0x222222, 
	//specular: 0x222222, 
	side: THREE.FrontSide, 
	perPixel: true,
	map: CITY.roadTexture
	 } );

CITY.sidewalkTexture  = THREE.ImageUtils.loadTexture( "images/sidewalk.jpg" );
CITY.sidewalkTexture.wrapS = CITY.sidewalkTexture.wrapT = THREE.RepeatWrapping;

CITY.sidewalkMaterial = new THREE.MeshLambertMaterial( {
			color: 0xaaaaaa, 
			//side: THREE.DoubleSide,
			side: THREE.FrontSide, 
			map: CITY.sidewalkTexture 
	} );


CITY.tree1 = THREE.ImageUtils.loadTexture( 'images/CutoutTree_Vol.01_01_MIN.png' );
CITY.tree2 = THREE.ImageUtils.loadTexture( 'images/Tree2.png' );
CITY.tree3 = THREE.ImageUtils.loadTexture( 'images/Tree3.png' );

CITY.treeTextures = [];

CITY.treeTextures.push(CITY.tree1);
CITY.treeTextures.push(CITY.tree2);
CITY.treeTextures.push(CITY.tree3);

CITY.numTreeTextures = CITY.treeTextures.length;

CITY.lampost1 = THREE.ImageUtils.loadTexture( 'images/decoration_textures/lampposts/Lamp-Postmini.png' );



CITY.grassTexture  = THREE.ImageUtils.loadTexture( "images/grass/grasstileable1.jpg" );
CITY.grassTexture.wrapS = CITY.grassTexture.wrapT = THREE.RepeatWrapping;
//roadTexture.repeat.set( 150, 150 );

CITY.grassMaterial = new THREE.MeshLambertMaterial( {
		color: 0xaaaaaa, 
		side: THREE.FrontSide, 
		//side: THREE.DoubleSide, 
		map: CITY.grassTexture 
} );


/*
* Texture from Mr.Doob experiment
*/

CITY.cloud = THREE.ImageUtils.loadTexture( 'images/cloud10.png' );
CITY.block = THREE.ImageUtils.loadTexture( 'images/block.png' );