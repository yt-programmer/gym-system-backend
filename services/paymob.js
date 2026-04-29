const axios = require("axios");

async function getAuthToken() {
  const res = await axios.post("https://accept.paymob.com/api/auth/tokens", {
    api_key: process.env.PAYMOB_API_KEY,
  });
  return res.data.token;
}

async function createOrder(token, amount) {
  const res = await axios.post(
    "https://accept.paymob.com/api/ecommerce/orders",
    {
      auth_token: token,
      delivery_needed: false,
      amount_cents: amount * 100,
      currency: "EGP",
    },
  );
  return res.data.id;
}

async function getPaymentKey(token, orderId, amount, user) {
  const nameParts = (user.name || "User").split(" ");

  const res = await axios.post(
    "https://accept.paymob.com/api/acceptance/payment_keys",
    {
      auth_token: token,
      amount_cents: amount * 100,
      expiration: 3600,
      order_id: orderId,
      currency: "EGP",
      integration_id: process.env.PAYMOB_INTEGRATION_ID,
      billing_data: {
        first_name: nameParts[0],
        last_name: nameParts[1] || "NA",
        email: user.email,
        phone_number: user.phone || "01000000000",
        country: "EG",
        city: "Cairo",
        street: "NA",
        building: "NA",
        floor: "NA",
        apartment: "NA",
      },
    },
  );

  return res.data.token;
}
module.exports = { getAuthToken, createOrder, getPaymentKey };
