import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/userModel.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const razorpay = async (req, res) => {
  console.log(req.user)
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZARPAY_KEY_ID,
      key_secret: process.env.RAZARPAY_KEY_SECRET,
    });

    const options = {
      amount: 1999 * 100,
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (err) {
    if (err) throw err;
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

const successFunction = async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      email,
    } = req.body;

    const shasum = crypto.createHmac("sha256", "9f8327fvCnjWCAj0mpp8uNJB");
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature)
      return res.status(400).json({ msg_error: "Transaction not legit!" });
    const newPayment = {
      email: req.body.email,
      razorpayDetails: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
      success: true,
    };

    try {
      const user = await User.create(newPayment);
    } catch (err) {
      console.log(err.message);
      throw err;
    }

    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error);
  }
};

export { razorpay, successFunction };
