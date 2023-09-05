import mongoose  from "mongoose";
const PaymentDetailsSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    razorpayDetails: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
    success: Boolean,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("PatmentDetail", PaymentDetailsSchema);
export default User;