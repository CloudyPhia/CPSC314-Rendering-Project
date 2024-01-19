/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314 -- Sept 2023  -- A3 Template
/////////////////////////////////////////////////////////////////////////////////////////

console.log('A3 Sept 2023');
	
var a=7;  
var b=2.6;
console.log('a=',a,'b=',b);
var myvector = new THREE.Vector3(0,1,2);
console.log('myvector =',myvector);

var animation = true;
var meshesLoaded = false;
var RESOURCES_LOADED = false;
var deg2rad = Math.PI/180;

// give the following global scope (within in this file), which is useful for motions and objects
// that are related to animation

  // setup animation data structure, including a call-back function to use to update the model matrix
var myboxMotion = new Motion(myboxSetMatrices); 
var sharkMotion = new Motion(sharkSetMatrices);
var sharkFunkyMotion = new Motion(sharkSetMatrices);

var link1, link2, link3, link4, link5, link6, link7, link8, link9, link10, link11, link12, link13;
var linkFrame1, linkFrame2, linkFrame3, linkFrame4, linkFrame5, linkFrame6, linkFrame7, linkFrame8, linkFrame9, linkFrame10, linkFrame11, linkFrame12, linkFrame13;
var sphere;    
var mybox;     
var meshes = {};  

// set up motion variable
var notDefaultMotion = false;


// SETUP RENDERER & SCENE

var canvas = document.getElementById('canvas');
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: false });
// renderer.setClearColor(0xd0f0d0);     // set background colour

//Load background texture
const loader2 = new THREE.TextureLoader();
loader2.load('https://images.unsplash.com/photo-1551244072-5d12893278ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80' , function(texture)
            {
             scene.background = texture;  
});

canvas.appendChild(renderer.domElement);

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////

function initCamera() {
    // set up M_proj    (internally:  camera.projectionMatrix )
    var cameraFov = 30;     // initial camera vertical field of view, in degrees
      // view angle, aspect ratio, near, far
    camera = new THREE.PerspectiveCamera(cameraFov,1,0.1,1000); 

    var width = 10;  var height = 5;

//    An example of setting up an orthographic projection using threejs:
//    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000 );

    // set up M_view:   (internally:  camera.matrixWorldInverse )
    camera.position.set(0,12,20);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(0,0,0);
    scene.add(camera);

      // SETUP ORBIT CONTROLS OF THE CAMERA (user control of rotation, pan, zoom)
//    const controls = new OrbitControls( camera, renderer.domElement );
    var controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;
    controls.autoRotate = false;
};

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
}

////////////////////////////////////////////////////////////////////////	
// init():  setup up scene
////////////////////////////////////////////////////////////////////////	

