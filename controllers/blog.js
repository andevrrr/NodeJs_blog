const Service = require('../models/service');

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
    res.render('blog/products', {
        pageTitle: 'Our products',
        path: '/products'
    });
}

exports.getPosts = (req, res, next) => {
    res.render('blog/posts', {
        pageTitle: 'Posts',
        path: '/posts'
    });
}