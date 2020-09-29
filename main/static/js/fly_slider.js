  var rotation = function(event){
      switch(event.keyCode){
      case 69:
        camera.rotation.y -= 0.1;
        break;
      case 81:
        camera.rotation.y += 0.1;
        break;
      case 87:
        camera.translateZ(-100);
        break;
      case 83:
        camera.translateZ(100);
        break;
      case 68:
        camera.translateX(100);
        break;
      case 65:
        camera.translateX(-100);
        break;
    }
  }


  blocker.addEventListener('click',function(){
    camera.position.set(0,300,0);
    camera.rotation.x = 0;
    camera.rotation.z = 0;
    camera.rotation.y = 10;
    orbit.enabled = false;
    document.getElementById("mySidebar").style.width = "0px";
    document.getElementById("close").style.display = "none";
    document.getElementById("open").style.display = "block";
    document.getElementById("open").style.marginLeft = "0px";
    document.getElementById("close").style.marginLeft = "0px";
    document.getElementById("unlock").style.display = 'block';
    document.addEventListener('keydown',rotation,false);
  },false);
  unlock.addEventListener('click',function(){
   camera.target = new THREE.Vector3(w/2,1000,h/2);
   camera.position.set(1000,1000,1000);
    camera.lookAt(scene.position);
    orbit.enabled =true;
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("open").style.display = "none";
    document.getElementById("close").style.display = "block";
    document.getElementById("close").style.marginLeft = "250px";
    document.getElementById("open").style.marginLeft = "250px";
    document.getElementById("unlock").style.display = 'none';
    document.removeEventListener('keydown',rotation,false);
  },false);

  function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }
document.getElementById("toggle_func").addEventListener('click',function(){
    var container = document.getElementById('horizon');
    if(container.style.height == "0px"){
    container.style.height = ""
}
})