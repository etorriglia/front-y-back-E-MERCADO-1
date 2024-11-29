// const userInfoKeys= ["userFirstName", "userSecondName", "userLast", "userSecondLast", "userPhone"]

let username = getCookie('sessionUser');
let userData = JSON.parse(localStorage.getItem(username));
let fields = ['firstname', 'secondname', 'lastname', 'secondlastname', 'userphone'];

buildUserData();
showFieldValues();

// Constructor del objeto a usar para guardar la información del usuario, guardar la info del usuario en una variable, pasar todo al localStorage
function buildUserData() {
  if (localStorage.getItem(username) == null) {
    userData = { firstname: '', secondname: '', lastname: '', secondlastname: '', userphone: '' };
  }
  return userData;
}

function storeUserData() {
  let fieldValue = '';

  fields.forEach(field => {
    fieldValue = document.getElementById(field).value.trim();
    userData[field] = fieldValue;
  })
  return userData;
}

function localUserData(userData) {
  localStorage.setItem(getCookie('sessionUser'), JSON.stringify(userData));
}


// Funcion para mostrar el mail con el que ingreso el usuario en el campo E-mail
showEmailValue();

function showEmailValue() {
  let emailInput = document.getElementById("email");
  let emailValue = getCookie("sessionUser");
  emailInput.value = emailValue;
}

// Función para mostrar los otros campos luego de validar el form

function showFieldValues() {
  fields.forEach(field => {
    let fieldInput = document.getElementById(field)
    let fieldValue = userData[field];
    fieldInput.value = fieldValue;
  })
}


// Validacion del formulario al enviar
(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.stopPropagation()
      } else {
        userData = storeUserData();
        localUserData(userData)
        showFieldValues();
        delayRemoveValidation();
      }
      event.preventDefault()
      form.classList.add('was-validated')
    }, false)
  })
})()

function delayRemoveValidation() {
  setTimeout(() => {
    const forms = document.querySelectorAll('.was-validated')
    Array.from(forms).forEach(form => {
      form.classList.remove('was-validated')
    })
  }, 3000);
}


// modo noche
const user = getCookie('sessionUser'); 

function enableDayMode() {
  document.body.classList.add('day-mode');
  document.body.classList.remove('night-mode');
  localStorage.setItem(`${user}-theme`, 'day');
  document.getElementById('theme-toggle').checked = false;

  const elements = document.querySelectorAll('.card-body, .navbar'); //reconoce los elementos para agregarlos al css luego
  elements.forEach(el => {
    el.classList.add('day-mode');
    el.classList.remove('night-mode');
  });

}

function enableNightMode() {
  document.body.classList.add('night-mode');
  document.body.classList.remove('day-mode');
  localStorage.setItem(`${user}-theme`, 'night');
  document.getElementById('theme-toggle').checked = true;

  const elements = document.querySelectorAll('.card-body, .navbar');
  elements.forEach(el => {
    el.classList.add('night-mode');
    el.classList.remove('day-mode');
  });

}

function loadTheme() {
  const savedTheme = localStorage.getItem(`${user}-theme`);
  if (savedTheme === 'night') {
    enableNightMode();
  } else {
    enableDayMode();
  }
}


document.addEventListener('DOMContentLoaded', loadTheme);

// evento para el toggle de modo
document.getElementById('theme-toggle').addEventListener('change', function () {
  if (this.checked) {
    enableNightMode();
  } else {
    enableDayMode();
  }
});


// CAMBIAR FOTO DE PERFIL

const btnImgProfile = document.getElementById('btn-img-profile');
const profilePic = document.getElementById('profile-pic');

// Cargar la imagen de perfil desde localStorage al cargar la página
window.onload = function() {
  const user = getCookie('sessionUser'); 
  const storedImage = localStorage.getItem(`profilePic_${user}`); 

  // Comprobar si la cookie existe y si hay una imagen almacenada
  if (user) {
      if (storedImage) {
          profilePic.src = storedImage; 
          profilePic.style.display = 'block'; 
      } else {
          profilePic.src = 'img/profile_icon.svg'; 
          profilePic.style.display = 'block'; 
      }
  } else {
      localStorage.removeItem(`profilePic_${user}`);
      profilePic.src = 'img/profile_icon.svg'; 
      profilePic.style.display = 'block'; 
  }
};

// Escuchar el evento de clic para cambiar la foto de perfil
btnImgProfile.addEventListener('click', function() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = function(event) {
      const file = event.target.files[0];
      const maxSizeInMB = 2; // Tamaño máximo en MB
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024; 

      if (file.size > maxSizeInBytes) {
          alert(`El tamaño máximo permitido es ${maxSizeInMB} MB.`);
          return; // alerta si pesa mas de 2mb
      }

      const reader = new FileReader();
      reader.onload = function(e) {
          const user = getCookie('sessionUser'); 
          localStorage.setItem(`profilePic_${user}`, e.target.result); 
          profilePic.src = e.target.result; 
          profilePic.style.display = 'block'; 
      };
      reader.readAsDataURL(file); // Leer la imagen como Data URL para almacenar en local
  };

  input.click(); 
});
