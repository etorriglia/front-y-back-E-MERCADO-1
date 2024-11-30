// modo noche
const user = getCookie("sessionUser");

// Se declaran como variables globales la clave del carrito y su contenido
const cartKey = getCookie("sessionUser") + "-cart";
let cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];

// Se inicializa la variable global Tipo de Envío, que será actualizada con los eventos de los radio buttons
let deliveryType = "Standard";

// Variable global método de pago
let paymentMethod = "Tarjeta de crédito";

// Variable global de los totales
let totals = { subtotal: 0, deliveryCost: 0, total: 0 }

// Evento para llamar a la función cargarProductos
document.addEventListener("DOMContentLoaded", cargarProductos);

//Evento para llamar a la función billingInfoDisplay
document.addEventListener('DOMContentLoaded', billingInfoDisplay)

// Evento para llamar a la función loadTheme
document.addEventListener("DOMContentLoaded", loadTheme);

// Funciones y eventos relacionados con el Modo Oscuro
function enableDayMode() {
  document.body.classList.add("day-mode");
  document.body.classList.remove("night-mode");
  localStorage.setItem(`${user}-theme`, "day");
  document.getElementById("theme-toggle").checked = false;

  const elements = document.querySelectorAll(".card-body, .navbar"); //reconoce los elementos para agregarlos al css luego
  elements.forEach((el) => {
    el.classList.add("day-mode");
    el.classList.remove("night-mode");
  });
}

function enableNightMode() {
  document.body.classList.add("night-mode");
  document.body.classList.remove("day-mode");
  localStorage.setItem(`${user}-theme`, "night");
  document.getElementById("theme-toggle").checked = true;

  const elements = document.querySelectorAll(".card-body, .navbar");
  elements.forEach((el) => {
    el.classList.add("night-mode");
    el.classList.remove("day-mode");
  });
}

function loadTheme() {
  const savedTheme = localStorage.getItem(`${user}-theme`);
  if (savedTheme === "night") {
    enableNightMode();
  } else {
    enableDayMode();
  }
}
// evento para el toggle de modo
document.getElementById("theme-toggle").addEventListener("change", function () {
  if (this.checked) {
    enableNightMode();
  } else {
    enableDayMode();
  }
});

// Función actualizar la cantidad de un producto
function actualizarCantidad(index, change, cartItems) {
  const item = cartItems[index];
  item.amount += change;
  if (item.amount < 1) item.amount = 1;

  const cartKey = getCookie("sessionUser") + "-cart";
  localStorage.setItem(cartKey, JSON.stringify(cartItems));
  showCartBadge();

  const amountElement = document.getElementById(`amount-${index}`);
  amountElement.textContent = item.amount;

  const totalElement = document.getElementById(`total-${index}`);
  totalElement.textContent = `${item.currency} ${(item.price * item.amount).toFixed(2)}`;
  showTotals(cartItems);
}

