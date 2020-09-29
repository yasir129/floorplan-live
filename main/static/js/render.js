
function render() {
    requestAnimationFrame(render);
    DirectionalLight.position.copy(camera.position); 
    if(EditMode ){
      raycaster.setFromCamera( mouse, camera );
      var intersects = raycaster.intersectObjects(walls);
      if(intersects.length > 0){
        document.getElementById('texture_viewer').style.display = 'block';
      }
    }
    else{
      document.getElementById('texture_viewer').style.display = 'none';
    }
    if(transform_mode){
      document.getElementById("adjust_viewer").style.display ="block";
    }
    else{
      document.getElementById("adjust_viewer").style.display ="none";
    }
    
    renderer.render(scene, camera);
  }
  selected_object = {};
  document.onmousedown = function(){
 
     if(transform_mode){
      collision.setFromCamera( mouse, camera );
      var intersects = collision.intersectObjects(object_collision);
      if(intersects.length > 0){
        selected_object = intersects[0].object;
        intersects[0].object.material.transparent = true;
        intersects[0].object.material.opacity = 0.5;
        if(intersects[0].object.name == "wc"){
          change_attribues(intersects[0].object);
        }
        else if(intersects[0].object.name == "chair"){
          change_attribues(intersects[0].object);
        }
        else if(intersects[0].object.name == "door"){
           change_attribues(intersects[0].object);
        }
        else if(intersects[0].object.name == "table"){
           change_attribues(intersects[0].object);
        }
        else if(intersects[0].object.name == "sink"){
           change_attribues(intersects[0].object);
        }
        else if(intersects[0].object.name == "window"){
           change_attribues(intersects[0].object);
        }
        else if(intersects[0].object.name == "sofa"){
           change_attribues(intersects[0].object);
        }
        else if(intersects[0].object.name == "tub"){
           change_attribues(intersects[0].object);
        }
      }
      else{
        selected_object.material.opacity = 1;
        selected_object.material.transparent = false;
        selected_object = {};
      }
    }
      else{
        selected_object.material.opacity = 1;
        selected_object.material.transparent = false;
        selected_object = {};
    }
  }
  function editMode() {
    var x = document.getElementById("toggleEdit");
    if (x.innerHTML === "Change Texture") {
      EditMode = true;
      document.getElementById("toggleEdit").style.backgroundColor="#ff0000";
      x.innerHTML = "Disable Mode";
    } else {
      EditMode = false;
      document.getElementById("toggleEdit").style.backgroundColor="dodgerblue";
      x.innerHTML = "Change Texture";
    }
  }
  function transform_mode1(){
    var x = document.getElementById("toggle_transform");
    if(x.innerHTML === "Transform Objects"){
      transform_mode = true;
      document.getElementById("toggle_transform").style.backgroundColor="#ff0000";
      x.innerHTML = "Disable Mode";
    }
    else{
      transform_mode = false;
      document.getElementById("toggle_transform").style.backgroundColor="green";
      x.innerHTML = "Transform Objects";
    }
  }