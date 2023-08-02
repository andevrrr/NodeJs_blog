const Service = require('../models/service');

exports.getCreateService = (req, res, next) => {
    res.render('admin/service.ejs', {
        pageTitle: 'Add Product',
        path: '/add-service'
    })
}

exports.postCreateService = (req, res, next) => {
    const name = req.body.name;
    const time = req.body.time;
    const price = req.body.price;

    console.log('Headers:', req.headers);
  console.log('Body:', req.body);

    console.log('I am here');

    const service = new Service({
        name: name,
        time: time,
        price: price
    })

    return service.save()
    .then(result => {
        res.redirect('/services')
    })
    .catch(err => {
        console.log(err);
    })
}