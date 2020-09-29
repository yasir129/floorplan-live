  var keyboard = {};
  var renderer;
  var scene;
  var camera;
  var control;
  var orbit;
  var h = document.getElementById('h').innerHTML;
  var w = document.getElementById('w').innerHTML;
  var camera, scene, renderer;
  var geometry, material, mesh;
  var DirectionalLight;
  objects= [];
  walls=[];
  var X = document.getElementById('x').innerHTML;
  var wc_x = JSON.parse(document.getElementById('wc_x').innerHTML);
  var wc_y = JSON.parse(document.getElementById('wc_y').innerHTML);
  var sink_x = JSON.parse(document.getElementById('sink_x').innerHTML);
  var sink_y = JSON.parse(document.getElementById('sink_y').innerHTML);
  X = JSON.parse(X);
  wall_values="";
  EditMode = false;
  transform_mode = false;
  window_enable = false;
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var loader;
  var blocker = document.getElementById( 'blocker' );
  var instructions = document.getElementById( 'instructions' );
  var unlock = document.getElementById('unlock');
  var controlsEnabled = false;
  var floor_plan;
  var collision = new THREE.Raycaster();
  var object_collision = []
  var object_positions={'chair':0,'window':0,'sofa':0,'door':0,'wc':0,'sink':100,'tub':25,'table':170};

  function init() {
        var size = 100000;
        var divisions = 1000;

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.2, 20000);
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xffffff, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.set( w, 1000,h );
        camera.lookAt(scene.position);
        orbit = new THREE.OrbitControls( camera, renderer.domElement );
        orbit.target = new THREE.Vector3(w/2,1000,h/2);
        orbit.update();
       
        for(i in X){
          var shape = new THREE.Shape();
          wall_values += "<b>WALL COUNT:"+(parseInt(i)+1)+"</b></br>";
          for(j in X[i]['X']){
              if(j == 0){
                shape.moveTo(X[i]['X'][j],X[i]['Y'][j]);
              }
                shape.lineTo(X[i]['X'][j],X[i]['Y'][j]);
              wall_values+= "<b>X</b>:"+X[i]['X'][j]+"    "+"<b>Y</b>:"+X[i]['Y'][j]+"</br>"
          }
          var extrudeSettings = {
            steps: 1,
            depth: 560,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 0
          };
    document.getElementById("values_walls").innerHTML = wall_values;
    var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
    var material = new THREE.MeshLambertMaterial({
     color:new THREE.Color("rgb(252, 249, 214)"),
    });
    var mesh = new THREE.Mesh( geometry, material ) ;
    walls.push(mesh);
    mesh.rotation.x = Math.PI/2;
    mesh.position.y = 560;
    scene.add( mesh );
  }
        for(i in X){
          var shape = new THREE.Shape();
          for(j in X[i]['X']){
              if(j == 0){
                shape.moveTo(X[i]['X'][j],X[i]['Y'][j]);
              }
                shape.lineTo(X[i]['X'][j],X[i]['Y'][j]);
          }
          var extrudeSettings = {
            steps: 1,
            depth: 1,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 0
          };
    var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
    var material = new THREE.MeshLambertMaterial({
     color:new THREE.Color("rgb(255, 255, 255)"),
    });

    var mesh = new THREE.Mesh( geometry, material ) ;
    mesh.rotation.x = Math.PI/2;
    mesh.position.y = 562;
    scene.add( mesh );
  }

  var geometry = new THREE.BoxGeometry( w, 20, h );
  var material = new THREE.MeshLambertMaterial( {color:new THREE.Color("rgb(252, 249, 214)"),} );
  floor_plane = new THREE.Mesh( geometry, material );
  floor_plane.position.set(w/2,10,h/2)

  scene.add( floor_plane);

  var AmbientLight = new THREE.AmbientLight(0xffffff,0.55);
  scene.add(AmbientLight);
  DirectionalLight = new THREE.PointLight(0xFFFFFF,0.5);
  
  scene.add(DirectionalLight);
  document.body.appendChild(renderer.domElement);
  
  
  var dragControls = new THREE.DragControls(object_collision, camera, renderer.domElement);
    dragControls.addEventListener( 'dragstart', function ( event ) {
      orbit.enabled = false;
    });
  
    dragControls.addEventListener ( 'drag', function( event ){ 
         if(event.object.name == "sink"){
          event.object.position.y = object_positions.sink;
         }
         else if(event.object.name == "tub"){
          event.object.position.y = object_positions.tub;
         }
         else if(event.object.name == "table"){
          event.object.position.y = object_positions.table;
         }
         else{
          event.object.position.y = 0;
         }
    })
    dragControls.addEventListener( 'dragend', function ( event ) {
      orbit.enabled = true;
    })

  if(wc_x && wc_y){
    for(var i=0;i<wc_x.length;i++){
      set_place("wc",wc_x[i],wc_y[i]);
    }
  }
  if(sink_x && sink_y){
    for(var i=0;i<wc_x.length;i++){
      set_place("sink",sink_x[i],sink_y[i]);
    }
  }







  
  window.addEventListener( 'resize', onWindowResize, false );
  render();
  }


  function set_place(data,x,y){
   var GLB = "/static/models/"+data+".glb";
  var loader = new THREE.GLTFLoader();
    var dracoLoader = new THREE.DRACOLoader();
    loader.setDRACOLoader( dracoLoader );
    loader.load(
    GLB,
  function ( gltf ) {
      gltf.scene.traverse( child => {

        if ( child.material ) {
          child.material.metalness = 0;
        }
    } );
    gltf.scene.name = data;
    gltf.scene.traverse( function ( child ) {
        if(child.type === "Group")
        {
            newObject = true;
        }
        if ( child.isMesh ) {
            child.name = data;
            object_collision.push(child);
        }
    } );
    gltf.scene.position.set(x,100,y);
    scene.add( gltf.scene);
  });
  }


  function change_attribues(object){
    var count=object.scale.x;
    var pos = object.position.y
    document.onkeydown = function(event){
      switch ( event.keyCode ) {
          case 76: 
            object.scale.set(count,count,count);
            count=count+0.04
            break;
          case 74:
            object.scale.set(count,count,count);
            count=count-0.04
            break;
          case 73: //
            object.position.y=pos;
            pos = pos+1.5;
            break;
          case 75:
            object.position.y=pos;
            pos =pos-1.5;
            break;
          case 69:
            object.rotation.z = object.rotation.z +Math.PI/2;
            break;
          case 81:
            object.rotation.z= object.rotation.z -Math.PI/2;
            break;
      }
    }
  }
   
  
  