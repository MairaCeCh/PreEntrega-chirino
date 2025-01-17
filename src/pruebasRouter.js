import { Router } from "express";


const router = Router();
////session////
router.get('/session', (req, res) => { 
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Se ha visitado el sitio ${req.session.counter} veces`);
    } else {
        req.session.counter = 1;
        res.send("Bienvenido");
    }
});

///////login//////
router.get("/login", (req, res)=>{
    const {username, password} = req.query
    if(username != "fede" || password != "el mejor"){
        return res.send("login failed")
    }
    req.session.user ={
        username,
        admin: true
    }
    res.send("login success")
})
function authentication(req, res, next) {
if(req.session?.user?.username=== "fede" && req.session.user.admin)
    return next()
    
return res.status(401).send("error de autenticacion")}

router.get("/current",authentication, (req, res) =>{
    res.send(req.session.user)
})

///////fin login//////
router.get('/logout', (req, res) => { 
   req.session.destroy(err =>{
    if(err) return res.send({status: "error", error:err})
   })
res.send("logout exitoso")
});


////cookies///
///set
router.get('/setCookies', (req, res) => { 
    res.cookie('mayCookie','esta es una cookie de may',{maxAge: 100000000}).send('Cookies seteadas');
});

router.get('/setsignedCookies', (req, res) => { 
    res.cookie('mayCookie','esta es una cookie de may',{maxAge: 100000000, signed:true}).send('Cookies seteadas');
});
/////get
router.get('/getCookies', (req, res) => {
    console.log(req.cookies);
    res.send(req.cookies);
});

router.get('/getsignedCookies', (req, res) => {
    console.log(req.signedCookies);
    res.send(req.signedCookies);
});
//////delete
router.get('/deleteCookies', (req, res) => {
    res.clearCookie('mayCookie').send('Cookie eliminada');
});
export default router;