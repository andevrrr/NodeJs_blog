exports.get500 = (req, res, next) => {
    res.status(500).render('500',
        { pageTitle: 'Page Not Found', path: '/500' });
};