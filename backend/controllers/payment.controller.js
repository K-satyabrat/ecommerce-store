import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    // Coupon generation moved to checkoutSuccess function
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res
      .status(500)
      .json({ message: "Error processing checkout", error: error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Check if order already exists for this session
      const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
      
      if (existingOrder) {
        return res.status(200).json({
          success: true,
          message: "Order already processed for this session.",
          orderId: existingOrder._id,
        });
      }

      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          {
            isActive: false,
          }
        );
      }

      // create a new Order
      const products = JSON.parse(session.metadata.products);
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100, // convert from cents to dollars,
        stripeSessionId: sessionId,
      });

      await newOrder.save();

    // Clear user's cart after successful order
      const User = (await import('../models/user.model.js')).default;
      await User.findByIdAndUpdate(session.metadata.userId, { cartItems: [] });

      // Generate coupon for orders >= $50 (5000 cents)
      console.log(`Order total: ${session.amount_total} cents (${session.amount_total / 100} dollars)`);
      if (session.amount_total >= 5000) {
        console.log(`Generating coupon for user ${session.metadata.userId} with total amount: ${session.amount_total / 100}`);
        await createNewCoupon(session.metadata.userId);
      } else {
        console.log(`Order amount ${session.amount_total / 100} is less than $50, no coupon generated`);
      }

      res.status(200).json({
        success: true,
        message:
          "Payment successful, order created, and coupon deactivated if used.",
        orderId: newOrder._id,
      });
    }
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    res
      .status(500)
      .json({
        message: "Error processing successful checkout",
        error: error.message,
      });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}

async function createNewCoupon(userId) {
  console.log(`Creating new coupon for user: ${userId}`);
  console.log(`User ID type: ${typeof userId}`);
  
  try {
    // Delete existing coupon first
    const deletedCoupon = await Coupon.findOneAndDelete({ userId });
    console.log(`Deleted existing coupon:`, deletedCoupon);

    const newCoupon = new Coupon({
      code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      userId: userId,
    });

    console.log(`New coupon object before save:`, newCoupon);

    await newCoupon.save();
    console.log(`Created new coupon: ${newCoupon.code} for user: ${userId}`);
    console.log(`Saved coupon object:`, newCoupon);

    // Verify the coupon was saved by fetching it
    const savedCoupon = await Coupon.findById(newCoupon._id);
    console.log(`Verified saved coupon:`, savedCoupon);

    return newCoupon;
  } catch (error) {
    console.error(`Error creating coupon for user ${userId}:`, error);
    throw error;
  }
}
