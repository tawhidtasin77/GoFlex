import { Return } from "../models/return.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllReturnRequests = asyncHandler(
  async (req, res) => {
    if (req.user.role !== "admin") {
      throw new ApiError(
        403,
        "Only admin can access return requests"
      );
    }

    const returns = await Return.find()
      .populate("user", "name email")
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


const updateReturnStatus = asyncHandler(
  async (req, res) => {
    if (req.user.role !== "admin") {
      throw new ApiError(
        403,
        "Only admin can update return requests"
      );
    }

    const { id } = req.params;
    const { status } = req.body;

    if (
      !["approved", "rejected"].includes(status)
    ) {
      throw new ApiError(
        400,
        "Status must be approved or rejected"
      );
    }

    const returnRequest =
      await Return.findById(id);

    if (!returnRequest) {
      throw new ApiError(
        404,
        "Return request not found"
      );
    }

    if (returnRequest.status !== "pending") {
      throw new ApiError(
        400,
        `Return request is already ${returnRequest.status}`
      );
    }

    returnRequest.status = status;

    await returnRequest.save();

    const updatedReturn =
      await Return.findById(id)
        .populate("user", "name email")
        .populate("order")
        .populate(
          "product",
          "name image price"
        );

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedReturn,
        `Return request ${status} successfully`
      )
    );
  }
);

export {
  getAllReturnRequests,
  updateReturnStatus,
};