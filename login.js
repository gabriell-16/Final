const $submit = document.getElementById("submit");
      $password = document.getElementById("password");
      $username = document.getElementById("username");
      $visible = document.getElementById("visible");
//  document.addEventListener("change" , (e)=>{
//     if(e.target === $visible){
//         if($visible.checked === false) $password.type = "password";
//         else  $password.type = "text";
//     }
//  });

 document.addEventListener("click", (e) => {
    if (e.target === $submit) {
      if ($password.value === "7862" && $username.value === "gabriel") { 
        e.preventDefault();
        window.location.href = "Adm-Crud.html";
      }
      else if($password.value === "401" && $username.value === "juan")
      {
        e.preventDefault();
        window.location.href = "Emp-Crud.html";
      }
      else
      {
        alert("Porfavor,Complete los Campos")
      }
    }
  });