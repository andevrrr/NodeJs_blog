const Service = require("../models/service");
const Product = require("../models/product");
const Post = require("../models/post");
const fileHelper = require("../utils/file");

const { validationResult } = require("express-validator");

exports.getCreateService = (req, res, next) => {
  res.render("admin/service.ejs", {
    pageTitle: "Add Service",
    path: "/admin/add-service",
    hasError: false,
    editing: false,
    errorMessage: "",
  });
};

exports.getCreateProduct = (req, res, next) => {
  res.render("admin/product.ejs", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    hasError: false,
    editing: false,
    errorMessage: "",
  });
};

exports.postCreateService = (req, res, next) => {
  const name = req.body.name;
  const time = req.body.time;
  const price = req.body.price;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/service.ejs", {
      pageTitle: "Add Service",
      path: "/admin/add-service",
      hasError: true,
      editing: false,
      product: {
        name: name,
        time: time,
        price: price,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

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

exports.postCreateProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const inStock = req.body.inStock === "true";

  if (!image) {
    return res.status(422).render("admin/product.ejs", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      hasError: true,
      editing: false,
      product: {
        title: title,
        price: price,
        description: description,
        inStock: inStock,
      },
      errorMessage: "Attached file is not an image",
    });
  }

  const errors = validationResult(req);
  const imageUrl = image.path;

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/product.ejs", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      hasError: true,
      editing: false,
      product: {
        title: title,
        image: imageUrl,
        price: price,
        description: description,
        inStock: inStock,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  const product = new Product({
    title: title,
    price: price,
    image: imageUrl,
    description: description,
    inStock: inStock,
  });

  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findByIdAndRemove(productId)
    .then((product) => {
      fileHelper.deleteFile(product.image);
    })
    .then((result) => {
      console.log("Product deleted");
      res.redirect("/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteService = (req, res, next) => {
  const serviceId = req.params.serviceId;

  Service.findByIdAndRemove(serviceId)
    .then((result) => {
      console.log("Service deleted");
      res.redirect("/services");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/product.ejs", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const inStock = req.body.inStock === "true";

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/product.ejs", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      hasError: true,
      editing: true,
      product: {
        title: title,
        image: imageUrl,
        price: price,
        description: description,
        inStock: inStock,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  Product.findById(productId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.description = description;
      product.inStock = inStock;

      if (image) {
        fileHelper.deleteFile(product.image);
        product.image = image.path;
      }

      return product.save().then((result) => {
        console.log("Product updated!");
        res.redirect("/products");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditService = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const serviceId = req.params.serviceId;

  Service.findById(serviceId)
    .then((service) => {
      if (!service) {
        return res.redirect("/");
      }
      res.render("admin/service.ejs", {
        pageTitle: "Edit Service",
        path: "/admin/edit-service",
        editing: true,
        service: service,
        hasError: false,
        errorMessage: null,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditService = (req, res, next) => {
  const serviceId = req.body.serviceId;
  const name = req.body.name;
  const time = req.body.time;
  const price = req.body.price;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/service.ejs", {
      pageTitle: "Edit Service",
      path: "/admin/edit-service",
      hasError: true,
      editing: true,
      product: {
        name: name,
        time: time,
        price: price,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  Service.findById(serviceId)
    .then((service) => {
      service.name = name;
      service.time = time;
      service.price = price;

      return service.save().then((result) => {
        console.log("Service updated!");
        res.redirect("/services");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCreatePost = (req, res, next) => {
  res.render("admin/post.ejs", {
    pageTitle: "Add Product",
    path: "/admin/add-post",
    hasError: false,
    editing: false,
    errorMessage: "",
  });
};

exports.postCreatePost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/post.ejs", {
      pageTitle: "Add Post",
      path: "/admin/add-post",
      hasError: true,
      editing: false,
      post: {
        title: title,
        content: content,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  const post = new Post({
    title: title,
    content: content,
  });

  return post
    .save()
    .then((result) => {
      res.redirect("/posts");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findByIdAndRemove(postId)
    .then((result) => {
      console.log("Product deleted");
      res.redirect("/posts");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditPost = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      res.render("admin/post.ejs", {
        pageTitle: "Edit Post",
        path: "/admin/edit-post",
        editing: true,
        post: post,
        hasError: false,
        errorMessage: null,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditPost = (req, res, next) => {
  const postId = req.body.postId;
  const title = req.body.title;
  const content = req.body.content;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/post.ejs", {
      pageTitle: "Edit Post",
      path: "/admin/edit-post",
      hasError: true,
      editing: true,
      post: {
        title: title,
        content: content,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  Post.findById(postId)
    .then((post) => {
      post.title = title;
      post.content = content;

      return post.save().then((result) => {
        console.log("Post updated!");
        res.redirect("/posts");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteCommentPost = (req, res, next) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Find the comment by its id and remove it from the comments array
      const commentIndex = post.comments.findIndex(
        (comment) => comment.id === commentId
      );
      if (commentIndex !== -1) {
        post.comments.splice(commentIndex, 1);
        return post.save();
      } else {
        return res.status(404).json({ message: "Comment not found" });
      }
    })
    .then((result) => {
      res.redirect("/posts"); // Redirect to the post list
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/posts");
    });
};

exports.postDeleteCommentProduct = (req, res, next) => {
  const productId = req.params.postId;
  const commentId = req.params.commentId;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Find the comment by its id and remove it from the comments array
      const commentIndex = product.comments.findIndex(
        (comment) => comment.id === commentId
      );
      if (commentIndex !== -1) {
        product.comments.splice(commentIndex, 1);
        return product.save();
      } else {
        return res.status(404).json({ message: "Comment not found" });
      }
    })
    .then((result) => {
      res.redirect("/products"); // Redirect to the post list
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/products");
    });
};

exports.postIsVisibleProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.isVisible) {
        product.isVisible = false;
      } else {
        product.isVisible = true;
      }

      return product.save();
    })
    .then((result) => {
      res.redirect("/products"); // Redirect to the post list
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/products");
    });
};

exports.postIsVisibleService = (req, res, next) => {
  const prodId = req.params.serviceId;

  Service.findById(prodId)
    .then((service) => {
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      if (service.isVisible) {
        service.isVisible = false;
      } else {
        service.isVisible = true;
      }

      return service.save();
    })
    .then((result) => {
      res.redirect("/services"); // Redirect to the post list
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/services");
    });
};

exports.postIsVisiblePost = (req, res, next) => {
  const prodId = req.params.postId;

  Post.findById(prodId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.isVisible) {
        post.isVisible = false;
      } else {
        post.isVisible = true;
      }

      return post.save();
    })
    .then((result) => {
      res.redirect("/posts");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/posts");
    });
};

exports.postIsFeaturedPost = (req, res, next) => {
  const prodId = req.params.postId;

  Post.findById(prodId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.isFeatured) {
        post.isFeatured = false;
      } else {
        post.isFeatured = true;
      }

      return post.save();
    })
    .then((result) => {
      res.redirect("/posts");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/posts");
    });
};

exports.postIsFeaturedService = (req, res, next) => {
  const prodId = req.params.serviceId;

  Service.findById(prodId)
    .then((service) => {
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      if (service.isFeatured) {
        service.isFeatured = false;
      } else {
        service.isFeatured = true;
      }

      return service.save();
    })
    .then((result) => {
      res.redirect("/services");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/services");
    });
};

exports.postIsFeaturedProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.isFeatured) {
        product.isFeatured = false;
      } else {
        product.isFeatured = true;
      }

      return product.save();
    })
    .then((result) => {
      res.redirect("/products");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/products");
    });
};

exports.postStatus = (Model, field, redirectUrl) => {
  return (req, res, next) => {
    const itemId = req.params.id;

    Model.findById(itemId)
      .then((item) => {
        if (!item) {
          return res.status(404).json({ message: "Item not found" });
        }

        item[field] = !item[field];

        return item.save();
      })
      .then((result) => {
        res.redirect(redirectUrl);
      })
      .catch((err) => {
        console.log(err);
        res.redirect(redirectUrl);
      });
  };
};
