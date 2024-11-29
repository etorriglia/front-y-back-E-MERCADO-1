const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

function sortCategories(criteria, array){
    let result = []; // se inicializa la variable result como array vacio, aca se almacenara el array ordenado luego 
    if (criteria === ORDER_ASC_BY_NAME) // ordenar de forma ascendente por nombre (A a Z) 
    {
        result = array.sort(function(a, b) { //toma una función de comparación que recibe dos elementos (a y b)
            if ( a.name < b.name ){ return -1; } // si a.name es menor que b.name, se retorna -1 para que a venga antes que b
            if ( a.name > b.name ){ return 1; } // si a.name es mayor que b.name, se retorna 1 para que b venga antes que a
            return 0; // si son iguales, se retorna 0 y no cambia su posición relativa
        });
    }else if (criteria === ORDER_DESC_BY_NAME){ // ordenar de forma descendente por nombre (Z a A)
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){ // ordenar por cantidad de productos, menor a mayor 
        result = array.sort(function(a, b) { 
            let aCount = parseInt(a.productCount); // convierte a.productCount y b.productCount en números con parseInt
            let bCount = parseInt(b.productCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result; // la funcion retorna el array ordenado de acuerdo con el criterio especificado antes
}

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}

function showCategoriesList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentCategoriesArray.length; i++){
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){

            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentCategoriesArray = resultObj.data
            showCategoriesList()
            //sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showCategoriesList();
    });
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