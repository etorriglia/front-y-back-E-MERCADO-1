let cartKey = getCookie('sessionUser') + '-cart';

//Construye un objeto con la información necesaria para cada item
function itemObjectConstructor(itemid, itemname, itemimg, itemcurr, itemamount, itemprice) {
    return (item = { id: itemid, name: itemname, img: itemimg, currency: itemcurr, amount: itemamount, price: itemprice })
}

//Agrega el producto en el cual se hizo click en 'agregar al carrito' al carrito. 
function addToCart(productInfo) {
    let image = ""
    if(typeof productInfo.images === "undefined"){
        image = productInfo.image
    } else {
        image = productInfo.images[0]
    }

    let cart = JSON.parse(localStorage.getItem(cartKey));
    let item = itemObjectConstructor(productInfo.id, productInfo.name, image, productInfo.currency, 1, productInfo.cost);
    if (cart === null) {
        cart = [];
    }
    let productIndex = isInCart(cart, item.id);
    if (productIndex > -1) {
        cart[productIndex].amount += 1;
    } else {
        cart[cart.length] = item;
    }
    localStorage.setItem(cartKey, JSON.stringify(cart));
    showCartBadge();
}

//Función que determina si un producto ya está en el carrito
function isInCart(items, id) {
    index = items.findIndex(item => item.id === id);
    return index
}
