const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET_KEY = "letskeepitasasecret";



//ROUTE 1: Create a User using: POST "/api/auth/createUser". Doesn't require Auth

router.post('/createUser', [

    body('name', 'Enter Valid Name').isLength({ min: 3 }),
    body('email', 'Enter Valid Email').isEmail(),
    body('password', 'Password Should Be atleast Length Of 5').isLength({ min: 5 })

], async (req, res) => {

    try {
        let success=true;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            success=false;
            return res.status(400).json({success:success, errors: errors.array() });
        }
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            success=false;
            return res.status(404).json({ success:success ,error: "email already exists" })

        }
        else {
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                password: secPassword,
                email: req.body.email,
            });

            const data = {
                user: {
                    id: user.id
                }
            }
            var authToken = jwt.sign(data, JWT_SECRET_KEY);
            res.json({ success , authToken });
        }


    }
    catch (err) {
        console.error(err.message);
        
        res.status(500).send( {error:"Internal Error Occured "});
    }

})


//ROUTE 2: Authenticate a User using: POST "/api/auth/login". Doesn't require Auth

router.post('/login', [
    body('email', 'Enter Valid Email').isEmail(),
    body('password', 'Password should not be NULL').exists()
], async (req, res) => {

    let success=true;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success=false;
        return res.status(400).json({ success:success,errors: errors.array() });
        
    }
    else {
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                success=false;
                return res.status(400).json({ success:success,error: "Enter Correct Credentials" });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                success=false;
                return res.status(400).json({ success:success,error: "Enter Correct Credentials" });
            }


            const data = {
                user: {
                    id: user.id
                }
            }
            success=true;
            var authToken = jwt.sign(data, JWT_SECRET_KEY);
            res.json({ success,authToken });

        }
        catch (err) {
            console.error(err.message);
            res.status(500).send("Internal Error Occured ");
        }
    }
});
//ROUTE 3: Get Loggedin User Details using: POST "/api/auth/getUser".

router.post('/getuser', fetchuser, async (req, res) => {

    try {

        var userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Error Occured ");
    }
});
module.exports = router