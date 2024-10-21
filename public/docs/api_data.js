define({ "api": [
  {
    "type": "get",
    "url": "/admin/get/:id",
    "title": "Get admin by ID",
    "name": "GetAdmin",
    "group": "Admin",
    "permission": [
      {
        "name": "SuperAdmin"
      }
    ],
    "description": "<p>Fetch a specific admin's details by their ID</p>",
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
            "description": "<p>Admin's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"admin\": {\n    \"_id\": \"61234abcd5678ef901234567\",\n    \"name\": \"John Doe\",\n    \"email\": \"john.doe@example.com\",\n    \"loginType\": \"admin\",\n    \"createdAt\": \"2024-09-30T12:30:45.123Z\",\n    \"updatedAt\": \"2024-10-01T14:22:05.456Z\"\n  }\n}",
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
    "type": "get",
    "url": "/admin/getAll",
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
            "description": "<p>Bearer token for authentication.</p>"
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
    "type": "post",
    "url": "/admin/signup",
    "title": "Sign Up Admin by SuperAdmin",
    "name": "SignupAdmin",
    "group": "Admin",
    "version": "1.0.0",
    "description": "<p>Allows a SuperAdmin to create a new admin user.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>SuperAdmin's unique access token (JWT).</p>"
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
            "field": "username",
            "description": "<p>Username for the new admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address for the new admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>First name of the new admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>Last name of the new admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>Phone number of the new admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of birth of the new admin (YYYY-MM-DD format).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_school",
            "description": "<p>School ID for the new admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gender",
            "description": "<p>Gender of the admin</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>address of the admin</p>"
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
            "description": "<p>Whether there was an error (false if successful).</p>"
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
            "field": "response",
            "description": "<p>The newly created admin user object.</p>"
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
        ],
        "500": [
          {
            "group": "500",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>Whether there was an internal server error.</p>"
          },
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message (if internal error occurs).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"you are not superadmin\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": true,\n  \"message\": \"Internal Server Error\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/auth/signup.js",
    "groupTitle": "Admin"
  },
  {
    "type": "put",
    "url": "/admin/update",
    "title": "Update Admin Profile",
    "name": "UpdateAdminProfile",
    "group": "Admin",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin"
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
            "description": "<p>Bearer token authorization.</p>"
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
            "description": "<p>The new first name of the admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "lastName",
            "description": "<p>The new last name of the admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "phone",
            "description": "<p>The new phone number of the admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>The new email of the admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address",
            "description": "<p>The new address of the admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "gender",
            "description": "<p>Gender of the admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "dob",
            "description": "<p>The DOB of the admin.</p>"
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
    "filename": "routes/admin/users.js",
    "groupTitle": "Admin-User"
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
    "type": "post",
    "url": "/attendance/getstudents",
    "title": "Get StudentsForAttendance",
    "name": "GetClassStudentsForAttendance",
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
            "description": "<p>The ID of the class for which students are being retrieved.</p>"
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
            "type": "Object[]",
            "optional": false,
            "field": "students",
            "description": "<p>Array of students in the specified class.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students._id",
            "description": "<p>The unique ID of the student.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.rollNo",
            "description": "<p>The roll number of the student.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"students\": [\n    {\n      \"_id\": \"60c72b2f9b1e8a3b4c3e4f6a\",\n      \"rollNo\": \"001\"\n    },\n    {\n      \"_id\": \"60c72b2f9b1e8a3b4c3e4f6b\",\n      \"rollNo\": \"002\"\n    }\n  ]\n}",
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
            "description": "<p>The reason for the error (e.g., &quot;You are not teacher&quot;, &quot;you are not assigned to this class&quot;).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"You are not teacher\"\n}",
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
    "url": "/attendance/percentage",
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
    "url": "/attendance/mark",
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
            "optional": false,
            "field": "studentId",
            "description": "<p>The ID of the student whose attendance is being marked.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"message\": \"Student has been marked present\",\n  \"attendance\": {\n    \"_id\": \"60c72b2f9b1e8a3b4c3e4f6c\",\n    \"_class\": \"60c72b2f9b1e8a3b4c3e4f6a\",\n    \"date\": \"2024-10-04T00:00:00.000Z\",\n    \"presentIds\": [\"60c72b2f9b1e8a3b4c3e4f6b\"]\n  }\n}",
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
            "description": "<p>The reason for the error (e.g., &quot;You are not a teacher&quot;, &quot;You are not assigned to this class&quot;, &quot;Student is not assigned to this class&quot;).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": true,\n  \"reason\": \"You are not a teacher\"\n}",
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
    "type": "get",
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
          "content": "{\n  \"error\": false,\n  \"attendanceStatus\": [\n    {\n      \"date\": \"2024-10-01T00:00:00.000Z\",\n      \"isPresent\": true\n    },\n    {\n      \"date\": \"2024-10-02T00:00:00.000Z\",\n      \"isPresent\": false\n    }\n  ]\n}",
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
    "url": "/login",
    "title": "User Login",
    "version": "1.0.0",
    "name": "Login",
    "group": "Auth",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint allows users (students, teachers, admins, and super admins) to log in to the system. The endpoint checks for required credentials based on the <code>loginType</code> and generates a token upon successful login.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "loginType",
            "description": "<p>Type of user logging in, one of &quot;student&quot;, &quot;teacher&quot;, &quot;admin&quot;.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>Username of the student (required if loginType is &quot;student&quot;).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Email of the user (required if loginType is &quot;admin&quot; or &quot;teacher&quot;).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the user.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request-Example-1:",
        "content": "{\n  \"loginType\": \"admin\",\n  \"email\": \"admin@example.com\",\n  \"password\": \"yourpassword\"\n}",
        "type": "json"
      },
      {
        "title": "Request-Example-2:",
        "content": "{\n  \"loginType\": \"student\",\n  \"username\": \"username\",\n  \"password\": \"yourpassword\"\n}",
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
            "description": "<p>False indicating no error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JWT token generated after successful login.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\"\n}",
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
            "field": "MissingFields",
            "description": "<p>Fields <code>loginType</code> and <code>password</code> are mandatory.</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "MissingUsername",
            "description": "<p>Field <code>username</code> is required for <code>loginType</code> &quot;student&quot;.</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "MissingEmail",
            "description": "<p>Field <code>email</code> is required for <code>loginType</code> &quot;admin&quot; or &quot;teacher&quot;.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "UserInactive",
            "description": "<p>The user is inactive and cannot log in.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The user with the provided credentials was not found.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error occurred during login.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": true,\n  \"reason\": \"User Not Found\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/auth/index.js",
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
    "filename": "routes/admin/class.js",
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
    "filename": "routes/admin/class.js",
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
    "filename": "routes/admin/class.js",
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
    "filename": "routes/admin/class.js",
    "groupTitle": "Class"
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
    "filename": "routes/admin/notices.js",
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
    "filename": "routes/admin/notices.js",
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
    "filename": "routes/admin/notices.js",
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
    "filename": "routes/admin/notices.js",
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
    "filename": "routes/admin/notices.js",
    "groupTitle": "Notice"
  },
  {
    "type": "post",
    "url": "/api/v1/schools",
    "title": "Create a new school with Stripe account",
    "name": "CreateSchool",
    "group": "School",
    "version": "1.0.0",
    "description": "<p>Creates a new school in the system and sets up a Stripe account for payment processing.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's unique JWT token with &quot;Bearer &quot; prefix.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p><code>application/json</code></p>"
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
            "optional": false,
            "field": "name",
            "description": "<p>Name of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "registrationNumber",
            "description": "<p>Registration number of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the school.</p>"
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
            "optional": false,
            "field": "address.pinCode",
            "description": "<p>Postal code of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "contact",
            "description": "<p>Contact information of the school.</p>"
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
            "optional": false,
            "field": "contact.website",
            "description": "<p>Website of the school (optional).</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "location",
            "description": "<p>Geographical location of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "location.type",
            "description": "<p>Type of the location, always set to <code>&quot;Point&quot;</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": false,
            "field": "location.coordinates",
            "description": "<p>Longitude and latitude of the school as an array.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "principalName",
            "description": "<p>Name of the school's principal.</p>"
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
    "filename": "routes/admin/schedules.js",
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
            "field": "establishYear",
            "description": "<p>Year the school was established.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "schoolType",
            "description": "<p>Type of the school, e.g., <code>&quot;primary&quot;</code>, <code>&quot;secondary&quot;</code>, <code>&quot;highSchool&quot;</code>.</p>"
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
    "filename": "routes/admin/schedules.js",
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
            "field": "message",
            "description": "<p>Success message.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "school",
            "description": "<p>Details of the created school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "school._id",
            "description": "<p>ID of the school.</p>"
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
    "filename": "routes/admin/schedules.js",
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
    "filename": "routes/admin/schedules.js",
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
            "field": "school.address",
            "description": "<p>Address details of the school.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "school.contact",
            "description": "<p>Contact details of the school.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "school.location",
            "description": "<p>Location coordinates of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "school.principalName",
            "description": "<p>Name of the school's principal.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "school.establishYear",
            "description": "<p>Establishment year of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "school.schoolType",
            "description": "<p>Type of the school.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "stripeAccountId",
            "description": "<p>Stripe account ID created for the school.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "accountLink",
            "description": "<p>Stripe account onboarding link.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "accountLink.url",
            "description": "<p>URL for Stripe account onboarding.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "accountLink.expires_at",
            "description": "<p>Expiration timestamp of the account link.</p>"
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
            "description": "<p>The user is not an admin or the request is invalid.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Server error during school creation.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "400 Error Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": true,\n  \"reason\": \"You are not admin\"\n}",
          "type": "json"
        },
        {
          "title": "500 Error Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Error message explaining the issue\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/school.js",
    "groupTitle": "School"
  },
  {
    "type": "put",
    "url": "/school",
    "title": "Update School Information",
    "name": "UpdateSchool",
    "group": "School",
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
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the School to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>The name of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "address",
            "description": "<p>The address of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.city",
            "description": "<p>The city of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.state",
            "description": "<p>The state of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.country",
            "description": "<p>The country of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address.pinCode",
            "description": "<p>The pin code of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "contact",
            "description": "<p>The contact details of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "contact.phoneNo",
            "description": "<p>The phone number of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "contact.email",
            "description": "<p>The email address of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "contact.website",
            "description": "<p>The website of the school.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "principalName",
            "description": "<p>The name of the principal.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "description": "<p>Whether the school is active or not.</p>"
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
    "filename": "routes/admin/schools.js",
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
            "field": "error",
            "description": "<p>Indicates whether there was an error.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "school",
            "description": "<p>The updated school object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "school._id",
            "description": "<p>The unique ID of the school.</p>"
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
            "type": "Object",
            "optional": false,
            "field": "school.address",
            "description": "<p>The address of the school.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "school.contact",
            "description": "<p>The contact details of the school.</p>"
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
            "type": "Boolean",
            "optional": false,
            "field": "school.isActive",
            "description": "<p>Whether the school is active or not.</p>"
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
            "description": "<p>Indicates whether there was an error.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>The reason for the error (e.g., &quot;you are not admin&quot;, &quot;school not found&quot;).</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/school.js",
    "groupTitle": "School"
  },
  {
    "type": "post",
    "url": "/teacher/create",
    "title": "Create Teacher",
    "name": "CreateTeacher",
    "group": "Teacher",
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
            "type": "String",
            "optional": true,
            "field": "address",
            "description": "<p>address of the teacher</p>"
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
          "content": "{\n  \"error\": false,\n  \"user\": {\n    \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"gender\": \"Male\",\n    \"email\": \"john.doe@example.com\",\n    \"phone\": \"1234567890\",\n    \"dob\": \"1990-01-01T00:00:00.000Z\",\n    \"username\": \"Joh1230\",\n    \"isActive\": true,\n    \"customerStripeId\": \"cus_123456789\"\n  }\n}",
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
    "filename": "routes/admin/teacher.js",
    "groupTitle": "Teacher"
  },
  {
    "type": "get",
    "url": "/teacher/find",
    "title": "Find Teachers",
    "name": "FindTeachers",
    "group": "Teacher",
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
            "field": "searchText",
            "description": "<p>Optional search text to filter teachers by first name, last name, email, or phone.</p>"
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
            "field": "users",
            "description": "<p>List of teachers matching the search criteria.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "usersCount",
            "description": "<p>Total number of teachers matching the search criteria.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"users\": [\n    {\n      \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n      \"firstName\": \"John\",\n      \"lastName\": \"Doe\",\n      \"email\": \"john.doe@example.com\",\n      \"phone\": \"1234567890\",\n      \"isActive\": true,\n      \"loginType\": \"teacher\"\n    }\n  ],\n  \"usersCount\": 1\n}",
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
    "filename": "routes/admin/teacher.js",
    "groupTitle": "Teacher"
  },
  {
    "type": "get",
    "url": "/teacher/get/:id",
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
    "filename": "routes/admin/teacher.js",
    "groupTitle": "Teacher"
  },
  {
    "type": "put",
    "url": "/teacher/update/:id",
    "title": "Update Teacher Details",
    "name": "UpdateTeacher",
    "group": "Teacher",
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
            "type": "String",
            "optional": true,
            "field": "address",
            "description": "<p>address of the teacher</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"user\": {\n    \"_id\": \"60d5f60c9b4d7635e8aebaf7\",\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\",\n    \"email\": \"john.doe@example.com\",\n    \"phone\": \"1234567890\",\n    \"isActive\": true,\n    \"bankDetails\": {\n      \"accountNumber\": \"123456789\",\n      \"ifscCode\": \"IFSC0001\"\n    }\n  }\n}",
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
    "filename": "routes/admin/teacher.js",
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
    "filename": "routes/admin/transaction.js",
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
    "filename": "routes/admin/transaction.js",
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
    "filename": "routes/admin/transaction.js",
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
    "filename": "routes/admin/transaction.js",
    "groupTitle": "Transaction"
  },
  {
    "type": "get",
    "url": "/user/:id",
    "title": "get user details",
    "name": "userDetails",
    "group": "User",
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
    "filename": "routes/rest/users.js",
    "groupTitle": "User"
  }
] });
