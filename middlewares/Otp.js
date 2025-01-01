// otpMiddleware.js

const crypto = require('crypto'); // For generating random OTP
const twilio = require('twilio'); // Use Twilio for sending SMS

const accountSid = 'your_account_sid'; // Twilio Account SID
const authToken = 'your_auth_token'; // Twilio Auth Token
const twilioPhoneNumber = 'your_twilio_phone_number'; // Twilio phone number
const client = new twilio(accountSid, authToken);

// Function to send OTP
const sendOTP = async (phone, otp) => {
    const message = `Your OTP is: ${otp}`;
    await client.messages.create({
        body: message,
        to: phone,
        from: twilioPhoneNumber,
    });
};

// Middleware to generate and send OTP
const otpMiddleware = async (req, res, next) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({
                status: "error",
                message: "Phone number is required."
            });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999); // 6-digit OTP

        // Send OTP to the user's phone number
        await sendOTP(phone, otp);

        // Attach the OTP and expiry time to the request object
        req.otp = otp; // Store OTP temporarily in request object
        req.otpExpiry = Date.now() + 10 * 60 * 1000; // Set OTP expiry time (10 minutes)

        next(); // Call the next middleware or route handler
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Failed to send OTP.",
            error: error.message,
        });
    }
};

module.exports = otpMiddleware;
