define({ "api": [
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
            "field": "studentCSV",
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
    "title": "Delete User",
    "group": "Admin",
    "permission": [
      {
        "name": "SuperAdmin,admin"
      }
    ],
    "name": "DeleteUser",
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
    "type": "POST",
    "url": "/admin/fetchavailableteachers",
    "title": "Fetch Available Teachers",
    "name": "FetchAvailableTeachers",
    "group": "Admin",
    "version": "1.0.0",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "description": "<p>Fetch a list of available teachers for each day and period based on the school's schedule.</p>",
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
      "examples": [
        {
          "title": "Request Example:",
          "content": "{\n  \"schoolId\": \"6705007aa091352256b07f53\" // This is fetched from the logged-in user's school.\n}",
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
            "description": "<p>Indicates if there was an error.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "availableTeachersList",
            "description": "<p>A list of available teachers grouped by day.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "availableTeachersList[day]",
            "description": "<p>Array of periods for the day.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"availableTeachersList\": {\n    \"mon\": [\n      {\n        \"startTime\": \"10:30\",\n        \"endTime\": \"11:15\",\n        \"availableTeachers\": [\"teacherId1\", \"teacherId2\"]\n      },\n      {\n        \"startTime\": \"11:15\",\n        \"endTime\": \"12:00\",\n        \"availableTeachers\": [\"teacherId3\"]\n      }\n    ],\n    \"tue\": [\n      {\n        \"startTime\": \"10:30\",\n        \"endTime\": \"11:15\",\n        \"availableTeachers\": [\"teacherId4\"]\n      }\n    ]\n  }\n}",
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
            "description": "<p>Indicates if there was an error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message describing the issue.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"message\": \"Error fetching available teachers\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/adminSchedules.js",
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
    "url": "/api/v1/admin/students/view-students",
    "title": "View all students",
    "name": "ViewAllStudents",
    "group": "Admin",
    "description": "<p>This endpoint allows admins, teachers, or super admins to view all students based on search filters and pagination.</p>",
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
            "optional": true,
            "field": "className",
            "description": "<p>The name of the class to filter students.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "section",
            "description": "<p>The section of the class to filter students.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "searchString",
            "description": "<p>Optional search string to filter students. The search can be based on:</p> <ul> <li><code>rollNo</code> (numeric, typically shorter than phone numbers)</li> <li><code>phone</code> (numeric, matches exactly)</li> <li><code>gender</code> (e.g., &quot;Male&quot;, &quot;Female&quot;)</li> <li><code>email</code> (case-insensitive)</li> <li><code>firstName</code> (case-insensitive)</li> <li><code>lastName</code> (case-insensitive)</li> <li><code>fullName</code> (case-insensitive)</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "pageNo",
            "description": "<p>Page number for pagination. Default is 1.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "skipLimit",
            "description": "<p>Number of students per page. Default is 10.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "sortBy",
            "defaultValue": "rollNo",
            "description": "<p>Field to sort students by(rollNo or class). Default is <code>rollNo</code>.</p>"
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
            "description": "<p>Indicates whether an error occurred. Always <code>false</code> for successful responses.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "students",
            "description": "<p>List of students.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students._id",
            "description": "<p>Student ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.firstName",
            "description": "<p>First name of the student.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.lastName",
            "description": "<p>Last name of the student.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.fullName",
            "description": "<p>Full name of the student.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.rollNo",
            "description": "<p>Roll number of the student.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.email",
            "description": "<p>Email number of the student(must be unique).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.phone",
            "description": "<p>Phone number of the student(must be unique).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.gender",
            "description": "<p>Gender of the student.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "students._class",
            "description": "<p>Class details of the student.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students._class.name",
            "description": "<p>Name of the class.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students._class.section",
            "description": "<p>Section of the class.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "totalStudents",
            "description": "<p>Total number of students matching the filters.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "totalPages",
            "description": "<p>Total number of pages for the current pagination.</p>"
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
            "description": "<p>Indicates whether an error occurred. Always <code>true</code> for error responses.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message describing the issue.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "403 Forbidden:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": true,\n  \"message\": \"You do not have permission to view student details\"\n}",
          "type": "json"
        },
        {
          "title": "404 Not Found:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": true,\n  \"message\": \"10th Grade-A not available for 2024-2025\"\n}",
          "type": "json"
        },
        {
          "title": "500 Internal Server Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"message\": \"An unexpected error occurred\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST \\\n  http://localhost:3000/api/v1/admin/students/view-students \\\n  -H 'Authorization: Bearer <your-token>' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n        \"className\": \"10th Grade\",\n        \"section\": \"A\",\n        \"searchString\": \"123\",\n        \"pageNo\": 1,\n        \"skipLimit\": 20,\n        \"sortBy\": \"rollNo\"\n      }'",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/rest/adminStudent.js",
    "groupTitle": "Admin"
  },
  {
    "type": "get",
    "url": "/user/:id",
    "title": "get user details",
    "name": "userDetails",
    "group": "Admin_User",
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
    "groupTitle": "Admin_User"
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
    "type": "get",
    "url": "admin/notice/awstempcreds",
    "title": "5.0 Get Temporary AWS Key",
    "name": "GetAwsKey",
    "group": "Auth",
    "permission": [
      {
        "name": "user"
      }
    ],
    "description": "<p>Fetches temporary AWS credentials (Access Key, Secret Key, and Session Token) using AWS STS (Security Token Service). These credentials can be used for accessing AWS services like S3 for a limited time.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in the format &quot;Bearer xxxx.yyyy.zzzz&quot;.</p>"
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
            "description": "<p>Indicates if there was an error (always <code>false</code> for success).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "S3BucketName",
            "description": "<p>The name of the S3 bucket.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "S3Region",
            "description": "<p>The AWS region where the S3 bucket is located.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "AccessKeyId",
            "description": "<p>The temporary AWS Access Key ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "SecretAccessKey",
            "description": "<p>The temporary AWS Secret Access Key.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "SessionToken",
            "description": "<p>The temporary session token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"S3BucketName\": \"your-bucket-name\",\n  \"S3Region\": \"us-east-1\",\n  \"AccessKeyId\": \"ASIAxxxxxxxxxxxxxxx\",\n  \"SecretAccessKey\": \"wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEKEY\",\n  \"SessionToken\": \"FQoGZXIvYXdzEPn//////////wEaDJASmdZoWJj+lXCh...\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>An error occurred while generating the temporary AWS credentials.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"reason\": \"Invalid AWS Access Key or Secret Key\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminNotices.js",
    "groupTitle": "Auth"
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
    "group": "Leave",
    "permission": [
      {
        "name": "Teacher"
      }
    ],
    "description": "<p>This endpoint allows teachers to retrieve their leave requests with optional filtering by leave type, reason, or status.</p>",
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
    "groupTitle": "Leave"
  },
  {
    "type": "post",
    "url": "/leaves",
    "title": "Get all leaves",
    "name": "GetAllLeaves",
    "group": "Leave",
    "permission": [
      {
        "name": "admin, teacher"
      }
    ],
    "description": "<p>This endpoint retrieves a paginated list of leave records. Admins can view all leaves within their school, while teachers can view only their own leave records.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token required for authentication.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "PermissionError",
            "description": "<p>No permission to access leaves.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Internal server error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"No permission\"\n}",
          "type": "json"
        },
        {
          "title": "Server Error Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Internal server error message\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success Response (admin):",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"leaves\": [\n    {\n      \"_id\": \"64a67f5a9a3c45e1d2c7b1e5\",\n      \"_teacher\": \"64a678f7e6c9b0b7f0e8d456\",\n      \"_school\": \"64a6715a9f1b24b8d2c7a5e7\",\n      \"createdAt\": \"2024-11-01T10:00:00.000Z\"\n    },\n    ...\n  ],\n  \"totalLeaves\": 50\n}",
          "type": "json"
        },
        {
          "title": "Success Response (teacher):",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"leaves\": [\n    {\n      \"_id\": \"64a67f5a9a3c45e1d2c7b1e5\",\n      \"_teacher\": \"64a678f7e6c9b0b7f0e8d456\",\n      \"_school\": \"64a6715a9f1b24b8d2c7a5e7\",\n      \"createdAt\": \"2024-11-01T10:00:00.000Z\"\n    }\n  ],\n  \"totalLeaves\": 10\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/leave.js",
    "groupTitle": "Leave"
  },
  {
    "type": "get",
    "url": "/leave/:id",
    "title": "Retrieve Leave by ID",
    "name": "GetLeave",
    "group": "Leave",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Leave unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"leave\": {\n    \"_id\": \"6724d6a7eaa09a9de7c7e922\",\n    \"_school\": \"671a88862e586338c6c94516\",\n    \"_teacher\": \"671f435dadf7c71b57b7927d\",\n    \"startDate\": \"2024-11-10T00:00:00.000Z\",\n    \"endDate\": \"2024-11-12T00:00:00.000Z\",\n    \"reason\": \"due to health issue\",\n    \"status\": \"pending\",\n    \"appliedDate\": \"2024-11-01T13:24:55.270Z\",\n    \"isHalfDay\": true,\n    \"__v\": 0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Leave Not Found:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"leave not found\"\n}",
          "type": "json"
        },
        {
          "title": "Server Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"Error\": \"error message\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/leave.js",
    "groupTitle": "Leave"
  },
  {
    "type": "get",
    "url": "/remainingleave",
    "title": "Get Teacher Remaining Leave",
    "name": "GetRemainingLeave",
    "group": "Leave",
    "permission": [
      {
        "name": "Teacher"
      }
    ],
    "description": "<p>Retrieve the remaining leave for the logged-in teacher.</p>",
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
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>User object containing remaining leave details.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user.remainingLeave",
            "description": "<p>Leave details.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user.remainingLeave.CL",
            "description": "<p>Casual Leave .</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user.remainingLeave.PL",
            "description": "<p>Privilege Leave.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user.remainingLeave.SL",
            "description": "<p>Sick Leave .</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"user\": {\n    \"remainingLeave\": {\n      \"CL\": 2,\n      \"PL\": 7,\n      \"SL\": 6\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Unauthorized (Not a Teacher):",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You are not teacher\"\n}",
          "type": "json"
        },
        {
          "title": "Internal Server Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"Error\": \"Some internal error message\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/leave.js",
    "groupTitle": "Leave"
  },
  {
    "type": "post",
    "url": "/leave/get",
    "title": "Get Leaves",
    "description": "<p>Fetches leave applications for teachers or all teachers by admin. Teachers can filter their leaves based on leave type and status, while admins can view leaves for specific teachers or filter by leave type and status.</p>",
    "version": "1.0.0",
    "group": "Leave",
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
    "groupTitle": "Leave",
    "name": "PostLeaveGet"
  },
  {
    "type": "post",
    "url": "/teacher/leave",
    "title": "Apply Leave",
    "description": "<p>Allows teachers to apply for leave by providing the necessary details.</p>",
    "version": "1.0.0",
    "group": "Leave",
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
    "groupTitle": "Leave",
    "name": "PostTeacherLeave"
  },
  {
    "type": "post",
    "url": "/leavestatus/:id",
    "title": "Update Leave Status",
    "name": "UpdateLeaveStatus",
    "group": "Leave",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "description": "<p>Update the status of a leave request. Only admins can perform this action.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Leave request ID.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request Example:",
        "content": "PUT /leave/12345\n{\n  \"status\": \"approved\"\n}",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"leave\": {\n    \"_id\": \"673356750726b5a7972c4516\",\n    \"_school\": \"670cc3c55aa29e2e31348c7e\",\n    \"_teacher\": \"670cf24bdbb09a7c2b2af9a0\",\n    \"leaveType\": \"SL\",\n    \"startDate\": \"2024-11-06T00:00:00.000Z\",\n    \"endDate\": \"2024-11-15T00:00:00.000Z\",\n    \"reason\": \"All Test\",\n    \"status\": \"approved\",\n    \"appliedDate\": \"2024-11-12T13:21:57.549Z\",\n    \"createdAt\": \"2024-11-12T13:21:57.550Z\",\n    \"updatedAt\": \"2024-11-13T08:05:01.360Z\",\n    \"__v\": 0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response (Not Admin):",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You are not admin\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response (Invalid Status):",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"message\": \"Invalid leave type. Must be one of approved, rejected, or cancelled\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/leave.js",
    "groupTitle": "Leave"
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
    "url": "/admin/notice/createnotice",
    "title": "Create Notice",
    "name": "CreateNotice",
    "group": "Notice",
    "description": "<p>This route allows an admin or a teacher to create a notice. Teachers can only post notices for students.</p>",
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
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>The title of the notice.</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>The description or content of the notice.</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "allowedValues": [
              "\"student\"",
              "\"teacher\"",
              "\"general\""
            ],
            "optional": false,
            "field": "noticeType",
            "description": "<p>The type of the notice. Teachers can only create student notices.</p>"
          },
          {
            "group": "Request body",
            "type": "Boolean",
            "optional": true,
            "field": "isUrgent",
            "description": "<p>Indicates if the notice is urgent.</p>"
          },
          {
            "group": "Request body",
            "type": "Date",
            "optional": true,
            "field": "expireDate",
            "description": "<p>The expiration date of the notice.</p>"
          },
          {
            "group": "Request body",
            "type": "Array",
            "optional": true,
            "field": "attachments",
            "description": "<p>Array of attachment objects, each containing:</p> <ul> <li><code>createdAt</code> (Date): Date when the attachment was added (optional, defaults to current date if not provided).</li> <li><code>doctype</code> (String): Type of the document (e.g., PDF, image).</li> <li><code>filename</code> (String): Name of the attachment file.</li> <li><code>url</code> (String): URL where the attachment is stored.</li> </ul>"
          },
          {
            "group": "Request body",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "defaultValue": "true",
            "description": "<p>Indicates if the notice is currently active.</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": true,
            "field": "signatureOfTeacherUrl",
            "description": "<p>URL to the teacher's signature (required if posted by a teacher).</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request-Example:",
        "content": "{\n  \"title\": \"School Assembly\",\n  \"description\": \"Mandatory attendance for all students.\",\n  \"noticeType\": \"student\",\n  \"isUrgent\": true,\n  \"expireDate\": \"2024-11-30T00:00:00Z\",\n  \"attachments\": [\n    {\n      \"createdAt\": \"2024-11-04T10:30:00Z\",\n      \"doctype\": \"pdf\",\n      \"filename\": \"assembly_schedule.pdf\",\n      \"url\": \"https://example.com/assembly_schedule.pdf\"\n    }\n  ],\n  \"isActive\": true,\n  \"signatureOfTeacherUrl\": \"https://example.com/signature.png\"\n}",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403",
            "description": "<p>Unauthorized Only admins or teachers can create notices.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminNotices.js",
    "groupTitle": "Notice"
  },
  {
    "type": "delete",
    "url": "/admin/notice/deletenotice/:id",
    "title": "Delete Notice",
    "name": "DeleteNotice",
    "group": "Notice",
    "description": "<p>Deletes a specific notice. Only accessible by admin or the teacher who posted the notice.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the notice to be deleted.</p>"
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
            "description": "<p>Bearer token for authentication.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Notice deleted successfully\",\n  \"noticeId\": \"609e127e60b5f5095c4d2f14\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>If the notice with the specified ID does not exist.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>If the user is not an admin or the original posting teacher.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>If an unexpected error occurs during deletion.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": true,\n  \"reason\": \"Unauthorized\"\n}",
          "type": "json"
        },
        {
          "title": "NoNoticeFound:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"No such Notice!\"\n}",
          "type": "json"
        },
        {
          "title": "InternalServerError:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"reason\": \"An error message explaining the issue\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminNotices.js",
    "groupTitle": "Notice"
  },
  {
    "type": "get",
    "url": "/admin/notice/getNotice/:id",
    "title": "Get a specific notice by ID",
    "name": "GetNotice",
    "group": "Notice",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's unique access token.</p>"
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
            "description": "<p>Notice's unique ID.</p>"
          }
        ]
      }
    },
    "description": "<p>This endpoint retrieves a specific notice by its ID. Access is restricted based on the user's role:</p> <ul> <li>Admins can view all types of notices.</li> <li>Teachers can view notices of type &quot;teacher&quot; and &quot;general&quot;.</li> <li>Students can view notices of type &quot;student&quot; and &quot;general&quot;.</li> </ul>",
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"notice\": {\n    \"_id\": \"12345\",\n    \"title\": \"Important Update\",\n    \"description\": \"This is an important notice\",\n    \"noticeType\": \"general\",\n    \"isUrgent\": true,\n    \"postedBy\": \"67890\",\n    \"expireDate\": \"2024-12-31T23:59:59.999Z\",\n    \"attachments\": [],\n    \"isActive\": true,\n    \"postedDate\": \"2024-11-04T10:00:00.000Z\",\n    \"signatureOfTeacherUrl\": \"\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates that an error occurred.</p>"
          },
          {
            "group": "Error 400",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Reason for the failure, such as &quot;No such Notice!&quot;.</p>"
          }
        ],
        "Error 403": [
          {
            "group": "Error 403",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates that an error occurred.</p>"
          },
          {
            "group": "Error 403",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>&quot;Unauthorized&quot; - The user does not have permission to view the requested notice.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates that an error occurred.</p>"
          },
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>The error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"No such Notice!\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminNotices.js",
    "groupTitle": "Notice"
  },
  {
    "type": "put",
    "url": "/admin/notice/editnotice/:id",
    "title": "Update Notice",
    "name": "UpdateNotice",
    "group": "Notice",
    "permission": [
      {
        "name": "admin, teacher"
      }
    ],
    "description": "<p>Updates an existing notice. Only the admin or the teacher who posted the notice can make changes. If the expiration date (<code>expireDate</code>) is modified, the associated scheduled agenda job will be rescheduled accordingly.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Notice unique ID.</p>"
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
            "description": "<p>Bearer token.</p>"
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
            "type": "Object",
            "optional": false,
            "field": "notice",
            "description": "<p>Updated notice object.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"notice\": {\n    \"_id\": \"123456789\",\n    \"title\": \"Updated Notice Title\",\n    \"description\": \"This is an updated description for the notice.\",\n    \"expireDate\": \"2024-12-31T23:59:59Z\",\n    \"isUrgent\": true,\n    \"attachments\": {\n      \"url\": \"https://example.com/attachment.pdf\",\n      \"fileName\": \"attachment.pdf\"\n    },\n    \"isActive\": true,\n    \"postedDate\": \"2024-11-04T12:00:00Z\",\n    \"postedBy\": \"987654321\",\n    \"noticeType\": \"student\",\n    \"signatureOfTeacherUrl\": \"https://example.com/signature.png\"\n  }\n}",
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
            "description": "<p>Indicates if there was an error.</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Reason for the error (e.g., &quot;No such Notice!&quot; if the notice does not exist).</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates if there was an error.</p>"
          },
          {
            "group": "403",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Reason for the error (e.g., &quot;Unauthorized&quot; if the user does not have permission to edit the notice).</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates if there was a server error.</p>"
          },
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error Response (No Notice Found):",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"No such Notice!\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response (Unauthorized):",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": true,\n  \"reason\": \"Unauthorized\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Request Example:",
        "content": "PUT /admin/notice/editnotice/123456789\n{\n  \"title\": \"Updated Notice Title\",\n  \"description\": \"This is an updated description for the notice.\",\n  \"expireDate\": \"2024-12-31T23:59:59Z\",\n  \"isUrgent\": true,\n  \"attachments\": {\n    \"url\": \"https://example.com/attachment.pdf\",\n    \"fileName\": \"attachment.pdf\"\n  },\n  \"isActive\": true\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/rest/adminNotices.js",
    "groupTitle": "Notice"
  },
  {
    "type": "post",
    "url": "/notices",
    "title": "Get all notices with pagination and filters",
    "name": "GetNotices",
    "group": "Notices",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "searchString",
            "description": "<p>Search term for filtering notices by title (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "pageNo",
            "defaultValue": "1",
            "description": "<p>Page number for pagination (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "skipLimit",
            "defaultValue": "10",
            "description": "<p>Number of items per page (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "dateRange",
            "description": "<p>Date range filter (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dateRange.start",
            "description": "<p>Start date for filtering notices. <strong>(Required if dateRange is provided)</strong>.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "dateRange.end",
            "description": "<p>End date for filtering notices. <strong>(Optional but must be provided with start)</strong>.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>Filter notices by type (optional, can be &quot;student&quot;, &quot;teacher&quot;, &quot;general&quot;).</p>"
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
            "description": "<p><code>false</code> if the request was successful.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "count",
            "description": "<p>Total number of notices matching the filter.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "notices",
            "description": "<p>List of notices matching the filter.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "pageNo",
            "description": "<p>Current page number.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "skipLimit",
            "description": "<p>Number of notices per page.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "totalPages",
            "description": "<p>Total number of pages.</p>"
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
            "description": "<p><code>true</code> if there is a bad request (e.g., missing start or end date).</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Error message, e.g., &quot;Please select both start and end dates&quot;.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p><code>true</code> if there is a server error.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example request:",
        "content": "fetch(\"/notices\", {\n  method: \"POST\",\n  headers: {\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    searchString: \"Exam\",\n    pageNo: 1,\n    skipLimit: 10,\n    dateRange: {\n      start: \"2024-11-01\",\n      end: \"2024-11-20\"\n    },\n    type: \"student\"\n  })\n});",
        "type": "js"
      },
      {
        "title": "Example response:",
        "content": "{\n  \"error\": false,\n  \"count\": 25,\n  \"notices\": [\n    {\n      \"title\": \"Important Exam Schedule\",\n      \"noticeType\": \"student\",\n      \"postedDate\": \"2024-11-01T00:00:00.000Z\",\n      \"expireDate\": \"2024-11-30T23:59:59.999Z\",\n      \"isActive\": true\n    },\n    ...\n  ],\n  \"pageNo\": 1,\n  \"skipLimit\": 10,\n  \"totalPages\": 3\n}",
        "type": "js"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/rest/adminNotices.js",
    "groupTitle": "Notices"
  },
  {
    "type": "post",
    "url": "/admin/progressReport/createprogressreport",
    "title": "Upload and Create Progress Reports",
    "name": "CreateProgressReport",
    "group": "ProgressReport",
    "description": "<p>This endpoint allows an admin or teacher to upload a CSV file containing students' progress report data and create progress report entries in the database.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "csvFile",
            "description": "<p>CSV file containing the progress report data.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "schoolId",
            "description": "<p>The ID of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "academicYear",
            "description": "<p>The academic year of the progress report.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "className",
            "description": "<p>The name of the class (e.g., &quot;Grade 10&quot;).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "section",
            "description": "<p>The section of the class (e.g., &quot;A&quot;).</p>"
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
            "description": "<p>Bearer token (JWT) with user information.</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "Admin, Teacher"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message confirming report generation.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"Progress reports generated successfully!\"\n}",
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
            "field": "Unauthorized",
            "description": "<p>Only users with the role &quot;admin&quot; or &quot;teacher&quot; can upload progress reports.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>No file was uploaded.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>School or class not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoMatchingStudents",
            "description": "<p>No students were found matching the given Roll Numbers, School ID, Class, and Section.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ExistingReports",
            "description": "<p>All reports already exist for the given students and term.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Error processing the file or data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"Unauthorized. Only admins or teachers can upload progress reports.\"\n}",
          "type": "json"
        },
        {
          "title": "No File Error:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"No file uploaded.\"\n}",
          "type": "json"
        },
        {
          "title": "School/Class Not Found:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"message\": \"School or class not found.\"\n}",
          "type": "json"
        },
        {
          "title": "No Matching Students:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"message\": \"No matching students found.\"\n}",
          "type": "json"
        },
        {
          "title": "No New Reports:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"message\": \"No new progress reports to generate. All reports already exist for the given students.\"\n}",
          "type": "json"
        },
        {
          "title": "Server Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Error processing the data\",\n  \"details\": \"Detailed error message\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminProgressReport.js",
    "groupTitle": "ProgressReport"
  },
  {
    "type": "post",
    "url": "/getallprogressreport",
    "title": "Get All Progress Reports",
    "name": "GetAllProgressReports",
    "group": "ProgressReport",
    "version": "1.0.0",
    "permission": [
      {
        "name": "Admin, Teacher, SuperAdmin"
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
            "description": "<p>Bearer token for authentication.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>User does not have permission to access this resource.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "ClassNotFound",
            "description": "<p>No class was found for the specified filters.</p>"
          },
          {
            "group": "404",
            "optional": false,
            "field": "ProgressReportNotFound",
            "description": "<p>No progress reports were found for the specified filters.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Unexpected server error occurred.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error Response (Class Not Found):",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"message\": \"Class not found.\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response (No Progress Reports Found):",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"message\": \"No progress reports found for the specified criteria.\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response (Unauthorized):",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"Unauthorized. Access restricted to admin, teacher, or super admin.\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response (Server Error):",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Error retrieving progress reports\",\n  \"details\": \"Error message here.\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example Request:",
        "content": "POST /api/v1/progress-report/get-all\n{\n  \"academicYear\": \"2024-2025\",\n  \"className\": \"10th Grade\",\n  \"section\": \"A\"\n}",
        "type": "json"
      }
    ],
    "filename": "routes/rest/adminProgressReport.js",
    "groupTitle": "ProgressReport"
  },
  {
    "type": "get",
    "url": "/admin/progressReport/getprogressreport/:studentId",
    "title": "Retrieve Student Progress Report",
    "name": "GetProgressReport",
    "group": "ProgressReport",
    "permission": [
      {
        "name": "student, teacher, admin"
      }
    ],
    "description": "<p>Retrieve the progress report for a student by class and academic year. Admins and teachers can view any student’s report by providing the student’s ID. Students can only view their own report.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "studentId",
            "description": "<p>Student's unique ID. Required for admins and teachers.</p>"
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
            "description": "<p>Bearer Token for authentication.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Postman Testing:",
          "content": "Add `class` and `academicYear` as query parameters:\n  - `class`: Set to the class name (e.g., \"10th Grade\").\n  - `academicYear`: Set to the desired academic year (e.g., \"2023-2024\").\nSend the request.",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\nHTTP/1.1 400 Bad Request\n{\n  \"error\": \"Please provide both class and academic year.\"\n}\n\nHTTP/1.1 403 Forbidden\n{\n  \"error\": \"Unauthorized access.\"\n}\n\nHTTP/1.1 404 Not Found\n{\n  \"message\": \"No progress reports found for the specified class and academic year.\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Error retrieving the progress report\",\n  \"details\": \"Detailed error message\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/adminProgressReport.js",
    "groupTitle": "ProgressReport"
  },
  {
    "type": "post",
    "url": "/admin/setscheduletime",
    "title": "Set Weekly Schedule",
    "name": "SetScheduleTime",
    "group": "Schedule",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "description": "<p>Set the weekly schedule for a school.</p>",
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
            "description": "<p>Success message confirming the schedule was set.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "weekSchedule",
            "description": "<p>The saved weekly schedule.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "weekSchedule.mon",
            "description": "<p>Monday's schedule.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "weekSchedule.mon.periodDuration",
            "description": "<p>Duration of each period (in minutes).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "weekSchedule.mon.startTime",
            "description": "<p>Start time of the schedule (HH:mm).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "weekSchedule.mon.endTime",
            "description": "<p>End time of the schedule (HH:mm).</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "weekSchedule.mon.breakTime",
            "description": "<p>Break time between periods (in minutes).</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "weekSchedule.tue",
            "description": "<p>Tuesday's schedule. (Same as <code>weekSchedule.mon</code> structure) ...</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Schedule created successfully\",\n  \"weekSchedule\": {\n    \"mon\": {\n      \"periodDuration\": 40,\n      \"startTime\": \"09:00\",\n      \"endTime\": \"13:00\",\n      \"breakTime\": 10\n    },\n    \"tue\": {\n      \"periodDuration\": 40,\n      \"startTime\": \"09:00\",\n      \"endTime\": \"13:00\",\n      \"breakTime\": 10\n    },\n    ...\n  }\n}",
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
            "description": "<p>Indicates if there was an error (true on failure).</p>"
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
          "title": "MissingFields:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"Required fields are missing in the schedule.\"\n}",
          "type": "json"
        },
        {
          "title": "InvalidToken:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": true,\n  \"reason\": \"Invalid or missing authorization token.\"\n}",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"reason\": \"An unexpected error occurred. Please try again later.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/settings.js",
    "groupTitle": "Schedule"
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
            "field": "principalName",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "schoolType",
            "description": "<p>[&quot;primary&quot;, &quot;secondary&quot;, &quot;highSchool&quot;]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "locationUrl",
            "description": "<p>url of school location</p>"
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
        "content": "{\n  \"name\": \"schoolXYZ\",\n  \"schoolAddress\": {\n    \"city\": \"Greenwood\",\n    \"state\": \"California\",\n    \"country\": \"USA\",\n    \"pinCode\": \"90210\"\n  },\n  \"contact\": {\n    \"phoneNo\": \"+1-f sjdfndsf\",\n    \"email\": \"info@greenwoodhigh.edu\",\n    \"website\": \"http://www.greenwoodhigh.edu\"\n  \"establishYear\":\"1995\",\n  },\n  \"location\": {\n    \"type\": \"Point\",\n    \"coordinates\": [21.418325060918168, 84.02980772446274]\n  },\n\"imageUrl\":\"http://www.greenwoodhigh.edu\"\n\"principalName\":\"\",\n  \"email\": \"sumanr@logic-square.com\",\n  \"firstName\": \"suman\",\n  \"lastName\": \"rana\",\n  \"dob\": \"12/08/2001\",\n  \"gender\": \"Male\",\n  \"phone\": \"9668123855\"\n\"profileImage\":\"nvkdjnvdjfnkfd\",\n\"locationUrl\":\"\"\n}",
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
    "url": "/school",
    "title": "Get All Schools",
    "name": "GetAllSchools",
    "group": "School",
    "version": "1.0.0",
    "description": "<p>Retrieve a paginated list of all schools with their associated admin details (only accessible by super admins).</p>",
    "permission": [
      {
        "name": "SuperAdmin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "pageNumber",
            "defaultValue": "1",
            "description": "<p>Page number for pagination (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "pageSize",
            "defaultValue": "10",
            "description": "<p>Number of records per page (optional).</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"school\": [\n    {\n      \"_id\": \"603ddf15e245ae19f85ce109\",\n      \"name\": \"Green Valley High School\",\n      \"registrationNumber\": \"GVHS-1234\",\n      \"address\": {\n        \"city\": \"San Francisco\",\n        \"state\": \"California\",\n        \"country\": \"USA\",\n        \"pinCode\": \"94107\"\n      },\n      \"contact\": {\n        \"phoneNo\": \"+1 415-555-0198\",\n        \"email\": \"info@greenvalleyhigh.com\",\n        \"website\": \"www.greenvalleyhigh.com\"\n      },\n      \"location\": {\n        \"type\": \"Point\",\n        \"coordinates\": [-122.399972, 37.781372]\n      },\n      \"principalName\": \"Dr. John Doe\",\n      \"establishYear\": 1995,\n      \"schoolType\": \"highSchool\",\n      \"totalStudents\": 1200,\n      \"totalClasses\": 40,\n      \"isActive\": true,\n      \"admin\": {\n        \"_id\": \"6711051061792663918458bf\",\n        \"username\": \"mahesh\",\n        \"firstName\": \"admin\",\n        \"lastName\": \"abcd\",\n        \"email\": \"mahesh123@gmail.com\",\n        \"accountType\": \"email\",\n        \"dob\": \"2001-12-08T00:00:00.000Z\",\n        \"loginType\": \"admin\",\n        \"isActive\": true,\n        \"isAdmin\": true,\n        \"isSuperAdmin\": false,\n        \"bankAdded\": false,\n        \"messagingEnabled\": true,\n        \"createdAt\": \"2024-10-17T12:37:36.453Z\",\n        \"updatedAt\": \"2024-10-24T11:53:08.239Z\",\n        \"gender\": \"Male\",\n        \"profileImage\": \"https://img.freepik.com/free-photo/sample-image.jpg\"\n      }\n    }\n  ],\n  \"totalSchools\": 100\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You are not superadmin\"\n}",
          "type": "json"
        },
        {
          "title": "Internal Server Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"Error\": \"Server Error Message\"\n}",
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
    "description": "<p>Fetch the details of a specific school using its ID, along with its assigned admin user.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique ID of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "pageNumber",
            "defaultValue": "1",
            "description": "<p>Page number for pagination (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "pageSize",
            "defaultValue": "10",
            "description": "<p>Number of records per page (optional).</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"school\": {\n    \"_id\": \"603ddf15e245ae19f85ce109\",\n    \"name\": \"Green Valley High School\",\n    \"registrationNumber\": \"GVHS-1234\",\n    \"address\": {\n      \"city\": \"San Francisco\",\n      \"state\": \"California\",\n      \"country\": \"USA\",\n      \"pinCode\": \"94107\"\n    },\n    \"contact\": {\n      \"phoneNo\": \"+1 415-555-0198\",\n      \"email\": \"info@greenvalleyhigh.com\",\n      \"website\": \"www.greenvalleyhigh.com\"\n    },\n    \"location\": {\n      \"type\": \"Point\",\n      \"coordinates\": [-122.399972, 37.781372]\n    },\n    \"principalName\": \"Dr. John Doe\",\n    \"establishYear\": 1995,\n    \"schoolType\": \"highSchool\",\n    \"totalStudents\": 1200,\n    \"totalClasses\": 40,\n    \"isActive\": true,\n    \"locationUrl\": \"\"\n  },\n  \"admin\": {\n    \"address\": {\n      \"city\": \"New York\",\n      \"country\": \"USA\",\n      \"locality\": \"Greenwood Avenue\",\n      \"pin\": \"10001\",\n      \"state\": \"NY\"\n    },\n    \"_id\": \"6711051061792663918458bf\",\n    \"username\": \"mahesh\",\n    \"firstName\": \"admin\",\n    \"lastName\": \"abcd\",\n    \"email\": \"mahesh123@gmail.com\",\n    \"accountType\": \"email\",\n    \"dob\": \"Sat Dec 08 2001 00:00:00 GMT+0530 (India Standard Time)\",\n    \"loginType\": \"admin\",\n    \"isActive\": true,\n    \"isAdmin\": true,\n    \"isSuperAdmin\": false,\n    \"bankAdded\": false,\n    \"_school\": \"670cc3c55aa29e2e31348c7e\",\n    \"customerStripeId\": \"cus_R2yvkL6hLUVk7h\",\n    \"messagingEnabled\": true,\n    \"createdAt\": \"2024-10-17T12:37:36.453Z\",\n    \"updatedAt\": \"2024-10-24T11:53:08.239Z\",\n    \"gender\": \"Male\",\n    \"profileImage\": \"https://img.freepik.com/free-photo/\",\n    \"id\": \"6711051061792663918458bf\"\n  }\n}",
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
            "field": "principalName",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "schoolType",
            "description": "<p>The type of the school  [&quot;primary&quot;, &quot;secondary&quot;, &quot;highSchool&quot;]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "locationUrl",
            "description": "<p>location url of school</p>"
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
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"settings\": [\n    {\n      \"_id\": \"60f7f15d9b1e8b001c3a8b8c\",\n      \"_school\": \"60f7f12e9b1e8b001c3a8b8b\",\n      \"academicYear\": \"2024-2025\",\n      \"availableClasses\": [\n        {\n          \"grade\": \"5\",\n          \"sections\": [\"A\", \"B\", \"C\"],\n          \"monthlyFee\": 1500\n        }\n      ],\n      \"busFee\": [\n        { \"range\": \"morning\", \"fee\": 500 },\n        { \"range\": \"evening\", \"fee\": 500 }\n      ],\n      \"isActive\": true\n    }\n  ],\n  \"schoolDetails\": {\n    \"_id\": \"671b5f46365b083490f126d2\",\n    \"name\": \"Khukurdaha I C M M High School\",\n    \"registrationNumber\": \"REG3167\",\n    \"address\": {\n      \"city\": \"Panskura\",\n      \"state\": \"West Bengal\",\n      \"country\": \"India\",\n      \"pinCode\": \"721641\"\n    },\n    \"contact\": {\n      \"phoneNo\": \"+91 8172059732\",\n      \"email\": \"kicmmhs@gmail.com\",\n      \"website\": \"kicmmhs.edu\"\n    },\n    \"location\": {\n      \"type\": \"Point\",\n      \"coordinates\": [21.418325060918168, 84.02980772446274]\n    },\n    \"principalName\": \"Mrinal Bera\",\n    \"establishYear\": 1995,\n    \"isActive\": true,\n    \"schoolType\": \"highSchool\",\n    \"createdAt\": \"2024-11-25T05:29:00.467Z\",\n    \"updatedAt\": \"2024-11-25T05:29:00.467Z\"\n  }\n}",
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
    "type": "put",
    "url": "/admin/updatesettings",
    "title": "Organization Settings Update",
    "name": "Organization_Settings_Update",
    "group": "Settings",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "description": "<p>Updates various settings for the school, including available classes, bus fees, salary ranges, holidays, leave types, subjects, and school details (e.g., name, registration number, address, contact, etc.).</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "setField",
            "description": "<p>The field to update. Possible values: <code>class</code>, <code>busFee</code>, <code>salary</code>, <code>holidays</code>, <code>leave</code>, <code>subjects</code>, <code>schools</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "availableClasses",
            "description": "<p>The available classes to be updated (only if <code>setField</code> is <code>class</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "availableClasses.grade",
            "description": "<p>The grade for the class.</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "availableClasses.sections",
            "description": "<p>List of sections for the class.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "availableClasses.monthlyFee",
            "description": "<p>The monthly fee for the class.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "busFee",
            "description": "<p>List of bus fee entries (only if <code>setField</code> is <code>busFee</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "busFee.range",
            "description": "<p>The range in the format <code>start-end</code> (e.g., <code>1-5</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "busFee.fee",
            "description": "<p>The bus fee for the range.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "salary",
            "description": "<p>List of salary ranges (only if <code>setField</code> is <code>salary</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "salary.range",
            "description": "<p>The salary range in the format <code>start-end</code> (e.g., <code>12-24</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "salary.amount",
            "description": "<p>The salary amount for the range.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "holidays",
            "description": "<p>List of holidays to be updated (only if <code>setField</code> is <code>holidays</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "holidays.name",
            "description": "<p>The name of the holiday.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "holidays.date",
            "description": "<p>The date of the holiday in <code>DD/MM/YYYY</code> format.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "leave",
            "description": "<p>List of leave types (only if <code>setField</code> is <code>leave</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "leave.type",
            "description": "<p>The type of leave (e.g., <code>CL</code>, <code>PL</code>, <code>SL</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "leave.days",
            "description": "<p>The number of days for the leave type.</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "subjectsArray",
            "description": "<p>List of subjects to be updated (only if <code>setField</code> is <code>subjects</code> and multiple subjects are provided).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "subjectsSingle",
            "description": "<p>Single subject to be updated (only if <code>setField</code> is <code>subjects</code> and a single subject is provided).</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "schools",
            "description": "<p>The school details to be updated (only if <code>setField</code> is <code>schools</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schools.name",
            "description": "<p>The name of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schools.registrationNumber",
            "description": "<p>The registration number of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "schools.address",
            "description": "<p>The address of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schools.address.city",
            "description": "<p>The city of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schools.address.state",
            "description": "<p>The state of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schools.address.country",
            "description": "<p>The country of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schools.address.pinCode",
            "description": "<p>The pin code of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "schools.contact",
            "description": "<p>The contact details of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schools.contact.phoneNo",
            "description": "<p>The phone number of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schools.contact.email",
            "description": "<p>The email of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schools.contact.website",
            "description": "<p>The website of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "schools.location",
            "description": "<p>The location of the school (latitude and longitude).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schools.location.type",
            "description": "<p>The location type (e.g., <code>Point</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": true,
            "field": "schools.location.coordinates",
            "description": "<p>The coordinates of the school as an array <code>[longitude, latitude]</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schools.principalName",
            "description": "<p>The name of the principal.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "schools.establishYear",
            "description": "<p>The year the school was established.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "schools.isActive",
            "description": "<p>The active status of the school (<code>true</code>/<code>false</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schools.schoolType",
            "description": "<p>The type of the school (e.g., <code>Public</code>, <code>Private</code>).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "settings",
            "description": "<p>The updated settings for the school.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "settings.schoolSubjectsList",
            "description": "<p>The updated list of subjects.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "settings.availableClasses",
            "description": "<p>The updated available classes.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "settings.busFee",
            "description": "<p>The updated bus fees.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "settings.salary",
            "description": "<p>The updated salary ranges.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "settings.holidays",
            "description": "<p>The updated holidays.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "settings.leave",
            "description": "<p>The updated leave types.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "school",
            "description": "<p>The updated school details.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "school.name",
            "description": "<p>The name of the school.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "school.registrationNumber",
            "description": "<p>The registration number of the school.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "school.address",
            "description": "<p>The address of the school.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "school.contact",
            "description": "<p>The contact details of the school.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "school.location",
            "description": "<p>The location of the school.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "school.principalName",
            "description": "<p>The name of the principal.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "school.establishYear",
            "description": "<p>The year the school was established.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "school.isActive",
            "description": "<p>The active status of the school.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "school.schoolType",
            "description": "<p>The type of the school.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Field validation failed. Specific reason is provided.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>The user is not authorized to perform this action (non-admin).</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Settings or school not found.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Server-side error occurred.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request Example (for updating subjects):",
        "content": "{\n  \"setField\": \"subjects\",\n  \"subjectsArray\": [\"Computer Science\", \"Physical Education\"]\n}",
        "type": "json"
      },
      {
        "title": "Request Example (for updating a single subject):",
        "content": "{\n  \"setField\": \"subjects\",\n  \"subjectsSingle\": \"Mathematics\"\n}",
        "type": "json"
      },
      {
        "title": "Request Example (for updating school details):",
        "content": "{\n  \"setField\": \"schools\",\n  \"schools\": {\n    \"name\": \"ABC High School\",\n    \"registrationNumber\": \"12345ABC\",\n    \"address\": {\n      \"city\": \"New York\",\n      \"state\": \"NY\",\n      \"country\": \"USA\",\n      \"pinCode\": \"10001\"\n    },\n    \"contact\": {\n      \"phoneNo\": \"+1234567890\",\n      \"email\": \"contact@abcschool.com\",\n      \"website\": \"http://abcschool.com\"\n    },\n    \"location\": {\n      \"type\": \"Point\",\n      \"coordinates\": [-74.0060, 40.7128]\n    },\n    \"principalName\": \"John Doe\",\n    \"establishYear\": 1995,\n    \"isActive\": true,\n    \"schoolType\": \"Public\"\n  }\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/rest/settings.js",
    "groupTitle": "Settings"
  },
  {
    "type": "post",
    "url": "admin/setsettings",
    "title": "Update School Settings",
    "name": "UpdateSettings",
    "group": "Settings",
    "version": "1.0.0",
    "description": "<p>This route allows an admin to update various settings for a school, including available classes, bus fees, salaries, holidays, leave policies, and subjects. Each update is categorized by the <code>setField</code> parameter.</p>",
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
            "type": "Object",
            "optional": false,
            "field": "settings",
            "description": "<p>The updated settings object.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "{\n  \"error\": false,\n  \"settings\": {\n    \"_id\": \"64f1b5fa4d589eb5b820db3e\",\n    \"_school\": \"64f1b5fa4d589eb5b820db3f\",\n    \"availableClasses\": [\n      { \"grade\": \"10th Grade\", \"sections\": [\"A\", \"B\", \"C\", \"D\"], \"monthlyFee\": 3000 }\n    ],\n    \"academicYear\": \"2024-2025\",\n    \"busFee\": [],\n    \"salary\": [],\n    \"holidays\": [],\n    \"leave\": [],\n    \"schoolSubjectsList\": [\"Mathematics\", \"Science\", \"History\"]\n  }\n}",
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
            "description": "<p>Indicates an error occurred.</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Explanation of the error.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates a server-side error occurred.</p>"
          },
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Validation Error:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"Field 'availableClasses' is required\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Request Example (Set Available Classes):",
        "content": "{\n  \"setField\": \"class\",\n  \"availableClasses\": [\n    { \"grade\": \"10th Grade\", \"monthlyFee\": 3000 },\n    { \"grade\": \"9th Grade\", \"monthlyFee\": 2500 }\n  ]\n}",
        "type": "json"
      },
      {
        "title": "Request Example (Set Bus Fees):",
        "content": "{\n  \"setField\": \"busFee\",\n  \"busFee\": [\n    { \"range\": \"1-5\", \"fee\": 500 },\n    { \"range\": \"6-10\", \"fee\": 800 }\n  ]\n}",
        "type": "json"
      },
      {
        "title": "Request Example (Set Holidays):",
        "content": "{\n  \"setField\": \"holidays\",\n  \"holidays\": [\"2024-12-25\", \"2024-01-01\"]\n}",
        "type": "json"
      },
      {
        "title": "Request Example (Set Subjects):",
        "content": "{\n  \"setField\": \"subjects\",\n  \"subjects\": [\"Mathematics\", \"Science\", \"History\"]\n}",
        "type": "json"
      }
    ],
    "filename": "routes/rest/settings.js",
    "groupTitle": "Settings"
  },
  {
    "type": "put",
    "url": "/admin/student/:id",
    "title": "Edit Student Details",
    "version": "1.0.0",
    "name": "EditStudentDetails",
    "group": "Student",
    "description": "<p>Allows an admin or super admin to edit the details of an existing student.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique identifier of the student (in URL parameters).</p>"
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
            "description": "<p>Bearer token for authorization.</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "admin, superAdmin"
      }
    ],
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Missing required parameters or invalid data.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>You do not have permission to edit student details.</p>"
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
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"message\": \"Student not found\"\n}",
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
            "field": "message",
            "description": "<p>Success message.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "student",
            "description": "<p>Updated student object excluding password, forgotpassword, and bankAdded fields.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"Student details updated successfully\",\n  \"student\": {\n    \"_id\": \"123456\",\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"fullName\": \"John Doe\",\n    \"email\": \"john.doe@example.com\",\n    \"gender\": \"Male\",\n    \"phone\": \"1234567890\",\n    \"dob\": \"2000-01-01T00:00:00.000Z\",\n    \"rollNo\": \"101\",\n    \"signature\": \"http://example.com/signature.jpg\",\n    \"profileImage\": \"http://example.com/profile.jpg\",\n    \"address\": {\n      \"locality\": \"Downtown\",\n      \"city\": \"Cityville\",\n      \"state\": \"Stateville\",\n      \"pin\": \"12345\",\n      \"country\": \"Countryland\"\n    },\n    \"guardian\": {\n      \"fathersName\": \"Michael Doe\",\n      \"fathersOccupation\": \"Engineer\",\n      \"mothersName\": \"Jane Doe\",\n      \"mothersOccupation\": \"Teacher\"\n    },\n    \"admissionYear\": \"2020\",\n    \"createdAt\": \"2024-01-01T12:00:00.000Z\",\n    \"updatedAt\": \"2024-01-02T12:00:00.000Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PUT 'https://api.example.com/students/123456' \\\n-H 'Authorization: Bearer <token>' \\\n-d '{\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"email\": \"john.doe@example.com\",\n    \"gender\": \"Male\",\n    \"phone\": \"1234567890\",\n    \"dob\": \"2000-01-01\",\n    \"rollNo\": \"101\",\n    \"signature\": \"http://example.com/signature.jpg\",\n    \"profileImage\": \"http://example.com/profile.jpg\",\n    \"address\": {\n      \"locality\": \"Downtown\",\n      \"city\": \"Cityville\",\n      \"state\": \"Stateville\",\n      \"pin\": \"12345\",\n      \"country\": \"Countryland\"\n    },\n    \"guardian\": {\n      \"fathersName\": \"Michael Doe\",\n      \"fathersOccupation\": \"Engineer\",\n      \"mothersName\": \"Jane Doe\",\n      \"mothersOccupation\": \"Teacher\"\n    }\n}'",
        "type": "curl"
      }
    ],
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
            "description": "<p>Bearer token of the admin|teacher|Super Admin.</p>"
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
        "content": "{\n  \"error\": false,\n  \"student\": {\n    \"_id\": \"67052d954cbe69ed12657f76\",\n    \"username\": \"student123\",\n    \"email\": \"student@example.com\",\n    \"loginType\": \"student\",\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"isActive\": true,\n    \"_school\": {\n         \"address\": {\n             \"city\": \"Panskura\",\n             \"state\": \"West Bengal\",\n             \"country\": \"India\",\n             \"pinCode\": \"721641\"\n         },\n         \"contact\": {\n             \"phoneNo\": \"+91 8172059732\",\n             \"email\": \"kicmmhs@gmail.com\",\n             \"website\": \"kicmmhs.edu\"\n         },\n         \"location\": {\n             \"type\": \"Point\",\n             \"coordinates\": [\n                 21.418325060918168,\n                 84.02980772446274\n             ]\n         },\n         \"name\": \"Khukurdaha I C M M High School\",\n         \"registrationNumber\": \"REG3167\",\n         \"principalName\": \"Mrinal undefined\",\n         \"establishYear\": 1995,\n         \"imageUrl\": \"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR991hgwd5EAqJRywib6kdEyDFFIxmmA20x_evuRgHj5zlRqYq8Wq16u_rYSEkXieoQFQg&usqp=CAU\",\n         \"isActive\": true,\n         \"schoolType\": \"highSchool\"\n     }\n    \"_class\": {\n      \"name\": \"10\",\n      \"section\": \"A\"\n    },\n    \"gender\": \"Male\",\n    \"address\": \"123 Main St\",\n    \"phone\": \"123-456-7890\",\n    \"dob\": \"01/01/2005\",\n    \"createdAt\": \"2024-10-21T00:00:00.000Z\",\n    \"updatedAt\": \"2024-10-21T00:00:00.000Z\"\n  }\n}",
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
    "title": "Change Student Status",
    "name": "ChangeStudentStatus",
    "group": "Students",
    "version": "1.0.0",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "description": "<p>This endpoint allows an admin to activate or deactivate a student account. The status can either be explicitly provided or toggled automatically.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Admin's valid JWT token in the format <code>Bearer &lt;token&gt;</code>.</p>"
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
            "description": "<p>The unique ID of the student whose status is to be changed.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage in Postman:",
        "content": "1. **Explicitly Activate a Student:**\n   - **Method**: PUT\n   - **URL**: https://schoolmanagement-zn7n.onrender.com/admin/student/change-status/671b78eb95c2172188f84ac4\n   - **Headers**:\n     - `Authorization`: Bearer <token>\n     - `Content-Type`: application/json\n   - **Body (raw JSON)**:\n     ```json\n     {\n       \"isActive\": true\n     }\n     ```\n\n2. **Toggle the Student's Current Status:**\n   - **Method**: PATCH\n   - **URL**: https://schoolmanagement-zn7n.onrender.com/admin/student/change-status/671b78eb95c2172188f84ac4\n   - **Headers**:\n     - `Authorization`: Bearer <token>\n     - `Content-Type`: application/json\n   - **Body**: Leave empty.",
        "type": "postman"
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
            "description": "<p>Indicates whether the request was successful (<code>false</code> for success).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Describes the result of the operation.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "{\n  \"error\": false,\n  \"message\": \"Student activated successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not an admin.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The student with the specified ID does not exist.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>There was a server error while processing the request.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Only admins can edit student details\"\n}",
          "type": "json"
        },
        {
          "title": "Not Found Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Student not found\"\n}",
          "type": "json"
        },
        {
          "title": "Server Error Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Internal Server Error\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/adminStudent.js",
    "groupTitle": "Students"
  },
  {
    "type": "post",
    "url": "/admin/student",
    "title": "Create New Student (Admin)",
    "name": "CreateStudent",
    "group": "Students",
    "description": "<p>This endpoint allows an admin to create a new student record in the system. The admin is responsible for providing all required student details including personal information, class details, and optional fields like roll number and join date. The system also auto-generates the username and password for the student.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>First name of the student.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>Last name of the student.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address of the student.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gender",
            "description": "<p>Gender of the student.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "guardian",
            "description": "<p>Guardian details (father's and mother's names and occupations).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "guardian.fathersName",
            "description": "<p>Father's name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "guardian.fathersOccupation",
            "description": "<p>Father's occupation.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "guardian.mothersName",
            "description": "<p>Mother's name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "guardian.mothersOccupation",
            "description": "<p>Mother's occupation.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>Contact number of the student.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "admissionYear",
            "description": "<p>The year in which the student was admitted.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of birth of the student (in <code>YYYY-MM-DD</code> format).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "classname",
            "description": "<p>The name of the class the student is assigned to.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "section",
            "description": "<p>The section the student is assigned to.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "currentAcademicYear",
            "description": "<p>The academic year for which the student is enrolled, e.g., &quot;2024-2025&quot;.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "signature",
            "description": "<p>Digital signature of the student (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "profileImage",
            "description": "<p>Profile image of the student (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the student.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address.locality",
            "description": "<p>Locality of the student's address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address.city",
            "description": "<p>City of the student's address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address.state",
            "description": "<p>State of the student's address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address.pin",
            "description": "<p>PIN code of the student's address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address.country",
            "description": "<p>Country of the student's address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "rollNo",
            "description": "<p>Roll number of the student (optional, but required if <code>autoAssignRoll=false</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "joinDate",
            "description": "<p>Date the student joined (in <code>YYYY-MM-DD</code> format, optional).</p>"
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
            "description": "<p>Bearer token for admin authentication.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p><code>Unauthorized</code> If the user is not an admin or if the request is malformed.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p><code>Class not found!</code> If the class with the given name, section, and academic year is not found.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Error message if there is an issue with the request.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Request:",
        "content": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"email\": \"john.doe@example.com\",\n  \"gender\": \"Male\",\n  \"guardian\": {\n    \"fathersName\": \"Robert Doe\",\n    \"fathersOccupation\": \"Engineer\",\n    \"mothersName\": \"Jane Doe\",\n    \"mothersOccupation\": \"Teacher\"\n  },\n  \"phone\": \"1234567890\",\n  \"admissionYear\": \"2024\",\n  \"dob\": \"2005-06-15\",\n  \"classname\": \"10th\",\n  \"section\": \"A\",\n  \"currentAcademicYear\": \"2024-2025\",\n  \"signature\": \"signature_image_data\",\n  \"profileImage\": \"profile_image_url\",\n  \"address\": {\n    \"locality\": \"Downtown\",\n    \"city\": \"Sample City\",\n    \"state\": \"Sample State\",\n    \"pin\": \"123456\",\n    \"country\": \"Sample Country\"\n  }\n}",
        "type": "json"
      },
      {
        "title": "Example Response:",
        "content": "{\n  \"error\": false,\n  \"StudentUserName\": \"JohSam789\",\n  \"StudentPassword\": \"generatedPassword123\"\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/rest/adminStudent.js",
    "groupTitle": "Students"
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
            "type": "File",
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
    "url": "/admin/teacher/create",
    "title": "Create Teacher",
    "name": "CreateTeacher",
    "group": "Teacher",
    "permission": [
      {
        "name": "admin, superAdmin"
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
            "optional": true,
            "field": "schoolId",
            "description": "<p>school id(only use when superadmin will create )</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request-Example:",
        "content": "{\n  \"firstName\": \"Sahil\",\n  \"lastName\": \"Sahu\",\n  \"gender\": \"Male\",\n  \"email\": \"sahil123@gmail.com\",\n  \"phone\": \"9668123060\",\n  \"dob\": \"06/04/2001\",\n  \"signature\": \"base64EncodedSignature\",\n  \"schoolId\":\"\"\n  \"bankDetails\": {\n    \"bankName\": \"Bank of Odisha\",\n    \"accountNumber\": \"123456789012\",\n    \"ifscCode\": \"BKID0001234\"\n  },\n  \"address\": {\n    \"locality\": \"Dhanupali\",\n    \"city\": \"Sambalpur\",\n    \"state\": \"Odisha\",\n    \"pin\": \"768005\",\n    \"country\": \"India\"\n  },\n  \"profileImage\": \"https://example.com/profile.jpg\",\n  \"schoolId\": \"671a88862e586338c6c94516\",\n  \"subject\": [\"Math\", \"English\"],\n  \"qualification\": \"PhD\",\n  \"experience\": \"5 years\",\n  \"joinDate\": \"2024-11-01\"\n}",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"user\": {\n    \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"gender\": \"Male\",\n    \"email\": \"john.doe@example.com\",\n    \"phone\": \"1234567890\",\n    \"dob\": \"DD/MM/YYYY\",\n    \"isActive\": true,\n    \"address\": {\n      \"locality\": \"Dhanupali\",\n      \"city\": \"Sambalpur\",\n      \"state\": \"Odisha\",\n      \"pin\": \"768005\",\n      \"country\": \"India\"\n    },\n    \"subject\": [\"Math\", \"English\"],\n    \"qualification\": \"PhD\",\n    \"experience\": \"5\",\n    \"joinDate\": \"2024-11-01\",\n    \"profileImage\": \"https://example.com/profile.jpg\",\n    \"createdAt\": \"2024-11-01T19:14:42.334Z\",\n    \"updatedAt\": \"2024-11-02T21:24:44.423Z\"\n  }\n}",
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
          "content": "{\n  \"error\": true,\n  \"message\": \"Email already in use, please provide a unique email.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"message\": \"Phone number already in use, please provide a unique phone number.\"\n}",
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
    "title": "Delete Teacher",
    "name": "DeleteTeacher",
    "group": "Teacher",
    "permission": [
      {
        "name": "Admin or SuperAdmin"
      }
    ],
    "description": "<p>Allows an admin to delete a teacher from their assigned school, and a superadmin to delete any teacher. For superadmins, an optional <code>schoolId</code> can be provided to ensure the teacher belongs to a specific school.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the teacher to delete.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schoolId",
            "description": "<p>(SuperAdmin only) Optional ID of the school to which the teacher must belong for deletion.</p>"
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
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Message indicating the result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response (Admin or SuperAdmin):",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"reason\": \"Teacher deleted successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates if there was an error.</p>"
          },
          {
            "group": "Error 400",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Reason for the error, e.g., &quot;Teacher not found&quot; or &quot;You do not have permission to delete this teacher.&quot;</p>"
          }
        ],
        "Error 403": [
          {
            "group": "Error 403",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates if there was an error.</p>"
          },
          {
            "group": "Error 403",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Message indicating unauthorized action, e.g., &quot;This teacher does not belong to the specified school.&quot;</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates if there was an internal server error.</p>"
          },
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>Error message explaining the issue.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Teacher Not Found (Error 400):",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"Teacher not found\"\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized Action (Error 403):",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": true,\n  \"reason\": \"You do not have permission to delete this teacher\"\n}",
          "type": "json"
        },
        {
          "title": "SuperAdmin School ID Mismatch (Error 403):",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": true,\n  \"reason\": \"This teacher does not belong to the specified school\"\n}",
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
          "content": "HTTP/1.1 200 OK\n{\n\"error\": false,\n\"users\": [\n   {\n        \"address\": {\n            \"city\": \"New York\",\n            \"country\": \"USA\",\n            \"locality\": \"Greenwood Avenue\",\n            \"pin\": \"10001\",\n            \"state\": \"NY\"\n        },\n        \"_id\": \"670cf24bdbb09a7c2b2af9a0\",\n        \"username\": \"sri990\",\n        \"firstName\": \"Sritam\",\n        \"lastName\": \"mohapatra123\",\n        \"email\": \"bonysahoo133@gmail.com\",\n        \"accountType\": \"email\",\n        \"gender\": \"Male\",\n        \"dob\": \"2000-02-20\",\n        \"loginType\": \"teacher\",\n        \"_addedBy\": \"670cf177dbb09a7c2b2af98b\",\n        \"isActive\": true,\n        \"joinDate\": \"Sat Apr 06 2024 05:30:00 GMT+0530 (India Standard Time)\",\n        \"bankAdded\": false,\n        \"_school\": \"670cc3c55aa29e2e31348c7e\",\n        \"customerStripeId\": \"cus_R1pATMqHh7GKzy\",\n        \"isPaid\": false,\n       \"messagingEnabled\": false,\n        \"subject\": [],\n        \"qualification\":\"\",\n        \"experience\":\"2\"\n        \"createdAt\": \"2024-10-14T10:28:27.463Z\",\n        \"updatedAt\": \"2024-11-03T14:09:21.434Z\",\n        \"__v\": 0,\n        \"isSuperAdmin\": false,\n        \"fullName\": \"Sritam mohapatra123\",\n        \"id\": \"670cf24bdbb09a7c2b2af9a0\"\n    }\n],\n\"usersCount\": 1\n  }",
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
    "description": "<p>Retrieves all teachers belonging to the school.</p>",
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
            "description": "<p>Page number (starting from 1) sent within the params.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pageSize",
            "defaultValue": "10",
            "description": "<p>Number of records to return (default is 10) sent within the params.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": " HTTP/1.1 200 OK\n{\n   \"error\": false,\n   \"message\": \"Teachers retrieved successfully.\",\n   \"data\": [\n       {\n           \"qualification\": \"\",\n           \"experience\": \"2\",\n           \"address\": {\n               \"city\": \"New York\",\n               \"country\": \"USA\",\n               \"locality\": \"Greenwood Avenue\",\n               \"pin\": \"10001\",\n               \"state\": \"NY\"\n           },\n           \"subject\": [],\n           \"_id\": \"671b8f3e792331ab10d6a525\",\n           \"username\": \"ritsch855\",\n           \"firstName\": \"Ritik\",\n           \"lastName\": \"Sahoo\",\n           \"email\": \"ritik133@gmail.com\",\n           \"accountType\": \"email\",\n           \"gender\": \"Male\",\n           \"dob\": \"2001-04-06T00:00:00Z\",\n           \"loginType\": \"teacher\",\n           \"_addedBy\": \"671a88862e586338c6c94518\",\n           \"isActive\": true,\n           \"isSuperAdmin\": false,\n           \"bankAdded\": false,\n           \"_school\": \"671a88862e586338c6c94516\",\n           \"isPaid\": false,\n           \"messagingEnabled\": false,\n           \"createdAt\": \"2024-10-25T12:29:50.885Z\",\n           \"updatedAt\": \"2024-10-25T15:57:04.821Z\",\n           \"__v\": 0,\n           \"phone\": \"8712302804\",\n           \"joinDate\": \"2024-04-06T05:30:00Z\",\n           \"id\": \"671b8f3e792331ab10d6a525\"\n       }\n   ],\n   \"totalTeachers\": 5\n}",
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
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"user\": {\n    \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"gender\": \"Male\",\n    \"email\": \"john.doe@example.com\",\n    \"phone\": \"1234567890\",\n    \"dob\": \"1985-04-15T00:00:00.000Z\",\n    \"isActive\": true,\n    \"address\": {\n      \"locality\": \"\",\n      \"state\": \"\",\n      \"city\": \"\",\n      \"pin\": \"\",\n      \"country\": \"\"\n    },\n    \"subject\": [\"Math\", \"English\"],\n    \"qualification\": \"PhD\",\n    \"experience\": \"5\",\n    \"_school\": \"\",\n    \"joinDate\": \"2021-09-01T00:00:00.000Z\",\n    \"fullName\": \"John Doe\",\n    \"isSuperAdmin\": false,\n    \"bankAdded\": false,\n    \"isPaid\": false,\n    \"messagingEnabled\": false,\n    \"createdAt\": \"2021-09-01T00:00:00.000Z\",\n    \"updatedAt\": \"2021-09-01T00:00:00.000Z\",\n    \"__v\": 0\n  }\n}",
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
            "field": "reason",
            "description": "<p>Error message explaining the reason.</p>"
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "joinDate",
            "description": "<p>joinDate</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "qualification",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "experience",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"user\": {\n    \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"email\": \"john.doe@example.com\",\n    \"phone\": \"1234567890\",\n    \"isActive\": true,\n    \"bankDetails\": {\n      \"accountNumber\": \"123456789\",\n      \"ifscCode\": \"IFSC0001\"\n    }\n   \"address\":{\n   \"locality\":\"\",\n   \"city\":\"\",\n   \"state\":\"\",\n   \"pin\":\"\",\n   \"country\":\"\"\n    },\n   \"_school\":\"schoolid\",\n   \"profileImage\":\"\",\n   \"subject\":[\"Math\",\"English\"]\n   \"joinDate\":\"\",\n   \"experience\":\"\",\n   \"qualification:\"\"\n\n  }\n}",
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
    "type": "post",
    "url": "/admin/transactions",
    "title": "Get all transactions for a school",
    "name": "GetAllTransactions",
    "group": "Transaction",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "pageNumber",
            "defaultValue": "1",
            "description": "<p>Page number for pagination (default is 1).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "pageSize",
            "defaultValue": "10",
            "description": "<p>Number of records per page (default is 10).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "setField",
            "description": "<p>Specify the field to filter transactions by. Can be:</p> <ul> <li><code>&quot;teacher&quot;</code> to get transactions for teachers.</li> <li><code>&quot;student&quot;</code> to get transactions for students.</li> <li>No value to get transactions for both teachers and students.</li> </ul>"
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
            "description": "<p>Indicates that the user is not an admin.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Indicates server error.</p>"
          },
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "Error",
            "description": "<p>Error message detailing the issue.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Request (for teachers):",
        "content": "POST /admin/transactions\n{\n  \"pageNumber\": 1,\n  \"pageSize\": 10,\n  \"setField\": \"teacher\"\n}",
        "type": "json"
      },
      {
        "title": "Example Request (for students):",
        "content": "POST /admin/transactions\n{\n  \"pageNumber\": 1,\n  \"pageSize\": 10,\n  \"setField\": \"student\"\n}",
        "type": "json"
      },
      {
        "title": "Example Response (for teachers):",
        "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"transaction\": [\n    {\n      \"_id\": \"673aec22d0817c64a75a1b7c\",\n      \"_teacher\": \"6738c4f008b861d9c1506848\",\n      \"date\": \"2024-11-02T00:00:00.000Z\",\n      \"amount\": 18000,\n      \"status\": \"paid\",\n      \"_school\": \"671a88862e586338c6c94516\",\n      \"createdAt\": \"2024-11-18T07:26:26.957Z\",\n      \"updatedAt\": \"2024-11-18T07:26:26.957Z\",\n      \"userType\": \"teacher\"\n    }\n  ]\n}",
        "type": "json"
      },
      {
        "title": "Example Response (for students):",
        "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"transaction\": [\n    {\n      \"_id\": \"673aec22d0817c64a75a1b7c\",\n      \"_student\": \"6738c4f008b861d9c1506848\",\n      \"date\": \"2024-11-02T00:00:00.000Z\",\n      \"amount\": 5000,\n      \"status\": \"paid\",\n      \"_school\": \"671a88862e586338c6c94516\",\n      \"createdAt\": \"2024-11-18T07:26:26.957Z\",\n      \"updatedAt\": \"2024-11-18T07:26:26.957Z\",\n      \"userType\": \"student\"\n    }\n  ]\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/rest/adminTransaction.js",
    "groupTitle": "Transaction"
  },
  {
    "type": "post",
    "url": "/user/transaction",
    "title": "Get own transaction details",
    "name": "GetOwnTransactionDetails",
    "group": "Transaction",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "pageNumber",
            "defaultValue": "1",
            "description": "<p>Page number for pagination (default is 1).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "pageSize",
            "defaultValue": "10",
            "description": "<p>Number of records per page (default is 10).</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Request:",
        "content": "{\n  \"pageNumber\": 1,\n  \"pageSize\": 10\n}",
        "type": "json"
      },
      {
        "title": "Example Response:",
        "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"transaction\": [\n    {\n      \"_id\": \"6083f9a1b413c24f4446d98b\",\n      \"date\": \"2024-10-25\",\n      \"amount\": 5000,\n      \"busFee\": 100,\n      \"totalAmount\": 5100,\n      \"status\": \"success\"\n    }\n  ],\n  \"totalTransaction\": 50\n}",
        "type": "json"
      }
    ],
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
    "url": "/admin/transaction/get/:id",
    "title": "Get a transaction by ID",
    "name": "GetTransaction",
    "group": "Transaction",
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
    "examples": [
      {
        "title": "Example Request:",
        "content": "GET /admin/transaction/get/673aec22d0817c64a75a1b7c",
        "type": "json"
      },
      {
        "title": "Example Response (Transaction found):",
        "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"transaction\": {\n    \"_id\": \"673aec22d0817c64a75a1b7c\",\n    \"_teacher\": \"6738c4f008b861d9c1506848\",\n    \"_school\": \"671a88862e586338c6c94516\",\n    \"date\": \"2024-11-02T00:00:00.000Z\",\n    \"amount\": 18000,\n    \"status\": \"paid\",\n    \"createdAt\": \"2024-11-18T07:26:26.957Z\",\n    \"updatedAt\": \"2024-11-18T07:26:26.957Z\"\n  }\n}",
        "type": "json"
      },
      {
        "title": "Example Response (Transaction not found):",
        "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"message\": \"Transaction not found\"\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "routes/rest/adminTransaction.js",
    "groupTitle": "Transaction"
  },
  {
    "type": "post",
    "url": "/admin/salary",
    "title": "Pay salary to a teacher",
    "name": "PaySalary",
    "group": "Transaction",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "teacherId",
            "description": "<p>Teacher's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "amount",
            "description": "<p>Salary amount to be paid to the teacher (optional, will use calculated amount based on experience if not provided).</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Request:",
        "content": "POST /admin/salary\n{\n  \"teacherId\": \"6738c4f008b861d9c1506848\",\n  \"amount\": 25000\n}",
        "type": "json"
      },
      {
        "title": "Example Response (Salary successfully paid):",
        "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"transaction\": {\n    \"_id\": \"673aec22d0817c64a75a1b7c\",\n    \"_teacher\": \"6738c4f008b861d9c1506848\",\n    \"_school\": \"671a88862e586338c6c94516\",\n    \"date\": \"2024-11-18T07:26:26.957Z\",\n    \"amount\": 25000,\n    \"status\": \"paid\",\n    \"createdAt\": \"2024-11-18T07:26:26.957Z\",\n    \"updatedAt\": \"2024-11-18T07:26:26.957Z\"\n  }\n}",
        "type": "json"
      },
      {
        "title": "Example Response (Salary already paid for the current month):",
        "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"Salary already paid for November 2024\"\n}",
        "type": "json"
      }
    ],
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
    "type": "post",
    "url": "/changepassword/",
    "title": "Update own password",
    "name": "ChangePassword",
    "group": "User",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin, teacher, student, superAdmin"
      }
    ],
    "description": "<p>This endpoint allows a user (admin, teacher, student, or superAdmin) to update their password.</p>",
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
            "optional": false,
            "field": "oldPassword",
            "description": "<p>The user's current password.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPassword",
            "description": "<p>The user's new password.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reEnterPassword",
            "description": "<p>The user's new password repeated.</p>"
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
            "description": "<p>Success message indicating the password was updated.</p>"
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
            "description": "<p>True if the user is not an admin or the admin was not found.</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>The reason for the error.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Only Admin, Teacher, Student, and SuperAdmin can change password.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Server error.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PUT 'https://api.example.com/changepassword/' \\\n-H 'Authorization: Bearer <token>' \\\n-d '{\n    \"oldPassword\": \"oldpassword\",\n    \"newPassword\": \"newpassword\",\n    \"reEnterPassword\": \"newpassword\"\n}'",
        "type": "curl"
      }
    ],
    "filename": "routes/rest/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
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
