module.exports = {
  openapi: "3.0.0",
  info: {
    title: "User Management API",
    version: "1.0.0",
    description: "APIs for managing users"
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server"
    }
  ],
   components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
