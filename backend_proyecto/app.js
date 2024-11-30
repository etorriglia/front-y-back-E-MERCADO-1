const express = require("express");
const app = express();
const cors = require("cors");
const mariadb = require("mariadb");
const jwt = require("jsonwebtoken");

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "ecommerce",
  connectionLimit: 5,
});

const port = 3307;

app.use(express.json());
app.use(cors());



//Login
const JWT_SECRET = "CLAVE_ULTRA_SECRETA";

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username != '' && password != '') {
    const token = jwt.sign({ username }, JWT_SECRET);
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "Los campos no pueden estar vacíos." });
  }
});


const authorizeJWT = (req, res, next) => {
  const token = req.headers['access-token'];

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  next();
};


/** /json/cart */

let buyMessage = require("./json/cart/buy.json");



app.get("/cart/buy.json", (req, res) => {
  res.send(buyMessage);
});

/** /json/cats */

let categories = {};

app.get("/cats", authorizeJWT, (req, res) => {
  let cats = require("./json/cats/cat.json");
  res.json(cats);
});

app.get("/cats/:id", authorizeJWT, (req, res) => {
  let categories = {};
  let cats = require("./json/cats/cat.json");
  for (let i = 0; i < cats.length; i++) {
    if (cats[i].id == req.params.id) {
      categories = cats[i];
    }
  }
  res.send(categories);
  categories = {}; 
});

/** /json/cats_products */

app.get("/cats/cats_products/:catid", authorizeJWT, (req, res) => {
  let catID = req.params.catid;
  let catProducts = require(`./json/cats_products/${catID}.json`);
  res.send(catProducts);
});

/** /json/products */

app.get("/products/:id", authorizeJWT, (req, res) => {
  let productID = req.params.id;
  let productInfo = require(`./json/products/${productID}.json`);
  res.send(productInfo);
});

/** /json/products_comments */

app.get("/products_comments/:id", authorizeJWT, (req, res) => {
  let productID = req.params.id;
  let productComments = require(`./json/products_comments/${productID}.json`);
  res.send(productComments);
});

/** /json/sell */

let sell = require("./json/sell/publish.json");


const { message } = require("statuses");

app.get("/sell", authorizeJWT, (req, res) => {
  res.json(sell);
});

// endpoint para enviar la información del carrito a la BD al finalizar la compra

app.post("/cart", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const response = await conn.query(
      `INSERT INTO orders (delivery_type, department, city, address, payment_method, subtotal, delivery_fee, total, customer_email) VALUE(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.delivery_type,
        req.body.department,
        req.body.city,
        req.body.address,
        req.body.payment_method,
        req.body.subtotal,
        req.body.delivery_fee,
        req.body.total,
        req.body.customer_email,
      ]
    );

    let orderId = parseInt(response.insertId);
    let values = "";
    for (product of req.body.products) {
      if (values != "") {
        values += ",";
      }
      values += `('${orderId}', '${product.id}', '${product.amount}')`;
    }
    values += ";";

    let query =
      "INSERT INTO orders_products(order_id, product_id, amount) VALUES " +
      values;
    await conn.query(query);

    res.json({ id: orderId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: "Se rompió el servidor" });
  } finally {
    if (conn) conn.release(); //release to pool
  }
});

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
