require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db.connection");

const auth = require("./middlewares/auth.middleware");

const loginRoutes = require("./routes/login.route");
const logoutRoutes = require("./routes/logout.route");
const refreshAccessTokenRoutes = require("./routes/refreshAccessToken.route");

const userRoutes = require("./routes/user.route");
const productRoutes = require("./routes/product.route");
const orderRoutes = require("./routes/order.route");
const orderItemRoutes = require("./routes/orderItem.route");

const app = express();

// swagger
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");


// middleware
app.use(express.json());

// connect database
connectDB();

// swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// routes
// app.get("/", (req, res) => res.send("Hello world!"));
app.use("/api/auth/login", loginRoutes);
app.use("/api/auth/logout", logoutRoutes);
app.use("/api/auth/refresh-token", refreshAccessTokenRoutes);

app.use("/api/user", auth, userRoutes);
app.use("/api/product", auth, productRoutes);
app.use("/api/order", auth, orderRoutes);
app.use("/api/order-item", auth, orderItemRoutes);


// simple error handler (expand as needed)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", err: err.errorResponse });
});

const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`🚀 Server running localhost:${port}`);
})