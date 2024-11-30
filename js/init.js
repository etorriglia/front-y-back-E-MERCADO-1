const CATEGORIES_URL = "http://localhost:3307/cats"; 
const PUBLISH_PRODUCT_URL = "http://localhost:3307/sell";  
const PRODUCTS_URL = "http://localhost:3307/cats_products/";  
const PRODUCT_INFO_URL = "http://localhost:3307/products/";  
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3307/products_comments/"; 
const CART_INFO_URL = "http://localhost:3307/user_cart/";  
const CART_BUY_URL = "http://localhost:3307/cart/buy.json";  
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

showCartBadge();

// Funcion para notificar la existencia de productos en el carrito
function showCartBadge() {
  let cartKey = getCookie('sessionUser') + '-cart';
  let cartProducts = JSON.parse(localStorage.getItem(cartKey));
  let amount = 0;

  if (cartProducts == null) {
    return;
  }

  for (product of cartProducts) {
    amount += product.amount;
  }

  let badge = document.getElementById("cartBadge")
  if (amount == 0) {
    badge.classList = "";
    badge.innerHTML = "";
  } else {
    badge.classList = "badge rounded-pill bg-danger";
    badge.innerHTML = `${amount}<span class="visually-hidden">productos en el carrito</span>`
  }
}

//Inicializar los tooltips

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})