function init() {
    console.log('init called');

    initCamera();
    initMotions();
    initLights();
    initObjects();
    initShark();
    initFileObjects();

    window.addEventListener('resize',resize);
    resize();
};

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {

      // keyframes for the mybox animated motion:   name, time, [x, y, z, theta]
    myboxMotion.addKeyFrame(new Keyframe('pose A',0.0, [5, 0, -6, -180]));
    myboxMotion.addKeyFrame(new Keyframe('pose B',1.0, [5, 1, -6, -90]));
    myboxMotion.addKeyFrame(new Keyframe('pose C',2.0, [5, 2, -6, -180])); // changed 3 to 7 to make it go higher
    myboxMotion.addKeyFrame(new Keyframe('pose D',3.0, [5, 1, -6, -270]));
    myboxMotion.addKeyFrame(new Keyframe('pose A',4.0, [5, 0, -6, -180]));

      // basic interpolation test, just printing interpolation result to the console
    myboxMotion.currTime = 0.1;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=0.1
    myboxMotion.currTime = 2.9;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=2.9

      // keyframes for sharkMotion:    name, time, [x, y, theta1, theta2, theta3, theta4, theta5]
    sharkMotion.addKeyFrame(new Keyframe('straight',         0.0, [0, 3,    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('straight1',         1.0, [1, 3,    20, -15, 20, 0, 0, 21, 0, 0, 0, -20, 0, 0, 0, 5, -15]));
	sharkMotion.addKeyFrame(new Keyframe('straight2',         2.0, [2, 3,    -20, 15, -20, 0, 0, -21, 0, 0, 0, 20, 0, 0, 0, -5, 15]));
	sharkMotion.addKeyFrame(new Keyframe('straight3',         2.5, [2.5, 3,    20, -15, 20, 0, 0, 21, 0, 0, 0, -10, 0, 0, 0, 5, -15]));
	sharkMotion.addKeyFrame(new Keyframe('straight4',         3.0, [3, 3,    -20, 15, -20, 0, 0, -21, 0, 0, 0, 10, 0, 0, 0, -5, 15]));
	sharkMotion.addKeyFrame(new Keyframe('straight5',         4.0, [4, 3,    20, -15, 20, 0, 0, 21, 0, 0, 0, -20, 0, 0, 0, 5, -15]));
	
	sharkMotion.addKeyFrame(new Keyframe('turn1',         4.1, [4.5, 3,    20, 15, 15, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn2',         4.3, [4.5, 3,    40, 30, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn3',         4.5, [4.5, 3,    60, 45, 45, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn4',         4.7, [4.5, 3,    80, 65, 65, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn5',         4.9, [4.5, 3,    90, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn6',         5.0, [4.5, 3,    110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn7',         5.2, [4.5, 3,    160, 0, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn7',         5.4, [4.5, 3,    180, 0, 0, 0, 0, 0, 0, 0, 0, -20, 0, 0, 0, 0, 0]));

	sharkMotion.addKeyFrame(new Keyframe('straight11',         6.0, [4, 3,    200, -15, 20, 0, 0, 21, 0, 0, 0, -20, 0, 0, 0, 5, -15]));
	sharkMotion.addKeyFrame(new Keyframe('straight21',         7.0, [3, 3,    160, 15, -20, 0, 0, -21, 0, 0, 0, 20, 0, 0, 0, -5, 15]));
	sharkMotion.addKeyFrame(new Keyframe('straight31',         8.0, [2, 3,    200, -15, 20, 0, 0, 21, 0, 0, 0, -20, 0, 0, 0, 5, -15]));
	sharkMotion.addKeyFrame(new Keyframe('straight41',         9.0, [1, 3,    160, 15, -20, 0, 0, -21, 0, 0, 0, 20, 0, 0, 0, -5, 15]));
	sharkMotion.addKeyFrame(new Keyframe('straight51',         10.0, [0, 3,    200, -15, 20, 0, 0, 21, 0, 0, 0, -20, 0, 0, 0, 5, -15]));
	sharkMotion.addKeyFrame(new Keyframe('straight61',         10.6, [-1, 3,    160, 15, -20, 0, 0, -21, 0, 0, 0, 0, 0, 0, 0, -5, -15]));
	sharkMotion.addKeyFrame(new Keyframe('straight71',         11.2, [-2, 3,    200, -15, 20, 0, 0, 21, 0, 0, 0, 20, 0, 0, 0, 5, 15]));
	sharkMotion.addKeyFrame(new Keyframe('straight81',         11.8, [-3, 3,    160, 15, -20, 0, 0, -21, 0, 0, 0, 0, 0, 0, 0, -5, -15]));
	sharkMotion.addKeyFrame(new Keyframe('straight91',         12.4, [-4, 3,    200, -15, 20, 0, 0, 21, 0, 0, 0, -20, 0, 0, 0, 5, 15]));
	sharkMotion.addKeyFrame(new Keyframe('straight101',         13.0, [-4.5, 3,    160, 15, -20, 0, -21, 0, 0, 0, 0, 0, 0, 0, 0, -5, -15]));

	sharkMotion.addKeyFrame(new Keyframe('turn11',         13.1, [-4.5, 3,    220, 15, 15, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn21',         13.3, [-4.5, 3,    240, 30, 30, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn31',         13.5, [-4.5, 3,    260, 45, 45, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn41',         13.7, [-4.5, 3,    280, 65, 65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn51',         13.9, [-4.5, 3,    290, 0, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn61',         14.0, [-4.5, 3,    310, 0, 0, 0, 0, 0, 0, 0, 0, -20, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn71',         14.2, [-4.5, 3,    330, 0, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, 0, 0]));
	sharkMotion.addKeyFrame(new Keyframe('turn81',         14.4, [-4.5, 3,    360, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));

	sharkMotion.addKeyFrame(new Keyframe('straight12',         15.0, [-4, 3,    380, -15, 20, 0, 0, 21, 0, 0, 0, 20, 0, 0, 0, 5, -15]));
	sharkMotion.addKeyFrame(new Keyframe('straight22',         15.5, [-3, 3,    340, 15, -20, 0, 0, -21, 0, 0, 0, 0, 0, 0, 0, -5, 15]));
	sharkMotion.addKeyFrame(new Keyframe('straight32',         16.0, [-2, 3,    380, -15, 20, 0, 0, 21, 0, 0, 0, -20, 0, 0, 0, 5, -15]));
	sharkMotion.addKeyFrame(new Keyframe('straight42',         16.5, [-1, 3,    340, 15, -20, 0, 0, -21, 0, 0, 0, 0, 0, 0, 0, -5, 15]));
	sharkMotion.addKeyFrame(new Keyframe('straight52',         17.0, [0, 3,    360, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0]));
	

	// keyframes for sharkFunkyMotion
	sharkFunkyMotion.addKeyFrame(new Keyframe('straightup',         0.0, [0, 3,    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('straightup1',         1.0, [1, 8,    15, 15, 20, 0, 0, 10, 0, 20, 0, -20, 0, 0, 0, 5, 15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('straightup2',         2.0, [3, 13,    -15, -15, -20, 0, 0, -10, -20, 0, 0, 20, 0, 0, 0, -5, -15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('straightup3',         3.5, [5, 18,    15, 15, 20, 0, 0, 10, 0, 0, 20, -10, 0, 0, 0, 5, 15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('straightup4',         5.0, [6, 23,    -15, -15, -20, 0, 0, -10, 0, -20, 0, 10, 0, 0, 0, -5, -15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('straightup5',         7.0, [8, 25,    15, 15, 20, 0, 0, 10, 0, 20, 0, -20, 0, 0, 0, 5, 15]));

	sharkFunkyMotion.addKeyFrame(new Keyframe('dive',         7.5, [9, 25,    -5, -5, -10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('dive1',         8.0, [10, 18,    -10, -10, -15, 0, 0, 10, 0, 20, 0, -20, 0, 0, 0, 5, 15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('dive2',         8.5, [10, 13,    -20, -20, -20, 0, 0, -10, -20, 0, 0, 20, 0, 0, 0, -5, -15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('dive3',         9.0, [11, 8,    -30, -30, -20, 0, 0, 10, 0, 0, 20, -10, 0, 0, 0, 5, 15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('dive4',         9.5, [11, 8,    -45, -10, -15, 0, 0, -10, 0, -20, 0, 10, 0, 0, 0, -5, -15]));
	
	sharkFunkyMotion.addKeyFrame(new Keyframe('diveturn1',         10.0, [10, 8,    -60, 15, 15, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, 0, -15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('diveturn2',         10.2, [9, 6,    -90, 30, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('diveturn3',         10.4, [7, 6.5,   -120, 45, 45, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, -15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('diveturn4',         10.6, [4, 6,    -180, 65, 65, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, -15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('diveturn5',         10.8, [2, 5,    -225, 65, 65, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, -15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('diveturn6',         11.0, [-1, 5,    -270, 45, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('diveturn7',         11.2, [-3, 5,    -310, 30, 30, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, 0, -15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('diveturn7',         11.4, [-4, 3,    -360, 0, 0, 0, 0, 0, 0, 0, 0, -20, 0, 0, 0, 0, -15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('diveturn7',         11.6, [-2, 3,    -360, 0, 0, 0, 0, 0, 0, 0, 0, -20, 0, 0, 0, 0, -15]));
	sharkFunkyMotion.addKeyFrame(new Keyframe('diveturn7',         11.8, [0, 3,    -360, 0, 0, 0, 0, 0, 0, 0, 0, -20, 0, 0, 0, 0, 0]));



}

///////////////////////////////////////////////////////////////////////////////////////
// myboxSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function myboxSetMatrices(avars) {
    // note:  in the code below, we use the same keyframe information to animate both
    //        the box and the dragon, i.e., avars[], although only the dragon uses avars[3], as a rotation

    //  // update position of a box
    // mybox.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
    // mybox.matrix.identity();              
    // mybox.matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0], avars[1], avars[2]));  
    // mybox.matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI/2));
    // mybox.matrix.multiply(new THREE.Matrix4().makeScale(1.0,1.0,1.0));
    // mybox.updateMatrixWorld();  

     // update position of a dragon
    // var theta = avars[3]*deg2rad;
    // meshes["dragon1"].matrixAutoUpdate = false;
    // meshes["dragon1"].matrix.identity();
    // meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0],avars[1],0));  
    // meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeRotationX(theta));  
    // meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeScale(0.3,0.3,0.3));
    // meshes["dragon1"].updateMatrixWorld();  

	// var theta = avars[3]*deg2rad;
    meshes["seahorse1"].matrixAutoUpdate = false;
    meshes["seahorse1"].matrix.identity();
    meshes["seahorse1"].matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0],avars[1],avars[2]));  
    meshes["seahorse1"].matrix.multiply(new THREE.Matrix4().makeRotationY(Math.PI/6));  
    // meshes["seahorse1"].matrix.multiply(new THREE.Matrix4().makeScale(0.3,0.3,0.3));
    meshes["seahorse1"].updateMatrixWorld(); 

	var theta = avars[3]*deg2rad;
    meshes["seahorse2"].matrixAutoUpdate = false;
    meshes["seahorse2"].matrix.identity();
    meshes["seahorse2"].matrix.multiply(new THREE.Matrix4().makeTranslation(4.2,avars[1],-5));  
    meshes["seahorse2"].matrix.multiply(new THREE.Matrix4().makeRotationY(theta));  
    meshes["seahorse2"].matrix.multiply(new THREE.Matrix4().makeScale(2,2,2));
    meshes["seahorse2"].updateMatrixWorld(); 
}

///////////////////////////////////////////////////////////////////////////////////////
// sharkSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function sharkSetMatrices(avars) {
    var xPosition = avars[0];
    var yPosition = avars[1];
    var theta1 = avars[2]*deg2rad;
    var theta2 = avars[3]*deg2rad;
    var theta3 = avars[4]*deg2rad;
    var theta4 = avars[5]*deg2rad;
    var theta5 = avars[6]*deg2rad;
	var theta6 = avars[7]*deg2rad;
    var theta7 = avars[8]*deg2rad;
    var theta8 = avars[9]*deg2rad;
    var theta9 = avars[10]*deg2rad;
    var theta10 = avars[11]*deg2rad;
	var theta11 = avars[12]*deg2rad;
    var theta12 = avars[13]*deg2rad;
    var theta13 = avars[14]*deg2rad;
    var theta14 = avars[15]*deg2rad;
    var theta15 = avars[16]*deg2rad;

    var M =  new THREE.Matrix4();
    
      ////////////// link1 MAIN BODY
    linkFrame1.matrix.identity(); 
    linkFrame1.matrix.multiply(M.makeTranslation(xPosition,yPosition,0));   
	linkFrame1.matrix.multiply(M.makeRotationZ(Math.PI / 2));    
	if (!notDefaultMotion) {
		// default motion
		linkFrame1.matrix.multiply(M.makeRotationX(theta1));    
	} else {
		linkFrame1.matrix.multiply(M.makeRotationZ(theta1));    

	}
      // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
    link1.matrix.copy(linkFrame1.matrix);
    //link1.matrix.multiply(M.makeTranslation(2,0,0));   
    link1.matrix.multiply(M.makeScale(1,1.5,1)); 
	
      ////////////// link2 MID BODY
    linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
    linkFrame2.matrix.multiply(M.makeTranslation(0,3.7,0));

	if (!notDefaultMotion) {
		// default motion
	    linkFrame2.matrix.multiply(M.makeRotationX(theta2));    
	} else {
	    linkFrame2.matrix.multiply(M.makeRotationZ(theta2));    

	}

      // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
    link2.matrix.copy(linkFrame2.matrix);
    //link2.matrix.multiply(M.makeTranslation(2,0,0));   
    link2.matrix.multiply(M.makeScale(1,1.5,1));    

      ///////////////  link3 BUTT
    linkFrame3.matrix.copy(linkFrame2.matrix);
    linkFrame3.matrix.multiply(M.makeTranslation(0,3.5,0));
	linkFrame2.matrix.multiply(M.makeRotationZ(-0.2617993878));

	if (!notDefaultMotion) {
		// default motion
	    linkFrame3.matrix.multiply(M.makeRotationX(theta3));    
	} else {
	    linkFrame3.matrix.multiply(M.makeRotationZ(theta3));    
	}
      // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
    link3.matrix.copy(linkFrame3.matrix);
    //link3.matrix.multiply(M.makeTranslation(2,0,0));   
    link3.matrix.multiply(M.makeScale(1,1,1));    

      /////////////// link4 TOP FIN
    linkFrame4.matrix.copy(linkFrame1.matrix);
    linkFrame4.matrix.multiply(M.makeTranslation(1.7,1.5,0)); // changed 4 to be 5.2 (that looks best)
    linkFrame4.matrix.multiply(M.makeRotationZ(-0.5 * Math.PI));    

	linkFrame4.matrix.multiply(M.makeRotationZ(theta4));    
      // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
    link4.matrix.copy(linkFrame4.matrix);
    //link4.matrix.multiply(M.makeTranslation(2,0,0));   
    link4.matrix.multiply(M.makeScale(1,1,1));    

      // link5 TOP SMALL BACK FIN
    linkFrame5.matrix.copy(linkFrame3.matrix);
    linkFrame5.matrix.multiply(M.makeTranslation(0.8,0.2,0));
	linkFrame5.matrix.multiply(M.makeRotationZ(5*Math.PI/3.1));    

    linkFrame5.matrix.multiply(M.makeRotationZ(theta5));    
      // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
    link5.matrix.copy(linkFrame5.matrix);
    //link5.matrix.multiply(M.makeTranslation(2,0,0));   
    link5.matrix.multiply(M.makeScale(1,1,1));    

	
      // link6 TOP BACK FIN
    linkFrame6.matrix.copy(linkFrame3.matrix);
    linkFrame6.matrix.multiply(M.makeTranslation(1.3,2.8,0));
	linkFrame6.matrix.multiply(M.makeRotationZ(7*Math.PI/4));    

	if (!notDefaultMotion) {
		// default motion
	   linkFrame6.matrix.multiply(M.makeRotationX(theta6));    
	} else {
	   linkFrame6.matrix.multiply(M.makeRotationZ(theta6));   
	}
      // Frame 6 has been established, now setup the extra transformations for the scaled box geometry
    link6.matrix.copy(linkFrame6.matrix);
    //link6.matrix.multiply(M.makeTranslation(2,0,0));   
    link6.matrix.multiply(M.makeScale(1,1,1)); 

	    // link7 BOTTOM BACK FIN
    linkFrame7.matrix.copy(linkFrame3.matrix);
    linkFrame7.matrix.multiply(M.makeTranslation(-0.9,2.8,0));
	linkFrame7.matrix.multiply(M.makeRotationZ(Math.PI/6));  

	if (!notDefaultMotion) {
		// default motion
	    linkFrame7.matrix.multiply(M.makeRotationX(theta6));    
	} else {
	    linkFrame7.matrix.multiply(M.makeRotationZ(theta6));   
	}

      // Frame 7 has been established, now setup the extra transformations for the scaled box geometry
    link7.matrix.copy(linkFrame7.matrix);
    //link7.matrix.multiply(M.makeTranslation(2,0,0));   
    link7.matrix.multiply(M.makeScale(1,1,1)); 

	 // link 8 SMALL BOTTOM FIN
    linkFrame8.matrix.copy(linkFrame2.matrix);
    linkFrame8.matrix.multiply(M.makeTranslation(-1.2,2,1));
	
    linkFrame8.matrix.multiply(M.makeRotationZ(Math.PI/6)); 
	linkFrame8.matrix.multiply(M.makeRotationX(Math.PI/3));    


    linkFrame8.matrix.multiply(M.makeRotationZ(theta8));    // CHANGE THE THETA 
      // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
    link8.matrix.copy(linkFrame8.matrix);
    // link8.matrix.multiply(M.makeTranslation(2,0,0));   
    link8.matrix.multiply(M.makeScale(1,1,1)); 

	
	 // link9 SMALL BOTTOM FIN 2
    linkFrame9.matrix.copy(linkFrame2.matrix);
    linkFrame9.matrix.multiply(M.makeTranslation(-1.2,2,-1));
	
	linkFrame9.matrix.multiply(M.makeRotationZ(Math.PI/6)); 
	linkFrame9.matrix.multiply(M.makeRotationX(-Math.PI/3));    

    linkFrame9.matrix.multiply(M.makeRotationZ(theta9));    // CHANGE THE THETA 
      // Frame 9 has been established, now setup the extra transformations for the scaled box geometry
    link9.matrix.copy(linkFrame9.matrix);
    // link9.matrix.multiply(M.makeTranslation(2,0,0));   
    link9.matrix.multiply(M.makeScale(1,1,1)); 

	
	 // link10
    linkFrame10.matrix.copy(linkFrame1.matrix);
    linkFrame10.matrix.multiply(M.makeTranslation(-0.5,1.5,1.7));
	
    linkFrame10.matrix.multiply(M.makeRotationZ(5*Math.PI/6));  
	linkFrame10.matrix.multiply(M.makeRotationX(Math.PI/2));    

    linkFrame10.matrix.multiply(M.makeRotationZ(theta10));    // CHANGE THE THETA 
      // Frame 10 has been established, now setup the extra transformations for the scaled box geometry
    link10.matrix.copy(linkFrame10.matrix);
    //link10.matrix.multiply(M.makeTranslation(2,0,0));   
    link10.matrix.multiply(M.makeScale(1,1,1)); 

	 // link11
    linkFrame11.matrix.copy(linkFrame1.matrix);
    linkFrame11.matrix.multiply(M.makeTranslation(-0.5,1.5,-1.7));
    linkFrame11.matrix.multiply(M.makeRotationZ((5*Math.PI)/6)); 
	linkFrame11.matrix.multiply(M.makeRotationX(-Math.PI/2));    
	
    linkFrame11.matrix.multiply(M.makeRotationZ(theta10));    // CHANGE THE THETA 
      // Frame 11 has been established, now setup the extra transformations for the scaled box geometry
    link11.matrix.copy(linkFrame11.matrix);
    //link11.matrix.multiply(M.makeTranslation(2,0,0));   
    link11.matrix.multiply(M.makeScale(1,1,1)); 

	// link12
    linkFrame12.matrix.copy(linkFrame10.matrix);
    linkFrame12.matrix.multiply(M.makeTranslation(0,0.9,0));
    linkFrame12.matrix.multiply(M.makeRotationZ(theta12));    // CHANGE THE THETA 
      // Frame 12 has been established, now setup the extra transformations for the scaled box geometry
    link12.matrix.copy(linkFrame12.matrix);
    //link12.matrix.multiply(M.makeTranslation(2,0,0));   
    link12.matrix.multiply(M.makeScale(1,1,1)); 

	// link13
    linkFrame13.matrix.copy(linkFrame11.matrix);
    linkFrame13.matrix.multiply(M.makeTranslation(0,0.9,0));
    linkFrame13.matrix.multiply(M.makeRotationZ(theta13));    // CHANGE THE THETA 
      // Frame 13 has been established, now setup the extra transformations for the scaled box geometry
    link13.matrix.copy(linkFrame13.matrix);
    //link13.matrix.multiply(M.makeTranslation(2,0,0));   
    link13.matrix.multiply(M.makeScale(1,1,1)); 

	// link14
    linkFrame14.matrix.copy(linkFrame4.matrix);
    linkFrame14.matrix.multiply(M.makeTranslation(0,1,0));
    linkFrame14.matrix.multiply(M.makeRotationX(theta14));    // CHANGE THE THETA 
      // Frame 14 has been established, now setup the extra transformations for the scaled box geometry
    link14.matrix.copy(linkFrame14.matrix);
   // link14.matrix.multiply(M.makeTranslation(2,0,0));   
    link14.matrix.multiply(M.makeScale(1,1,1)); 

	// link15 HAMMERHEAD
    linkFrame15.matrix.copy(linkFrame1.matrix);
    linkFrame15.matrix.multiply(M.makeTranslation(0.5,-3,0));
	linkFrame15.matrix.multiply(M.makeRotationZ(Math.PI/2));
	linkFrame15.matrix.multiply(M.makeRotationX(Math.PI/2));

	if (!notDefaultMotion) {
		// default motion
	    linkFrame15.matrix.multiply(M.makeRotationZ(theta15));    
	} else {
	    linkFrame15.matrix.multiply(M.makeRotationY(theta15));  

	}

      // Frame 14 has been established, now setup the extra transformations for the scaled box geometry
    link15.matrix.copy(linkFrame15.matrix);
    //link15.matrix.multiply(M.makeTranslation(2,0,0));   
    link15.matrix.multiply(M.makeScale(1.8,1.2,1.2)); 


	// link16 SPHERE HEAD
    linkFrame16.matrix.copy(linkFrame1.matrix);
    linkFrame16.matrix.multiply(M.makeTranslation(0,-2,0));
    linkFrame16.matrix.multiply(M.makeRotationZ(theta1));    // CHANGE THE THETA 
      // Frame 14 has been established, now setup the extra transformations for the scaled box geometry
    link16.matrix.copy(linkFrame16.matrix);
    //link16.matrix.multiply(M.makeTranslation(2,0,0));   
    link16.matrix.multiply(M.makeScale(1,1,1)); 



	
    link1.updateMatrixWorld();
    link2.updateMatrixWorld();
    link3.updateMatrixWorld();
    link4.updateMatrixWorld();
    link5.updateMatrixWorld();
	link6.updateMatrixWorld();
    link7.updateMatrixWorld();
    link8.updateMatrixWorld();
    link9.updateMatrixWorld();
    link10.updateMatrixWorld();
	link11.updateMatrixWorld();
    link12.updateMatrixWorld();
    link13.updateMatrixWorld();
    link14.updateMatrixWorld();
    link15.updateMatrixWorld();
	link16.updateMatrixWorld();


    linkFrame1.updateMatrixWorld();
    linkFrame2.updateMatrixWorld();
    linkFrame3.updateMatrixWorld();
    linkFrame4.updateMatrixWorld();
    linkFrame5.updateMatrixWorld();
	linkFrame6.updateMatrixWorld();
    linkFrame7.updateMatrixWorld();
    linkFrame8.updateMatrixWorld();
    linkFrame9.updateMatrixWorld();
    linkFrame10.updateMatrixWorld();
	linkFrame11.updateMatrixWorld();
    linkFrame12.updateMatrixWorld();
    linkFrame13.updateMatrixWorld();
    linkFrame14.updateMatrixWorld();
    linkFrame15.updateMatrixWorld();
	linkFrame16.updateMatrixWorld();

}


/////////////////////////////////////	
// initLights():  SETUP LIGHTS
/////////////////////////////////////	

function initLights() {
    light = new THREE.PointLight(0xffffff);
    light.position.set(0,4,2);
    scene.add(light);
    ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
}

////////////////////////////////////	
// MATERIALS
/////////////////////////////////////	

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
var basicMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var armadilloMaterial = new THREE.MeshBasicMaterial( {color: 0x7fff7f} );

/////////////////////////////////////	
// initObjects():  setup objects in the scene
/////////////////////////////////////	

function initObjects() {
    var worldFrame = new THREE.AxesHelper(5) ;
    scene.add(worldFrame);

    // mybox 
    var myboxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    mybox = new THREE.Mesh( myboxGeometry, diffuseMaterial );
    mybox.position.set(4,4,0);
    // scene.add( mybox );

    // textured floor
    var floorTexture = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1534171472159-edb6d1e0b63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2148&q=80');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);
    var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
    var floorGeometry = new THREE.PlaneGeometry(15, 15);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -1.1;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // sphere, located at light position
    var sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
    sphere = new THREE.Mesh(sphereGeometry, basicMaterial);
    sphere.position.set(0,4,2);
    sphere.position.set(light.position.x, light.position.y, light.position.z);
    // scene.add(sphere);

    // box
    var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    var box = new THREE.Mesh( boxGeometry, diffuseMaterial );
    box.position.set(-4, 0, 0);
    // scene.add( box );

    // multi-colored cube      [https://stemkoski.github.io/Three.js/HelloWorld.html] 
    var cubeMaterialArray = [];    // order to add materials: x+,x-,y+,y-,z+,z-
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x33ff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
      // Cube parameters: width (x), height (y), depth (z), 
      //        (optional) segments along x, segments along y, segments along z
    var mccGeometry = new THREE.BoxGeometry( 1.5, 1.5, 1.5, 1, 1, 1 );
    var mcc = new THREE.Mesh( mccGeometry, cubeMaterialArray );
    mcc.position.set(0,0,0);
    // scene.add( mcc );	

    // cylinder
    // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
    var cylinderGeometry = new THREE.CylinderGeometry( 0.30, 0.30, 0.80, 20, 4 );
    var cylinder = new THREE.Mesh( cylinderGeometry, diffuseMaterial);
    cylinder.position.set(2, 0, 0);
    // scene.add( cylinder );

    // cone:   parameters --  radiusTop, radiusBot, height, radialSegments, heightSegments
    var coneGeometry = new THREE.CylinderGeometry( 0.0, 0.30, 0.80, 20, 4 );
    var cone = new THREE.Mesh( coneGeometry, diffuseMaterial);
    cone.position.set(4, 0, 0);
    // scene.add( cone);

    // torus:   parameters -- radius, diameter, radialSegments, torusSegments
    var torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
    var torus = new THREE.Mesh( torusGeometry, diffuseMaterial);

    torus.rotation.set(0,0,0);     // rotation about x,y,z axes
    torus.scale.set(1,2,3);
    torus.position.set(-6, 0, 0);   // translation

    // scene.add( torus );

    /////////////////////////////////////
    //  CUSTOM OBJECT 
    ////////////////////////////////////
    
    var geom = new THREE.Geometry(); 
    var v0 = new THREE.Vector3(0,0,0);
    var v1 = new THREE.Vector3(3,0,0);
    var v2 = new THREE.Vector3(0,3,0);
    var v3 = new THREE.Vector3(3,3,0);
    
    geom.vertices.push(v0);
    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);
    
    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.faces.push( new THREE.Face3( 1, 3, 2 ) );
    geom.computeFaceNormals();
    
    customObject = new THREE.Mesh( geom, diffuseMaterial );
    customObject.position.set(0, 0, -2);
    // scene.add(customObject);
}

/////////////////////////////////////////////////////////////////////////////////////
//  initShark():  define all geometry associated with the shark
/////////////////////////////////////////////////////////////////////////////////////

function initShark() {
    var sharkMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth

	// top fin
	var topCylinderGeometry = new THREE.CylinderGeometry(0.50, 1, 1, 20, 4); // radius at top, radius at bottom, height, radial segments, height segments
	var topConeGeometry = new THREE.CylinderGeometry(0.0, 0.5, 1, 20, 4)

	// bottom fins & small top fin
	var botCylinderGeometry = new THREE.CylinderGeometry(0.30, 0.60, 0.90, 20, 4);
	var botConeGeometry = new THREE.CylinderGeometry(0.0, 0.3, 1, 20, 4)
	
	// main body (f1-f2)
	var mainBodyCylinderGeometry = new THREE.CylinderGeometry(1.5, 1.3, 3, 20, 4);

	// mid body (f2-f3)
	var midBodyCylinderGeometry = new THREE.CylinderGeometry(1, 1.5, 2, 20, 4);

	// end body
	var endBodyCylinderGeometry = new THREE.CylinderGeometry(0.4, 1, 4, 20, 4);

	// back fins
	var backTopFinConeGeometry = new THREE.CylinderGeometry(0.0, 0.5, 3.5, 20, 4);
	var backBotFinConeGeometry = new THREE.CylinderGeometry(0.0, 0.3, 3, 20, 4);

	// head
	var headCylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 20, 4);
	var headSphereGeometry = new THREE.SphereGeometry(1.3,32,16)


    link1 = new THREE.Mesh( mainBodyCylinderGeometry, sharkMaterial );  scene.add( link1 );
    linkFrame1   = new THREE.AxesHelper(1) ;   scene.add(linkFrame1);
	
    link2 = new THREE.Mesh( midBodyCylinderGeometry, sharkMaterial );  scene.add( link2 );
    linkFrame2   = new THREE.AxesHelper(1) ;   scene.add(linkFrame2);
	
    link3 = new THREE.Mesh( endBodyCylinderGeometry, sharkMaterial );  scene.add( link3 );
    linkFrame3   = new THREE.AxesHelper(1) ;   scene.add(linkFrame3);
	
    link4 = new THREE.Mesh( topCylinderGeometry, sharkMaterial );  scene.add( link4 );
    linkFrame4   = new THREE.AxesHelper(1) ;   scene.add(linkFrame4);
	
    link5 = new THREE.Mesh( botConeGeometry, sharkMaterial );  scene.add( link5 );
    linkFrame5   = new THREE.AxesHelper(1) ;   scene.add(linkFrame5);

	link6 = new THREE.Mesh( backTopFinConeGeometry, sharkMaterial );  scene.add( link6 );
    linkFrame6   = new THREE.AxesHelper(1) ;   scene.add(linkFrame6);
	
    link7 = new THREE.Mesh( backBotFinConeGeometry, sharkMaterial );  scene.add( link7 );
    linkFrame7   = new THREE.AxesHelper(1) ;   scene.add(linkFrame7);
	
    link8 = new THREE.Mesh( botConeGeometry, sharkMaterial );  scene.add( link8 );
    linkFrame8   = new THREE.AxesHelper(1) ;   scene.add(linkFrame8);
	
    link9 = new THREE.Mesh( botConeGeometry, sharkMaterial );  scene.add( link9 );
    linkFrame9   = new THREE.AxesHelper(1) ;   scene.add(linkFrame9);
	
    link10 = new THREE.Mesh( botCylinderGeometry, sharkMaterial );  scene.add( link10 );
    linkFrame10   = new THREE.AxesHelper(1) ;   scene.add(linkFrame10);

	link11 = new THREE.Mesh( botCylinderGeometry, sharkMaterial );  scene.add( link11 );
    linkFrame11   = new THREE.AxesHelper(1) ;   scene.add(linkFrame11);
	
    link12 = new THREE.Mesh( botConeGeometry, sharkMaterial );  scene.add( link12 );
    linkFrame12   = new THREE.AxesHelper(1) ;   scene.add(linkFrame12);
	
    link13 = new THREE.Mesh( botConeGeometry, sharkMaterial );  scene.add( link13 );
    linkFrame13   = new THREE.AxesHelper(1) ;   scene.add(linkFrame13);

	link14 = new THREE.Mesh( topConeGeometry, sharkMaterial );  scene.add( link14 );
    linkFrame14   = new THREE.AxesHelper(1) ;   scene.add(linkFrame14);

	link15 = new THREE.Mesh( headCylinderGeometry, sharkMaterial );  scene.add( link15 );
    linkFrame15   = new THREE.AxesHelper(1) ;   scene.add(linkFrame15);

	link16 = new THREE.Mesh( headSphereGeometry, sharkMaterial );  scene.add( link16 );
    linkFrame16   = new THREE.AxesHelper(1) ;   scene.add(linkFrame16);

	

    link1.matrixAutoUpdate = false;  
    link2.matrixAutoUpdate = false;  
    link3.matrixAutoUpdate = false;  
    link4.matrixAutoUpdate = false;  
    link5.matrixAutoUpdate = false;
	link6.matrixAutoUpdate = false;  
    link7.matrixAutoUpdate = false;  
    link8.matrixAutoUpdate = false;  
    link9.matrixAutoUpdate = false;  
    link10.matrixAutoUpdate = false;
	link11.matrixAutoUpdate = false;  
    link12.matrixAutoUpdate = false;  
    link13.matrixAutoUpdate = false;  
    link14.matrixAutoUpdate = false;  
    link15.matrixAutoUpdate = false;
	link16.matrixAutoUpdate = false;

	
    linkFrame1.matrixAutoUpdate = false;  
    linkFrame2.matrixAutoUpdate = false;  
    linkFrame3.matrixAutoUpdate = false;  
    linkFrame4.matrixAutoUpdate = false;  
    linkFrame5.matrixAutoUpdate = false;
	linkFrame6.matrixAutoUpdate = false;  
    linkFrame7.matrixAutoUpdate = false;  
    linkFrame8.matrixAutoUpdate = false;  
    linkFrame9.matrixAutoUpdate = false;  
    linkFrame10.matrixAutoUpdate = false;
	linkFrame11.matrixAutoUpdate = false;  
    linkFrame12.matrixAutoUpdate = false;  
    linkFrame13.matrixAutoUpdate = false;  
    linkFrame14.matrixAutoUpdate = false;  
    linkFrame15.matrixAutoUpdate = false;
	linkFrame16.matrixAutoUpdate = false;

}

/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial( {
//        uniforms: { textureSampler: {type: 't', value: floorTexture}},
	vertexShader: document.getElementById( 'customVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'customFragmentShader' ).textContent
} );

// var ctx = renderer.context;
// ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

////////////////////////////////////////////////////////////////////////	
// initFileObjects():    read object data from OBJ files;  see onResourcesLoaded() for instances
////////////////////////////////////////////////////////////////////////	

var models;

function initFileObjects() {
        // list of OBJ files that we want to load, and their material
    models = {     
		teapot:    {obj:"obj/teapot.obj", mtl: customShaderMaterial, mesh: null	},
		armadillo: {obj:"obj/armadillo.obj", mtl: customShaderMaterial, mesh: null },
		dragon:    {obj:"obj/dragon.obj", mtl: customShaderMaterial, mesh: null },
		coralcoral:    {obj:"obj/coral.obj", mtl: customShaderMaterial, mesh: null },
		seashell:    {obj:"obj/seashell.obj", mtl: customShaderMaterial, mesh: null },
		coral2:    {obj:"obj/Coral2.obj", mtl: customShaderMaterial, mesh: null },
		seahorse:    {obj:"obj/seahorse.obj", mtl: customShaderMaterial, mesh: null },
		seagrass:    {obj:"obj/seagrass.obj", mtl: customShaderMaterial, mesh: null }

    };

    var manager = new THREE.LoadingManager();
    manager.onLoad = function () {
	console.log("loaded all resources");
	RESOURCES_LOADED = true;
	onResourcesLoaded();
    }
    var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
	    var percentComplete = xhr.loaded / xhr.total * 100;
	    console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
    };
    var onError = function ( xhr ) {
    };

    // Load models;  asynchronous in JS, so wrap code in a fn and pass it the index
    for( var _key in models ){
	console.log('Key:', _key);
	(function(key){
	    var objLoader = new THREE.OBJLoader( manager );
	    objLoader.load( models[key].obj, function ( object ) {
		object.traverse( function ( child ) {
		    if ( child instanceof THREE.Mesh ) {
			child.material = models[key].mtl;
			child.material.shading = THREE.SmoothShading;
		    }	} );
		models[key].mesh = object;
	    }, onProgress, onError );
	})(_key);
    }
}

/////////////////////////////////////////////////////////////////////////////////////
// onResourcesLoaded():  once all OBJ files are loaded, this gets called.
//                       Object instancing is done here
/////////////////////////////////////////////////////////////////////////////////////

function onResourcesLoaded(){
	
 // Clone models into meshes;   [Michiel:  AFAIK this makes a "shallow" copy of the model,
 //                             i.e., creates references to the geometry, and not full copies ]
  
	
	meshes["seashell1"] = models.seashell.mesh.clone();
	meshes["CORAL1"] = models.coralcoral.mesh.clone();
	
	meshes["CORAL2"] = models.coral2.mesh.clone();
	meshes["CORAL3"] = models.coral2.mesh.clone();

	meshes["CORAL4"] = models.coralcoral.mesh.clone();

	meshes["seahorse1"] = models.seahorse.mesh.clone();
	meshes["seahorse2"] = models.seahorse.mesh.clone();

	meshes["seagrass"] = models.seagrass.mesh.clone();
	meshes["seagrass2"] = models.seagrass.mesh.clone();







    // position the object instances and parent them to the scene, i.e., WCS
    // For static objects in your scene, it is ok to use the default postion / rotation / scale
    // to build the object-to-world transformation matrix. This is what we do below.
    //
    // Three.js builds the transformation matrix according to:  M = T*R*S,
    // where T = translation, according to position.set()
    //       R = rotation, according to rotation.set(), and which implements the following "Euler angle" rotations:
    //            R = Rx * Ry * Rz
    //       S = scale, according to scale.set()
    


	meshes["seashell1"].position.set(-2, -1.15, -2);
    meshes["seashell1"].rotation.set(0,0,0);
    meshes["seashell1"].scale.set(0.01,0.01,0.01);
    scene.add(meshes["seashell1"]);


	meshes["CORAL1"].position.set(2, 0, 2);
    meshes["CORAL1"].rotation.set(0,0,0);
    meshes["CORAL1"].scale.set(1,1,1);
    scene.add(meshes["CORAL1"]);
	
	meshes["CORAL4"].position.set(-0.3, 0, -1);
    meshes["CORAL4"].rotation.set(0,(Math.PI),0);
    meshes["CORAL4"].scale.set(1.5,1.3,0.5);
    scene.add(meshes["CORAL4"]);


	meshes["CORAL2"].position.set(-5, -1.2, -5);
    meshes["CORAL2"].rotation.set(0,0,0);
    meshes["CORAL2"].scale.set(0.05,0.05,0.05);
    scene.add(meshes["CORAL2"]);

	meshes["CORAL3"].position.set(5, -1.27, 2.5);
    meshes["CORAL3"].rotation.set(0,Math.PI,0);
    meshes["CORAL3"].scale.set(0.02,0.02,0.02);
    scene.add(meshes["CORAL3"]);

	meshes["seahorse1"].position.set(5, 1, -6);
    meshes["seahorse1"].rotation.set(0,0,0);
    meshes["seahorse1"].scale.set(3,3,3);
    scene.add(meshes["seahorse1"]);
	
	meshes["seahorse2"].position.set(4, 1, -5);
    meshes["seahorse2"].rotation.set(0,Math.PI/2,0);
    meshes["seahorse2"].scale.set(2,2,2);
    scene.add(meshes["seahorse2"]);


	meshes["seagrass"].position.set(-5, -1, 2);
    meshes["seagrass"].rotation.set(0,0,0);
    meshes["seagrass"].scale.set(5,5,5);
    scene.add(meshes["seagrass"]);

	meshes["seagrass2"].position.set(5, -1, -5);
    meshes["seagrass2"].rotation.set(0,Math.PI,0);
    meshes["seagrass2"].scale.set(4,5,3);
    scene.add(meshes["seagrass2"]);



    meshesLoaded = true;
}


///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // up
    if (keyCode == "W".charCodeAt()) {          // W = up
        light.position.y += 0.11;
        // down
    } else if (keyCode == "S".charCodeAt()) {   // S = down
        light.position.y -= 0.11;
        // left
    } else if (keyCode == "A".charCodeAt()) {   // A = left
	light.position.x -= 0.1;
        // right
    } else if (keyCode == "D".charCodeAt()) {   // D = right
        light.position.x += 0.11;
    } else if (keyCode == " ".charCodeAt()) {   // space
		notDefaultMotion = !notDefaultMotion;
    } else if (keyCode == "T".charCodeAt()) {
		animation = !animation;
		light.color.setHex(0xffffff);

	} else if (keyCode == "L".charCodeAt()) {
		light.color.setHex(Math.random() * 0xffffff);
	}
};


///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////

function update() {
//    console.log('update()');
    var dt=0.02;
    if (animation && !notDefaultMotion && meshesLoaded) {
	// advance the motion of all the animated objects
	  myboxMotion.timestep(dt);    // note: will also call myboxSetMatrices(), provided as a callback fn during setup
 	  sharkMotion.timestep(dt);     // note: will also call mysharkSetMatrices(), provided as a callback fn during setup
    } else if (notDefaultMotion && meshesLoaded && animation) {
	  	myboxMotion.timestep(dt);    // note: will also call myboxSetMatrices(), provided as a callback fn during setup
		sharkFunkyMotion.timestep(dt);     // note: will also call mysharkSetMatrices(), provided as a callback fn during setup
	}
    if (meshesLoaded) {
	sphere.position.set(light.position.x, light.position.y, light.position.z);
	renderer.render(scene, camera);
    }
    requestAnimationFrame(update);      // requests the next update call;  this creates a loop
}

init();
update();

