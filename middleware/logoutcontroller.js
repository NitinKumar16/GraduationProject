
module.exports.logout_get=(req,res)=>{

    res.cookie('xfcv'," ",{maxAge:1})
    res.redirect('/login/')
}