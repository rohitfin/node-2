module.exports = {
  schemas: {
    /* ===================== BASE USER ===================== */
    User: {
      type: "object",
      properties: {
        id: {
          type: "string",
          example: "65a7bc91f1a2c3d4e5f67890",
        },
        name: {
          type: "string",
          example: "Alex",
        },
        email: {
          type: "string",
          example: "alex@gmail.com",
        },
        isActive: {
          type: "boolean",
          example: true,
        },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2025-01-10T12:30:00.000Z",
        },
      },
    },

    /* ===================== CREATE USER REQUEST ===================== */
    CreateUserRequest: {
      type: "object",
      required: ["name", "email", "mobile"],
      properties: {
        name: {
          type: "string",
          example: "Alex",
        },
        email: {
          type: "string",
          example: "alex@gmail.com",
        },
        mobile: {
          type: "number",
          example: 9876543210,
        },
      },
    },

    /* ===================== CREATE USER RESPONSE ===================== */
    CreateUserResponse: {
      type: "object",
      properties: {
        success: {
          type: "boolean",
          example: true,
        },
        message: {
          type: "string",
          example: "User created successfully",
        },
        data: {
          $ref: "#/components/schemas/User",
        },
      },
    },

    /* ===================== LIST USER REQUEST ===================== */
    UserListRequest: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "alex",
        },
        email: {
          type: "string",
          example: "gmail",
        },
        isActive: {
          type: "boolean",
          example: true,
        },
        page: {
          type: "integer",
          default: 1,
          example: 1,
        },
        limit: {
          type: "integer",
          default: 10,
          example: 10,
        },
        sort: {
          type: "string",
          enum: ["Ascending", "Descending"],
          default: "Descending",
          example: "Descending",
        },
      },
    },

    /* ===================== LIST USER RESPONSE ===================== */
    UserListResponse: {
      type: "object",
      properties: {
        success: {
          type: "boolean",
          example: true,
        },
        message: {
          type: "string",
          example: "User list fetched successfully",
        },
        meta: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              example: 1,
            },
            limit: {
              type: "integer",
              example: 10,
            },
            total: {
              type: "integer",
              example: 25,
            },
            totalPages: {
              type: "integer",
              example: 3,
            },
          },
        },
        data: {
          type: "array",
          items: {
            $ref: "#/components/schemas/User",
          },
        },
      },
    },

    /* ===================== COMMON ERROR RESPONSE ===================== */
    ErrorResponse: {
      type: "object",
      properties: {
        success: {
          type: "boolean",
          example: false,
        },
        message: {
          type: "string",
          example: "Server error",
        },
      },
    },
  },
};
