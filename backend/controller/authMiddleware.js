const jwtSecretKey = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {

    const authorizationHeaader = req.headers.authorization;
    let result;
    if (authorizationHeaader) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const options = { expiresIn: 120 };
            let verifyResult = jwt.verify(token, jwtSecretKey);
            req._id = verifyResult.userId;
            req.userRole = verifyResult.userRole;
            
            if (verifyResult.userId) {
                let dbRes = await _db.get().collection(userCollection).findOne({ _id: ObjectId(verifyResult.userId) });

                if (dbRes) {
                    next();

                } else {
                    res.status(401).send({ message: 'Authentication error.user not exist in db', error: null, data: null });

                }
            } else {
                res.status(401).send({ message: 'Authentication error.', error: null, data: null });

            }

        } catch (err) {
            next(err);
        }
    } else {
        result = { error: 'Authentication error. Token required.', satatus: '0' };
        res.status(401).send(result);

    }
}

module.exports = {
    validateToken
}