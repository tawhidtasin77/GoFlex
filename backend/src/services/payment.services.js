import axios from "axios";
import qs from "qs";

const SSLCOMMERZ_API_URL =
    process.env.SSLCOMMERZ_IS_LIVE === "true"
        ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
        : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

const createSSLCommerzSession = async (paymentData) => {

    const response = await axios.post(
        SSLCOMMERZ_API_URL,
        qs.stringify(paymentData),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    return response.data;
};

const validateSSLCommerzPayment = async (valId) => {

    const response = await axios.get(
        "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php",
        {
            params: {
                val_id: valId,
                store_id: process.env.SSLCOMMERZ_STORE_ID,
                store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
                v: 1,
                format: "json"
            }
        }
    );

    return response.data;
};

export {
    createSSLCommerzSession,
    validateSSLCommerzPayment
};