// Función para cargar los productos del carrito
function cargarProductos() {
  const container = document.getElementById("data-container");
  const summaryContainer = document.querySelector(".cart-summary");
  const shippingOptions = document.querySelector(".shipping-options");
  container.innerHTML = "";
  let subtotal = 0;

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div style="
        color: black; 
        padding: 20px; 
        text-align: center; 
        width: 50%; 
        top: 50%; 
        left: 50%; 
        transform: translate(50%, 50%);
      ">
        No tienes productos en tu carrito
      </div>
    `;
    document.getElementById("order-total").textContent = "USD $0.00";
    summaryContainer.style.display = "none";
    shippingOptions.style.display = "none";
    return;
  } else {
    summaryContainer.style.display = "block";
    shippingOptions.style.display = "block";
  }

  cartItems.forEach((item, index) => {
    const productCard = document.createElement("div");
    const Subtotalcant = (item.currency, item.price) * item.amount;

    productCard.className = "col-md-12 mb-1 cart-item d-flex align-items-center justify-content-center";
    productCard.innerHTML = `
      <div class="d-flex flex-column flex-md-row align-items-center py-3 border-bottom">
        <img src="${item.img}" alt="${item.name}" class="product-img mr-3" style="width: 150px; height: auto; border-radius:8px;">
        <div class="flex-grow-1">
          <h5 class="product-name m-3">${item.name}</h5>
          
          <!-- Muestra el precio unitario en PESOS  -->
          <p class="m-3">${item.currency} ${item.price.toFixed(2)}</p>
        </div>
        <div class="d-flex align-items-center mx-5">
          <div class="btn-group" role="group" aria-label="Cantidad">
            <button class="btn btn-outline-secondary btn-sm quantity-btn restar">
              <i class="bi bi-dash"></i>
            </button>
            <span class="mx-2" id="amount-${index}">${item.amount}</span>
            <button class="btn btn-outline-secondary btn-sm quantity-btn sumar">
              <i class="bi bi-plus"></i>
            </button>
          </div>
        </div>
        
        <!-- Muestra el total en USD-->
        <p class="product-total font-weight-bold ml-4 mb-0" id="total-${index}"> ${item.currency} ${Subtotalcant.toFixed(2)}</p>
        
        <button class="btn btn-link text-danger p-0 m-5 delete-btn" data-index="${index}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16" style="color: black;">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
          </svg>
        </button>
      </div>
    `;

    // Agregar event listener para eliminar el producto
    const deleteBtn = productCard.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => eliminarProducto(index));

    const restarBtn = productCard.querySelector(".restar");
    const sumarBtn = productCard.querySelector(".sumar");

    restarBtn.addEventListener("click", () =>
      actualizarCantidad(index, -1, cartItems)
    );
    sumarBtn.addEventListener("click", () =>
      actualizarCantidad(index, 1, cartItems)
    );

    container.appendChild(productCard);

    subtotal += item.price * item.amount;
  });

  showTotals(cartItems);
}

//Funciones para mostrar u ocultar información de pago

const billingInfoCard = document.querySelector('.billing-info-card');
const billingInfoWire = document.querySelector('.billing-info-wire');
const creditCardRadio = document.getElementById('creditCardRadioBtn');
const wireRadio = document.getElementById('wireRadioBtn');

function billingInfoDisplay() {
  if (cartItems.length === 0) {
    billingInfoCard.style.display = 'none';
    billingInfoWire.style.display = 'none';

  } else {
    billingInfoCard.style.display = 'block';
    billingInfoWire.style.display = 'none';
  }
  creditCardRadio.addEventListener('input', showBillingForm);
  wireRadio.addEventListener('input', showBillingForm);

}

function showBillingForm() {
  if (creditCardRadio.checked) {
    billingInfoCard.style.display = 'block';
    billingInfoWire.style.display = 'none';
  } else {
    billingInfoCard.style.display = 'none';
    billingInfoWire.style.display = 'block';
  }
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
  cartItems.splice(index, 1);
  localStorage.setItem(cartKey, JSON.stringify(cartItems));
  cargarProductos();
  showCartBadge();
}

// Función para calcular Subtotal de la sección "Costos"
function calcSubtotal(cartProducts) {
  let subtotal = 0;
  cartProducts.forEach((product) => {
    subtotal += convertToUSD(product.currency, product.price) * product.amount;
  });
  return subtotal;
}

// Variable global para la tasa de cambio
let exchangeRate = 41;

// Obtener la tasa de cambio desde la API
fetch('https://uy.dolarapi.com/v1/cotizaciones/usd')
  .then(response => response.json())
  .then(data => {
    if (data && data.compra) {
      exchangeRate = data.compra; // Actualiza la variable global con la tasa de compra actual
      let costInfo = `Los costos de los productos en UYU fueron convertidos a USD utilizando la tasa de cambio de 1 x `;
      document.getElementById("costs-title").setAttribute("title", costInfo + exchangeRate); // Se actualiza el valor del cambio en el mensaje informativo
    }
    cargarProductos();
  })
  .catch(error => console.error('Error al obtener la tasa de cambio:', error));

// Función para convertir los precios en UYU a USD
function convertToUSD(currency, price) {
  if (currency === "USD") {
    return price;
  }
  return price / exchangeRate;
}

// Función para calcular Costo de Envío
function calcDeliveryCost(deliveryType, subtotal) {
  switch (deliveryType) {
    case "Premium":
      return subtotal * 0.15; // Representa un 15 % del precio total de los artículos
    case "Express":
      return subtotal * 0.07; // Representa un 7 % del precio total de los artículos
    case "Standard":
      return subtotal * 0.05; // Representa un 5 % del precio total de los artículos
    default:
      return 0;
  }
}

// Agregar eventos a los radio button "Tipo de Envío"
// Premium
document.getElementById("premiumRadioBtn").addEventListener("click", () => {
  deliveryType = "Premium";
  showTotals(cartItems);
});

// Express
document.getElementById("expressRadioBtn").addEventListener("click", () => {
  deliveryType = "Express";
  showTotals(cartItems);
});

// Standard
document.getElementById("standardRadioBtn").addEventListener("click", () => {
  deliveryType = "Standard";
  showTotals(cartItems);
});

// Actualizar valor del método de pago
document.getElementById("creditCardRadioBtn").addEventListener("click", () => {
  paymentMethod = "Tarjeta de crédito";
});

document.getElementById("wireRadioBtn").addEventListener("click", () => {
  paymentMethod = "Transferencia bancaria";
})

// Función para calcular y mostrar el costo total
function showTotals(cartItems) {
  let subtotal = calcSubtotal(cartItems);
  let deliveryCost = calcDeliveryCost(deliveryType, subtotal);
  let total = subtotal + deliveryCost;
  totals = { subtotal: subtotal, deliveryCost: deliveryCost, total: total }

  document.getElementById("order-total").textContent = `USD ${total.toFixed(2)}`;
  document.getElementById("order-subtotal").textContent = `USD ${subtotal.toFixed(2)}`;
  document.getElementById("shipping-total").textContent = `USD ${deliveryCost.toFixed(2)}`;
}

//validaciones

(() => {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');
  const shippingOptions = document.querySelectorAll('input[name="flexRadioShipping"]');
  const paymentOptions = document.querySelectorAll('input[name="flexRadioPayment"]');
  const addressFields = ['#departamento', '#localidad', '#calle', '#numero', '#esquina'];
  const productQuantities = document.querySelectorAll('.product-quantity');

  // campos de pago
  const creditCardFields = document.querySelectorAll('.billing-info-card input[required]');
  const wireTransferFields = document.querySelectorAll('.billing-info-wire input[required]');
  const creditCardRadioBtn = document.getElementById('creditCardRadioBtn');
  const wireRadioBtn = document.getElementById('wireRadioBtn');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      let shippingSelected = false;
      let paymentValid = true;
      let allAddressFilled = true;
      let allQuantitiesValid = true;

      // comprobar si los campos de dirección están completos
      addressFields.forEach(selector => {
        const field = document.querySelector(selector);
        if (!field.value.trim()) {
          allAddressFilled = false;
          field.classList.add('is-invalid');
        } else {
          field.classList.remove('is-invalid');
        }
      });

      // comprobar si hay opción de envío seleccionada
      shippingOptions.forEach(option => {
        if (option.checked) {
          shippingSelected = true;
        }
      });

      // cantidad de cada producto > 0
      productQuantities.forEach(quantityInput => {
        const quantity = parseInt(quantityInput.value);
        if (isNaN(quantity) || quantity <= 0) {
          allQuantitiesValid = false;
          quantityInput.classList.add('is-invalid');
        } else {
          quantityInput.classList.remove('is-invalid');
        }
      });

      //metodos de pago
      if (creditCardRadioBtn.checked) {
        creditCardFields.forEach(field => {
          field.required = true;
          if (!field.value.trim()) {
            field.classList.add('is-invalid');
            paymentValid = false;
          }
          wireTransferFields.forEach(field => {
            field.required = false;
          })
        });

      } else if (wireRadioBtn.checked) {
        //validar solo los campos de transferencia
        wireTransferFields.forEach(field => {
          field.required = true;
          if (!field.value.trim()) {
            field.classList.add('is-invalid');
            paymentValid = false;
          }
          creditCardFields.forEach(field => {
            field.required = false;
          })
        });
      }

      // estilos para los mensajes de error
      if (!shippingSelected || !allAddressFilled || !allQuantitiesValid || !paymentValid || !form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();

        if (!shippingSelected) {
          document.querySelector('.shipping-options').classList.add('is-invalid');
        } else {
          document.querySelector('.shipping-options').classList.remove('is-invalid');
        }

        delayRemoveValidation()
      } else {
        event.preventDefault();
        sendOrderToServer();
      }

      form.classList.add('was-validated');
    });
  });

  function delayRemoveValidation() {
    setTimeout(() => {
      addressFields.forEach(selector => {
        const field = document.querySelector(selector);
        field.classList.remove('is-invalid');
      });

      creditCardFields.forEach(field => {
        field.classList.remove('is-invalid');
      });

      wireTransferFields.forEach(field => {
        field.classList.remove('is-invalid');
      });

      document.querySelector('.shipping-options').classList.remove('is-invalid');
      document.querySelector('.payment-options').classList.remove('is-invalid');
    }, 500);
  }
})();

function createOrder() {
  let address = document.getElementById("calle").value.trim() + ', '
    + document.getElementById("numero").value.trim() + ', esq. '
    + document.getElementById("esquina").value.trim();
  let order = {
    customer_email: user,
    delivery_type: deliveryType,
    department: document.getElementById("departamento").value.trim(),
    city: document.getElementById("localidad").value.trim(),
    address: address,
    payment_method: paymentMethod,
    subtotal: totals.subtotal,
    delivery_fee: totals.deliveryCost,
    total: totals.total,
    products: cartItems
  }
  return order;
}

function sendOrderToServer() {
  let productsOrder = createOrder();
  fetch('http://localhost:3307/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "access-token": `${localStorage.getItem("access-token")}`,
    },
    body: JSON.stringify(productsOrder),
  })
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      localStorage.removeItem(cartKey);
      alert("Compra realizada con éxito.");
      window.location.replace("index.html");
    })
    .catch(error => {
      console.error('Hubo un error con la solicitud:', error);
      alert('Se ha producido un error con su orden. Por favor, intente de nuevo más tarde.');
    });
};
