const isAuth = (req, res, next) => {
    if(req.session.isAuth){
        next();
    }else {
        res.send("Not authorized")
    }
};

module.exports = isAuth;