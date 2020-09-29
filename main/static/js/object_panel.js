 lists_items= ["table","chair","wc","sink","sofa","tub"];
var store = "";
var count = 0;
for(j=0; j < Math.ceil(lists_items.length/2) ; j++){
  for(i = 0; i < 2; i++){
    var data = lists_items[count];
    var store = store + `<div class="item" onclick="add_items('`+data+`')">
    <div class="hover_add">
      <img src="/static/assets/add.png" class="hover_icon"/>
      </div>
    <img src="/static/assets/`+data+`.jpg"> 
    <p>`+lists_items[count]+`</p>
    </div>`;
    count=count+1;
  }
  document.getElementById("horizon").innerHTML = document.getElementById("horizon").innerHTML +'<div class="horizontal_container">'+ store + '</div>';
  store = "";
}
function add_items(data){
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
    scene.add( gltf.scene);
  });
};

function onMouseMove( event ) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
function TextureChange(URL){
    var intersects = raycaster.intersectObjects(walls);
  if(intersects.length > 0){
    var texture = THREE.ImageUtils.loadTexture( URL.src);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.flipY = false;
    intersects[ 0 ].object.material = new THREE.MeshLambertMaterial( { map: texture } );
    cubeMaterial.map.needsUpdate = true;
  }
}
function removeObject(){
  collision.setFromCamera( mouse, camera );
  var intersects = collision.intersectObjects(object_collision);
  if(intersects.length > 0){
    const parent = intersects[0].object.parent;
    parent.remove( intersects[0].object );
    document.getElementById("adjust_viewer").style.display ="none";
  }
}
