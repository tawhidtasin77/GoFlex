import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { admin } from "../middlewares/admin.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {getProducts, getProductById, createProduct, updateProduct, deleteProduct} from "../controllers/product.controllers.js"

const router = Router();

router.route("/").get(getProducts).post(verifyJWT, admin, upload.single("image"), createProduct);
router.route("/:id").get(getProductById).put(verifyJWT, admin, upload.single("image"), updateProduct).delete(verifyJWT, admin, deleteProduct);

export default router;