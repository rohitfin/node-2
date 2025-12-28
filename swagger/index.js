// const swaggerJsdoc = require("swagger-jsdoc");
// const options = require("./options");
// const components = require("./components");

// const swaggerSpec = swaggerJsdoc({
//   definition: {
//     ...options,
//     components,
//     // security: [
//     //   {
//     //     bearerAuth: [],
//     //   },
//     // ],
//   },
//   apis: ["**/*.route.js"]
// });

// module.exports = swaggerSpec;

const swaggerJSDoc = require("swagger-jsdoc");
const m2s = require("mongoose-to-swagger");

const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");

const Product = require("../models/product.model");

module.exports = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Order API",
      version: "1.0.0",
    },

    servers: [{ url: "http://localhost:3000" }],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        Order: m2s(Order),
        OrderItem: m2s(OrderItem),
        Product: m2s(Product),

        ProductListRequest: {
          type: "object",
          properties: {
            name: { type: "string" },
            color: { type: "string" },
            price: { type: "number" },
            isActive: { type: "boolean" },
            page: { type: "number", example: 1 },
            limit: { type: "number", example: 10 },
          },
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },

  apis: ["./routes/*.js"],
});
