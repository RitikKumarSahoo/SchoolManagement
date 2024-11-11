const mongoose = require("mongoose");
const users = require("../../models/user");
const School = require("../../models/school");
const Class = require("../../models/class");
const mail = require("../../lib/mail");
const randomstring = require("randomstring");
const { Readable } = require("stream");
const csv = require("csv-parser");

function generateCustomPassword() {
  const upperCaseLetter = randomstring.generate({
    length: 1,
    charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  });

  const lowerCaseLetters = randomstring.generate({
    length: 5, // Adjust the number of lowercase letters as needed
    charset: "abcdefghijklmnopqrstuvwxyz",
  });

  const specialChar = randomstring.generate({
    length: 1,
    charset: "!@#$%^&*()_+[]{}|;:,.<>?/", // Define special characters
  });

  const numbers = randomstring.generate({
    length: 3, // Adjust the number of digits as needed
    charset: "0123456789",
  });

  // Combine all parts
  const password = upperCaseLetter + lowerCaseLetters + specialChar + numbers;
  return password; // Return the generated password
}

module.exports = {
  /**
 * @api {post} /admin/student Create New Student (Admin)
 * @apiName CreateStudent
 * @apiGroup Students
 * 
 * @apiDescription This endpoint allows an admin to create a new student record in the system. The admin is responsible for providing all required student details including personal information, class details, and optional fields like roll number and join date. The system also auto-generates the username and password for the student.
 * 
 * @apiParam {String} firstName First name of the student.
 * @apiParam {String} lastName Last name of the student.
 * @apiParam {String} email Email address of the student.
 * @apiParam {String} gender Gender of the student.
 * @apiParam {Object} guardian Guardian details (father's and mother's names and occupations).
 * @apiParam {String} guardian.fathersName Father's name.
 * @apiParam {String} guardian.fathersOccupation Father's occupation.
 * @apiParam {String} guardian.mothersName Mother's name.
 * @apiParam {String} guardian.mothersOccupation Mother's occupation.
 * @apiParam {String} phone Contact number of the student.
 * @apiParam {String} admissionYear The year in which the student was admitted.
 * @apiParam {String} dob Date of birth of the student (in `YYYY-MM-DD` format).
 * @apiParam {String} classname The name of the class the student is assigned to.
 * @apiParam {String} section The section the student is assigned to.
 * @apiParam {String} currentAcademicYear The academic year for which the student is enrolled, e.g., "2024-2025".
 * @apiParam {String} [signature] Digital signature of the student (optional).
 * @apiParam {String} [profileImage] Profile image of the student (optional).
 * @apiParam {Boolean} [autoAssignRoll=true] Flag to auto-assign the roll number (default is `true`).
 * @apiParam {Object} address Address of the student.
 * @apiParam {String} address.locality Locality of the student's address.
 * @apiParam {String} address.city City of the student's address.
 * @apiParam {String} address.state State of the student's address.
 * @apiParam {String} address.pin PIN code of the student's address.
 * @apiParam {String} address.country Country of the student's address.
 * @apiParam {String} [rollNo] Roll number of the student (optional, but required if `autoAssignRoll=false`).
 * @apiParam {String} [joinDate] Date the student joined (in `YYYY-MM-DD` format, optional).
 * 
 * @apiHeader {String} Authorization Bearer token for admin authentication.
 * 
 * @apiError (400) {String} error `Unauthorized` If the user is not an admin or if the request is malformed.
 * @apiError (404) {String} error `Class not found!` If the class with the given name, section, and academic year is not found.
 * @apiError (400) {String} error `Roll number must be sequential` If the roll number is not sequential when `autoAssignRoll` is false.
 * @apiError (500) {String} error Error message if there is an issue with the request.
 * 
 * @apiExample Example Request:
 *  {
 *    "firstName": "John",
 *    "lastName": "Doe",
 *    "email": "john.doe@example.com",
 *    "gender": "Male",
 *    "guardian": {
 *      "fathersName": "Robert Doe",
 *      "fathersOccupation": "Engineer",
 *      "mothersName": "Jane Doe",
 *      "mothersOccupation": "Teacher"
 *    },
 *    "phone": "1234567890",
 *    "admissionYear": "2024",
 *    "dob": "2005-06-15",
 *    "classname": "10th",
 *    "section": "A",
 *    "currentAcademicYear": "2024-2025",
 *    "signature": "signature_image_data",
 *    "profileImage": "profile_image_url",
 *    "address": {
 *      "locality": "Downtown",
 *      "city": "Sample City",
 *      "state": "Sample State",
 *      "pin": "123456",
 *      "country": "Sample Country"
 *    }
 *  }
 * 
 * @apiExample Example Response:
 *  {
 *    "error": false,
 *    "StudentUserName": "JohSam789",
 *    "StudentPassword": "generatedPassword123"
 *  }
 */


  async createStudent(req, res) {
    try {
      const { firstName, lastName, email, gender, guardian, phone, admissionYear, dob, classname, section,currentAcademicYear, 
      signature, profileImage, autoAssignRoll = true, address} = req.body;
      let {
        rollNo,joinDate
      } = req.body

      const { loginType, id } = req.user;

      // Check if the user is an admin
      if (loginType !== "admin") {
        return res.status(403).json({ error: true, message: "Unauthorized" });
      }

      // Set joinDate to today's date if not provided
    // if (!joinDate) {
    //   const today = new Date();
    //   joinDate = today.toISOString().split('T')[0]; // Formats as "YYYY-MM-DD"
    // }

       // Validate required fields
      //  if (!firstName || !lastName || !gender || !guardian || !phone || !admissionYear || !classname || !section || !dob || !joinDate) {
      //   return res.status(400).json({ error: true, message: "All fields are required" });
      // }

      // Find admin and ensure they have access
      const admin = await users
        .findOne({ _id: id, loginType: "admin" })
        .select("_school")
        .populate({
          path: "_school",
          select: "name",
        })
        .lean()
        .exec();
      if (admin === null) {
        return res
          .status(403)
          .json({ error: true, message: "Admin not found" });
      }

      // Fetch the class details (assuming _classId is derived based on classname and section)
    const classDetails = await Class.findOne({ name: classname, section: section.toUpperCase(), _school:admin._school,currentAcademicYear }).select("_id id").lean()
      if (!classDetails) {
        return res
          .status(404)
          .json({ error: true, message: "Class not found!" });
      }

      // Fetch students in the given class and section
      const studentCount = await users
        .countDocuments({
          loginType: "student",
          _class: classDetails._id,
          _school: admin._school,
        })
        .exec();
      // const lastStudent = await users.findOne({ _class: classDetails._id, classname, section, _school:admin._school }).sort({ rollNo: -1 }).lean().exec();

      if (autoAssignRoll) {
        rollNo = studentCount + 1;
      } else {
        if (String(rollNo) !== String(studentCount + 1)) {
          return res.status(400).json({
            error: true,
            message: `Roll number must be sequential. The last roll number is ${studentCount}, so the next roll should be ${
              studentCount + 1
            }.`,
          });
        }
      }

      // let newRollNo;
      // if (autoAssignRoll) {
      //   // Auto-assign roll number
      //   newRollNo = studentCount + 1;
      // } else {
      //   // Admin manually inputs the roll number
      //   if (!rollNo) {
      //     return res.status(400).json({ error: true, message: "Roll number is required when autoAssignRoll is false" });
      //   }

      //   // Check if rollNo is sequential
      //   const lastRollNo = lastStudent ? parseInt(lastStudent.rollNo) : 0;
      //   if (parseInt(rollNo) !== lastRollNo + 1) {
      //     return res.status(400).json({
      //       error: true,
      //       message: `Roll number must be sequential. The last roll number is ${lastRollNo}, so the next roll should be ${lastRollNo + 1}.`
      //     });
      //   }

      //   newRollNo = rollNo;
      // }

      // Check if roll number already exists for this class and section
      // const existingStudent = await users.findOne({ _class: classDetails._id, classname, section, rollNo: newRollNo }).lean().exec();
      // if (existingStudent) {
      //   return res.status(400).json({
      //     error: true,
      //     message: `Roll number ${newRollNo} already exists for this class and section`,
      //     existingStudent: {
      //       id: existingStudent._id,
      //       name: `${existingStudent.firstName} ${existingStudent.lastName}`,
      //       rollNo: existingStudent.rollNo,
      //       email: existingStudent.email
      //     }
      //   });
      // }

      // Generate username and password for the student
      // const schoolName = await School.findOne({ _id: admin._school }).select("name").exec();
      // console.log(admin._school);

      const username =
        firstName.slice(0, 3) +
        admin._school.name.slice(0, 3) +
        phone.slice(-3);
      const password = generateCustomPassword();

      // Create student record
      const student = await users.create({
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email,
        gender,
        guardian,
        phone,
        admissionYear,
        _school: admin._school._id,
        dob,
        rollNo,
        _class: classDetails._id,
        _addedBy: admin._id, // Using admin name instead of id
        joinDate,
        signature,
        username,
        password,
        profileImage,
        loginType: "student",
        address,
        
      });

      // Send email notification
      const adminName = admin.firstName;
      const adminEmail = admin.email;
      const recipientEmail = student.email || adminEmail;
      // await mail("adminNotification", {
      //   to: recipientEmail,
      //   subject: "New Student Created",
      //   locals: {
      //     studentEmail: student.email,
      //     studentName: student.firstName,
      //     username: student.username,
      //     password: password,
      //     adminName: adminName
      //   }
      // });

      return res.status(201).json({
        error: false,
        StudentUserName: student.username,
        StudentPassword: password,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },
  /**
   * @api {put} /admin/student/:id Edit Student Details
   * @apiName EditStudentDetails
   * @apiGroup Student
   *
   * @apiHeader {String} Authorization Bearer token of the admin.
   *
   * @apiParam {String} id Student's unique ID.
   *
   * @apiDescription This route allows only admin users to edit details of a specific student. The admin must be logged in and authorized to access this endpoint. Only the provided fields in the request body will be updated.
   *
   * @apiParam (Request Body) {String} [firstName] Student's first name.
   * @apiParam (Request Body) {String} [lastName] Student's last name.
   * @apiParam (Request Body) {String} [email] Student's email.
   * @apiParam (Request Body) {String} [gender] Student's gender.
   * @apiParam (Request Body) {String} [guardian] Guardian's name.
   * @apiParam (Request Body) {String} [phone] Student's phone number.
   * @apiParam (Request Body) {String} [admissionYear] Admission year of the student.
   * @apiParam (Request Body) {String} [dob] Date of birth of the student.
   * @apiParam (Request Body) {String} [rollNo] Roll number of the student.
   * @apiParam (Request Body) {String} [signature] Signature of the student.
   * @apiParam (Request Body) {String} [profileImage] Profile image URL of the student.
   *
   * @apiError (403) Forbidden Only admins can edit student details.
   * @apiError (404) NotFound Student not found.
   * @apiError (500) InternalServerError An error occurred while updating student details.
   *
   * @apiExample {json} Request-Example:
   *     {
   *       "firstName": "Jane",
   *       "lastName": "Doe",
   *       "email": "janedoe@example.com",
   *       "gender": "Female",
   *       "phone": "0987654321"
   *     }
   *
   * @apiExample {json} Error-Response:
   *     {
   *       "message": "Only admins can edit student details"
   *     }
   *
   * @apiExample {json} Error-Response:
   *     {
   *       "message": "Student not found"
   *     }
   *
   * @apiExample {json} Error-Response:
   *     {
   *       "message": "An error occurred while updating student details",
   *       "error": "Error details here"
   *     }
   */
  async editStudentDetails(req, res) {
    try {
      // Get student ID from params
      const studentId = req.params.id;
      const { isAdmin } = req.user; // Get adminId from the request body
      console.log(studentId);

      // Check if the user exists and has the 'admin' role
      if (!isAdmin) {
        return res
          .status(403)
          .json({ message: "Only admins can edit student details" });
      }

      // Get editable fields from the request body
      const {
        firstName,
        lastName,
        email,
        gender,
        guardian,
        phone,
        admissionYear,
        dob,
        rollNo,
        _class,
        signature,
        profileImage,
      } = req.body;

      // Build the update object (only update fields that are provided)
      const updateData = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (email) updateData.email = email;
      if (gender) updateData.gender = gender;
      if (guardian) updateData.guardian = guardian;
      if (phone) updateData.phone = phone;
      if (admissionYear) updateData.admissionYear = admissionYear;
      if (dob) updateData.dob = dob;
      if (rollNo) updateData.rollNo = rollNo;
      // if (_class) updateData._class = _class;
      if (signature) updateData.signature = signature;
      if (profileImage) updateData.profileImage = profileImage;

      // Update the student record in the database
      const updatedStudent = await users.findByIdAndUpdate(
        { _id: studentId },
        { $set: updateData },
        { new: true } // Return the updated document
      );

      // If the student is not found
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Return the updated student
      res.status(200).json({
        message: "Student details updated successfully",
        student: updatedStudent,
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({
        message: "An error occurred while updating student details",
        error,
      });
    }
  },

  /**
   *@api {post} admin/students/view-students Admin will View All Students
   * @apiName ViewAllStudents
   * @apiGroup Admin
   *@apiVersion 1.0.0
   * @apiDescription Retrieves all teachers belonging to the school
   * @apiHeader {String} Authorization Bearer token for admin access.
   *
   * @apiParam {Number} [pageNo=1] The page number to retrieve (defaults to 1 if not provided).
   * @apiParam {Number} [skipLimit=20] The number of students to return per page (defaults to 20 if not provided).
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "students": [
   *     {
   *       "_id": "670504c7cd2223b01699c6b1",
   *       "username": "JunSpr385",
   *       "firstName": "June",
   *       "lastName": "David",
   *       "profileImage": "public/docsimg/ProfilePic.jpeg",
   *       "email": "june123@gmail.com",
   *       "phone": "9080264385",
   *       "gender": "Female",
   *       "admissionYear": "2024",
   *       "dob": "1996-07-12",
   *       "rollNo": "R003",
   *       "_class": {
   *         "name": "10",
   *         "section": "A"
   *       }
   *     },
   *     {
   *       "_id": "67052d954cbe69ed12657f76",
   *       "username": "MriSpr246",
   *       "firstName": "Mrinal",
   *       "lastName": "Mohan",
   *       "profileImage": "public/docsimg/ProfilePic.jpeg",
   *       "email": "mbera829@gmail.com",
   *       "phone": "9002550246",
   *       "gender": "Male",
   *       "admissionYear": "2024",
   *       "dob": "2010-05-02",
   *       "rollNo": "R001",
   *       "_class": {
   *         "name": "10",
   *         "section": "A"
   *       }
   *     }
   *   ],
   *   "totalStudents": 2
   * }
   *
   * @apiError NotAdmin You are not an admin.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Only admins can view student details"
   * }
   *
   * @apiError InternalServerError Internal server error.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "Internal server error"
   * }
   */

  async viewAllStudents(req, res) {
    try {
      const { loginType } = req.user; // Check if the user is an admin
      if (loginType !== "admin") {
        return res
          .status(403)
          .json({ message: "Only admins can view student details" });
      }

      const { name, rollNo, className, section, academicYear } = req.body;

      let { pageNo = 1, skipLimit = 20 } = req.body;

      pageNo = Number(pageNo);
      skipLimit = Number(skipLimit);

      _class = await Class.findOne({
        _school: req.user._school,
        name: className,
        section: section,
        academicYear: academicYear,
      });

      const query = {
        _school: req.user._school,
        loginType: "student",
      };

      if (rollNo) {
        query.rollNo = rollNo;
      }

      if (_class) {
        query._class = _class;
      }

      if (name) {
        query.$or = [
          { firstName: { $regex: name, $options: "i" } }, // case-insensitive search for firstName
          { lastName: { $regex: name, $options: "i" } }, // case-insensitive search for lastName
          { fullName: { $regex: name, $options: "i" } }, // case-insensitive search for lastName
        ];
      }

      // Get pagination values, with default values if not provided by frontend
      const skip = (pageNo - 1) * skipLimit;

      // Fetch students with pagination, while excluding sensitive fields
      const [students, totalStudents] = await Promise.all([
        users
          .find(query)
          .select("-password -forgotpassword -bankDetails -bankAdded") // Exclude sensitive fields
          .skip(skip)
          .limit(skipLimit)
          .populate("_class", "name section -_id") // Populate class details and exclude the _id field
          .lean()
          .exec(),
        users.countDocuments(query).lean(),
      ]);

      // Calculate total pages
      const totalPages = Math.ceil(totalStudents / skipLimit);

      // Send response with students and pagination data
      return res.json({
        error: false,
        students: students,
        totalStudents: totalStudents,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   * @api {get} /admin/student/:id View Student Details
   * @apiName ViewStudentDetails
   * @apiGroup Student
   *
   * @apiHeader {String} Authorization Bearer token of the admin.
   *
   * @apiParam {String} id Unique ID of the student to view details.
   *
   * @apiPermission Admin
   *
   * @apiDescription This endpoint allows an admin to view detailed information of a specific student by their ID. Only users with admin privileges can access this route.
   *
   * @apiError (403) Forbidden Only admins can view student details.
   * @apiError (404) NotFound Student not found.
   * @apiError (500) InternalServerError Unexpected error occurred.
   *
   * @apiExample {json} Response-Example:
   * {
   *   "error": false,
   *   "student": {
   *     "_id": "67052d954cbe69ed12657f76",
   *     "username": "student123",
   *     "email": "student@example.com",
   *     "loginType": "student",
   *     "firstName": "John",
   *     "lastName": "Doe",
   *     "isActive": true,
   *     "_school": {
   *          "address": {
   *              "city": "Panskura",
   *              "state": "West Bengal",
   *              "country": "India",
   *              "pinCode": "721641"
   *          },
   *          "contact": {
   *              "phoneNo": "+91 8172059732",
   *              "email": "kicmmhs@gmail.com",
   *              "website": "kicmmhs.edu"
   *          },
   *          "location": {
   *              "type": "Point",
   *              "coordinates": [
   *                  21.418325060918168,
   *                  84.02980772446274
   *              ]
   *          },
   *          "name": "Khukurdaha I C M M High School",
   *          "registrationNumber": "REG3167",
   *          "principalName": "Mrinal undefined",
   *          "establishYear": 1995,
   *          "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR991hgwd5EAqJRywib6kdEyDFFIxmmA20x_evuRgHj5zlRqYq8Wq16u_rYSEkXieoQFQg&usqp=CAU",
   *          "isActive": true,
   *          "schoolType": "highSchool"
   *      }
   *     "_class": {
   *       "name": "10th Grade"
   *     },
   *     "gender": "Male",
   *     "address": "123 Main St",
   *     "phone": "123-456-7890",
   *     "dob": "01/01/2005",
   *     "createdAt": "2024-10-21T00:00:00.000Z",
   *     "updatedAt": "2024-10-21T00:00:00.000Z"
   *   }
   * }
   */
  async viewStudentDetails(req, res) {
    try {
      // Get student ID from params
      const { id } = req.params;

      //This may be changed as in this route only admin have access to enter this route
      const { isAdmin } = req.user; // Get adminId from the request body
      // Check if the user exists and has the 'admin' role
      if (!isAdmin)
        return res
          .status(403)
          .json({ message: "Only admins can view student details" });

      const student = await users
        .findOne({ _id: id, isActive: true, loginType: "student" })
        .select("-password")
        .populate("_school", "-_id")
        .populate("_class", "-_id name section")
        .populate("_addedBy", "fullName")
        .exec();

      if (!student)
        return res
          .status(404)
          .json({ error: true, message: "Student not found" });

      if (!student)
        return res
          .status(404)
          .json({ error: true, message: "Student not found" });

      return res.json({ error: false, student });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   * Deactivate a student
   * @api {put} /admin/student/change-status/:id 5.0 Deactivate a student
   * @apiName deactivateStudent
   * @apiGroup Student
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} studentId `URL Param` The _id of the student to deactivate
   * @apiParam {String} adminId `Body Param` The _id of the admin who is deactivating the student
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     message: "Student deactivated successfully"
   * }
   */
  async changeStudentStatus(req, res) {
    try {
      // Check if the user exists and has the 'admin' role
      if (!req.user.isAdmin)
        return res
          .status(403)
          .json({ message: "Only admins can edit student details" });
      console.log(isAdmin);
      const student = await users
        .findOne({ _id: req.params.id, loginType: "student" })
        .exec();
      if (!student)
        return res
          .status(404)
          .json({ error: true, message: "Student not found" });
      student.isActive = !student.isActive;
      await student.save();
      return res.json({
        error: false,
        message: "Student status changed successfully",
      });

      student.isActive = false;
      await student.save();
      return res.json({
        error: false,
        message: "Student deactivated successfully",
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  async searchStudents(req, res) {
    try {
      const { isAdmin } = req.user; // Get adminId from the request body

      // Check if the user exists and has the 'admin' role
      if (!isAdmin) {
        return res
          .status(403)
          .json({ message: "Only admins can search for student details" });
      }

      // Extracting search criteria from the query
      const { name, rollNo, classId } = req.query;

      // Validations and search criteria setup
      const searchCriteria = {};

      // Search by name (firstname or lastname)
      if (name) {
        if (typeof name !== "string" || name.trim().length === 0) {
          return res.status(400).json({ message: "Invalid name provided." });
        }
        // Search for students where either firstname or lastname matches
        searchCriteria.$or = [
          { firstName: { $regex: name, $options: "i" } }, // case-insensitive search for firstName
          { lastName: { $regex: name, $options: "i" } }, // case-insensitive search for lastName
        ];
      }

      // Search by roll number
      if (rollNo) {
        if (typeof rollNo !== "string" || rollNo.trim().length === 0) {
          return res
            .status(400)
            .json({ message: "Invalid roll number provided." });
        }
        searchCriteria.rollNo = rollNo;
      }

      // Search by class ID
      if (classId) {
        // Assuming classId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(classId)) {
          return res
            .status(400)
            .json({ message: "Invalid class ID provided." });
        }
        searchCriteria._class = classId; // Assuming _class is the field holding the class reference
      }

      // Searching for students based on the criteria
      const student = await users
        .find(searchCriteria)
        .populate("_class", "-_id name section") // Populate class details
        .populate("_school", "-_idname") // Populate school details
        .select("firstName lastName rollNo"); // Only return the relevant fields

      // Returning the search results
      res.status(200).json({ error: false, student });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: "Error searching students",
        details: error.message,
      });
    }
  },

  /**
   * @api {get} /admin/classsection  classes Fetch all classes and section for a school
   * @apiName Fetch All Classes Section For School
   * @apiGroup Class
   *
   * @apiHeader {String} Authorization Bearer token of the admin.
   *
   * @apiParam {ObjectId} id `URL Param` The _id of the school for which classes are to be fetched.
   *
   * @apiSuccess {Boolean} error Indicates whether there was an error (false).
   * @apiSuccess {Array} classList Array of classes in the format: [{ _id, id, nameWiseSection }]
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "classList": [
   *     {
   *       "_id": "60d5f60c9b4d7635e8aebaf7",
   *       "id": "60d5f60c9b4d7635e8aebaf7",
   *       "nameWiseSection": "10 - A"
   *     }
   *   ]
   * }
   *
   * @apiError NotAdmin You are not an admin.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "message": "You are not an admin"
   * }
   *
   * @apiError InternalServerError Internal server error.
   * @apiErrorExample {json} Error-Response:
   * {
   *   "error": true,
   *   "reason": "Internal server error"
   * }
   */
  async fetchAllClassList(req, res) {
    try {
      // This route is for creating the class and section in this format and sent to FE during searching a student 10 - A
      const classes = await Class.find({ _school: req.params.id })
        .select("name section _id")
        .lean();

      const classList = classes.map((cls) => ({
        _id: cls._id,
        id: cls._id,
        nameWiseSection: `${cls.name} - ${cls.section}`,
      }));

      return res.json({ error: false, classList });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   * @api {post} /admin/students/bulk-upload Bulk Create Students from CSV
   * @apiName BulkCreateStudents
   * @apiGroup Admin
   * @apiVersion 1.0.0
   *
   * @apiHeader {String} Authorization Bearer token for admin authentication.
   *
   * @apiParam {File} studentCSV The CSV file containing student data to be uploaded.
   * @apiParam {String} className The name of the class where students will be enrolled.
   * @apiParam {String} section The section of the class.
   * @apiParam {String} academicYear The academic year for the enrollment.
   *
   * @apiSuccess {String} message Success message indicating the outcome of the operation.
   * @apiSuccess {Number} totalCreated The total number of students successfully created.
   *
   * @apiError BadRequest The uploaded file is missing or not provided.
   * @apiError Unauthorized The user is not authorized to perform this action.
   * @apiError NotFound The specified class was not found.
   * @apiError InternalServerError Some students failed to be created due to errors.
   * @apiErrorExample {json} Error Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "No file uploaded."
   *     }
   *
   * @apiErrorExample {json} Error Response:
   *     HTTP/1.1 403 Forbidden
   *     {
   *       "error": "Unauthorized. Only admins can upload student data."
   *     }
   *
   * @apiErrorExample {json} Error Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "error": "Class not found."
   *     }
   *
   * @apiErrorExample {json} Error Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "message": "Some students failed to be created.",
   *       "totalCreated": 5,
   *       "totalFailed": 2,
   *       "failedRecords": [
   *         {
   *           "student": "John Doe",
   *           "error": "Email already exists."
   *         },
   *         {
   *           "student": "Jane Smith",
   *           "error": "Phone number is invalid."
   *         }
   *       ]
   *     }
   */

  async bulkCreateFromCSV(req, res) {
    try {
      // Ensure a file is uploaded
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      // Extract user details from JWT token
      const { _school, loginType } = req.user;

      // Validate user role: ensure they are an admin
      if (loginType !== "admin") {
        return res
          .status(403)
          .json({
            error: "Unauthorized. Only admins can upload student data.",
          });
      }

      const { className, section, academicYear } = req.body;
      const studentsToCreate = [];
      const studentsWithoutEmail = [];
      const emailPromises = [];
      // Getting the Class Id:-
      const classDetails = await Class.findOne({ name: className, section, academicYear });
      
      
      // Validate if class exists
      if (!classDetails) {
        return res.status(404).json({ error: "Class not found." });
      }
      const school = await School.findOne({ _id: _school }).lean();

      // Create a readable stream from the uploaded file buffer
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null); // End the stream

      bufferStream
        .pipe(csv())
        .on("data", (row) => {
          // Generate a username based on the required format
          
          
          const username = `${row.Firstname.slice(0, 3).toLowerCase()}${school.name.slice(0, 3).toLowerCase()}${row.Phone.slice(-3)}`;
          const password = generateCustomPassword(); // Assuming you have a function for generating a custom password

          // Student data preparation
          const studentData = {
            username,
            password, // Use your hashing method later when saving
            firstName: row.Firstname,
            lastName: row.Lastname,
            fullName: `${row.Firstname} ${row.Lastname}`,
            email: row.Email || "", // Optional email
            phone: row.Phone,
            gender: row.Gender,
            dob: row.Dob,
            guardian: {
              fathersName: row.Fathersname,
              fathersOccupation: row.FathersOccupation,
              mothersName: row.Mothersname,
              mothersOccupation: row.MothersOccupation,
            },
            address: {
              locality: row.Locality,
              city: row.City,
              state: row.State,
              pin: row.Pin,
              country: row.Country,
            },
            admissionYear: row.Joindate.split("-")[0], // Extract year as admissionYear
            joinDate: row.Joindate,
            rollNo: row.Rollno,
            _addedBy: req.user._id,
            _class: classDetails._id,
            _school: _school, // Assuming _school is an object with an _id field
            loginType: "student",
            currentAcademicYear: row.Academicyear

          }

          studentsToCreate.push(studentData);

          if (!studentData.email) {
            studentsWithoutEmail.push({
              fullName: studentData.fullName,
              username: studentData.username,
              password,
            });
          } else {
            // Create a promise for sending email to student if they have an email
            const emailPromise = mail("adminNotification", {
              to: studentData.email,
              subject: `Welcome to the School`,
              locals: {
                studentEmail: studentData.email,
                studentName: studentData.firstName,
                username: studentData.username,
                password: password,
                adminName: req.user.firstName, // Or other property for admin's name
              },
            });
            emailPromises.push(emailPromise);
          }
        })
        .on("end", async () => {
          try {
            // Wait for all email promises to resolve
            await Promise.all(emailPromises);

            // Bulk insert students without hashing passwords here
            // await users.insertMany(studentsToCreate);
            const saveErrors = [];
            for (const studentData of studentsToCreate) {
              try {
                await users.create(studentData);
              } catch (saveError) {
                saveErrors.push({
                  student: studentData.fullName,
                  error: saveError.message,
                });
              }
            }

            if (studentsWithoutEmail.length > 0) {
              await mail("adminNotification", {
                to: req.user.email, // Admin email from the request user info
                subject: "New Students Created - Email Notification",
                locals: {
                  adminName: req.user.firstName,
                  studentName: "", // No student name available for admin notification
                  username: "", // No username available for admin notification
                  password: "", // No password available for admin notification
                  studentEmail: "", // Set to empty string
                  studentList: studentsWithoutEmail, // List of students without emails
                },
              });
            }

            if (saveErrors.length > 0) {
              return res.status(500).json({
                message: "Some students failed to be created.",
                totalCreated: studentsToCreate.length - saveErrors.length,
                totalFailed: saveErrors.length,
                failedRecords: saveErrors,
              });
            }

            res.status(200).json({
              message: "All students created successfully!",
              totalCreated: studentsToCreate.length,
              // studentsToCreate
            });
          } catch (error) {
            console.error(`Error saving students: ${error.message}`);
            res
              .status(500)
              .json({
                error: "Error processing the data",
                details: error.message,
              });
          }
        });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error processing the file", details: error.message });
    }
  },
  
  // Get Last Roll No of The class and section
  
  /**
   * @api {get} /admin/lastrollnumber Get Last Roll Number of a Class
   * @apiName GetLastRollNumber
   * @apiGroup Student
   * @apiPermission Admin
   *
   * @apiDescription This endpoint retrieves the last roll number of students in a class.
   *
   * @apiParam {String} className The name of the class.
   * @apiParam {String} section The section of the class.
   * @apiParam {String} academicYear The academic year of the class.
   *
   * @apiSuccess {String} message The response message.
   * @apiSuccess {Number} lastRollNumber The last roll number of students in the class.
   *
   * @apiError (401) {Boolean} error Indicates an error occurred (true means error).
   * @apiError (401) {String} message Error message stating the user is not authenticated.
   *
   * @apiError (403) {Boolean} error Indicates an error occurred (true means error).
   * @apiError (403) {String} message Error message stating the user is not an admin.
   *
   * @apiError (404) {Boolean} error Indicates an error occurred (true means error).
   * @apiError (404) {String} message Error message stating the class was not found.
   *
   * @apiError (500) {Boolean} error Indicates an error occurred (true means error).
   * @apiError (500) {String} reason Detailed error message for server-side issues.
   *
   * @apiHeader {String} Authorization Bearer token for admin access.
   */
  async getLastRollNumber(req,res){
    const {loginType} = req.user;
    if(loginType!=="admin"){
      return res.status(403).json({ message: 'Only admins can view student details' });
    }
    const {className,section,academicYear} = req.body;
    const classData = await Class.findOne({name:className,section:section,academicYear:academicYear}).lean();
    
    if(!classData){
      return res.status(404).json({ message: 'Class not found' });
    }
    const lastRollNumber = await users.find({_class:classData._id}).countDocuments();
    return res.status(200).json({ message: 'Last Roll Number', lastRollNumber });
  }
}
