import { Return } from "../models/return.models.js";
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";

const getOrderForReturn = asyncHandler(
  async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) {
      throw new ApiError(
        400,
        "Order ID is required"
      );
    }

    const order =
      await Order.findById(orderId).lean();

    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        "You are not allowed to access this order"
      );
    }

    const productIds = order.items
      .map((item) => {
        if (item.product) {
          return item.product;
        }

        if (item.productId) {
          return item.productId;
        }

        return null;
      })
      .filter(Boolean);

    const products =
      await Product.find({
        _id: {
          $in: productIds,
        },
      })
        .select("name image price")
        .lean();

    const updatedItems = order.items.map(
      (item) => {
        const productId =
          item.product ||
          item.productId;

        const product = products.find(
          (p) =>
            p._id.toString() ===
            productId?.toString()
        );

        return {
          ...item,
          product: product || null,
          productId: productId || null,
        };
      }
    );

    const orderForReturn = {
      ...order,
      items: updatedItems,
    };

    return res.status(200).json(
      new ApiResponse(
        200,
        orderForReturn,
        "Order found successfully"
      )
    );
  }
);

const createReturnRequest = asyncHandler(
  async (req, res) => {
    const {
      orderId,
      productId,
      reason,
      message,
    } = req.body;

    if (
      !orderId ||
      !productId ||
      !reason
    ) {
      throw new ApiError(
        400,
        "Order ID, product ID and reason are required"
      );
    }

    const order =
      await Order.findById(orderId);

    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        "You are not allowed to request a return for this order"
      );
    }

    if (order.status !== "delivered") {
      throw new ApiError(
        400,
        "You can only request a return after the order has been delivered"
      );
    }

    const productExists =
      order.items.some((item) => {
        const itemProductId =
          item.product ||
          item.productId;

        return (
          itemProductId &&
          itemProductId.toString() ===
            productId.toString()
        );
      });

    if (!productExists) {
      throw new ApiError(
        400,
        "This product does not belong to this order"
      );
    }

    const existingReturn =
      await Return.findOne({
        user: req.user._id,
        order: orderId,
        product: productId,
      });

    if (existingReturn) {
      throw new ApiError(
        400,
        "A return request already exists for this product"
      );
    }

    const returnRequest =
      await Return.create({
        user: req.user._id,
        order: orderId,
        product: productId,
        reason,
        message: message || "",
      });

    if (process.env.ADMIN_EMAIL) {
      try {
        await sendEmail(
          process.env.ADMIN_EMAIL,
          "New Return Request - GoFlex",
          `
            <h2>New Return Request</h2>

            <p>
              <strong>Customer:</strong>
              ${req.user.name}
            </p>

            <p>
              <strong>Email:</strong>
              ${req.user.email}
            </p>

            <p>
              <strong>Order ID:</strong>
              ${orderId}
            </p>

            <p>
              <strong>Product ID:</strong>
              ${productId}
            </p>

            <p>
              <strong>Reason:</strong>
              ${reason}
            </p>

            <p>
              <strong>Message:</strong>
              ${message || "No additional message"}
            </p>
          `
        );

        console.log(
          "Return request email sent to admin"
        );
      } catch (error) {
        console.error(
          "Return request admin email failed:",
          error.message
        );
      }
    } else {
      console.error(
        "ADMIN_EMAIL is not configured in .env"
      );
    }

    return res.status(201).json(
      new ApiResponse(
        201,
        returnRequest,
        "Return request submitted successfully"
      )
    );
  }
);

