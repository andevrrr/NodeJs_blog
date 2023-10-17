const Service = require("../models/service");
const Product = require("../models/product");
const Post = require("../models/post");
const ServiceCategory = require("../models/ServiceCategory");
const fileHelper = require("../utils/file");
const path = require('path');

const socketIO = require('../socket');
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

exports.getServiceCategories = async (req, res, next) => {
  try {
    const serviceCategories = await ServiceCategory.find();
    res.status(200).json(serviceCategories);
  } catch (error) {
    next(error);
  }
};

exports.getServicesWithCategories = async (req, res, next) => {
  try {
    const services = await Service.find().populate('category');
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

exports.postCreateService = async (req, res, next) => {
  const name = req.body.name;
  const time = req.body.time;
  const price = req.body.price;
  const category = req.body.category;
  console.log(category)
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // Create the service
    const service = new Service({
      name: name,
      time: time,
      price: price,
      category: category,
    });

    // Save the service
    const createdService = await service.save();

    // Now, associate the service with the category
    const foundCategory = await ServiceCategory.findById(category);

    if (!foundCategory) {
      console.log("the category is not found")
      return res.status(404).json({ message: "Category not found" });
    }

    // Associate the service with the category
    console.log(createdService._id)
    foundCategory.services.push(createdService._id);

    // Save the updated category
    const updatedCategory = await foundCategory.save();

    res.status(201).json({
      message: "Service created successfully",
      service: createdService,
      category: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create service" });
  }
};



exports.postCreateServiceCategory = (req, res, next) => {
  const name = req.body.name;

  const serviceCategory = new ServiceCategory({
    name: name
  });

  return serviceCategory
    .save()
    .then((createdService) => {
      const io = socketIO.getIO();
      io.emit('services', { action: 'create', service: createdService });
    })
    .then((createdServiceCategory) => {
      res.status(201).json({
        message: "Service category created successfully",
        serviceCategory: createdServiceCategory,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to create service category" });
    });
}

exports.postCreateProduct = (req, res, next) => {
  // if (!image) {
  //   return res.status(422).render("admin/product.ejs", {
  //     pageTitle: "Add Product",
  //     path: "/admin/add-product",
  //     hasError: true,
  //     editing: false,
  //     product: {
  //       title: title,
  //       price: price,
  //       description: description,
  //       inStock: inStock,
  //     },
  //     errorMessage: "Attached file is not an image",
  //   });
  // }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  console.log(req.file.path);
  console.log(req.body.title);

  const title = req.body.title;
  const imageUrl = req.file.path;
  const price = req.body.price;
  const description = req.body.description;
  const inStock = req.body.inStock === "true";

  // if (!errors.isEmpty()) {
  //   return res.status(422).render("admin/product.ejs", {
  //     pageTitle: "Add Product",
  //     path: "/admin/add-product",
  //     hasError: true,
  //     editing: false,
  //     product: {
  //       title: title,
  //       image: imageUrl,
  //       price: price,
  //       description: description,
  //       inStock: inStock,
  //     },
  //     errorMessage: errors.array()[0].msg,
  //   });
  // }

  const product = new Product({
    title: title,
    price: price,
    image: imageUrl,
    description: description,
    inStock: inStock,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(201).json({
        message: "Product created successfully.",
        product: createdProduct,
      });
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
      res.status(200).json({
        message: "Product deleted successfully.",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteService = (req, res, next) => {
  const serviceId = req.params.serviceId;

  Service.findByIdAndRemove(serviceId)
    .then((deletedService) => {
      if (!deletedService) {
        return res.status(404).json({ message: "Service not found" });
      }

      // If the service was associated with a category, remove its reference from the category
      const categoryId = deletedService.category;
      if (categoryId) {
        return ServiceCategory.findById(categoryId).then((category) => {
          if (category) {
            category.services.pull(deletedService._id);
            return category.save();
          }
        });
      }
    })
    .then(() => {
      res.status(200).json({
        message: "Service deleted successfully.",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to delete service" });
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
  const productId = req.params.productId;
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

      return product.save();
    })
    .then((updatedProduct) => {
      res.status(201).json({
        message: "Product updated successfully.",
        product: updatedProduct,
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

exports.postEditService = async (req, res, next) => {
  const serviceId = req.params.serviceId;
  const name = req.body.name;
  const time = req.body.time;
  const price = req.body.price;
  const category = req.body.category; // Assuming the new category ID is sent in the request body

  try {
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

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Remove the service from its previous category (if it had one)
    if (service.category) {
      const prevCategory = await ServiceCategory.findById(service.category);
      prevCategory.services.pull(serviceId);
      await prevCategory.save();
    }

    // Update the service's properties and category
    service.name = name;
    service.time = time;
    service.price = price;
    service.category = category;

    // Add the service to the new category (if a new category is provided)
    if (category) {
      const foundCategory = await ServiceCategory.findById(category);
      if (foundCategory) {
        foundCategory.services.push(serviceId);
        await foundCategory.save();
      }
    }

    const updatedService = await service.save();

    // Notify clients using socket.io about the service update
    io.getIO().emit('posts', { action: 'update', service: updatedService });

    res.status(200).json({
      message: "Service updated successfully.",
      service: updatedService,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update service" });
  }
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
    .then((createdPost) => {
      res.status(201).json({
        message: "Post created successfully!",
        post: createdPost,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findByIdAndRemove(postId)
    .then(() => {
      res.status(200).json({
        message: "Post deleted succeddfully.",
      });
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
  const postId = req.params.postId;
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
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      post.title = title;
      post.content = content;

      return post.save();
    })
    .then((updatedPost) => {
      return res.status(200).json({
        message: "Post updated",
        post: updatedPost,
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "An error occurred while updating the post" });
    });
};

exports.postDeleteComment = (Model) => {
  return (req, res, next) => {
    const itemId = req.params.id;
    const commentId = req.params.commentId;

    Model.findById(itemId)
      .then((item) => {
        if (!item) {
          return res.status(404).json({ message: "Not found" });
        }

        // Find the comment by its id and remove it from the comments array
        const commentIndex = item.comments.findIndex(
          (comment) => comment.id === commentId
        );
        if (commentIndex !== -1) {
          item.comments.splice(commentIndex, 1);
          return item.save();
        } else {
          return res.status(404).json({ message: "Comment not found" });
        }
      })
      .then((result) => {
        console.log("Succesfully deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

exports.postStatus = (Model, field) => {
  return (req, res, next) => {
    const itemId = req.params.id;

    Model.findById(itemId)
      .then((item) => {
        if (!item) {
          return res.status(404).json({ message: "Not found" });
        }

        item[field] = !item[field];

        return item.save();
      })
      .then((result) => {
        console.log("RESULT: " + result)
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
