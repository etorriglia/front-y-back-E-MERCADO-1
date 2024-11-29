let productID = localStorage.getItem(`productID`);

let productComments = [];

let productInfo = {};

const pageNameContainer = document.getElementById("page-name-container");

const productInfoContainer = document.getElementById("product-info-container");

const carouselProductInfoContainer = document.getElementById('carousel-product-info-container');

const productInfoColumn = document.getElementById('product-info-column');

const productInfoRow = document.getElementById('product-info-row');

const relatedProductsContainer = document.getElementById("related-products");

const stars = document.querySelectorAll(".star");

const textarea = document.getElementById("floatingTextarea");

const btnAddToCart = document.getElementById('btn-add-to-cart');

function showProductInfo(productInfo) {
  let carouselString = "";

  for (i = 0; i < productInfo.images.length; i++) {
    if (i == 0) {
      carouselString += `<div class="carousel-item active">
        <img src="${productInfo.images[i]}" class="d-block w-100" alt="...">
        </div>`;
    } else {
      carouselString += `<div class="carousel-item">
        <img src="${productInfo.images[i]}" class="d-block w-100" alt="...">
        </div>`;
    }
  }

  carouselProductInfoContainer.innerHTML +=
    `<div id="carouselControls" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
    ${carouselString}
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselControls" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselControls" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
    </div>`

  productInfoRow.innerHTML += `<h5 class="card-title product-name">${productInfo.name}</h5>
    <p class="product-soldCount" style="width: 108.1875px;">${productInfo.soldCount} vendidos</p>
    <p class="card-text product-description">${productInfo.description}</p>
    <p class="product-price" >${productInfo.cost} ${productInfo.currency}</p>
    `

}

// FUNCIÓN PRODUCTOS RELACIONADOS
function showRelatedProducts(productInfo) {
  let relatedImages = "";

  for (let i = 0; i < productInfo.relatedProducts.length; i++) {
    relatedImages += `
      <div class="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
        <div class="card-related">
          <div class="card-body card-body-related text-center text-related">
            <img src="${productInfo.relatedProducts[i].image}" class="card-img-top-related" alt="${productInfo.relatedProducts[i].name}">
            <h5 class="card-title card-title-related">${productInfo.relatedProducts[i].name}</h5>
            <a class="btn btn-primary btn-sm btn-related" id="${productInfo.relatedProducts[i].id}">Más información</a>
          </div>
        </div>
      </div>`;
  }

  const relatedProductsHTML = `
    <h2 class="text-center text-related">Productos Relacionados</h2>
    <div class="row justify-content-center">
      ${relatedImages}
    </div>`;

  relatedProductsContainer.innerHTML += relatedProductsHTML;
}


function goToRelated(productInfo) {
  let btns = document.getElementsByClassName("btn-related");
  let relatedProductsInfo = productInfo.relatedProducts;

  for (let i = 0; i < relatedProductsInfo.length; i++) {
    btns[i].addEventListener("click", function () {
      localStorage.setItem("productID", relatedProductsInfo[i].id);

      window.location = "product-info.html";
    });
  }
}

function showCategory(categoryName) {
  pageNameContainer.innerHTML += `
    <div style="display: flex; align-items: center; margin-bottom: 30px;">
    <a href="products.html" style="text-decoration: none;">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" style="cursor: pointer; color: black; stoke: black; margin: 2px; margin-bottom: 10px;" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16";>
        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
      </svg>   
    </a>
      <h2 class="fw-bold" style="margin-left: 8px;">${categoryName}</h2>
    </div>`;
}

// Evento para añadir al carrito
btnAddToCart.addEventListener('click', () => {
  addToCart(productInfo);
});


// Fetch and show product info
function showData() {
  getJSONData(
    `https://japceibal.github.io/emercado-api/products/${productID}.json`
  ).then(function (resultObj) {
    if (resultObj.status === "ok") {
      productInfo = resultObj.data;
      showCategory(productInfo.category);
      showProductInfo(productInfo);
      showRelatedProducts(productInfo);
      goToRelated(productInfo);
    }
  });
}


showData();





// URL de comentarios para cada producto
const PRODUCT_COMMENTS_URL = PRODUCT_INFO_COMMENTS_URL + productID + EXT_TYPE;

// Fetch para la seccion de los comentarios
getJSONData(PRODUCT_COMMENTS_URL).then(function (resultObj) {
  if (resultObj.status === "ok") {
    productComments = resultObj.data;
    let localComments = JSON.parse(localStorage.getItem(`productComments_${productID}`)) || [];
    showFirstProductComments(localComments, productComments);
  }
});

