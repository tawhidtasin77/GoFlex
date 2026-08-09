const orderHTML = (user, order) => `
    <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        color: #333;
    ">

        <h2 style="
            text-align: center;
            color: #222;
        ">
            Thank You for Your Order! 🛍️
        </h2>

        <p>Hello <strong>${user.name}</strong>,</p>

        <p>
            Thank you for shopping with <strong>GoFlex</strong>.
            Your order has been successfully placed.
        </p>

        <div style="
            background: #f5f5f5;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        ">

            <p>
                <strong>Order ID:</strong><br>
                ${order._id}
            </p>

            <p>
                <strong>Total Amount:</strong><br>
                ৳${order.totalAmount}
            </p>

            <p>
                <strong>Order Status:</strong><br>
                ${order.status}
            </p>

        </div>

        <p>
            We have received your order and will start processing it shortly.
        </p>

        <p>
            You will receive another email when your order status is updated.
        </p>

        <br>

        <p>
            Regards,<br>
            <strong>GoFlex Team</strong>
        </p>

    </div>
`;

export { orderHTML };