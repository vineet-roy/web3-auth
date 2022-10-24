
const { findeByAddress, create, authenticateUser } = require('../services/user');

const fetchUser = async(req, res, next)=>{
    try{
        const user = await findeByAddress(req.query.publicAddress);
        res.status(200).send(user);
    }catch(err){
        next(err)
    }
}

const createUser = async(req, res, next)=>{
    try{
        const data = await create(req.body);
        res.status(200).send({ message: 'Data fethed', error: null, data });
    }catch(err){
        next(err)
    }
}

const authUser = async(req, res, next)=>{
    try{
        const accessToken = await authenticateUser(req.body);
        res.status(200).send({ message: 'Data fethed', error: null, accessToken });
    }catch(err){
        next(err);
    }
}

module.exports = {
    fetchUser,
    createUser,
    authUser
}