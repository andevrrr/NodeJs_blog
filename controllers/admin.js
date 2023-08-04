const Service = require("../models/service");
const Product = require("../models/product");
const fileHelper = require('../utils/file');

const { validationResult } = require("express-validator");

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
    hasError: false,
    editing: false,
    errorMessage: ""
  });
};

exports.postCreateProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const inStock = req.body.inStock === "true";

  if (!image) {
    return res.status(422).render('admin/product.ejs', {
        pageTitle: 'Add Product',
        path: "/admin/add-product",
        hasError: true,
        editing: false,
        product: {
            title: title,
            price: price,
            description: description,
            inStock: inStock
        },
        errorMessage: 'Attached file is not an image'
    });
  }

  const errors = validationResult(req);
  const imageUrl = image.path;

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/product.ejs', {
        pageTitle: 'Add Product',
        path: "/admin/add-product",
        hasError: true,
        editing: false,
        product: {
            title: title,
            image: imageUrl,
            price: price,
            description: description,
            inStock: inStock
        },
        errorMessage: errors.array()[0].msg
    });
}

  const product = new Product({
    title: title,
    price: price,
    image: imageUrl,
    description: description,
    inStock: inStock
  });

  product
    .save()
    .then((result) => {
      console.log('Created Product');
      res.redirect("/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.params.productId;

    Product.findByIdAndRemove(productId)
    .then(product => {
        fileHelper.deleteFile(product.image);
    })
    .then(result => {
        console.log('Product deleted');
        res.redirect('/products');
    })
    .catch(err => {
        console.log(err);
    })
}
