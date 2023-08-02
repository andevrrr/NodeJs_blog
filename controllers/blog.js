
exports.getMain = (req, res, next) => {
    res.render('blog/main', {
        pageTitle: 'Main',
        path: '/'
    });
}

exports.getServices = (req, res, next) => {
    res.render('blog/services', {
        pageTitle: 'Our services',
        path: '/services'
    });
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