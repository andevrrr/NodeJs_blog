const Service = require("../models/service");
const Product = require("../models/product");

exports.getCreateService = (req, res, next) => {
  res.render("admin/service.ejs", {
    pageTitle: "Add Service",
    path: "/admin/add-service",
  });
};

exports.postCreateService = (req, res, next) => {
  const name = req.body.name;
  const time = req.body.time;
  const price = req.body.price;

  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  console.log("I am here");

  const service = new Service({
    name: name,
    time: time,
    price: price,
  });

  return service
    .save()
    .then((result) => {
      res.redirect("/services");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCreateProduct = (req, res, next) => {
  res.render("admin/product.ejs", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postCreateProduct = (req, res, next) => {
  const title = req.body.title;

  const price = req.body.price;
  const description = req.body.description;
  const inStock = req.body.inStock === "true"; // Convert the string value to a boolean
  const outOfStock = req.body.outOfStock === "true";

  const product = new Product({
    title: title,
    price: price,
    description: description,
    inStock: inStock
  });

  product
    .save()
    .then((result) => {
      res.redirect("/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
