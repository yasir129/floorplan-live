options = {};
function saveString( text, filename ) {

    save( new Blob( [ text ], { type: 'text/plain' } ), filename );

}

var link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );


function save( blob, filename ) {

  link.href = URL.createObjectURL( blob );
  link.download = filename;
  link.click();

}

function save1(){
    var exporter = new THREE.GLTFExporter();
    exporter.parse( scene, function ( gltf ) {
        if ( gltf instanceof ArrayBuffer ) {
    saveArrayBuffer( gltf, 'scene.glb' );
  } else {
    var output = JSON.stringify( gltf, null, 2 );
    saveString( output, 'scene.gltf' );
    }}, options );

}