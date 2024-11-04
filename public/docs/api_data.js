define({ "api": [
  {
    "type": "get",
    "url": "/user/:id",
    "title": "get user details",
    "name": "userDetails",
    "group": "Admin-User",
    "version": "1.0.0",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "name",
            "description": "<p>description</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\" : false,\n  \"user\" : {\n    \"email\": \"myEmail@logic-square.com\",\n    \"phone\": \"00000000000\",\n    \"name\"  : {\n      \"first\":\"Jhon\",\n      \"last\" :\"Doe\"\n    }\n  }\n}",
          "type": "type"
        }
      ]
    },
    "filename": "routes/rest/adminUsers.js",
    "groupTitle": "Admin-User"
  },
  {
    "type": "post",
    "url": "/admin/students/bulk-upload",
    "title": "Bulk Create Students from CSV",
    "name": "BulkCreateStudents",
    "group": "Admin",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin authentication.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>The CSV file containing student data to be uploaded.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "className",
            "description": "<p>The name of the class where students will be enrolled.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "section",
            "description": "<p>The section of the class.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "academicYear",
            "description": "<p>The academic year for the enrollment.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message indicating the outcome of the operation.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "totalCreated",
            "description": "<p>The total number of students successfully created.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>The uploaded file is missing or not provided.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized to perform this action.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The specified class was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Some students failed to be created due to errors.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"No file uploaded.\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"Unauthorized. Only admins can upload student data.\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"Class not found.\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Some students failed to be created.\",\n  \"totalCreated\": 5,\n  \"totalFailed\": 2,\n  \"failedRecords\": [\n    {\n      \"student\": \"John Doe\",\n      \"error\": \"Email already exists.\"\n    },\n    {\n      \"student\": \"Jane Smith\",\n      \"error\": \"Phone number is invalid.\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/adminStudent.js",
    "groupTitle": "Admin"
  },
  {
    "type": "post",
    "url": "/createadmin/:id",
    "title": "Create a new Admin   (id of school)",
    "name": "CreateAdmin",
    "group": "Admin",
    "permission": [
      {
        "name": "SuperAdmin"
      }
    ],
    "description": "<p>This endpoint allows a super admin to create a new admin for a specific school.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the school to which the admin belongs (in URL parameter).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>The first name of the admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>The last name of the admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>The phone number of the admin (must be unique).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The email address of the admin (must be unique).</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address",
            "description": "<p>The address of the admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gender",
            "description": "<p>The gender of the admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>The date of birth of the admin (format: DD/MM/YYYY).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "profileImage",
            "description": "<p>The URL of the profile image of the admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "joinDate",
            "description": "<p>The join date of the admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "bankDetails",
            "description": "<p>The bank details of the admin (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "signature",
            "description": "<p>The digital signature of the admin.</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Unauthorized Access",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You are not superadmin\"\n}",
          "type": "json"
        },
        {
          "title": "Email or Phone Exists",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"message\": \"Email already in use, please provide a unique email\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid Date Format",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"message\": \"Invalid date of birth format. Use DD/MM/YYYY.\"\n}",
          "type": "json"
        },
        {
          "title": "Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"Error\": \"An error message\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/auth/index.js",
    "groupTitle": "Admin"
  },
  {
    "type": "delete",
    "url": "/admin/delete/:id",
    "title": "Delete superadmin can delete admin and admin can delete student and teacher",
    "name": "DeleteUser",
    "group": "Admin",
    "permission": [
      {
        "name": "SuperAdmin,admin"
      }
    ],
    "description": "<p>superadmin can delete admin and admin can delete student and teacher</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for authentication.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of  user to delete.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates if there was an error (true if an error occurred).</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Explanation of the error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized Access:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": true,\n  \"reason\": \"You are not authorized to delete an admin\"\n}",
          "type": "json"
        },
        {
          "title": "Admin Not Found:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": true,\n  \"reason\": \"Admin not found\"\n}",
          "type": "json"
        },
        {
          "title": "Internal Server Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"message\": \"Error details here\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Admin deleted successfully.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/auth/signup.js",
    "groupTitle": "Admin"
  },
  {
    "type": "post",
    "url": "/admin/find",
    "title": "Find Admins",
    "name": "FindAdmins",
    "group": "Admin",
    "description": "<p>SuperAdmin can search all admin details.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token  super admin access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "searchText",
            "description": "<p>Optional search text to filter teachers by <code>firstName</code>, <code>lastName</code>, <code>email</code>, <code>joinDate</code>,<code>gender</code> <code>phone</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pageNumber",
            "defaultValue": "1",
            "description": "<p>page number (start with 1) send within the params</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pageSize",
            "defaultValue": "10",
            "description": "<p>number of data send within the params</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"users\": [\n    {\n      \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n      \"firstName\": \"John\",\n      \"lastName\": \"Doe\",\n      \"email\": \"john.doe@example.com\",\n      \"phone\": \"1234567890\",\n      \"isActive\": true,\n      \"loginType\": \"admin\"\n    }\n  ],\n  \"usersCount\": 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "NoAdmins-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": true,\n  \"reason\": \"No admin found\"\n}",
          "type": "json"
        },
        {
          "title": "InternalServerError-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"reason\": \"Internal server error\"\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal server error.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/auth/signup.js",
    "groupTitle": "Admin"
  },
  {
    "type": "get",
    "url": "/admindetails/:id",
    "title": "Get admin by ID",
    "name": "GetAdminDetails",
    "group": "Admin",
    "permission": [
      {
        "name": "SuperAdmin"
      }
    ],
    "description": "<p>Fetch a specific admin's details by their ID.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token of SuperAdmin for authentication.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Admin's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"admin\": {\n    \"address\": {\n      \"city\": \"New York\",\n      \"country\": \"USA\",\n      \"locality\": \"Greenwood Avenue\",\n      \"pin\": \"10001\",\n      \"state\": \"NY\"\n    },\n    \"subject\": [],\n    \"_id\": \"6721d1c8d3ba636fe8102e4a\",\n    \"username\": \"Sumxyz686\",\n    \"firstName\": \"Suman\",\n    \"lastName\": \"Rana\",\n    \"email\": \"199921212sumanrana@gmail.com\",\n    \"accountType\": \"email\",\n    \"phone\": \"8371887686\",\n    \"gender\": \"Male\",\n    \"dob\": \"2018-02-28\",\n    \"loginType\": \"admin\",\n    \"isActive\": true,\n    \"isAdmin\": true,\n    \"joinDate\": \"Wed Oct 30 2024 06:27:20 GMT+0000 (Coordinated Universal Time)\",\n    \"bankAdded\": false,\n    \"_school\": \"6721d1c8d3ba636fe8102e48\",\n    \"isPaid\": false,\n    \"messagingEnabled\": false,\n    \"fullName\": \"Suman Rana\",\n    \"createdAt\": \"2024-10-30T06:27:20.850Z\",\n    \"updatedAt\": \"2024-10-30T06:27:20.850Z\",\n    \"__v\": 0,\n    \"id\": \"6721d1c8d3ba636fe8102e4a\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Status of the request (true if an error occurred).</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Reason for the error if the user is not a super admin.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized Access:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You are not superAdmin\"\n}",
          "type": "json"
        },
        {
          "title": "Internal Server Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"Error\": \"Some error message\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/auth/signup.js",
    "groupTitle": "Admin"
  },
  {
    "type": "post",
    "url": "/admins",
    "title": "Get all admins",
    "name": "GetAllAdmins",
    "group": "Admin",
    "permission": [
      {
        "name": "SuperAdmin"
      }
    ],
    "description": "<p>Fetch all admin users</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token of superAdmin for authentication.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pageNumber",
            "defaultValue": "1",
            "description": "<p>page number (start with 1) send within the params</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pageSize",
            "defaultValue": "10",
            "description": "<p>number of data send within the params</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"admins\": [\n    {\n      \"_id\": \"61234abcd5678ef901234567\",\n      \"name\": \"John Doe\",\n      \"email\": \"john.doe@example.com\",\n      \"loginType\": \"admin\",\n      \"createdAt\": \"2024-09-30T12:30:45.123Z\",\n      \"updatedAt\": \"2024-10-01T14:22:05.456Z\"\n    },\n    {\n      \"_id\": \"62345bcde6789fg012345678\",\n      \"name\": \"Jane Smith\",\n      \"email\": \"jane.smith@example.com\",\n      \"loginType\": \"admin\",\n      \"createdAt\": \"2024-08-20T09:45:15.123Z\",\n      \"updatedAt\": \"2024-10-01T11:10:05.789Z\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Status of the request (true if an error occurred).</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Reason for the error if the user is not a super admin.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized Access:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You are not superAdmin\"\n}",
          "type": "json"
        },
        {
          "title": "Internal Server Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"Error\": \"Some error message\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/auth/signup.js",
    "groupTitle": "Admin"
  },
  {
    "type": "put",
    "url": "/admin/update/:id",
    "title": "Update users by superAdmin and admin",
    "name": "UpdateAdminProfile",
    "group": "Admin",
    "version": "1.0.0",
    "permission": [
      {
        "name": "superadmin,admin"
      }
    ],
    "description": "<p>This endpoint allows an admin to update their profile details, such as first name, last name, and phone number.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for authorization.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstName",
            "description": "<p>The new first name of user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "lastName",
            "description": "<p>The new last name of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "phone",
            "description": "<p>The new phone number of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>The new email of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "address",
            "description": "<p>The new address of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "gender",
            "description": "<p>Gender of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "dob",
            "description": "<p>The DOB of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "joinDate",
            "description": "<p>Join date of the user (ISO format).</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "leaveDate",
            "description": "<p>Leave date of the user (ISO format).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "_school",
            "description": "<p>School reference of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "admissionYear",
            "description": "<p>Admission year of the user (for students).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "rollNo",
            "description": "<p>Roll number of the user (for students).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether the request encountered an error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message indicating the profile was updated.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Admin profile updated successfully.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>True if the user is not an admin or the admin was not found.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>True if there was a server error.</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message explaining the failure reason.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response (Admin not found):",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"Admin not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (Not admin):",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You are not admin\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (Server error):",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"message\": \"An unexpected error occurred\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/auth/index.js",
    "groupTitle": "Admin"
  },
  {
    "type": "post",
    "url": "admin/students/view-students",
    "title": "Admin will View All Students",
    "name": "ViewAllStudents",
    "group": "Admin",
    "version": "1.0.0",
    "description": "<p>Retrieves all teachers belonging to the school</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "pageNo",
            "defaultValue": "1",
            "description": "<p>The page number to retrieve (defaults to 1 if not provided).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "skipLimit",
            "defaultValue": "20",
            "description": "<p>The number of students to return per page (defaults to 20 if not provided).</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"students\": [\n    {\n      \"_id\": \"670504c7cd2223b01699c6b1\",\n      \"username\": \"JunSpr385\",\n      \"firstName\": \"June\",\n      \"lastName\": \"David\",\n      \"profileImage\": \"public/docsimg/ProfilePic.jpeg\",\n      \"email\": \"june123@gmail.com\",\n      \"phone\": \"9080264385\",\n      \"gender\": \"Female\",\n      \"admissionYear\": \"2024\",\n      \"dob\": \"1996-07-12\",\n      \"rollNo\": \"R003\",\n      \"_class\": {\n        \"name\": \"10\",\n        \"section\": \"A\"\n      }\n    },\n    {\n      \"_id\": \"67052d954cbe69ed12657f76\",\n      \"username\": \"MriSpr246\",\n      \"firstName\": \"Mrinal\",\n      \"lastName\": \"Mohan\",\n      \"profileImage\": \"public/docsimg/ProfilePic.jpeg\",\n      \"email\": \"mbera829@gmail.com\",\n      \"phone\": \"9002550246\",\n      \"gender\": \"Male\",\n      \"admissionYear\": \"2024\",\n      \"dob\": \"2010-05-02\",\n      \"rollNo\": \"R001\",\n      \"_class\": {\n        \"name\": \"10\",\n        \"section\": \"A\"\n      }\n    }\n  ],\n  \"totalStudents\": 2\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAdmin",
            "description": "<p>You are not an admin.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal server error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Only admins can view student details\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Internal server error\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/adminStudent.js",
    "groupTitle": "Admin"
  },
  {
    "type": "post",
    "url": "attendance/checkin",
    "title": "Check In",
    "name": "CheckIn",
    "group": "Attendance",
    "version": "1.0.0",
    "description": "<p>Allows a teacher to check in at the school if they are within a 5km radius. If they have already checked in today, they will not be allowed to check in again.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token of the teacher.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": false,
            "field": "coordinates",
            "description": "<p>The current location of the teacher in the format [longitude, latitude].</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates if there was an error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success or error message.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "checkIn",
            "description": "<p>The check-in object containing details of the check-in.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Checked in successfully\",\n  \"checkIn\": {\n    \"_school\": \"school_id\",\n    \"teachers\": [\n      {\n        \"_teacher\": \"teacher_id\",\n        \"time\": \"2024-10-08T10:00:00.000Z\",\n        \"remark\": \"Checked in successfully\"\n      }\n    ],\n    \"checkinDate\": \"2024-10-08T10:00:00.000Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TeacherNotFound",
            "description": "<p>The teacher was not found in the system.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SchoolNotFound",
            "description": "<p>The school associated with the teacher was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "OutOfRadius",
            "description": "<p>The teacher is outside the 5km radius from the school.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AlreadyCheckedIn",
            "description": "<p>The teacher has already checked in today.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"message\": \"You are outside the 5km radius from the school.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"message\": \"Internal server error.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/attendance.js",
    "groupTitle": "Attendance"
  },
  {
    "type": "get",
    "url": "/attendance/absent",
    "title": "Get Absent Students",
    "name": "GetAbsentStudents",
    "group": "Attendance",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin or teacher access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_class",
            "description": "<p>The ID of the class for which absent students are being retrieved.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>The date for which the attendance is checked (in ISO format).</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"absentStudents\": [\n    {\n      \"_id\": \"60c72b2f9b1e8a3b4c3e4f6b\",\n      \"roll\": \"001\"\n    },\n    {\n      \"_id\": \"60c72b2f9b1e8a3b4c3e4f6c\",\n      \"roll\": \"002\"\n    }\n  ],\n  \"totalAbsent\": 2\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true).</p>"
          },
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "Error",
            "description": "<p>Detailed error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"Error\": \"Internal Server Error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/attendance.js",
    "groupTitle": "Attendance"
  },
  {
    "type": "get",
    "url": "/attendance/percentage/id",
    "title": "Student_Attendance_Percentage",
    "name": "GetStudentAttendancePercentage",
    "group": "Attendance",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "studentId",
            "description": "<p>The ID of the student for whom the attendance percentage is being requested.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "student.id",
            "description": "<p>The unique ID of the student.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "student.name",
            "description": "<p>The full name of the student.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "student.rollNo",
            "description": "<p>The roll number of the student.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "student.attendancePercentage",
            "description": "<p>The attendance percentage of the student.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"student\": {\n    \"id\": \"60c72b2f9b1e8a3b4c3e4f6b\",\n    \"name\": \"John Doe\",\n    \"rollNo\": \"001\",\n    \"attendancePercentage\": \"75.00%\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true).</p>"
          },
          {
            "group": "404",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message for not found student or class.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true).</p>"
          },
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Detailed error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Student not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Internal Server Error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/attendance.js",
    "groupTitle": "Attendance"
  },
  {
    "type": "get",
    "url": "/attendance/checkins",
    "title": "Get Teacher Check-in Records",
    "name": "GetTeacherCheckIns",
    "group": "Attendance",
    "permission": [
      {
        "name": "Teacher"
      }
    ],
    "description": "<p>This endpoint returns the check-in attendance records of a teacher, showing which days they were present or absent.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for teacher authentication.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates if the operation was successful (false for success).</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "attendance",
            "description": "<p>Array of attendance records for the teacher.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "attendance.date",
            "description": "<p>The date of the check-in.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "attendance.present",
            "description": "<p>Whether the teacher was present on that date.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "attendance.time",
            "description": "<p>The exact check-in time if the teacher was present, null otherwise.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"attendance\": [\n    {\n      \"date\": \"2024-10-01T00:00:00.000Z\",\n      \"present\": true,\n      \"time\": \"2024-10-01T09:15:00.000Z\"\n    },\n    {\n      \"date\": \"2024-10-02T00:00:00.000Z\",\n      \"present\": false,\n      \"time\": null\n    },\n    {\n      \"date\": \"2024-10-03T00:00:00.000Z\",\n      \"present\": true,\n      \"time\": \"2024-10-03T08:45:00.000Z\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates if the operation was successful (true for failure).</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Description of the error that occurred.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"message\": \"Internal server error.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/attendance.js",
    "groupTitle": "Attendance"
  },
  {
    "type": "post",
    "url": "/markattendance",
    "title": "Mark Student Attendance",
    "name": "MarkAttendance",
    "group": "Attendance",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for teacher access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_class",
            "description": "<p>The ID of the class for which attendance is being marked.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "studentIds",
            "description": "<p>The ID of the students:array format(presentIds)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"message\": \"Student has been marked present\",\n  \"attendanceRecord\":[\n  {\n    \"_id\": \"60c72b2f9b1e8a3b4c3e4f6c\",\n    \"rollNo\":\"1\",\n    \"isPresent\": true,\n  },\n {\n    \"_id\": \"60c72b2f9b1e8a3b4c3e4fcd\",\n    \"rollNo\":\"2\",\n    \"isPresent\": false,\n  }\n  ]\n\"date\": \"2024-10-26T18:30:00.000Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/attendance.js",
    "groupTitle": "Attendance"
  },
  {
    "type": "put",
    "url": "/attendance/update",
    "title": "Update Attendance",
    "name": "UpdateAttendance",
    "group": "Attendance",
    "permission": [
      {
        "name": "admin, teacher"
      }
    ],
    "description": "<p>Allows both teachers and admins to update attendance for a class. The update can be for the current day or a previous day. The action can either add a student to the present list or remove them.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_class",
            "description": "<p>The ID of the class.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "studentId",
            "description": "<p>The ID of the student whose attendance is being updated.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "action",
            "description": "<p>The action to perform, either &quot;add&quot; (to mark as present) or &quot;remove&quot; (to mark as absent).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "date",
            "description": "<p>The date for which attendance is being updated (optional, defaults to today).</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request Example:",
        "content": "{\n  \"_class\": \"652def8a7a39a61056fb8654\",\n  \"studentId\": \"652dc8b95a36b92434b54e88\",\n  \"action\": \"add\",\n  \"date\": \"2024-10-01\"\n}",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (false means success).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The success message describing the action performed.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "attendance",
            "description": "<p>The updated attendance record.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "{\n  \"error\": false,\n  \"message\": \"Attendance for October 1st 2024 successfully updated. Student added to attendance\",\n  \"attendance\": {\n    \"_id\": \"652def8a7a39a61056fb8654\",\n    \"_class\": \"652def8a7a39a61056fb8654\",\n    \"presentIds\": [\"652dc8b95a36b92434b54e88\"],\n    \"date\": \"2024-10-01T00:00:00.000Z\",\n    \"_school\": \"652ce46b5b9634070e541dbc\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true means failure).</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>A description of the error that occurred.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error Response (Student Not Assigned):",
          "content": "{\n  \"error\": true,\n  \"reason\": \"Student is not assigned to this class\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response (Unauthorized User):",
          "content": "{\n  \"error\": true,\n  \"reason\": \"You are not authorized to update attendance\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response (Invalid Action):",
          "content": "{\n  \"error\": true,\n  \"reason\": \"Invalid action provided. Use 'add' or 'remove'\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/attendance.js",
    "groupTitle": "Attendance"
  },
  {
    "type": "post",
    "url": "/attendance/viewattendance",
    "title": "View Attendance Records",
    "name": "ViewAttendance",
    "group": "Attendance",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for student access.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"attendanceStatus\": [\n    {\n      \"_id\":\"attendanceId\"\n      \"date\": \"2024-10-01T00:00:00.000Z\",\n      \"isPresent\": true\n    },\n    {\n      \"_id\":\"attendanceId\"\n      \"date\": \"2024-10-02T00:00:00.000Z\",\n      \"isPresent\": false\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true).</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Detailed error message.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true).</p>"
          },
          {
            "group": "403",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Error message for not being a student.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true).</p>"
          },
          {
            "group": "404",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message indicating no attendance records were found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"You are not a student\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": false,\n  \"message\": \"No attendance records found.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"Internal Server Error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/attendance.js",
    "groupTitle": "Attendance"
  },
  {
    "type": "post",
    "url": "/forgotpassword",
    "title": "Request to get password reset link in mail",
    "name": "forgotPassword",
    "group": "Auth",
    "version": "1.0.0",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "handle",
            "description": "<p>(email)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"handle\" : \"myEmail@logic-square.com\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "name",
            "description": "<p>description</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\" : false,\n    \"handle\" : \"myEmail@logic-square.com\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/auth/password.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/resetpassword",
    "title": "Request to set a new password",
    "name": "resetPassword",
    "group": "Auth",
    "version": "1.0.0",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"email\" : \"myEmail@logic-square.com\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "name",
            "description": "<p>description</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\" : false,\n    \"email\" : \"myEmail@logic-square.com\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/auth/password.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/login",
    "title": "User login",
    "name": "userLogin",
    "group": "Auth",
    "version": "1.0.0",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "handle",
            "description": "<p>(mobile / email / username)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>user's password</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"handle\" : \"myEmail@logic-square.com\",\n    \"password\" : \"myNewPassword\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "name",
            "description": "<p>description</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\" : false,\n    \"handle\" : \"myEmail@logic-square.com\",\n    \"token\": \"authToken.abc.xyz\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/auth/index.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/class/assignclass",
    "title": "Assign Class to Teacher",
    "name": "AssignClass",
    "group": "Class",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "_class",
            "description": "<p>ID of the class to be assigned.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "_teacher",
            "description": "<p>ID of the teacher to whom the class is being assigned.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"message\": \"Class successfully assigned to teacher\",\n  \"attendance\": {\n    \"_id\": \"60d5f60c9b4d7635e8aebaf6\",\n    \"_class\": \"60d5f60c9b4d7635e8aebaf7\",\n    \"_school\": \"60d5f60c9b4d7635e8aebaf5\",\n    \"_teacher\": \"60d5f60c9b4d7635e8aebaf8\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAdmin",
            "description": "<p>You are not an admin.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TeacherNotFound",
            "description": "<p>The specified teacher does not exist.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ClassAlreadyAssigned",
            "description": "<p>This class is already assigned to the specified teacher.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal server error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"You are not an admin\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Teacher not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"This class is already assigned to this teacher\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Internal server error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminClass.js",
    "groupTitle": "Class"
  },
  {
    "type": "post",
    "url": "/class/create",
    "title": "Create a New Class",
    "name": "CreateClass",
    "group": "Class",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the class.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "section",
            "description": "<p>Section of the class.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "academicYear",
            "description": "<p>Academic year for the class.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"classResponse\": {\n    \"_id\": \"60d5f60c9b4d7635e8aebaf6\",\n    \"name\": \"Class 10\",\n    \"section\": \"A\",\n    \"academicYear\": 2024,\n    \"_school\": \"60d5f60c9b4d7635e8aebaf5\"\n  },\n  \"name_section\": \"Class 10A\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ClassAlreadyExists",
            "description": "<p>Class with the same name and section already exists.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>You are not authorized to create a class.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal server error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Class with this name and section already exists.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"You are not admin\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"error\": \"Internal server error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminClass.js",
    "groupTitle": "Class"
  },
  {
    "type": "get",
    "url": "/admin/classsection",
    "title": "classes Fetch all classes and section for a school",
    "name": "Fetch_All_Classes_Section_For_School",
    "group": "Class",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token of the admin.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the school for which classes are to be fetched.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (false).</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "classList",
            "description": "<p>Array of classes in the format: [{ _id, id, nameWiseSection }]</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"classList\": [\n    {\n      \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n      \"id\": \"60d5f60c9b4d7635e8aebaf7\",\n      \"nameWiseSection\": \"10 - A\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAdmin",
            "description": "<p>You are not an admin.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal server error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"You are not an admin\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"Internal server error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminStudent.js",
    "groupTitle": "Class"
  },
  {
    "type": "get",
    "url": "/class/find",
    "title": "Search Classes",
    "name": "FindClasses",
    "group": "Class",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Name of the class to search for.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "section",
            "description": "<p>Section of the class to search for.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "academicYear",
            "description": "<p>Academic year to filter classes.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (false).</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>Array of classes that match the search criteria.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "classCounts",
            "description": "<p>Total number of classes that match the criteria.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"data\": [\n    {\n      \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n      \"name\": \"Mathematics\",\n      \"section\": \"A\",\n      \"academicYear\": \"2023-2024\"\n    }\n  ],\n  \"classCounts\": 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAdmin",
            "description": "<p>You are not an admin.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoClassesFound",
            "description": "<p>No classes found for the given criteria.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal server error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"You are not an admin\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"No classes found for the given criteria.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"Internal server error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminClass.js",
    "groupTitle": "Class"
  },
  {
    "type": "get",
    "url": "/class/getallassignclass",
    "title": "Get All Assigned Classes",
    "name": "GetAllAssignedClasses",
    "group": "Class",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for teacher access.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (false).</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "assignedClasses",
            "description": "<p>List of classes assigned to the teacher.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "assignedClasses._id",
            "description": "<p>Class ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "assignedClasses.name",
            "description": "<p>Name of the class.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "assignedClasses.section",
            "description": "<p>Section of the class.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "assignedClasses.academicYear",
            "description": "<p>Academic year of the class.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"assignedClasses\": [\n    {\n      \"_id\": \"60d5f60c9b4d7635e8aebaf6\",\n      \"name\": \"Class 10\",\n      \"section\": \"A\",\n      \"academicYear\": 2024\n    },\n    {\n      \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n      \"name\": \"Class 12\",\n      \"section\": \"B\",\n      \"academicYear\": 2024\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"You are not teacher\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"No assigned classes found for this teacher\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"Error\": \"Internal server error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/class.js",
    "groupTitle": "Class"
  },
  {
    "type": "get",
    "url": "/class/get/:id",
    "title": "Get Class by ID",
    "name": "GetClassById",
    "group": "Class",
    "permission": [
      {
        "name": "AuthenticatedUser"
      }
    ],
    "description": "<p>This endpoint retrieves a class by its ID. Only authenticated users who belong to the same school can access this resource.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique identifier of the class to retrieve (passed as a URL parameter).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data._id",
            "description": "<p>The ID of the class.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.name",
            "description": "<p>The name of the class.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.section",
            "description": "<p>The section of the class.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.academicYear",
            "description": "<p>The academic year of the class.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.totalStudents",
            "description": "<p>Total number of students in the class.</p>"
          },
          {
            "group": "Success 200",
            "type": "ObjectId",
            "optional": false,
            "field": "data._schedule",
            "description": "<p>Reference to the schedule object.</p>"
          },
          {
            "group": "Success 200",
            "type": "ObjectId",
            "optional": false,
            "field": "data._school",
            "description": "<p>Reference to the school object.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates an error occurred (true means error).</p>"
          },
          {
            "group": "404",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message stating that the class was not found.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates an error occurred (true means error).</p>"
          },
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Detailed error message for server-side issues.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for user authentication.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminClass.js",
    "groupTitle": "Class"
  },
  {
    "type": "post",
    "url": "/class/students",
    "title": "Get Class Students",
    "name": "GetClassStudents",
    "group": "Class",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "classname",
            "description": "<p>The name of the class.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "section",
            "description": "<p>The section of the class (e.g., &quot;A&quot;).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "academicYear",
            "description": "<p>The academic year of the class (e.g., &quot;2024&quot;).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schoolId",
            "description": "<p>The ID of the school (required for super admins).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pageNumber",
            "defaultValue": "1",
            "description": "<p>page number (start with 1) send within the params</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pageSize",
            "defaultValue": "10",
            "description": "<p>number of data send within the params</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"students\": [\n    {\n      \"_id\": \"670cf6badbb09a7c2b2af9b2\",\n      \"firstName\": \"Pratik\",\n      \"lastName\": \"Sahu\",\n      \"email\": \"pk2181121@gmail.com\",\n      \"phone\": \"09981240192\",\n      \"gender\": \"Male\",\n      \"currentYear\": \"2024\"\n    }\n  ],\n  \"attendancePercentage\": [\n    {\n      \"_Id\": \"670cf6badbb09a7c2b2af9b2\",\n      \"percentage\": \"85.71\"\n    }\n  ],\n  \"classId\": \"670cf194dbb09a7c2b2af991\",\n  \"totalStudents\": 2\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/attendance.js",
    "groupTitle": "Class"
  },
  {
    "type": "post",
    "url": "/leave/find",
    "title": "Find Teacher Leaves",
    "name": "FindTeacherLeaves",
    "group": "Leaves",
    "permission": [
      {
        "name": "Teacher"
      }
    ],
    "description": "<p>This endpoint allows teachers to retrieve their leave requests with optional filtering by leave type, reason, or status.</p>",
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": true,
        "field": "searchText",
        "description": "<p>Optional search text to filter leaves based on leave type, reason, or status.</p>"
      },
      {
        "group": "Body",
        "type": "Number",
        "optional": true,
        "field": "pageNumber",
        "defaultValue": "1",
        "description": "<p>The page number for pagination.</p>"
      },
      {
        "group": "Body",
        "type": "Number",
        "optional": true,
        "field": "pageSize",
        "defaultValue": "10",
        "description": "<p>The number of records per page for pagination.</p>"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates if there was an error (true if there was an error).</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>The reason for the error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized Access",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": true,\n  \"reason\": \"Unauthorized access. Only teachers can view this data.\"\n}",
          "type": "json"
        },
        {
          "title": "No Leaves Found",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": true,\n  \"reason\": \"No leaves found\"\n}",
          "type": "json"
        },
        {
          "title": "Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"reason\": \"Error message\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/leave.js",
    "groupTitle": "Leaves"
  },
  {
    "type": "post",
    "url": "/leave/get",
    "title": "Get Leaves",
    "description": "<p>Fetches leave applications for teachers or all teachers by admin. Teachers can filter their leaves based on leave type and status, while admins can view leaves for specific teachers or filter by leave type and status.</p>",
    "version": "1.0.0",
    "group": "Leaves",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for authentication</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "leaveType",
            "description": "<p>Filter leaves by leave type (e.g., CL, SL, PL).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>Filter leaves by status (e.g., pending, approved, etc.).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "teacherId",
            "description": "<p>Filter by a specific teacher's ID (Admin Only).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isHalfDay",
            "description": "<p>Filter by HalfDay</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"leaves\": [\n    {\n      \"_id\": \"leaveId\",\n      \"_school\": \"schoolId\",\n      \"_teacher\": \"teacherId\",\n      \"leaveType\": \"CL\",\n      \"startDate\": \"2024-11-01T00:00:00Z\",\n      \"endDate\": \"2024-11-05T00:00:00Z\",\n      \"reason\": \"Family function\",\n      \"status\": \"approved\",\n      \"appliedDate\": \"2024-10-25T00:00:00Z\",\n      \"approvedBy\": \"approverId\"\n    }\n    // More leave objects...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Bad Request Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You do not have permission\"\n}",
          "type": "json"
        },
        {
          "title": "Internal Server Error Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"message\": \"Error message describing the problem\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/leave.js",
    "groupTitle": "Leaves",
    "name": "PostLeaveGet"
  },
  {
    "type": "post",
    "url": "/teacher/leave",
    "title": "Apply Leave",
    "description": "<p>Allows teachers to apply for leave by providing the necessary details.</p>",
    "version": "1.0.0",
    "group": "Leaves",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for authentication</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "leaveType",
            "description": "<p>Type of leave (CL, PL, SL).</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "startDate",
            "description": "<p>Start date of the leave (required).</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "endDate",
            "description": "<p>End date of the leave (required).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Reason for the leave (required).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "isHalfDay",
            "description": "<p>Indicates if the leave is a half day.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 201 Created\n{\n  \"error\": false,\n  \"message\": \"Leave applied successfully\",\n  \"leave\": {\n    \"_id\": \"leaveId\",\n    \"_school\": \"schoolId\",\n    \"_teacher\": \"teacherId\",\n    \"leaveType\": \"CL\",\n    \"startDate\": \"2024-11-01T00:00:00Z\",\n    \"endDate\": \"2024-11-05T00:00:00Z\",\n    \"reason\": \"Family function\",\n    \"isHalfDay\": false,\n    \"appliedDate\": \"2024-10-25T00:00:00Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Bad Request Response (Missing startDate):",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"startDate is required\"\n}",
          "type": "json"
        },
        {
          "title": "Bad Request Response (Invalid leaveType):",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"message\": \"Invalid leave type. Must be one of CL, PL, or SL\"\n}",
          "type": "json"
        },
        {
          "title": "Internal Server Error Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"message\": \"Error message describing the problem\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example Request:",
        "content": "POST /api/leaves/apply\nAuthorization: Bearer <token>\n{\n  \"leaveType\": \"CL\",\n  \"startDate\": \"2024-11-01\",\n  \"endDate\": \"2024-11-05\",\n  \"reason\": \"Family function\",\n  \"isHalfDay\": false\n}",
        "type": "http"
      }
    ],
    "filename": "routes/rest/leave.js",
    "groupTitle": "Leaves",
    "name": "PostTeacherLeave"
  },
  {
    "type": "post",
    "url": "/message/createthread/:userId",
    "title": "Create ChatThread",
    "name": "CreateChatThread",
    "group": "Message",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>The ID of the user with whom the chat thread is being created.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (false for success).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Confirmation message about the creation of the chat thread.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "thread",
            "description": "<p>The created chat thread object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "thread._id",
            "description": "<p>The unique ID of the chat thread.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "thread._participants",
            "description": "<p>Array of participant IDs in the chat thread.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"message\": \"Chat thread created successfully.\",\n  \"thread\": {\n    \"_id\": \"60c72b2f9b1e8a3b4c3e4f6f\",\n    \"_participants\": [\n      \"60c72b2f9b1e8a3b4c3e4f6a\",\n      \"60c72b2f9b1e8a3b4c3e4f6b\"\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "403": [
          {
            "group": "403",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true).</p>"
          },
          {
            "group": "403",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The reason for the error (e.g., &quot;You are not an admin.&quot;).</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true).</p>"
          },
          {
            "group": "404",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The reason for the error (e.g., &quot;User not found.&quot;).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"User not found.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/message.js",
    "groupTitle": "Message"
  },
  {
    "type": "get",
    "url": "/message/thread/:id",
    "title": "Get ChatThread",
    "name": "GetChatThread",
    "group": "Message",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the chat thread to be retrieved.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (false for success).</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "thread",
            "description": "<p>The retrieved chat thread object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "thread._id",
            "description": "<p>The unique ID of the chat thread.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "thread._participants",
            "description": "<p>Array of participant IDs in the chat thread.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "thread.createdAt",
            "description": "<p>The date when the chat thread was created.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"thread\": {\n    \"_id\": \"60c72b2f9b1e8a3b4c3e4f6f\",\n    \"_participants\": [\n      \"60c72b2f9b1e8a3b4c3e4f6a\",\n      \"60c72b2f9b1e8a3b4c3e4f6b\"\n    ],\n    \"createdAt\": \"2023-07-20T10:00:00Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true).</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>The reason for the error (e.g., &quot;Thread not found&quot;).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"Thread not found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/message.js",
    "groupTitle": "Message"
  },
  {
    "type": "post",
    "url": "/message/permission",
    "title": "MessagingPermission",
    "name": "MessagingPermission",
    "group": "Message",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>The ID of the user for whom messaging permission is being updated.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "enable",
            "description": "<p>Flag to enable or disable messaging for the user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"userId\": \"60c72b2f9b1e8a3b4c3e4f6e\",\n  \"enable\": true\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (false for success).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Confirmation message about the update.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>The updated user object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user._id",
            "description": "<p>The unique ID of the user.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "user.messagingEnabled",
            "description": "<p>The messaging permission status for the user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"message\": \"Messaging has been enabled for user 60c72b2f9b1e8a3b4c3e4f6e.\",\n  \"user\": {\n    \"_id\": \"60c72b2f9b1e8a3b4c3e4f6e\",\n    \"messagingEnabled\": true\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "403": [
          {
            "group": "403",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true).</p>"
          },
          {
            "group": "403",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The reason for the error (e.g., &quot;You are not an admin.&quot;).</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true).</p>"
          },
          {
            "group": "404",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The reason for the error (e.g., &quot;User not found.&quot;).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"User not found.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/message.js",
    "groupTitle": "Message"
  },
  {
    "type": "get",
    "url": "/message/readmessage/:id",
    "title": "Read Messages",
    "name": "ReadMessages",
    "group": "Message",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for user access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the chat thread to read messages from.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"messages\": [\n    {\n      \"_id\": \"60c72b2f9b1e8a3b4c3e4f6f\",\n      \"_from\": \"60c72b2f9b1e8a3b4c3e4f6a\",\n      \"_to\": \"60c72b2f9b1e8a3b4c3e4f6b\",\n      \"text\": \"Hello!\",\n      \"createdAt\": \"2024-10-01T10:00:00Z\",\n      \"isRead\": true\n    },\n    // More messages...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true).</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>The reason for the error (e.g., &quot;No Thread Found&quot;).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"No Thread Found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/message.js",
    "groupTitle": "Message"
  },
  {
    "type": "post",
    "url": "/message/sendmessage",
    "title": "Send Message",
    "name": "sendMessage",
    "group": "Message",
    "version": "1.0.0",
    "permission": [
      {
        "name": "User"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for user access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>The content of the message to be sent.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_to",
            "description": "<p>The ID of the user to whom the message is being sent.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"text\": \"Hello, how are you?\",\n  \"_to\": \"60c72b2f9b1e8a3b4c3e4f6e\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "messageDetails._from",
            "description": "<p>The ID of the sender.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "messageDetails._to",
            "description": "<p>The ID of the receiver.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "messageDetails.text",
            "description": "<p>The text content of the message.</p>"
          },
          {
            "group": "200",
            "type": "Date",
            "optional": false,
            "field": "messageDetails.createdAt",
            "description": "<p>The timestamp when the message was created.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"message\": \"Message sent successfully.\",\n  \"messageDetails\": {\n    \"_id\": \"60c72b2f9b1e8a3b4c3e4f6f\",\n    \"_from\": \"60c72b2f9b1e8a3b4c3e4f6a\",\n    \"_to\": \"60c72b2f9b1e8a3b4c3e4f6b\",\n    \"text\": \"Hello, how are you?\",\n    \"createdAt\": \"2024-10-04T12:00:00.000Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (true).</p>"
          },
          {
            "group": "404",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Reason for the error (e.g., &quot;Sender not found.&quot;, &quot;Receiver not found.&quot;).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Receiver not found.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/message.js",
    "groupTitle": "Message"
  },
  {
    "type": "post",
    "url": "/notice",
    "title": "3.0 Create a new Notice",
    "name": "createNotice",
    "group": "Notice",
    "permission": [
      {
        "name": "Admin/Teacher"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "title",
            "description": "<p>Notice title</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>Notice description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "noticeType",
            "description": "<p>Notice noticeType <code>enum=[&quot;student&quot;, &quot;teacher&quot;, &quot;general&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isUrgent",
            "defaultValue": "false",
            "description": "<p>Notice isUrgent</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "postedBy",
            "description": "<p>Notice postedBy</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "expireDate",
            "description": "<p>Notice expireDate</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "attachments",
            "description": "<p>Notice attachments</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "attachments.url",
            "description": "<p>Notice attachments.url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "attachments.fileName",
            "description": "<p>Notice attachments.fileName</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "defaultValue": "true",
            "description": "<p>Notice isActive</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "postedDate",
            "description": "<p>Notice postedDate</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "signatureOfTeacherUrl",
            "description": "<p>Notice signatureOfTeacherUrl</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    notice: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminNotices.js",
    "groupTitle": "Notice"
  },
  {
    "type": "delete",
    "url": "/notice/:id",
    "title": "5.0 Delete a Notice by _id",
    "name": "deleteNotice",
    "group": "Notice",
    "permission": [
      {
        "name": "Admin/Teacher"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Notice to delete</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    error : false,\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminNotices.js",
    "groupTitle": "Notice"
  },
  {
    "type": "put",
    "url": "/notice/:id",
    "title": "4.0 Edit a Notice by _id",
    "name": "editNotice",
    "group": "Notice",
    "permission": [
      {
        "name": "Admin/Teacher"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Notice to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "title",
            "description": "<p>Notice title</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>Notice description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "noticeType",
            "description": "<p>Notice noticeType <code>enum=[&quot;student&quot;, &quot;teacher&quot;, &quot;general&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isUrgent",
            "defaultValue": "false",
            "description": "<p>Notice isUrgent</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "postedBy",
            "description": "<p>Notice postedBy</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "expireDate",
            "description": "<p>Notice expireDate</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "attachments",
            "description": "<p>Notice attachments</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "attachments.url",
            "description": "<p>Notice attachments.url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "attachments.fileName",
            "description": "<p>Notice attachments.fileName</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "defaultValue": "true",
            "description": "<p>Notice isActive</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "postedDate",
            "description": "<p>Notice postedDate</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "signatureOfTeacherUrl",
            "description": "<p>Notice signatureOfTeacherUrl</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    notice: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminNotices.js",
    "groupTitle": "Notice"
  },
  {
    "type": "get",
    "url": "/notices",
    "title": "1.0 Fetch all the Notices",
    "name": "fetchNotices",
    "group": "Notice",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    notices: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminNotices.js",
    "groupTitle": "Notice"
  },
  {
    "type": "get",
    "url": "/notice/:id",
    "title": "2.0 Find a Notice by _id",
    "name": "getNotice",
    "group": "Notice",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Notice to find</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    notice: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminNotices.js",
    "groupTitle": "Notice"
  },
  {
    "type": "post",
    "url": "/schedule",
    "title": "3.0 Create a new Schedule",
    "name": "createSchedule",
    "group": "Schedule",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "routine",
            "description": "<p>Schedule routine</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d1.first.subjectName",
            "description": "<p>Schedule routine.d1.first.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.first.startTime",
            "description": "<p>Schedule routine.d1.first.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.first.endTime",
            "description": "<p>Schedule routine.d1.first.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d1.first._teacher",
            "description": "<p>Schedule routine.d1.first._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d1.second.subjectName",
            "description": "<p>Schedule routine.d1.second.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.second.startTime",
            "description": "<p>Schedule routine.d1.second.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.second.endTime",
            "description": "<p>Schedule routine.d1.second.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d1.second._teacher",
            "description": "<p>Schedule routine.d1.second._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d1.third.subjectName",
            "description": "<p>Schedule routine.d1.third.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.third.startTime",
            "description": "<p>Schedule routine.d1.third.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.third.endTime",
            "description": "<p>Schedule routine.d1.third.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d1.third._teacher",
            "description": "<p>Schedule routine.d1.third._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d1.fourth.subjectName",
            "description": "<p>Schedule routine.d1.fourth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.fourth.startTime",
            "description": "<p>Schedule routine.d1.fourth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.fourth.endTime",
            "description": "<p>Schedule routine.d1.fourth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d1.fourth._teacher",
            "description": "<p>Schedule routine.d1.fourth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d1.fifth.subjectName",
            "description": "<p>Schedule routine.d1.fifth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.fifth.startTime",
            "description": "<p>Schedule routine.d1.fifth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.fifth.endTime",
            "description": "<p>Schedule routine.d1.fifth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d1.fifth._teacher",
            "description": "<p>Schedule routine.d1.fifth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d1.sixth.subjectName",
            "description": "<p>Schedule routine.d1.sixth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.sixth.startTime",
            "description": "<p>Schedule routine.d1.sixth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.sixth.endTime",
            "description": "<p>Schedule routine.d1.sixth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d1.sixth._teacher",
            "description": "<p>Schedule routine.d1.sixth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d2.first.subjectName",
            "description": "<p>Schedule routine.d2.first.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.first.startTime",
            "description": "<p>Schedule routine.d2.first.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.first.endTime",
            "description": "<p>Schedule routine.d2.first.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d2.first._teacher",
            "description": "<p>Schedule routine.d2.first._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d2.second.subjectName",
            "description": "<p>Schedule routine.d2.second.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.second.startTime",
            "description": "<p>Schedule routine.d2.second.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.second.endTime",
            "description": "<p>Schedule routine.d2.second.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d2.second._teacher",
            "description": "<p>Schedule routine.d2.second._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d2.third.subjectName",
            "description": "<p>Schedule routine.d2.third.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.third.startTime",
            "description": "<p>Schedule routine.d2.third.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.third.endTime",
            "description": "<p>Schedule routine.d2.third.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d2.third._teacher",
            "description": "<p>Schedule routine.d2.third._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d2.fourth.subjectName",
            "description": "<p>Schedule routine.d2.fourth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.fourth.startTime",
            "description": "<p>Schedule routine.d2.fourth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.fourth.endTime",
            "description": "<p>Schedule routine.d2.fourth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d2.fourth._teacher",
            "description": "<p>Schedule routine.d2.fourth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d2.fifth.subjectName",
            "description": "<p>Schedule routine.d2.fifth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.fifth.startTime",
            "description": "<p>Schedule routine.d2.fifth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.fifth.endTime",
            "description": "<p>Schedule routine.d2.fifth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d2.fifth._teacher",
            "description": "<p>Schedule routine.d2.fifth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d2.sixth.subjectName",
            "description": "<p>Schedule routine.d2.sixth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.sixth.startTime",
            "description": "<p>Schedule routine.d2.sixth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.sixth.endTime",
            "description": "<p>Schedule routine.d2.sixth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d2.sixth._teacher",
            "description": "<p>Schedule routine.d2.sixth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d3.first.subjectName",
            "description": "<p>Schedule routine.d3.first.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.first.startTime",
            "description": "<p>Schedule routine.d3.first.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.first.endTime",
            "description": "<p>Schedule routine.d3.first.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d3.first._teacher",
            "description": "<p>Schedule routine.d3.first._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d3.second.subjectName",
            "description": "<p>Schedule routine.d3.second.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.second.startTime",
            "description": "<p>Schedule routine.d3.second.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.second.endTime",
            "description": "<p>Schedule routine.d3.second.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d3.second._teacher",
            "description": "<p>Schedule routine.d3.second._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d3.third.subjectName",
            "description": "<p>Schedule routine.d3.third.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.third.startTime",
            "description": "<p>Schedule routine.d3.third.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.third.endTime",
            "description": "<p>Schedule routine.d3.third.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d3.third._teacher",
            "description": "<p>Schedule routine.d3.third._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d3.fourth.subjectName",
            "description": "<p>Schedule routine.d3.fourth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.fourth.startTime",
            "description": "<p>Schedule routine.d3.fourth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.fourth.endTime",
            "description": "<p>Schedule routine.d3.fourth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d3.fourth._teacher",
            "description": "<p>Schedule routine.d3.fourth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d3.fifth.subjectName",
            "description": "<p>Schedule routine.d3.fifth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.fifth.startTime",
            "description": "<p>Schedule routine.d3.fifth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.fifth.endTime",
            "description": "<p>Schedule routine.d3.fifth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d3.fifth._teacher",
            "description": "<p>Schedule routine.d3.fifth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d3.sixth.subjectName",
            "description": "<p>Schedule routine.d3.sixth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.sixth.startTime",
            "description": "<p>Schedule routine.d3.sixth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.sixth.endTime",
            "description": "<p>Schedule routine.d3.sixth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d3.sixth._teacher",
            "description": "<p>Schedule routine.d3.sixth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d4.first.subjectName",
            "description": "<p>Schedule routine.d4.first.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.first.startTime",
            "description": "<p>Schedule routine.d4.first.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.first.endTime",
            "description": "<p>Schedule routine.d4.first.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d4.first._teacher",
            "description": "<p>Schedule routine.d4.first._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d4.second.subjectName",
            "description": "<p>Schedule routine.d4.second.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.second.startTime",
            "description": "<p>Schedule routine.d4.second.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.second.endTime",
            "description": "<p>Schedule routine.d4.second.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d4.second._teacher",
            "description": "<p>Schedule routine.d4.second._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d4.third.subjectName",
            "description": "<p>Schedule routine.d4.third.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.third.startTime",
            "description": "<p>Schedule routine.d4.third.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.third.endTime",
            "description": "<p>Schedule routine.d4.third.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d4.third._teacher",
            "description": "<p>Schedule routine.d4.third._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d4.fourth.subjectName",
            "description": "<p>Schedule routine.d4.fourth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.fourth.startTime",
            "description": "<p>Schedule routine.d4.fourth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.fourth.endTime",
            "description": "<p>Schedule routine.d4.fourth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d4.fourth._teacher",
            "description": "<p>Schedule routine.d4.fourth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d4.fifth.subjectName",
            "description": "<p>Schedule routine.d4.fifth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.fifth.startTime",
            "description": "<p>Schedule routine.d4.fifth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.fifth.endTime",
            "description": "<p>Schedule routine.d4.fifth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d4.fifth._teacher",
            "description": "<p>Schedule routine.d4.fifth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d4.sixth.subjectName",
            "description": "<p>Schedule routine.d4.sixth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.sixth.startTime",
            "description": "<p>Schedule routine.d4.sixth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.sixth.endTime",
            "description": "<p>Schedule routine.d4.sixth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d4.sixth._teacher",
            "description": "<p>Schedule routine.d4.sixth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d5.first.subjectName",
            "description": "<p>Schedule routine.d5.first.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.first.startTime",
            "description": "<p>Schedule routine.d5.first.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.first.endTime",
            "description": "<p>Schedule routine.d5.first.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d5.first._teacher",
            "description": "<p>Schedule routine.d5.first._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d5.second.subjectName",
            "description": "<p>Schedule routine.d5.second.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.second.startTime",
            "description": "<p>Schedule routine.d5.second.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.second.endTime",
            "description": "<p>Schedule routine.d5.second.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d5.second._teacher",
            "description": "<p>Schedule routine.d5.second._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d5.third.subjectName",
            "description": "<p>Schedule routine.d5.third.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.third.startTime",
            "description": "<p>Schedule routine.d5.third.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.third.endTime",
            "description": "<p>Schedule routine.d5.third.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d5.third._teacher",
            "description": "<p>Schedule routine.d5.third._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d5.fourth.subjectName",
            "description": "<p>Schedule routine.d5.fourth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.fourth.startTime",
            "description": "<p>Schedule routine.d5.fourth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.fourth.endTime",
            "description": "<p>Schedule routine.d5.fourth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d5.fourth._teacher",
            "description": "<p>Schedule routine.d5.fourth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d5.fifth.subjectName",
            "description": "<p>Schedule routine.d5.fifth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.fifth.startTime",
            "description": "<p>Schedule routine.d5.fifth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.fifth.endTime",
            "description": "<p>Schedule routine.d5.fifth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d5.fifth._teacher",
            "description": "<p>Schedule routine.d5.fifth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d5.sixth.subjectName",
            "description": "<p>Schedule routine.d5.sixth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.sixth.startTime",
            "description": "<p>Schedule routine.d5.sixth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.sixth.endTime",
            "description": "<p>Schedule routine.d5.sixth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d5.sixth._teacher",
            "description": "<p>Schedule routine.d5.sixth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d6.first.subjectName",
            "description": "<p>Schedule routine.d6.first.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.first.startTime",
            "description": "<p>Schedule routine.d6.first.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.first.endTime",
            "description": "<p>Schedule routine.d6.first.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d6.first._teacher",
            "description": "<p>Schedule routine.d6.first._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d6.second.subjectName",
            "description": "<p>Schedule routine.d6.second.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.second.startTime",
            "description": "<p>Schedule routine.d6.second.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.second.endTime",
            "description": "<p>Schedule routine.d6.second.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d6.second._teacher",
            "description": "<p>Schedule routine.d6.second._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d6.third.subjectName",
            "description": "<p>Schedule routine.d6.third.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.third.startTime",
            "description": "<p>Schedule routine.d6.third.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.third.endTime",
            "description": "<p>Schedule routine.d6.third.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d6.third._teacher",
            "description": "<p>Schedule routine.d6.third._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d6.fourth.subjectName",
            "description": "<p>Schedule routine.d6.fourth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.fourth.startTime",
            "description": "<p>Schedule routine.d6.fourth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.fourth.endTime",
            "description": "<p>Schedule routine.d6.fourth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d6.fourth._teacher",
            "description": "<p>Schedule routine.d6.fourth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d6.fifth.subjectName",
            "description": "<p>Schedule routine.d6.fifth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.fifth.startTime",
            "description": "<p>Schedule routine.d6.fifth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.fifth.endTime",
            "description": "<p>Schedule routine.d6.fifth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d6.fifth._teacher",
            "description": "<p>Schedule routine.d6.fifth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d6.sixth.subjectName",
            "description": "<p>Schedule routine.d6.sixth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.sixth.startTime",
            "description": "<p>Schedule routine.d6.sixth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.sixth.endTime",
            "description": "<p>Schedule routine.d6.sixth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d6.sixth._teacher",
            "description": "<p>Schedule routine.d6.sixth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "postedBy",
            "description": "<p>Schedule postedBy</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "date",
            "description": "<p>Schedule date</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    schedule: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminSchedules.js",
    "groupTitle": "Schedule"
  },
  {
    "type": "delete",
    "url": "/schedule/:id",
    "title": "4.0 Delete a Schedule by _id",
    "name": "deleteSchedule",
    "group": "Schedule",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Schedule to delete</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    error : false,\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminSchedules.js",
    "groupTitle": "Schedule"
  },
  {
    "type": "put",
    "url": "/schedule/:id",
    "title": "4.0 Edit a Schedule by _id",
    "name": "editSchedule",
    "group": "Schedule",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Schedule to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "routine",
            "description": "<p>Schedule routine</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d1.first.subjectName",
            "description": "<p>Schedule routine.d1.first.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.first.startTime",
            "description": "<p>Schedule routine.d1.first.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.first.endTime",
            "description": "<p>Schedule routine.d1.first.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d1.first._teacher",
            "description": "<p>Schedule routine.d1.first._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d1.second.subjectName",
            "description": "<p>Schedule routine.d1.second.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.second.startTime",
            "description": "<p>Schedule routine.d1.second.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.second.endTime",
            "description": "<p>Schedule routine.d1.second.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d1.second._teacher",
            "description": "<p>Schedule routine.d1.second._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d1.third.subjectName",
            "description": "<p>Schedule routine.d1.third.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.third.startTime",
            "description": "<p>Schedule routine.d1.third.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.third.endTime",
            "description": "<p>Schedule routine.d1.third.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d1.third._teacher",
            "description": "<p>Schedule routine.d1.third._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d1.fourth.subjectName",
            "description": "<p>Schedule routine.d1.fourth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.fourth.startTime",
            "description": "<p>Schedule routine.d1.fourth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.fourth.endTime",
            "description": "<p>Schedule routine.d1.fourth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d1.fourth._teacher",
            "description": "<p>Schedule routine.d1.fourth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d1.fifth.subjectName",
            "description": "<p>Schedule routine.d1.fifth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.fifth.startTime",
            "description": "<p>Schedule routine.d1.fifth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.fifth.endTime",
            "description": "<p>Schedule routine.d1.fifth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d1.fifth._teacher",
            "description": "<p>Schedule routine.d1.fifth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d1.sixth.subjectName",
            "description": "<p>Schedule routine.d1.sixth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.sixth.startTime",
            "description": "<p>Schedule routine.d1.sixth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d1.sixth.endTime",
            "description": "<p>Schedule routine.d1.sixth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d1.sixth._teacher",
            "description": "<p>Schedule routine.d1.sixth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d2.first.subjectName",
            "description": "<p>Schedule routine.d2.first.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.first.startTime",
            "description": "<p>Schedule routine.d2.first.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.first.endTime",
            "description": "<p>Schedule routine.d2.first.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d2.first._teacher",
            "description": "<p>Schedule routine.d2.first._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d2.second.subjectName",
            "description": "<p>Schedule routine.d2.second.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.second.startTime",
            "description": "<p>Schedule routine.d2.second.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.second.endTime",
            "description": "<p>Schedule routine.d2.second.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d2.second._teacher",
            "description": "<p>Schedule routine.d2.second._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d2.third.subjectName",
            "description": "<p>Schedule routine.d2.third.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.third.startTime",
            "description": "<p>Schedule routine.d2.third.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.third.endTime",
            "description": "<p>Schedule routine.d2.third.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d2.third._teacher",
            "description": "<p>Schedule routine.d2.third._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d2.fourth.subjectName",
            "description": "<p>Schedule routine.d2.fourth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.fourth.startTime",
            "description": "<p>Schedule routine.d2.fourth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.fourth.endTime",
            "description": "<p>Schedule routine.d2.fourth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d2.fourth._teacher",
            "description": "<p>Schedule routine.d2.fourth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d2.fifth.subjectName",
            "description": "<p>Schedule routine.d2.fifth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.fifth.startTime",
            "description": "<p>Schedule routine.d2.fifth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.fifth.endTime",
            "description": "<p>Schedule routine.d2.fifth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d2.fifth._teacher",
            "description": "<p>Schedule routine.d2.fifth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d2.sixth.subjectName",
            "description": "<p>Schedule routine.d2.sixth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.sixth.startTime",
            "description": "<p>Schedule routine.d2.sixth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d2.sixth.endTime",
            "description": "<p>Schedule routine.d2.sixth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d2.sixth._teacher",
            "description": "<p>Schedule routine.d2.sixth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d3.first.subjectName",
            "description": "<p>Schedule routine.d3.first.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.first.startTime",
            "description": "<p>Schedule routine.d3.first.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.first.endTime",
            "description": "<p>Schedule routine.d3.first.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d3.first._teacher",
            "description": "<p>Schedule routine.d3.first._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d3.second.subjectName",
            "description": "<p>Schedule routine.d3.second.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.second.startTime",
            "description": "<p>Schedule routine.d3.second.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.second.endTime",
            "description": "<p>Schedule routine.d3.second.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d3.second._teacher",
            "description": "<p>Schedule routine.d3.second._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d3.third.subjectName",
            "description": "<p>Schedule routine.d3.third.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.third.startTime",
            "description": "<p>Schedule routine.d3.third.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.third.endTime",
            "description": "<p>Schedule routine.d3.third.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d3.third._teacher",
            "description": "<p>Schedule routine.d3.third._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d3.fourth.subjectName",
            "description": "<p>Schedule routine.d3.fourth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.fourth.startTime",
            "description": "<p>Schedule routine.d3.fourth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.fourth.endTime",
            "description": "<p>Schedule routine.d3.fourth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d3.fourth._teacher",
            "description": "<p>Schedule routine.d3.fourth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d3.fifth.subjectName",
            "description": "<p>Schedule routine.d3.fifth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.fifth.startTime",
            "description": "<p>Schedule routine.d3.fifth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.fifth.endTime",
            "description": "<p>Schedule routine.d3.fifth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d3.fifth._teacher",
            "description": "<p>Schedule routine.d3.fifth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d3.sixth.subjectName",
            "description": "<p>Schedule routine.d3.sixth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.sixth.startTime",
            "description": "<p>Schedule routine.d3.sixth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d3.sixth.endTime",
            "description": "<p>Schedule routine.d3.sixth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d3.sixth._teacher",
            "description": "<p>Schedule routine.d3.sixth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d4.first.subjectName",
            "description": "<p>Schedule routine.d4.first.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.first.startTime",
            "description": "<p>Schedule routine.d4.first.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.first.endTime",
            "description": "<p>Schedule routine.d4.first.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d4.first._teacher",
            "description": "<p>Schedule routine.d4.first._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d4.second.subjectName",
            "description": "<p>Schedule routine.d4.second.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.second.startTime",
            "description": "<p>Schedule routine.d4.second.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.second.endTime",
            "description": "<p>Schedule routine.d4.second.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d4.second._teacher",
            "description": "<p>Schedule routine.d4.second._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d4.third.subjectName",
            "description": "<p>Schedule routine.d4.third.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.third.startTime",
            "description": "<p>Schedule routine.d4.third.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.third.endTime",
            "description": "<p>Schedule routine.d4.third.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d4.third._teacher",
            "description": "<p>Schedule routine.d4.third._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d4.fourth.subjectName",
            "description": "<p>Schedule routine.d4.fourth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.fourth.startTime",
            "description": "<p>Schedule routine.d4.fourth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.fourth.endTime",
            "description": "<p>Schedule routine.d4.fourth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d4.fourth._teacher",
            "description": "<p>Schedule routine.d4.fourth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d4.fifth.subjectName",
            "description": "<p>Schedule routine.d4.fifth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.fifth.startTime",
            "description": "<p>Schedule routine.d4.fifth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.fifth.endTime",
            "description": "<p>Schedule routine.d4.fifth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d4.fifth._teacher",
            "description": "<p>Schedule routine.d4.fifth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d4.sixth.subjectName",
            "description": "<p>Schedule routine.d4.sixth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.sixth.startTime",
            "description": "<p>Schedule routine.d4.sixth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d4.sixth.endTime",
            "description": "<p>Schedule routine.d4.sixth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d4.sixth._teacher",
            "description": "<p>Schedule routine.d4.sixth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d5.first.subjectName",
            "description": "<p>Schedule routine.d5.first.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.first.startTime",
            "description": "<p>Schedule routine.d5.first.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.first.endTime",
            "description": "<p>Schedule routine.d5.first.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d5.first._teacher",
            "description": "<p>Schedule routine.d5.first._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d5.second.subjectName",
            "description": "<p>Schedule routine.d5.second.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.second.startTime",
            "description": "<p>Schedule routine.d5.second.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.second.endTime",
            "description": "<p>Schedule routine.d5.second.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d5.second._teacher",
            "description": "<p>Schedule routine.d5.second._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d5.third.subjectName",
            "description": "<p>Schedule routine.d5.third.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.third.startTime",
            "description": "<p>Schedule routine.d5.third.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.third.endTime",
            "description": "<p>Schedule routine.d5.third.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d5.third._teacher",
            "description": "<p>Schedule routine.d5.third._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d5.fourth.subjectName",
            "description": "<p>Schedule routine.d5.fourth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.fourth.startTime",
            "description": "<p>Schedule routine.d5.fourth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.fourth.endTime",
            "description": "<p>Schedule routine.d5.fourth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d5.fourth._teacher",
            "description": "<p>Schedule routine.d5.fourth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d5.fifth.subjectName",
            "description": "<p>Schedule routine.d5.fifth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.fifth.startTime",
            "description": "<p>Schedule routine.d5.fifth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.fifth.endTime",
            "description": "<p>Schedule routine.d5.fifth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d5.fifth._teacher",
            "description": "<p>Schedule routine.d5.fifth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d5.sixth.subjectName",
            "description": "<p>Schedule routine.d5.sixth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.sixth.startTime",
            "description": "<p>Schedule routine.d5.sixth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d5.sixth.endTime",
            "description": "<p>Schedule routine.d5.sixth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d5.sixth._teacher",
            "description": "<p>Schedule routine.d5.sixth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d6.first.subjectName",
            "description": "<p>Schedule routine.d6.first.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.first.startTime",
            "description": "<p>Schedule routine.d6.first.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.first.endTime",
            "description": "<p>Schedule routine.d6.first.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d6.first._teacher",
            "description": "<p>Schedule routine.d6.first._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d6.second.subjectName",
            "description": "<p>Schedule routine.d6.second.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.second.startTime",
            "description": "<p>Schedule routine.d6.second.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.second.endTime",
            "description": "<p>Schedule routine.d6.second.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d6.second._teacher",
            "description": "<p>Schedule routine.d6.second._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d6.third.subjectName",
            "description": "<p>Schedule routine.d6.third.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.third.startTime",
            "description": "<p>Schedule routine.d6.third.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.third.endTime",
            "description": "<p>Schedule routine.d6.third.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d6.third._teacher",
            "description": "<p>Schedule routine.d6.third._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d6.fourth.subjectName",
            "description": "<p>Schedule routine.d6.fourth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.fourth.startTime",
            "description": "<p>Schedule routine.d6.fourth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.fourth.endTime",
            "description": "<p>Schedule routine.d6.fourth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d6.fourth._teacher",
            "description": "<p>Schedule routine.d6.fourth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d6.fifth.subjectName",
            "description": "<p>Schedule routine.d6.fifth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.fifth.startTime",
            "description": "<p>Schedule routine.d6.fifth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.fifth.endTime",
            "description": "<p>Schedule routine.d6.fifth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d6.fifth._teacher",
            "description": "<p>Schedule routine.d6.fifth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "routine.d6.sixth.subjectName",
            "description": "<p>Schedule routine.d6.sixth.subjectName</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.sixth.startTime",
            "description": "<p>Schedule routine.d6.sixth.startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "routine.d6.sixth.endTime",
            "description": "<p>Schedule routine.d6.sixth.endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "routine.d6.sixth._teacher",
            "description": "<p>Schedule routine.d6.sixth._teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectID",
            "optional": true,
            "field": "postedBy",
            "description": "<p>Schedule postedBy</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "date",
            "description": "<p>Schedule date</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    schedule: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminSchedules.js",
    "groupTitle": "Schedule"
  },
  {
    "type": "get",
    "url": "/schedules",
    "title": "1.0 Fetch all the Schedules",
    "name": "fetchSchedules",
    "group": "Schedule",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    schedules: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminSchedules.js",
    "groupTitle": "Schedule"
  },
  {
    "type": "get",
    "url": "/schedule/:id",
    "title": "2.0 Find a Schedule by _id",
    "name": "getSchedule",
    "group": "Schedule",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Schedule to find</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    schedule: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminSchedules.js",
    "groupTitle": "Schedule"
  },
  {
    "type": "post",
    "url": "/createschool",
    "title": "Create School",
    "name": "CreateSchool",
    "group": "School",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token of the super admin.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "schoolAddress",
            "description": "<p>School address object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "schoolAddress.city",
            "description": "<p>City of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "schoolAddress.state",
            "description": "<p>State of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "schoolAddress.country",
            "description": "<p>Country of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "schoolAddress.pinCode",
            "description": "<p>Pin code of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "contact",
            "description": "<p>Contact information object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contact.phoneNo",
            "description": "<p>Phone number for the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contact.email",
            "description": "<p>Email address for the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contact.website",
            "description": "<p>Website of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "location",
            "description": "<p>Location object.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "location.type",
            "description": "<p>Type of location (e.g., Point).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": false,
            "field": "location.coordinates",
            "description": "<p>Coordinates of the school (longitude, latitude).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "imageUrl",
            "description": "<p>Image URL of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "profileImage",
            "description": "<p>user profile image URL.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>users's email address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>user's first name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>user's last name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>user's date of birth.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gender",
            "description": "<p>user's gender.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>user's phone number.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "establishYear",
            "description": "<p>The year the school was established.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pfname",
            "description": "<p>Principal's first name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "plname",
            "description": "<p>Principal's last name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "schoolType",
            "description": "<p>[&quot;primary&quot;, &quot;secondary&quot;, &quot;highSchool&quot;]</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Unexpected error occurred.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request-Example:",
        "content": "{\n  \"name\": \"schoolXYZ\",\n  \"schoolAddress\": {\n    \"city\": \"Greenwood\",\n    \"state\": \"California\",\n    \"country\": \"USA\",\n    \"pinCode\": \"90210\"\n  },\n  \"contact\": {\n    \"phoneNo\": \"+1-f sjdfndsf\",\n    \"email\": \"info@greenwoodhigh.edu\",\n    \"website\": \"http://www.greenwoodhigh.edu\"\n  \"establishYear\":\"1995\",\n  },\n  \"location\": {\n    \"type\": \"Point\",\n    \"coordinates\": [21.418325060918168, 84.02980772446274]\n  },\n\"imageUrl\":\"http://www.greenwoodhigh.edu\"\n\"pfname\": \"PrincipalFirstName\",\n\"plname\": \"PrincipalLastName\",\n\n  \"email\": \"sumanr@logic-square.com\",\n  \"firstName\": \"suman\",\n  \"lastName\": \"rana\",\n  \"dob\": \"12/08/2001\",\n  \"gender\": \"Male\",\n  \"phone\": \"9668123855\"\n\"profileImage\":\"nvkdjnvdjfnkfd\",\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/rest/school.js",
    "groupTitle": "School"
  },
  {
    "type": "delete",
    "url": "/school/delete/:id",
    "title": "Delete School",
    "name": "DeleteSchool",
    "group": "School",
    "version": "1.0.0",
    "description": "<p>Delete a school by its ID. Only superadmin can perform this operation.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for authentication.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the school</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"school deleted\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You are not superadmin\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"Error\": \"Server Error Message\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/school.js",
    "groupTitle": "School"
  },
  {
    "type": "post",
    "url": "/schools",
    "title": "Get All Schools",
    "name": "GetAllSchools",
    "group": "School",
    "version": "1.0.0",
    "description": "<p>Fetch a list of all schools.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token of superAdmin for authentication.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"school\": [\n    {\n      \"_id\": \"603ddf15e245ae19f85ce109\",\n      \"name\": \"Green Valley High School\",\n      \"registrationNumber\": \"GVHS-1234\",\n      \"address\": {\n        \"city\": \"San Francisco\",\n        \"state\": \"California\",\n        \"country\": \"USA\",\n        \"pinCode\": \"94107\"\n      },\n      \"contact\": {\n        \"phoneNo\": \"+1 415-555-0198\",\n        \"email\": \"info@greenvalleyhigh.com\",\n        \"website\": \"www.greenvalleyhigh.com\"\n      },\n      \"principalName\": \"Dr. John Doe\",\n      \"establishYear\": 1995,\n      \"schoolType\": \"highSchool\",\n      \"totalStudents\": 1200,\n      \"totalClasses\": 40,\n      \"isActive\": true\n      \"imageUrl\":\"\"\n    },\n    {\n      \"_id\": \"603ddf15e245ae19f85ce110\",\n      \"name\": \"Blue Sky Elementary School\",\n      \"registrationNumber\": \"BSES-5678\",\n      \"address\": {\n        \"city\": \"New York\",\n        \"state\": \"New York\",\n        \"country\": \"USA\",\n        \"pinCode\": \"10001\"\n      },\n      \"contact\": {\n        \"phoneNo\": \"+1 212-555-0199\",\n        \"email\": \"info@blueskyelementary.com\",\n        \"website\": \"www.blueskyelementary.com\"\n      },\n      \"principalName\": \"Dr. Jane Smith\",\n      \"establishYear\": 2000,\n      \"schoolType\": \"primary\",\n      \"totalStudents\": 800,\n      \"totalClasses\": 20,\n      \"isActive\": true,\n      \"imageUrl\":\"\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"Error\": \"You are not superadmin\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"Error\": \"Server Error Message\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/school.js",
    "groupTitle": "School"
  },
  {
    "type": "get",
    "url": "/school/:id",
    "title": "Get School Details",
    "name": "GetSchoolDetails",
    "group": "School",
    "version": "1.0.0",
    "description": "<p>Fetch the details of a specific school using its ID.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the school.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates if there was an error (false if successful).</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "school",
            "description": "<p>The school object containing detailed information.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"school\": {\n    \"_id\": \"603ddf15e245ae19f85ce109\",\n    \"name\": \"Green Valley High School\",\n    \"registrationNumber\": \"GVHS-1234\",\n    \"address\": {\n      \"city\": \"San Francisco\",\n      \"state\": \"California\",\n      \"country\": \"USA\",\n      \"pinCode\": \"94107\"\n    },\n    \"contact\": {\n      \"phoneNo\": \"+1 415-555-0198\",\n      \"email\": \"info@greenvalleyhigh.com\",\n      \"website\": \"www.greenvalleyhigh.com\"\n    },\n    \"location\": {\n      \"type\": \"Point\",\n      \"coordinates\": [-122.399972, 37.781372]\n    },\n    \"principalName\": \"Dr. John Doe\",\n    \"establishYear\": 1995,\n    \"schoolType\": \"highSchool\",\n    \"totalStudents\": 1200,\n    \"totalClasses\": 40,\n    \"isActive\": true\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"Error\": \"Server Error Message\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/school.js",
    "groupTitle": "School"
  },
  {
    "type": "put",
    "url": "/school/:id",
    "title": "Update School",
    "name": "UpdateSchool",
    "group": "School",
    "permission": [
      {
        "name": "admin,superAdmin"
      }
    ],
    "version": "1.0.0",
    "description": "<p>This endpoint allows  to update the details of an existing school.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>unique access token (JWT).</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>The updated name of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "address",
            "description": "<p>The updated address of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.city",
            "description": "<p>City of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.state",
            "description": "<p>State of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.country",
            "description": "<p>Country of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.pinCode",
            "description": "<p>Pin code of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "contact",
            "description": "<p>The updated contact details of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "contact.phoneNo",
            "description": "<p>Updated phone number of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "contact.email",
            "description": "<p>Updated email address of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "contact.website",
            "description": "<p>Updated website of the school (if applicable).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "description": "<p>Update the activation status of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "imageUrl",
            "description": "<p>image of school</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "establishYear",
            "description": "<p>The year the school was established.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pfname",
            "description": "<p>Principal's first name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "plname",
            "description": "<p>Principal's last name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "schoolType",
            "description": "<p>The type of the school  [&quot;primary&quot;, &quot;secondary&quot;, &quot;highSchool&quot;]</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Whether there was an error.</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Reason for the error (if applicable).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"you are not authorized to update school details\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"Error\": \"Internal Server Error\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/school.js",
    "groupTitle": "School"
  },
  {
    "type": "post",
    "url": "/school",
    "title": "3.0 Create a new School",
    "name": "createSchool",
    "group": "School",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>School name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "registrationNumber",
            "description": "<p>School registrationNumber</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "address",
            "description": "<p>School address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.city",
            "description": "<p>School address.city</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.state",
            "description": "<p>School address.state</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.country",
            "description": "<p>School address.country</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.pinCode",
            "description": "<p>School address.pinCode</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "contact",
            "description": "<p>School contact</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "contact.phoneNo",
            "description": "<p>School contact.phoneNo</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "contact.email",
            "description": "<p>School contact.email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "contact.website",
            "description": "<p>School contact.website</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "location",
            "defaultValue": "Point",
            "description": "<p>School location <code>enum=[&quot;Point&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "location.type",
            "defaultValue": "Point",
            "description": "<p>School location.type <code>enum=[&quot;Point&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": true,
            "field": "location.coordinates",
            "description": "<p>School location.coordinates</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "principalName",
            "description": "<p>School principalName</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "establishYear",
            "description": "<p>School establishYear</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schoolType",
            "description": "<p>School schoolType <code>enum=[&quot;primary&quot;, &quot;secondary&quot;, &quot;highSchool&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "totalStudents",
            "description": "<p>School totalStudents</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "totalClasses",
            "description": "<p>School totalClasses</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "defaultValue": "true",
            "description": "<p>School isActive</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    school: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminSchools.js",
    "groupTitle": "School"
  },
  {
    "type": "delete",
    "url": "/school/:id",
    "title": "4.0 Delete a School by _id",
    "name": "deleteSchool",
    "group": "School",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the School to delete</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    error : false,\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminSchools.js",
    "groupTitle": "School"
  },
  {
    "type": "put",
    "url": "/school/:id",
    "title": "4.0 Edit a School by _id",
    "name": "editSchool",
    "group": "School",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the School to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>School name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "registrationNumber",
            "description": "<p>School registrationNumber</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "address",
            "description": "<p>School address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.city",
            "description": "<p>School address.city</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.state",
            "description": "<p>School address.state</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.country",
            "description": "<p>School address.country</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.pinCode",
            "description": "<p>School address.pinCode</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "contact",
            "description": "<p>School contact</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "contact.phoneNo",
            "description": "<p>School contact.phoneNo</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "contact.email",
            "description": "<p>School contact.email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "contact.website",
            "description": "<p>School contact.website</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "location",
            "defaultValue": "Point",
            "description": "<p>School location <code>enum=[&quot;Point&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "location.type",
            "defaultValue": "Point",
            "description": "<p>School location.type <code>enum=[&quot;Point&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": true,
            "field": "location.coordinates",
            "description": "<p>School location.coordinates</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "principalName",
            "description": "<p>School principalName</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "establishYear",
            "description": "<p>School establishYear</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schoolType",
            "description": "<p>School schoolType <code>enum=[&quot;primary&quot;, &quot;secondary&quot;, &quot;highSchool&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "totalStudents",
            "description": "<p>School totalStudents</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "totalClasses",
            "description": "<p>School totalClasses</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "defaultValue": "true",
            "description": "<p>School isActive</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    school: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminSchools.js",
    "groupTitle": "School"
  },
  {
    "type": "get",
    "url": "/schools",
    "title": "1.0 Fetch all the Schools",
    "name": "fetchSchools",
    "group": "School",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    schools: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminSchools.js",
    "groupTitle": "School"
  },
  {
    "type": "get",
    "url": "/school/:id",
    "title": "2.0 Find a School by _id",
    "name": "getSchool",
    "group": "School",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the School to find</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    school: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminSchools.js",
    "groupTitle": "School"
  },
  {
    "type": "delete",
    "url": "/admin/deletesetting",
    "title": "Delete Setting",
    "name": "DeleteSetting",
    "group": "Settings",
    "permission": [
      {
        "name": "admin superadmin"
      }
    ],
    "description": "<p>Deletes a specific setting for a given academic year and school.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token.</p>"
          }
        ]
      }
    },
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "academicYear",
        "description": "<p>The academic year for the setting to be deleted (e.g., &quot;2024-2025&quot;).</p>"
      },
      {
        "group": "Body",
        "type": "String",
        "optional": true,
        "field": "schoolId",
        "description": "<p>School ID to specify if the user is a superadmin. Admins delete settings only for their school.</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates if there was an error (false on success).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message confirming deletion.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"deleted\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Permission Error:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You do not have permission to delete\"\n}",
          "type": "json"
        },
        {
          "title": "Not-Found Error:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": true,\n  \"reason\": \"setting not found\"\n}",
          "type": "json"
        },
        {
          "title": "Server Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"Error\": \"Error message\"\n}",
          "type": "json"
        }
      ],
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>True if a server error occurred.</p>"
          },
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "Error",
            "description": "<p>Server error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/settings.js",
    "groupTitle": "Settings"
  },
  {
    "type": "post",
    "url": "admin/settings",
    "title": "Get Class Settings",
    "name": "GetSettings",
    "group": "Settings",
    "permission": [
      {
        "name": "admin superadmin"
      }
    ],
    "description": "<p>Retrieve class settings for a specific school with optional filtering by academic year and active status.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token.</p>"
          }
        ]
      }
    },
    "query": [
      {
        "group": "Query",
        "type": "String",
        "optional": true,
        "field": "schoolId",
        "description": "<p>The ID of the school. (Super Admins only)</p>"
      }
    ],
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": true,
        "field": "academicYear",
        "description": "<p>Optional filter by academic year (e.g., &quot;2024-2025&quot;).</p>"
      },
      {
        "group": "Body",
        "type": "Boolean",
        "optional": true,
        "field": "isActive",
        "description": "<p>Optional filter to return active/inactive settings.</p>"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"settings\": [\n    {\n      \"_id\": \"60f7f15d9b1e8b001c3a8b8c\",\n      \"_school\": \"60f7f12e9b1e8b001c3a8b8b\",\n      \"academicYear\": \"2024-2025\",\n      \"availableClasses\": [\n        {\n          \"grade\": \"5\",\n          \"section\": [\"A\", \"B\", \"C\"],\n          \"monthlyFee\": 1500,\n          \"salary\": 2000\n        }\n      ],\n      \"busFee\": {\n        \"morning\": 500,\n        \"evening\": 500\n      },\n      \"isActive\": true\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You do not have permission\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/settings.js",
    "groupTitle": "Settings"
  },
  {
    "type": "post",
    "url": "/admin/setsettings",
    "title": "Set Settings",
    "name": "SetSettings",
    "group": "Settings",
    "description": "<p>This endpoint is used to set the school settings, including available classes, academic year, bus fees, and more.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin or super admin access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "availableClasses",
            "description": "<p>List of classes with their details.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "academicYear",
            "description": "<p>The academic year for the settings.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "busFee",
            "description": "<p>The bus fee structure (e.g., { &quot;0-5&quot;: 600, &quot;6-10&quot;: 800 }).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schoolId",
            "description": "<p>Optional school ID for super admins to set settings for a specific school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "salary",
            "description": "<p>salary of teacher</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"availableClasses\": [\n    {\n      \"grade\": \"1\",\n      \"monthlyFee\": 500,\n      \"salary\": 2000\n    },\n    {\n      \"grade\": \"2\",\n      \"monthlyFee\": 600,\n      \"salary\": 2200\n    }\n  ],\n  \"academicYear\": \"2024-2025\",\n  \"busFee\": {\n    \"0-5\": 600,\n    \"6-10\": 800\n  },\n  \"schoolId\": \"60c72b2f5f1b2c001c4f8b3e\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Settings updated successfully\",\n  \"settingsClass\": {\n    \"_school\": \"60c72b2f5f1b2c001c4f8b3e\",\n    \"academicYear\": \"2024-2025\",\n    \"availableClasses\": [\n      {\n        \"grade\": \"1\",\n        \"section\": [\"A\", \"B\", \"C\", \"D\"],\n        \"monthlyFee\": 500,\n        \"salary\": 2000\n      },\n      {\n        \"grade\": \"2\",\n        \"section\": [\"A\", \"B\", \"C\", \"D\"],\n        \"monthlyFee\": 600,\n        \"salary\": 2200\n      }\n    ],\n    \"busFee\": {\n      \"0-5\": 600,\n      \"6-10\": 800\n    },\n    \"isActive\": true\n  },\n  \"AllClass\": [\n    {\n      \"_id\": \"60c72b2f5f1b2c001c4f8b4f\",\n      \"name\": \"1\",\n      \"section\": \"A\",\n      \"academicYear\": \"2024-2025\",\n      \"_school\": \"60c72b2f5f1b2c001c4f8b3e\"\n    },\n    {\n      \"_id\": \"60c72b2f5f1b2c001c4f8b50\",\n      \"name\": \"2\",\n      \"section\": \"A\",\n      \"academicYear\": \"2024-2025\",\n      \"_school\": \"60c72b2f5f1b2c001c4f8b3e\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": true,\n  \"message\": \"Settings not found\"\n}",
          "type": "json"
        },
        {
          "title": "Permission-Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You do not have permission\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/settings.js",
    "groupTitle": "Settings"
  },
  {
    "type": "put",
    "url": "/admin/updatesettings",
    "title": "Update Settings",
    "name": "UpdateClassSettings",
    "group": "Settings",
    "description": "<p>This endpoint updates the class settings, including available classes, bus fees, and the active status.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin or super admin access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "availableClasses",
            "description": "<p>List of available classes with details.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "busFee",
            "description": "<p>The updated bus fee structure (e.g., { &quot;0-5&quot;: 600, &quot;6-10&quot;: 800 }).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "description": "<p>Indicates if the settings should be active or not.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "academicYear",
            "description": "<p>&quot;2024-2025&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "salary",
            "description": "<p>salary of teacher</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"availableClasses\": [\n    {\n      \"grade\": \"1\",\n      \"section\": [\"A\", \"B\"],\n      \"monthlyFee\": 500,\n      \"salary\": 2000\n    },\n    {\n      \"grade\": \"2\",\n      \"monthlyFee\": 600,\n      \"salary\": 2200\n    }\n  ],\n  \"busFee\": {\n    \"0-5\": 600,\n    \"6-10\": 800\n  },\n  \"isActive\": true\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Class settings updated successfully\",\n  \"updatedSettings\": {\n    \"_school\": \"60c72b2f5f1b2c001c4f8b3e\",\n    \"academicYear\": \"2024-2025\",\n    \"availableClasses\": [\n      {\n        \"grade\": \"1\",\n        \"section\": [\"A\", \"B\"],\n        \"monthlyFee\": 500,\n        \"salary\": 2000\n      },\n      {\n        \"grade\": \"2\",\n        \"section\": [\"A\", \"B\", \"C\", \"D\"],\n        \"monthlyFee\": 600,\n        \"salary\": 2200\n      }\n    ],\n    \"busFee\": {\n      \"0-5\": 600,\n      \"6-10\": 800\n    },\n    \"isActive\": true\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": true,\n  \"message\": \"Settings not found\"\n}",
          "type": "json"
        },
        {
          "title": "Permission-Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You do not have permission\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/settings.js",
    "groupTitle": "Settings"
  },
  {
    "type": "post",
    "url": "/admin/student/createstudent",
    "title": "Create Student",
    "name": "CreateStudent",
    "group": "Student",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Admin's access token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>Student's first name (required).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>Student's last name (required).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Student's email address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gender",
            "description": "<p>Student's gender (required).</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "guardian",
            "description": "<p>Guardian's information (required).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "guardian.fathersName",
            "description": "<p>Guardian's father's name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "guardian.mothersName",
            "description": "<p>Guardian's mother's name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>Student's phone number (required).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "admissionYear",
            "description": "<p>Year of admission (required).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Student's date of birth (required).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "classname",
            "description": "<p>Class name (required).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "section",
            "description": "<p>Class section (required).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "joinDate",
            "description": "<p>Date of joining (required).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "signature",
            "description": "<p>Base64 encoded signature.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "profileImage",
            "description": "<p>Path to the profile image.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "rollNo",
            "description": "<p>Student's roll number. Required if autoAssignRoll is false.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "autoAssignRoll",
            "defaultValue": "false",
            "description": "<p>Whether to auto-assign the roll number.</p>"
          }
        ]
      }
    },
    "description": "<p>Creates a new student record in the database. The roll number can be auto-assigned or manually entered by the admin. If manually entered, it must be sequential based on the last roll number in the class and section.</p>",
    "examples": [
      {
        "title": "Example usage (Manual Roll Number):",
        "content": "'{\n    \"firstName\": \"June\",\n    \"lastName\": \"David\",\n    \"gender\": \"Female\",\n    \"guardian\": {\n      \"fathersName\": \"Ryan David\",\n      \"fathersOccupation\":\"School Teacher\"\n      \"mothersName\": \"Milli David\",\n       \"mothersOccupation\":\"Housewife\"\n    },\n   \"address\":{\n     locality:\"Godrej Waterside, Salt Lake,Kolkata, 700009\",\n       \"city\":\"Kolkata\",\n       \"state\":\"West Bengal\",\n       \"pin\":\"700009\"\n       \"country\":\"India\",\n     },\n    \"phone\": \"9080264385\",\n    \"admissionYear\": 2024,\n    \"dob\": \"1990-07-02\",\n    \"rollNo\": \"R004\",  // Manually assigned roll number\n    \"classname\": \"10\",\n    \"section\": \"A\",\n    \"joinDate\": \"2024-10-10\",\n    \"signature\": \"base64EncodedString\",\n    \"profileImage\": \"public/docsimg/ProfilePic.jpeg\",\n    \"autoAssignRoll\": false\n  }'",
        "type": "json"
      },
      {
        "title": "Example usage (Auto-Assigned Roll Number):",
        "content": "'{\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"gender\": \"Male\",\n    \"guardian\": {\n      \"fathersName\": \"Ryan David\",\n      \"fathersOccupation\":\"School Teacher\"\n      \"mothersName\": \"Milli David\",\n       \"mothersOccupation\":\"Housewife\"\n    },\n\"address\":{\n     \"locality\":\"Godrej Waterside, Salt Lake,Kolkata, 700009\",\n       \"city\":\"Kolkata\",\n       \"state\":\"West Bengal\",\n       \"pin\":\"700009\",\n       \"country\":\"India\",\n     },\n    \"phone\": \"9123456789\",\n    \"admissionYear\": 2024,\n    \"dob\": \"1990-08-15\",\n    \"classname\": \"10\",\n    \"section\": \"B\",\n    \"joinDate\": \"2024-10-10\",\n    \"signature\": \"base64EncodedString\",\n    \"profileImage\": \"public/docsimg/ProfilePic2.jpeg\",\n    \"autoAssignRoll\": true  // Roll number will be auto-assigned\n  }'",
        "type": "json"
      }
    ],
    "filename": "routes/rest/adminStudent.js",
    "groupTitle": "Student"
  },
  {
    "type": "put",
    "url": "/admin/student/:id",
    "title": "Edit Student Details",
    "name": "EditStudentDetails",
    "group": "Student",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token of the admin.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Student's unique ID.</p>"
          }
        ],
        "Request Body": [
          {
            "group": "Request Body",
            "type": "String",
            "optional": true,
            "field": "firstName",
            "description": "<p>Student's first name.</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": true,
            "field": "lastName",
            "description": "<p>Student's last name.</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Student's email.</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": true,
            "field": "gender",
            "description": "<p>Student's gender.</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": true,
            "field": "guardian",
            "description": "<p>Guardian's name.</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": true,
            "field": "phone",
            "description": "<p>Student's phone number.</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": true,
            "field": "admissionYear",
            "description": "<p>Admission year of the student.</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": true,
            "field": "dob",
            "description": "<p>Date of birth of the student.</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": true,
            "field": "rollNo",
            "description": "<p>Roll number of the student.</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": true,
            "field": "signature",
            "description": "<p>Signature of the student.</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": true,
            "field": "profileImage",
            "description": "<p>Profile image URL of the student.</p>"
          }
        ]
      }
    },
    "description": "<p>This route allows only admin users to edit details of a specific student. The admin must be logged in and authorized to access this endpoint. Only the provided fields in the request body will be updated.</p>",
    "error": {
      "fields": {
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can edit student details.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Student not found.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>An error occurred while updating student details.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request-Example:",
        "content": "{\n  \"firstName\": \"Jane\",\n  \"lastName\": \"Doe\",\n  \"email\": \"janedoe@example.com\",\n  \"gender\": \"Female\",\n  \"phone\": \"0987654321\"\n}",
        "type": "json"
      },
      {
        "title": "Error-Response:",
        "content": "{\n  \"message\": \"Only admins can edit student details\"\n}",
        "type": "json"
      },
      {
        "title": "Error-Response:",
        "content": "{\n  \"message\": \"Student not found\"\n}",
        "type": "json"
      },
      {
        "title": "Error-Response:",
        "content": "{\n  \"message\": \"An error occurred while updating student details\",\n  \"error\": \"Error details here\"\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/rest/adminStudent.js",
    "groupTitle": "Student"
  },
  {
    "type": "get",
    "url": "/admin/lastrollnumber",
    "title": "Get Last Roll Number of a Class",
    "name": "GetLastRollNumber",
    "group": "Student",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "description": "<p>This endpoint retrieves the last roll number of students in a class.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "className",
            "description": "<p>The name of the class.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "section",
            "description": "<p>The section of the class.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "academicYear",
            "description": "<p>The academic year of the class.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The response message.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "lastRollNumber",
            "description": "<p>The last roll number of students in the class.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates an error occurred (true means error).</p>"
          },
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message stating the user is not authenticated.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates an error occurred (true means error).</p>"
          },
          {
            "group": "403",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message stating the user is not an admin.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates an error occurred (true means error).</p>"
          },
          {
            "group": "404",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message stating the class was not found.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates an error occurred (true means error).</p>"
          },
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Detailed error message for server-side issues.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin access.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminStudent.js",
    "groupTitle": "Student"
  },
  {
    "type": "get",
    "url": "/admin/student/:id",
    "title": "View Student Details",
    "name": "ViewStudentDetails",
    "group": "Student",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token of the admin.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique ID of the student to view details.</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "description": "<p>This endpoint allows an admin to view detailed information of a specific student by their ID. Only users with admin privileges can access this route.</p>",
    "error": {
      "fields": {
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can view student details.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Student not found.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Unexpected error occurred.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Response-Example:",
        "content": "{\n  \"error\": false,\n  \"student\": {\n    \"_id\": \"67052d954cbe69ed12657f76\",\n    \"username\": \"student123\",\n    \"email\": \"student@example.com\",\n    \"loginType\": \"student\",\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"isActive\": true,\n    \"_school\": {\n         \"address\": {\n             \"city\": \"Panskura\",\n             \"state\": \"West Bengal\",\n             \"country\": \"India\",\n             \"pinCode\": \"721641\"\n         },\n         \"contact\": {\n             \"phoneNo\": \"+91 8172059732\",\n             \"email\": \"kicmmhs@gmail.com\",\n             \"website\": \"kicmmhs.edu\"\n         },\n         \"location\": {\n             \"type\": \"Point\",\n             \"coordinates\": [\n                 21.418325060918168,\n                 84.02980772446274\n             ]\n         },\n         \"name\": \"Khukurdaha I C M M High School\",\n         \"registrationNumber\": \"REG3167\",\n         \"principalName\": \"Mrinal undefined\",\n         \"establishYear\": 1995,\n         \"imageUrl\": \"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR991hgwd5EAqJRywib6kdEyDFFIxmmA20x_evuRgHj5zlRqYq8Wq16u_rYSEkXieoQFQg&usqp=CAU\",\n         \"isActive\": true,\n         \"schoolType\": \"highSchool\"\n     }\n    \"_class\": {\n      \"name\": \"10th Grade\"\n    },\n    \"gender\": \"Male\",\n    \"address\": \"123 Main St\",\n    \"phone\": \"123-456-7890\",\n    \"dob\": \"01/01/2005\",\n    \"createdAt\": \"2024-10-21T00:00:00.000Z\",\n    \"updatedAt\": \"2024-10-21T00:00:00.000Z\"\n  }\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/rest/adminStudent.js",
    "groupTitle": "Student"
  },
  {
    "type": "put",
    "url": "/admin/student/change-status/:id",
    "title": "5.0 Deactivate a student",
    "name": "deactivateStudent",
    "group": "Student",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "studentId",
            "description": "<p><code>URL Param</code> The _id of the student to deactivate</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "adminId",
            "description": "<p><code>Body Param</code> The _id of the admin who is deactivating the student</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    message: \"Student deactivated successfully\"\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminStudent.js",
    "groupTitle": "Student"
  },
  {
    "type": "post",
    "url": "/bulkCreateTeachers",
    "title": "Bulk Create Teachers",
    "name": "BulkCreateTeachers",
    "group": "Teacher",
    "permission": [
      {
        "name": "SuperAdmin, Admin"
      }
    ],
    "description": "<p>Creates multiple teacher records from a CSV file. The request requires a CSV file with each row containing teacher details.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for authentication.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "teacherCSV",
            "optional": false,
            "field": "file",
            "description": "<p>CSV file containing teacher data. Required fields: <code>firstName</code>, <code>lastName</code>, <code>gender</code>, <code>phone</code>. Optional fields include <code>email</code>, <code>dob</code>, <code>joinDate</code>, <code>profileImage</code>, <code>signature</code>, <code>bankDetails</code>, <code>address</code>, <code>schoolId</code>, and <code>subject</code>.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message showing the count of created teachers.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "results",
            "description": "<p>List of successfully created teachers.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "results.error",
            "description": "<p>Indicates if the teacher creation was successful (false).</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "results.user",
            "description": "<p>Created teacher's data.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "results.user.firstName",
            "description": "<p>Teacher's first name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "results.user.lastName",
            "description": "<p>Teacher's last name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "results.user.email",
            "description": "<p>Teacher's email address.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "results.user.phone",
            "description": "<p>Teacher's phone number.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "results.user.dob",
            "description": "<p>Teacher's date of birth.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "results.user.username",
            "description": "<p>Generated username for the teacher.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "errors",
            "description": "<p>List of errors encountered during creation.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "errors.teacherData",
            "description": "<p>Data from the CSV row that caused the error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "errors.error",
            "description": "<p>Description of the error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"3 teachers created\",\n  \"results\": [\n    {\n      \"error\": false,\n      \"user\": {\n        \"firstName\": \"John\",\n        \"lastName\": \"Doe\",\n        \"email\": \"john@school.com\",\n        \"phone\": \"1234567890\",\n        \"dob\": \"06/04/2001\",\n        \"username\": \"Johsch890\"\n      }\n    },\n    {\n      \"error\": false,\n      \"user\": {\n        \"firstName\": \"Jane\",\n        \"lastName\": \"Smith\",\n        \"email\": \"jane@school.com\",\n        \"phone\": \"0987654321\",\n        \"dob\": \"02/02/1999\",\n        \"username\": \"Jansch321\"\n      }\n    },\n    {\n      \"error\": false,\n      \"user\": {\n        \"firstName\": \"Asit\",\n        \"lastName\": \"Raj\",\n        \"email\": \"asit@school.com\",\n        \"phone\": \"98223682221\",\n        \"dob\": \"01/11/2001\",\n        \"username\": \"Asisch221\"\n      }\n    }\n  ],\n  \"errors\": [\n    {\n      \"teacherData\": {\n        \"firstName\": \"Jane\",\n        \"lastName\": \"Smith\",\n        \"gender\": \"Female\",\n        \"email\": \"tim@school.com\",\n        \"phone\": \"0987654376\",\n        \"dob\": \"02/02/1999\",\n        \"subject\": \"['Math'\",\n        \"_7\": \"'English']\"\n      },\n      \"error\": \"Email already in use. Provide a unique email.\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Status of the request (true if an error occurred).</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message if the request fails.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized Access:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You do not have permission to create teachers\"\n}",
          "type": "json"
        },
        {
          "title": "File Missing:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"message\": \"CSV file is required\"\n}",
          "type": "json"
        },
        {
          "title": "Internal Server Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"message\": \"An error message explaining the failure\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminTeacher.js",
    "groupTitle": "Teacher"
  },
  {
    "type": "post",
    "url": "admin/teacher/create",
    "title": "Create Teacher",
    "name": "CreateTeacher",
    "group": "Teacher",
    "permission": [
      {
        "name": "admin,superAdmin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>First name of the teacher.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>Last name of the teacher.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gender",
            "description": "<p>Gender of the teacher (e.g., Male, Female).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the teacher (must be unique).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>Phone number of the teacher (must be unique).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of birth of the teacher in DD/MM/YYYY format.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "signature",
            "description": "<p>Optional signature of the teacher.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "bankDetails",
            "description": "<p>Optional bank details of the teacher.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "address",
            "description": "<p>address of the teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "profileImage",
            "description": "<p>image url of the teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schoolId",
            "description": "<p>school id(only use when superadmin will create )</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "subject",
            "description": "<p>array of string ['Math',&quot;English&quot;]</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (false).</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>The newly created teacher object.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"user\": {\n    \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"gender\": \"Male\",\n    \"email\": \"john.doe@example.com\",\n    \"phone\": \"1234567890\",\n    \"dob\": \"1990-01-01T00:00:00.000Z\",\n    \"username\": \"Joh1230\",\n    \"isActive\": true,\n    \"customerStripeId\": \"cus_123456789\",\n    \"address\":{\n       \"locality\":\"\",\n       \"city\":\"\",\n       \"state\":\"\",\n       \"pin\":\"\",\n       \"country\":\"\"\n     }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAdmin",
            "description": "<p>You are not an admin.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingField",
            "description": "<p>One or more required fields are missing.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidDOB",
            "description": "<p>Invalid date of birth format.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EmailExists",
            "description": "<p>Email already in use.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PhoneExists",
            "description": "<p>Phone number already in use.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal server error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"You are not Admin\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"First name is required\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Invalid date of birth format. Use DD/MM/YYYY.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Email already use, please provide an unique email\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Phone number already use, please provide an unique phone number\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"Internal server error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminTeacher.js",
    "groupTitle": "Teacher"
  },
  {
    "type": "delete",
    "url": "/admin/teacher/delete/:id",
    "title": "Delete Teacher by admin or superadmin",
    "name": "DeleteTeacher",
    "group": "Teacher",
    "permission": [
      {
        "name": "Admin or SuperAdmin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the teacher to be deleted (as URL parameter).</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"reason\": \"user deleted\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (No Permission):",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You do not have permission to delete teacher\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (Teacher Not Found):",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"teacher not found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminTeacher.js",
    "groupTitle": "Teacher"
  },
  {
    "type": "post",
    "url": "/admin/teacher/find",
    "title": "Find Teachers",
    "name": "FindTeachers",
    "group": "Teacher",
    "description": "<p>Allows super admins and admins to search for teachers. Super admins can search all teachers, while admins can only search teachers in their assigned school.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin or super admin access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "searchText",
            "description": "<p>Optional search text to filter teachers by <code>firstName</code>, <code>lastName</code>, <code>email</code>,<code>gender</code> <code>phone</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pageNumber",
            "defaultValue": "1",
            "description": "<p>page number (start with 1) send within the params</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pageSize",
            "defaultValue": "10",
            "description": "<p>number of data send within the params</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"users\": [\n    {\n      \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n      \"firstName\": \"John\",\n      \"lastName\": \"Doe\",\n      \"email\": \"john.doe@example.com\",\n      \"phone\": \"1234567890\",\n      \"isActive\": true,\n      \"loginType\": \"teacher\"\n    }\n  ],\n  \"usersCount\": 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnauthorizedAccess",
            "description": "<p>Unauthorized access (not an admin or super admin).</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoTeachersFound",
            "description": "<p>No teachers found matching the search criteria.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal server error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": true,\n  \"reason\": \"Unauthorized access\"\n}",
          "type": "json"
        },
        {
          "title": "NoTeachers-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": true,\n  \"reason\": \"No teacher found\"\n}",
          "type": "json"
        },
        {
          "title": "InternalServerError-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"reason\": \"Internal server error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminTeacher.js",
    "groupTitle": "Teacher"
  },
  {
    "type": "post",
    "url": "/admin/teachers",
    "title": "Get All Teachers",
    "name": "GetAllTeachers",
    "group": "Teacher",
    "version": "1.0.0",
    "description": "<p>Retrieves all teachers belonging to the school</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin authentication.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pageNumber",
            "defaultValue": "1",
            "description": "<p>page number (start with 1) send within the params</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pageSize",
            "defaultValue": "10",
            "description": "<p>number of data send within the params</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Teachers retrieved successfully.\",\n  \"data\": [\n    {\n      \"_id\": \"614d1b6f8f8b9e001cb12345\",\n      \"firstName\": \"John\",\n      \"lastName\": \"Doe\",\n      \"email\": \"john.doe@example.com\",\n      \"phone\": \"1234567890\",\n      \"gender\": \"Male\",\n      \"_school\": \"614c1b6f8f8b9e001cb12345\",\n      \"isActive\": true\n    },\n    {\n      \"_id\": \"614d1b6f8f8b9e001cb12346\",\n      \"firstName\": \"Jane\",\n      \"lastName\": \"Smith\",\n      \"email\": \"jane.smith@example.com\",\n      \"phone\": \"0987654321\",\n      \"gender\": \"Female\",\n      \"_school\": \"614c1b6f8f8b9e001cb12345\",\n      \"isActive\": true\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates if there was an error (true if failed).</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message explaining the reason.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error Response (No Teachers Found):",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": true,\n  \"message\": \"No teachers found for this school.\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response (Server Error):",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"reason\": \"Server error message.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/adminTeacher.js",
    "groupTitle": "Teacher"
  },
  {
    "type": "get",
    "url": "/admin/teacher/get/:id",
    "title": "Get Teacher Details",
    "name": "GetTeacherDetails",
    "group": "Teacher",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin or superadmin access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Teacher's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether there was an error (false).</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>Details of the teacher.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user._id",
            "description": "<p>Teacher's unique ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.firstName",
            "description": "<p>Teacher's first name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.lastName",
            "description": "<p>Teacher's last name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.gender",
            "description": "<p>Teacher's gender.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.email",
            "description": "<p>Teacher's email.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.phone",
            "description": "<p>Teacher's phone number.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "user.dob",
            "description": "<p>Teacher's date of birth.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "user.isActive",
            "description": "<p>Indicates if the teacher is active.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"user\": {\n    \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"gender\": \"Male\",\n    \"email\": \"john.doe@example.com\",\n    \"phone\": \"1234567890\",\n    \"dob\": \"1985-04-15T00:00:00.000Z\",\n    \"isActive\": true\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAdmin",
            "description": "<p>You are not an admin.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoTeacherFound",
            "description": "<p>No teacher found with the given ID.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal server error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"You are not Admin\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"No teacher found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"Internal server error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminTeacher.js",
    "groupTitle": "Teacher"
  },
  {
    "type": "put",
    "url": "admin/teacher/update/:id",
    "title": "Update Teacher Details",
    "name": "UpdateTeacher",
    "group": "Teacher",
    "permission": [
      {
        "name": "admin,superadmin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin,superadmin access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Teacher's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstName",
            "description": "<p>Teacher's first name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "lastName",
            "description": "<p>Teacher's last name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Teacher's email.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "description": "<p>Indicates if the teacher is active.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "phone",
            "description": "<p>Teacher's phone number.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "bankDetails",
            "description": "<p>Teacher's bank details.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "address",
            "description": "<p>address of the teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "profileImage",
            "description": "<p>image url of the teacher</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "_school",
            "description": "<p>school id</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "subject",
            "description": "<p>array of string subject:[&quot;Math&quot;]</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"user\": {\n    \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"email\": \"john.doe@example.com\",\n    \"phone\": \"1234567890\",\n    \"isActive\": true,\n    \"bankDetails\": {\n      \"accountNumber\": \"123456789\",\n      \"ifscCode\": \"IFSC0001\"\n    }\n   \"address\":{\n   \"locality\":\"\",\n   \"city\":\"\",\n   \"state\":\"\",\n   \"pin\":\"\",\n   \"country\":\"\"\n},\n   \"_school\":\"schoolid\",\n   \"profileImage\":\"\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAdmin",
            "description": "<p>You are not an admin.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoUserFound",
            "description": "<p>No teacher found with the given ID.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal server error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"You are not Admin\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"No User Found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"Internal server error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminTeacher.js",
    "groupTitle": "Teacher"
  },
  {
    "type": "post",
    "url": "/transaction/create",
    "title": "Create Transaction",
    "name": "CreateTransaction",
    "group": "Transaction",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin access.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>The ID of the user creating the transaction.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "amount",
            "description": "<p>The amount for the transaction.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "busFee",
            "description": "<p>The bus fee associated with the transaction.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"success\"",
              "\"pending\""
            ],
            "optional": true,
            "field": "status",
            "description": "<p>The new status of the transaction.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "transaction._id",
            "description": "<p>The unique ID of the transaction.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "transaction._user",
            "description": "<p>The ID of the user associated with the transaction.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "transaction.amount",
            "description": "<p>The amount for the transaction.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "transaction.busFee",
            "description": "<p>The bus fee associated with the transaction.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "transaction.totalAmount",
            "description": "<p>The total amount of the transaction (amount + busFee).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "transaction.status",
            "description": "<p>The status of the transaction.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "transaction.date",
            "description": "<p>The date of the transaction creation.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  \"error\": false,\n  \"transaction\": {\n    \"_id\": \"609c2e08f74b612b6c345c44\",\n    \"_user\": \"609c2e08f74b612b6c345c40\",\n    \"amount\": 100,\n    \"busFee\": 10,\n    \"totalAmount\": 110,\n    \"status\": \"pending\",\n    \"date\": \"2024-10-01T10:00:00.000Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>There was an error creating the transaction.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"message\": \"Error message here\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminTransaction.js",
    "groupTitle": "Transaction"
  },
  {
    "type": "get",
    "url": "/transaction/pendingfee",
    "title": "Get Pending Fee Payments",
    "name": "GetPendingPayments",
    "group": "Transaction",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token for admin access.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "studentsWithPendingPayments",
            "description": "<p>List of students with pending fees.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "studentsWithPendingPayments.studentId",
            "description": "<p>ID of the student.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "studentsWithPendingPayments.pendingMonths",
            "description": "<p>Months for which fees are pending.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "studentsWithPendingPayments.studentEmail",
            "description": "<p>Email of the student.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "studentsWithPendingPayments.amountDue",
            "description": "<p>Total amount due.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"studentsWithPendingPayments\": [\n    {\n      \"studentId\": \"60d5f60c9b4d7635e8aebaf7\",\n      \"pendingMonths\": [\"September\", \"October\"],\n      \"studentEmail\": \"student@example.com\",\n      \"amountDue\": 150\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AdminNotFound",
            "description": "<p>The user making the request is not an admin.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoStudentsFound",
            "description": "<p>No students found in the school.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal server error during the fetching process.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"admin not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"No students found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Internal server error\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminTransaction.js",
    "groupTitle": "Transaction"
  },
  {
    "type": "get",
    "url": "/transaction/get/:id",
    "title": "Get Transaction by ID",
    "name": "GetTransactionById",
    "group": "Transaction",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Transaction's unique ID.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's access token.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Transaction retrieved successfully\",\n  \"data\": {\n    \"_id\": \"652def8a7a39a61056fb8654\",\n    \"_user\": {\n      \"_id\": \"652dc8b95a36b92434b54e88\",\n      \"firstName\": \"John\",\n      \"lastName\": \"Doe\",\n      \"email\": \"john.doe@example.com\"\n    },\n    \"amount\": 1000,\n    \"busFee\": 50,\n    \"totalAmount\": 1050,\n    \"status\": \"pending\",\n    \"date\": \"2024-10-07T10:00:00Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TransactionNotFound",
            "description": "<p>The transaction with the given ID was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Server-side issue occurred while retrieving transaction.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "TransactionNotFound:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": true,\n  \"message\": \"Transaction not found\"\n}",
          "type": "json"
        },
        {
          "title": "InternalServerError:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"message\": \"An error occurred while processing the request\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminTransaction.js",
    "groupTitle": "Transaction"
  },
  {
    "type": "put",
    "url": "//transaction/update",
    "title": "Update Transaction",
    "name": "UpdateTransaction",
    "group": "Transaction",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "description": "<p>This endpoint allows an admin to update an existing transaction's details such as the amount, bus fee, and status.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token (Admin's token)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "transactionId",
            "description": "<p>The ID of the transaction to be updated.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "userId",
            "description": "<p>The ID of the user associated with the transaction.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "amount",
            "description": "<p>The new transaction amount.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "busFee",
            "description": "<p>The new bus fee amount.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"success\"",
              "\"pending\""
            ],
            "optional": true,
            "field": "status",
            "description": "<p>The new status of the transaction.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether the operation was successful or not.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "transaction",
            "description": "<p>The updated transaction object.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Transaction updated successfully\",\n  \"transaction\": {\n    \"_id\": \"652def8a7a39a61056fb8654\",\n    \"_user\": \"652dc8b95a36b92434b54e88\",\n    \"amount\": 1000,\n    \"busFee\": 50,\n    \"totalAmount\": 1050,\n    \"status\": \"pending\",\n    \"date\": \"2024-10-01T10:00:00.000Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates that there was an error.</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>The reason for the error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"Invalid transaction data provided.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": true,\n  \"reason\": \"You are not authorized to update this transaction.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": true,\n  \"reason\": \"Transaction not found.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminTransaction.js",
    "groupTitle": "Transaction"
  },
  {
    "type": "put",
    "url": "/activatedeactivate/:id",
    "title": "Activate/Deactivate user",
    "name": "DeactivateUser",
    "group": "User",
    "permission": [
      {
        "name": "Admin,superAdmin"
      }
    ],
    "description": "<p>superAdmin can active deactivate any user and admin can only activate deactivate teacher and student</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "flag",
            "description": "<p>true or false</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates whether an error occurred (true when an error occurred).</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Reason for the failure.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "User Not Found",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"user not found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/auth/signup.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/updateprofile/",
    "title": "Edit Own Profile Data",
    "version": "1.0.0",
    "name": "EditUser",
    "group": "User",
    "permission": [
      {
        "name": "teacher, admin, student"
      }
    ],
    "description": "<p>Allows a user (teacher, admin, or student) to update their profile information.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's unique access token (JWT).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message indicating that the user details were updated.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"User details updated successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 404": [
          {
            "group": "Error 404",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The user was not found.</p>"
          }
        ],
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "InvalidUserType",
            "description": "<p>Only teacher, admin, or student roles are allowed to edit.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Internal server error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"message\": \"User not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"User must be Admin, Teacher or Student\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Server error\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Request-Example:",
        "content": "{\n  \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"phone\": \"1234567890\",\n    \"dob\": \"1990-05-15\",\n    \"signature\": \"John's Signature\",\n    \"profileImage\": \"path_to_image.jpg\",\n    \"email\": \"john.doe@example.com\",\n    \"guardian\": {\n      \"fatherName\": \"Michael Doe\",\n      \"motherName\": \"Jane Doe\"\n    },\n    \"address\": \"123 Main St, Springfield\"\n}",
        "type": "json"
      }
    ],
    "filename": "routes/rest/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/v1/profile",
    "title": "Get loggedIn User Details",
    "name": "GetUser",
    "group": "User",
    "version": "1.0.0",
    "description": "<p>Fetch a user's details using their ID,The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the user.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET http://localhost:3000/api/v1/user/6711051061792663918458bf",
        "type": "curl"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"user\": {\n    \"_id\": \"6711051061792663918458bf\",\n    \"username\": \"mahesh\",\n    \"firstName\": \"admin\",\n    \"lastName\": \"abcd\",\n    \"email\": \"mahesh123@gmail.com\",\n    \"accountType\": \"email\",\n    \"dob\": \"2001-12-07T18:30:00.000Z\",\n    \"loginType\": \"admin\",\n    \"isActive\": true,\n    \"isAdmin\": true,\n    \"isSuperAdmin\": false,\n    \"bankAdded\": false,\n    \"_school\": \"670cc3c55aa29e2e31348c7e\",\n    \"customerStripeId\": \"cus_R2yvkL6hLUVk7h\",\n    \"isPaid\": false,\n    \"messagingEnabled\": true,\n    \"createdAt\": \"2024-10-17T12:37:36.453Z\",\n    \"updatedAt\": \"2024-10-17T13:15:32.530Z\",\n    \"address\": \"Sambalpur,Odisha,768005\",\n    \"gender\": \"Female\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"No user found for the given id\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/users.js",
    "groupTitle": "User"
  }
] });