// Función para mostrar hasta los primeros 3 comentarios del producto
function showFirstProductComments(localComments, productComments) {
  let commentsContainer = document.getElementById("product-comments-container");
  commentsContainer.innerHTML = "";

  let allComments = localComments.concat(productComments);

  if (allComments.length === 0) {
    commentsContainer.innerHTML += `
      <p class="m-1 text-secondary">No existen calificaciones para el producto seleccionado.</p>
    `;
    return;
  }

  //organizar comentarios por fecha
  allComments.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  let shortCommentsList = allComments.slice(0, 3);
  for (comment of shortCommentsList) {
    commentsContainer.innerHTML += `
        <div class="col mb-2">
          <div class="card h-100">
            <div class="card-body">
              <p>${drawStars(comment.score)}</p>
              <h6 class="card-title title-bold">${comment.user}</h6>
              <p class="text-secondary">${new Date(comment.dateTime).toLocaleString()}</p>
              <p class="card-text">${comment.description}</p>
            </div>
          </div>
        </div>
        `;
  }

  let allCommentContainer = document.getElementById("all-comments-button");
  allCommentContainer.innerHTML = "";

  if (allComments.length > 3) {
    updateCommentsModal(allComments);

    let button = document.createElement("button");
    button.type = "button";
    button.classList = "mt-3 p-2 btn-text";
    button.setAttribute("data-bs-toggle", "modal");
    button.setAttribute("data-bs-target", "#exampleModalScrollable");
    button.innerHTML = "Ver todas las calificaciones";
    allCommentContainer.appendChild(button);
  }
}

// Funcion para actualizar el modal con todos los comentarios
function updateCommentsModal(productComments) {
  let modalContent = document.getElementById("all-comments-modal");
  modalContent.innerHTML = "";
  for (comment of productComments) {
    modalContent.innerHTML += `
        <div class="card mb-2">
            <div class="card-body">
            <p>${drawStars(comment.score)}</p>
            <h5 class="card-title title-bold">${comment.user}</h5>
            <p class="text-secondary">${new Date(comment.dateTime).toLocaleString()}</p>
            <p class="card-text">${comment.description}</p>
          </div>
        </div>
      `;
  }
}

// Funcion para dibujar las estrellas
function drawStars(rating) {
  let ratingHTML = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      ratingHTML += '<span class="fa fa-star checked-star"></span>';
    } else {
      ratingHTML += '<span class="fa fa-star not-checked-star"></span>';
    }
  }
  return ratingHTML;
}

let currentRating = 0;
stars.forEach((star) => {
  star.addEventListener("click", () => {
    const value = star.getAttribute("data-value");
    stars.forEach((s) => s.classList.remove("selected"));
    for (let i = 0; i < value; i++) {
      stars[i].classList.add("selected");
    }
    currentRating = value;
  });
});

document.getElementById("submit-rating").addEventListener("click", () => {
  const comment = textarea.value;
  const rating = currentRating;
  const date = new Date().toUTCString();
  const userName = getCookie('sessionUser');

  if (comment && rating) {
    //obtiene calificaciones guardadas en localStorage
    let localComments = JSON.parse(localStorage.getItem(`productComments_${productID}`)) || [];

    //crea nueva calificacion
    let newComment = {
      user: userName,
      description: comment,
      score: rating,
      dateTime: date
    };

    //agrega nueva calificacion al array de calif guardadas
    localComments.push(newComment);

    //guarda las calif actualizadas en localStorage
    localStorage.setItem(`productComments_${productID}`, JSON.stringify(localComments));

    textarea.value = "";
    stars.forEach((s) => s.classList.remove("selected"));
    currentRating = 0;

    showFirstProductComments(localComments, productComments);
  }
});


// modo noche
const user = getCookie('sessionUser');

function enableDayMode() {
  document.body.classList.add('day-mode');
  document.body.classList.remove('night-mode');
  localStorage.setItem(`${user}-theme`, 'day');
  document.getElementById('theme-toggle').checked = false;

  const elements = document.querySelectorAll('.card-body, .navbar, .modal-body, .modal-header, .modal-footer'); //reconoce los elementos para agregarlos al css luego
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

  const elements = document.querySelectorAll('.card-body, .navbar, .modal-body, .modal-header, .modal-footer');
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