const express = require("express");
const router = express.Router();
const {
  getProduct,
  addProduct,
  addMultipleProducts,
  getProductList,
} = require("../controllers/product.controller");


/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get product API status
 *     tags: [Product]
 */
router.get("/", getProduct);

/**
 * @swagger
 * /api/product/list:
 *   post:
 *     summary: Get product list with filters and pagination
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductListRequest'
 *     responses:
 *       200:
 *         description: Product list fetched successfully
 */
router.post("/list", getProductList);

/**
 * @swagger
 * /api/product/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product added successfully
 */
router.post("/create", addProduct);

/**
 * @swagger
 * /api/product/create-multiple:
 *   post:
 *     summary: Create multiple products
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Products added successfully
 */
router.post("/bulk-create", addMultipleProducts);

module.exports = router;