const getMyReturnRequests =
  asyncHandler(
    async (req, res) => {
      const returns =
        await Return.find({
          user: req.user._id,
        })
          .populate("order")
          .populate(
            "product",
            "name image price"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json(
        new ApiResponse(
          200,
          returns,
          "Return requests fetched successfully"
        )
      );
    }
  );

const getAllReturnRequests =
  asyncHandler(
    async (req, res) => {
      if (req.user.role !== "admin") {
        throw new ApiError(
          403,
          "Admin access required"
        );
      }

      const returns =
        await Return.find()
          .populate(
            "user",
            "name email"
          )
          .populate("order")
          .populate(
            "product",
            "name image price"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json(
        new ApiResponse(
          200,
          returns,
          "All return requests fetched successfully"
        )
      );
    }
  );

const updateReturnStatus =
  asyncHandler(
    async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;

      if (req.user.role !== "admin") {
        throw new ApiError(
          403,
          "Admin access required"
        );
      }

      if (
        !["approved", "rejected"].includes(
          status
        )
      ) {
        throw new ApiError(
          400,
          "Status must be approved or rejected"
        );
      }

      const returnRequest =
        await Return.findById(id)
          .populate(
            "user",
            "name email"
          )
          .populate("order")
          .populate(
            "product",
            "name image price"
          );

      if (!returnRequest) {
        throw new ApiError(
          404,
          "Return request not found"
        );
      }

      if (
        returnRequest.status !==
        "pending"
      ) {
        throw new ApiError(
          400,
          `This return request has already been ${returnRequest.status}`
        );
      }

      const customerEmail =
        returnRequest.user?.email;

      const customerName =
        returnRequest.user?.name ||
        "Customer";

      const productName =
        returnRequest.product?.name ||
        "Requested product";

      const orderId =
        returnRequest.order?._id ||
        returnRequest.order ||
        "N/A";

      returnRequest.status = status;

      await returnRequest.save();

      if (!customerEmail) {
        console.error(
          "Customer email not found for return request:",
          returnRequest._id
        );
      } else {
        const isApproved =
          status === "approved";

        const subject = isApproved
          ? "Your Return Request Has Been Approved - GoFlex"
          : "Your Return Request Has Been Rejected - GoFlex";

        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <title>GoFlex Return Request</title>
            </head>

            <body
              style="
                margin: 0;
                padding: 0;
                background-color: #18181b;
                font-family: Arial, Helvetica, sans-serif;
                color: #e4e4e7;
              "
            >
              <div
                style="
                  max-width: 600px;
                  margin: 40px auto;
                  background-color: #27272a;
                  border-radius: 12px;
                  overflow: hidden;
                  border: 1px solid #3f3f46;
                "
              >
                <div
                  style="
                    padding: 25px;
                    background-color: #f97316;
                    text-align: center;
                  "
                >
                  <h1
                    style="
                      margin: 0;
                      color: white;
                      font-size: 28px;
                    "
                  >
                    GoFlex
                  </h1>

                  <p
                    style="
                      margin: 8px 0 0;
                      color: white;
                      font-size: 14px;
                    "
                  >
                    Return Request Update
                  </p>
                </div>

                <div style="padding: 30px;">
                  <h2
                    style="
                      margin-top: 0;
                      color: white;
                    "
                  >
                    Hello ${customerName},
                  </h2>

                  ${
                    isApproved
                      ? `
                        <p
                          style="
                            line-height: 1.7;
                            color: #d4d4d8;
                          "
                        >
                          Your return request has been
                          <strong style="color: #4ade80;">
                            approved
                          </strong>.
                        </p>

                        <p
                          style="
                            line-height: 1.7;
                            color: #d4d4d8;
                          "
                        >
                          Our team will process the return
                          according to the GoFlex return policy.
                        </p>
                      `
                      : `
                        <p
                          style="
                            line-height: 1.7;
                            color: #d4d4d8;
                          "
                        >
                          Unfortunately, your return request has been
                          <strong style="color: #f87171;">
                            rejected
                          </strong>.
                        </p>

                        <p
                          style="
                            line-height: 1.7;
                            color: #d4d4d8;
                          "
                        >
                          If you believe this decision was made
                          in error, please contact GoFlex support.
                        </p>
                      `
                  }

                  <div
                    style="
                      margin-top: 25px;
                      padding: 20px;
                      background-color: #18181b;
                      border-radius: 8px;
                      border: 1px solid #3f3f46;
                    "
                  >
                    <h3
                      style="
                        margin-top: 0;
                        color: #f97316;
                      "
                    >
                      Return Details
                    </h3>

                    <p>
                      <strong>Product:</strong>
                      ${productName}
                    </p>

                    <p>
                      <strong>Order ID:</strong>
                      ${orderId}
                    </p>

                    <p>
                      <strong>Reason:</strong>
                      ${returnRequest.reason}
                    </p>

                    <p>
                      <strong>Status:</strong>

                      <span
                        style="
                          color: ${
                            isApproved
                              ? "#4ade80"
                              : "#f87171"
                          };
                          font-weight: bold;
                        "
                      >
                        ${status.toUpperCase()}
                      </span>
                    </p>
                  </div>

                  <p
                    style="
                      margin-top: 30px;
                      line-height: 1.7;
                      color: #a1a1aa;
                    "
                  >
                    Thank you for choosing GoFlex.
                  </p>

                  <p
                    style="
                      color: #f97316;
                      font-weight: bold;
                    "
                  >
                    GoFlex Team
                  </p>
                </div>
              </div>
            </body>
          </html>
        `;

        try {
          await sendEmail(
            customerEmail,
            subject,
            html
          );

          console.log(
            `Return ${status} email sent to ${customerEmail}`
          );
        } catch (error) {
          console.error(
            "Error sending return status email:",
            error.message
          );
        }
      }

      return res.status(200).json(
        new ApiResponse(
          200,
          returnRequest,
          `Return request ${status} successfully`
        )
      );
    }
  );

export {
  getOrderForReturn,
  createReturnRequest,
  getMyReturnRequests,
  getAllReturnRequests,
  updateReturnStatus,
};