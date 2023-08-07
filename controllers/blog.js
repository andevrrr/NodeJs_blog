const Service = require('../models/service');
const Product = require('../models/product');
const Post = require("../models/post");

exports.getMain = (req, res, next) => {
    res.render('blog/main', {
        pageTitle: 'Main',
        path: '/'
    });
}

exports.getServices = (req, res, next) => {
    Service.find()
    .then(services => {
        res.render('blog/services', {
            pageTitle: 'Our services',
            path: '/services',
            services: services 
        });
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getProducts = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('blog/products', {
            pageTitle: 'Our products',
            path: '/products',
            products: products
        });
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getProductsDetails = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        res.render('blog/details', {
            pageTitle: 'Details',
            path: '/detaild',
            product: product
        });
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getPosts = (req, res, next) => {
    Post.find()
    .then(posts => {
        res.render('blog/posts', {
            pageTitle: 'Posts',
            path: '/posts',
            posts: posts
        });
    })
    .catch(err => {
        console.log(err);
    })
};



exports.postAddCommentPost = (req, res, next) => {
    const postId = req.params.postId;
    const commentText = req.body.comment;
  
    Post.findById(postId)
      .then(post => {
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            text: commentText
        }
  
        post.comments.push(newComment);
        return post.save();
      })
      .then(result => {
        res.redirect('/posts'); 
      })
      .catch(err => {
        console.log(err);
        res.redirect('/posts'); 
      });
  };

  exports.postAddCommentProduct = (req, res, next) => {
    const productId = req.params.productId;
    const commentText = req.body.comment;
  
    Product.findById(productId)
      .then(product => {
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }

        const newComment = {
            text: commentText
        }
  
        product.comments.push(newComment);
        return product.save();
      })
      .then(result => {
        res.redirect(`/details/${productId}`); 
      })
      .catch(err => {
        console.log(err);
        res.redirect('/products'); 
      });
  };
