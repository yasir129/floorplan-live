   function openNav() {
          document.getElementById("mySidebar").style.width = "250px";
          document.getElementById("open").style.display = "none";
          document.getElementById("close").style.display = "block";
          document.getElementById("close").style.marginLeft = "250px";
          document.getElementById("open").style.marginLeft = "250px";


        }
        function closeNav() {
          document.getElementById("mySidebar").style.width = "0px";
          document.getElementById("close").style.display = "none";
          document.getElementById("open").style.display = "block";
          document.getElementById("open").style.marginLeft = "0px";
          document.getElementById("close").style.marginLeft = "0px";
        }
