var catID = localStorage.getItem("catID");
let productData = []
let searchQuery = "";
let minCost = 0;
let maxCost = Number.MAX_SAFE_INTEGER;

const PRODUCT_DATA_URL =
  `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

const productContainer = document.getElementById("card-container"); // "Traemos" utilizando el DOM el div de class "card-container" para colocar la información en él

const pageNameContainer = document.getElementById("page-name-container"); // "Traemos" utilizando el DOM el div de class "page-name" para colocar la información en él



/** Función que recibe el nombre de la categoría e imprime como título
 * Productos
 * Categoría 
**/

function showCategory(categoryName) {
  pageNameContainer.innerHTML += `
    <h2 class="fw-bold">${categoryName}</h2>`;
}

/**
 * Función que recibe por parámetro un array con los datos que se mostrarán en el DOM
 * Los datos se mostrarán dentro del div de id "big-product-container" y por cada ítem se está creando una nueva product-card en la cual se
 * imprime el campo "catName" del JSON, y los campos "name", "description", "cost", "currency", "soldCount", y "image" de cada item de productArray.
 */

function limitarCaracteres(texto, limite = 50) {
  // Si el texto es más corto que el límite, lo devolvemos tal cual
  if (texto.length <= limite) {
    return texto;
  }

  // Cortamos el texto al límite de caracteres
  let textoLimitado = texto.slice(0, limite);

  // Añadimos puntos suspensivos
  return textoLimitado + '...';

}

// Funcion para filtrar productos
function filterProducts(productArray) {
  let filteredProducts = productArray.filter(
    (product) => {
      let productName = normalizeText(product.name);
      let productDescription = normalizeText(product.description);
      let query = normalizeText(searchQuery);

      let isInPriceRange = product.cost >= minCost && product.cost <= maxCost;

      return (productName.includes(query) || productDescription.includes(query)) && isInPriceRange;
    }
  )
  showProductData(filteredProducts);
}

function sortProducts(criteria) {
  switch (criteria) {
    case 1: // Ordenar por precio ascendente
      productData.products = productData.products.sort(function (a, b) {
        if (parseInt(a.cost) < parseInt(b.cost)) { return -1; }
        if (parseInt(a.cost) > parseInt(b.cost)) { return 1; }
        return 0;
      });
      break;
    case 2: // Ordenar por precio descendente
      productData.products = productData.products.sort(function (a, b) {
        if (parseInt(a.cost) > parseInt(b.cost)) { return -1; }
        if (parseInt(a.cost) < parseInt(b.cost)) { return 1; }
        return 0;
      });
      break;
    case 3: // Ordenar por relevancia
      productData.products = productData.products.sort(function (a, b) {
        if (parseInt(a.soldCount) > parseInt(b.soldCount)) { return -1; }
        if (parseInt(a.soldCount) < parseInt(b.soldCount)) { return 1; }
        return 0;
      });
      break;
    default: // Orden por por defecto por ID
      productData.products = productData.products.sort(function (a, b) {
        if (a.id < b.id) { return -1; }
        if (a.id > b.id) { return 1; }
        return 0;
      });
  }
  filterProducts(productData.products);
}

// Captura de botones por sus IDs
const buttonSortAsc = document.getElementById('sort-asc');
const buttonSortDesc = document.getElementById('sort-desc');
const buttonSortRelevance = document.getElementById('sort-relevance');
const buttonClearFilters = document.getElementById('clear-filters');

//Agregar eventos para los botones
buttonSortAsc.addEventListener('click', () => {
  sortProducts(1); //ordena ascendente 
})

buttonSortDesc.addEventListener('click', () => {
  sortProducts(2); //ordena descendente
})

buttonSortRelevance.addEventListener('click', () => {
  sortProducts(3); //por relevancia
})

buttonClearFilters.addEventListener('click', () => {
  // Limpiar los inputs
  document.getElementById('preciominimo').value = "";
  document.getElementById('preciomaximo').value = "";

  // Restabler el orden por defecto de las variables
  minCost = 0;
  maxCost = Number.MAX_SAFE_INTEGER;

  // Llamar a la funcion sort para restablecer por defecto el listado de productos
  sortProducts(0);
})

// Para normalizar los textos (ignorar tildes y mayúsculas)
function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

function showProductData(productArray) {
  productContainer.innerHTML = "";
  // Iteramos sobre los productos y los insertamos en el HTML
  for (const item of productArray) {
    productContainer.innerHTML += `<div class="col-sm-6 col-lg-4">
                <div class="card mb-3">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}" id="productImage">
                    <div class="card-body">
                        <h5 class="card-title product-name mb-1" id="productName">${item.name}</h5>
                        <p class="card-text product-description">` + limitarCaracteres(item.description) + `</p>
                        <div class="row">
                            <div class="col-6 product-price">
                                <p>${item.cost} ${item.currency}</p>
                            </div>
                            <div class="col-6 text-center">
                                <p class="product-soldCount">${item.soldCount} vendidos</p>
                            </div>
                        </div>
                        <div class="row mx-auto">
                            <button id="btn-cart-${item.id}" class="btn btn-dark">Añadir al carrito</button>
                        </div>
                    </div>
                </div>
            </div>`;
  }
  getProductID(productArray);
}

// Para actualizar y borrar el contenido de la barra de busqueda
const searchInput = document.querySelector('.search-input');
const clearIcon = document.querySelector('.clear-icon');

searchInput.addEventListener('input', function () {
  clearIcon.style.display = this.value.length ? 'block' : 'none';
  onSearchQueryChange(this.value);
});

clearIcon.addEventListener('click', function () {
  searchInput.value = '';
  onSearchQueryChange('');
  this.style.display = 'none';
  searchInput.focus();
});

function onSearchQueryChange(query) {
  searchQuery = query;
  filterProducts(productData.products);
}

function getProductID(productArray) {
  let cards = document.getElementsByClassName("card");
  for (let i = 0; i < productArray.length; i++) {
    setAddToCartEvent(productArray[i]);
    cards[i].addEventListener("click", function () {
      localStorage.setItem("productID", productArray[i].id);

      window.location = "product-info.html";
    })

  }
}

// Función para establecer el evento del botón de añadir al carrito
function setAddToCartEvent(product) {
  let cartBtn = document.getElementById(`btn-cart-${product.id}`);
  let toastLiveExample = document.getElementById('liveToast');
  let toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)

  cartBtn.addEventListener("click", function (e) {
    addToCart(product);
    toastBootstrap.show()
    e.stopPropagation();
  })
}


// Fetch and show product data
getJSONData(PRODUCT_DATA_URL).then(function (resultObj) {
  if (resultObj.status === "ok") {
    productData = resultObj.data;
    showCategory(productData.catName);
    showProductData(productData.products);
  }
});


//BOTON FILTRAR POR PRECIO CON FUNCIONALIDAD
document.getElementById("Filtrarprecio").addEventListener("click", function () {
  minCost = parseFloat(document.getElementById('preciominimo').value) || 0;
  maxCost = parseFloat(document.getElementById('preciomaximo').value) || Number.MAX_SAFE_INTEGER;

  filterProducts(productData.products);
});



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