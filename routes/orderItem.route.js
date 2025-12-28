const express = require("express");
const router = express.Router();
const { getOrderItem, addOrderItem, getOrderItemList, getOrderItemDetail } = require("../controllers/orderItem.controller");

router.get("/", getOrderItem);

/**
 * @swagger
 * /api/order-item/create:
 *   post:
 *     summary: Add product to order
 *     tags: [Order Item]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 */
router.post("/create", addOrderItem);


/**
 * @swagger
 * /api/order-item/list:
 *   post:
 *     summary: Get list of order items
 *     tags: [Order Item]
 *     description: Returns list of order items based on filter. You can send empty body for all.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               orderId: "6747c62ec0f117fc359d651f"
 *               productId: "6747c62ec0f117fc359d777a"
 *     responses:
 *       200:
 *         description: List of order items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post("/list", getOrderItemList);


/**
 * @swagger
 * /api/order-item/detail:
 *   post:
 *     summary: Get order item detail
 *     tags: [Order Item]
 *     description: Fetch full detail of a single order item by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *             properties:
 *               _id:
 *                 type: string
 *                 description: Order Item ObjectId
 *                 example: "6767d9b45a8cc82a26fcc5e1"
 *     responses:
 *       200:
 *         description: Order item details found
 *       400:
 *         description: Invalid ID provided
 *       404:
 *         description: Order item not found
 */
router.post("/detail", getOrderItemDetail);

module.exports = router;
