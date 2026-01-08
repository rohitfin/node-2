const express = require("express");
const router = express.Router();
const {
  getOrder,
  addOrder,
  getOrderList,
  getOrderDetail,
  getMyOrders
} = require("../controllers/order.controller");

router.post("/", getOrder);
router.post("/create", addOrder);

/**
 * @swagger
 * /api/order/list:
 *   post:
 *     summary: get order
 *     tags: [Order Item]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 */
router.post("/list", getOrderList);
router.post("/detail", getOrderDetail);

router.post("/my-orders", getMyOrders);

module.exports = router;
