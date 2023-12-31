const Service = require("../models/service");
const Product = require("../models/product");
const Post = require("../models/post");
const { validationResult } = require("express-validator");
const ServiceCategory = require("../models/ServiceCategory");
const ProductCategory = require("../models/ProductCategory");
const io = require('../socket');

exports.getMain = (req, res, next) => {
  const post = Post.find().exec();
  const service = Service.find().exec();
  const product = Product.find().exec();

  Promise.all([post, service, product])
    .then(([posts, services, products]) => {
      res.render("blog/main", {
        pageTitle: "Main",
        path: "/",
        posts: posts,
        services: services,
        products: products,
      });
    })
    .catch((err) => {
      console.log("/");
    });
};

exports.getProductsCategories = (req, res, next) => {
  ProductCategory.find()
    .then((categories) => {
      if (!categories) {
        return res.status(404).json({ message: "Categories not found" });
      }
      res.status(200).json({
        message: "Fetched categories successfully",
        categories: categories 
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

exports.getServicesCategories = (req, res, next) => {
  ServiceCategory.find()
    .then((categories) => {
      if (!categories) {
        return res.status(404).json({ message: "Categories not found" });
      }
      res.status(200).json({
        message: "Fetched categories successfully",
        categories: categories 
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

exports.getServices = (req, res, next) => {
  Service.find({ isVisible: true })
    .then((services) => {
      if (!services) {
        return res.status(404).json({ message: "Services not found" });
      }
      res.status(200).json({
        message: "Fetched services successfully",
        services: services 
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ isVisible: true })
    .then((products) => {
      // res.render("blog/products", {
      //   pageTitle: "Our products",
      //   path: "/products",
      //   products: products,
      // });
      if (!products) {
        return res.status(404).json({ message: "Products not found" });
      }
      res.status(200).json({
        message: "Fetched products successfully",
        products: products
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPosts = (req, res, next) => {
  Post.find({ isVisible: true })
    .then((posts) => {
      // res.render("blog/posts", {
      //   pageTitle: "Posts",
      //   path: "/posts",
      //   posts: posts,
      // });
      if (!posts) {
        return res.status(404).json({ message: "Posts not found" });
      }
      res.status(200).json({
        message: 'Fethced posts successfully',
        posts: posts
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddCommentPost = (req, res, next) => {
  const postId = req.params.postId;
  const name = req.body.name;
  const email = req.body.email;
  const commentText = req.body.comment;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const newComment = {
        name: name,
        email: email,
        text: commentText,
      };

      post.comments.push(newComment);
      return post.save();
    })
    .then((result) => {
      console.log("Comment created successfully!")
      res.redirect(`/posts/${postId}`);
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/posts/${postId}`);
    });
};

exports.postAddCommentProduct = (req, res, next) => {
  const productId = req.params.productId;
  const name = req.body.name;
  const email = req.body.email;
  const commentText = req.body.comment;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const newComment = {
        name: name,
        email: email,
        text: commentText,
      };

      product.comments.push(newComment);
      return product.save();
    })
    .then(result => {
      io.emit('comments', {
        productId: productId,
        newComment: result.comments[result.comments.length - 1] // Emit the last added comment
      });
      console.log("Comment created successfully!")
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      res.status(200).json({
        message: 'Fatched the post successfully',
        post: post,
        comments: post.comments
      })
      // res.render("blog/post", {
      //   pageTitle: "Post",
      //   path: "/post",
      //   post: post,
      // });
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.status(200).json({
        message: "Product fetched successfully",
        product: product,
        comments: product.comments
      })
      // res.render("blog/details", {
      //   pageTitle: "Details",
      //   path: "/detaild",
      //   product: product,
      // });
    })
    .catch((err) => {
      console.log(err);
    });
};
