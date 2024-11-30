const userInput = document.getElementById("user");
const passwordInput = document.getElementById("password");

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    const togglePassword = document.getElementById("togglePassword");

    // Mostrar/ocultar la contraseña
    togglePassword.addEventListener("change", function () {
        passwordInput.type = togglePassword.checked ? "text" : "password";
    });

    // Manejar el envío del formulario
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevenir el envío del formulario

        const username = userInput.value.trim();
        const password = passwordInput.value.trim();

        // Validar que los campos no estén vacíos
        if (username === "" || password === "") {
            alert("Por favor, complete todos los campos.");
            return;
        }
        //COOKIES
        // Guardar la sesión en una cookie
        document.cookie = `sessionUser=${username}; path=/;`;
        sendInfoToServer();
    });
});


function createUserObject(input1, input2) {
    let username = input1.value.trim();
    let password = input2.value.trim()
    return {
        username: username,
        password: password
    };
}

function sendInfoToServer() {
    let loginData = createUserObject(userInput, passwordInput);
    fetch('http://localhost:3307/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('access-token', data.token)
                window.location.replace('index.html');
            } else {
                alert('Debe ingresar usuario y constraseña válidos.');
            }
        })
        .catch(error => {
            console.error('Hubo un error con la solicitud:', error);
            alert('Ocurrió un error en el servidor');
        });
};