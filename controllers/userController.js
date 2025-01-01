const { StatusCodes, Messages } = require('../Constant');
const blacklistedTokens = new Set();
const db = require('../models');
const User = db.User;
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');
const SecretKey = "secretkey";




const register = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const profileImage  = req.file ? req.file.path : null;
        const staticOtp = "000000";
        if (!name) {
            return res.status(400).json({ status: StatusCodes.BAD_REQUEST, message: Messages.Name });
        }
        if (!profileImage) {
            return res.status(400).json({ status: StatusCodes.BAD_REQUEST, message: Messages.ProfileImage });
        }
        if (!email) {
            return res.status(400).json({ status: StatusCodes.BAD_REQUEST, message: Messages.Email });
        }
        if (!phone) {
            return res.status(400).json({ status: StatusCodes.BAD_REQUEST, message: Messages.phone });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ status: StatusCodes.BAD_REQUEST, message: Messages.UserExist });
        }
        // const newUser = await User.create({
        //     name,
        //     email,
        //     phone,
        //     profileImage
        // });
        // const token = jwt.sign({ id: newUser.id, email: newUser.email }, SecretKey, { expiresIn: '1h' });
        res.status(200).json({
            status: StatusCodes.STATUSSUCCESS,
            message: Messages.OTPSUCESS,
            otp: staticOtp,
            // token,
            // data: { id: newUser.id, name: newUser.name, email: newUser.email, profileImage: newUser.profileImage, phone: newUser.phone },

        });
    } catch (error) {
        res.status(500).json({
            status: StatusCodes.STATUSERROR,
            error: error.message,
        });
    }
};


const verifyOtp = async (req, res) => {
    try {
        const { name, email, phone, otp } = req.body;
        const profileImage = req.file ? req.file.path : null;
        console.log(req.file);
        const staticOtp = "000000";

        if (!name) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.STATUSERROR, message: Messages.Name });
        }
        if (!email) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.STATUSERROR, message: Messages.Email });
        }
        if (!phone) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.STATUSERROR, message: Messages.phone });
        }
        if (!profileImage) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.STATUSERROR, message: Messages.ProfileImage });
        }
        if (!otp) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.STATUSERROR, message: Messages.OTPREQUIRED });
        }
        if (otp !== staticOtp) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.STATUSERROR, message: Messages.OTPINVALID });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({ status: StatusCodes.STATUSERROR, message: Messages.UserExist });
        }
        const newUser = await User.create({
            name,
            email,
            phone,
            profileImage
        });
        const token = jwt.sign({ id: newUser.id }, "YourSecretKey", { expiresIn: "1h" });
        res.status(201).json({
            message: Messages.RegisterSuccess,
            token,
            data: { id: newUser.id, name: newUser.name, email: newUser.email, profileImage: newUser.profileImage, phone: newUser.phone },

        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: Messages.INTERNAL_SERVER_ERROR,
            error: error.message,
        });
    }
};



const Login = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.STATUSERROR,
                message: Messages.phone,
            });
        }
        const userExist = await User.findOne({ where: { phone } });
        if (!userExist) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusCodes.STATUSERROR,
                message: Messages.InvalideCredentials,
            });
        }
        const token = jwt.sign({ id: userExist.id, email: userExist.email }, SecretKey, { expiresIn: '1h' });
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.STATUSSUCCESS,
            message: Messages.LoginSuccess,
            token,
            user: { id: userExist.id, email: userExist.email, name: userExist.name },
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.STATUSERROR,
            message: Messages.Error,
            error: error.message,
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const userExist = await User.findOne({ where: { id: userId } });
        if (userExist) {
            return res.status(StatusCodes.OK).json({
                status: StatusCodes.STATUSSUCCESS,
                message: Messages.DataSuccess,
                data: { id: userExist.id, name: userExist.name, profileImage: userExist.profileImage, email: userExist.email, createdAt: userExist.createdAt },
            });
        }
        return res.status(StatusCodes.NOT_FOUND).json({ status: StatusCodes.STATUSERROR, message: Messages.UserNotExist });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.STATUSERROR, message: Messages.Error, error: error.message });
    }
};


const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.STATUSERROR,
                message: Messages.TokenRequired,
            });
        }
        blacklistedTokens.add(token);
        res.status(StatusCodes.OK).json({
            status: StatusCodes.STATUSSUCCESS,
            message: Messages.LogoutSuccess,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.STATUSERROR,
            message: Messages.INTERNAL_SERVER_ERROR,
            error: error.message,
        });
    }
};


const editProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;
        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.STATUSERROR, message: Messages.UserId });
        }
        if (!name) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.STATUSERROR, message: Messages.Name });
        }
        const userExist = await User.findOne({ where: { id: userId } });
        if (userExist) {
            await User.update({ name }, { where: { id: userId } });
            return res.status(StatusCodes.OK).json({ status: StatusCodes.STATUSSUCCESS, message: Messages.UpdateSuccess });
        }
        return res.status(StatusCodes.NOT_FOUND).json({ status: StatusCodes.STATUSERROR, message: Messages.UserNotExist });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.STATUSERROR, message: Messages.Error, error: error.message });
    }
};



module.exports = {
    register,
    Login,
    getProfile,
    logout,
    blacklistedTokens,
    verifyOtp,
    editProfile
};

