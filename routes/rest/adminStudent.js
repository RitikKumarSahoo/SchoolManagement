const mongoose = require("mongoose");
const users = require("../../models/user");
const School = require("../../models/school");
const Class = require("../../models/class");
const mail = require("../../lib/mail");
const randomstring = require("randomstring");
const { Readable } = require("stream");
const csv = require("csv-parser");
const { error } = require("console");

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

      const existingUser = await users.findOne({ 
        $or: [{ email }, { phone }] 
      }).lean().exec();
  
      if (existingUser) {
        const conflictField = existingUser.email === email ? "email" : "phone";
        return res.status(400).json({ 
          error: true, 
          message: `The provided ${conflictField} already exists. Please use a different ${conflictField}.` 
        });
      }

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
 * @apiVersion 1.0.0
 * @apiName EditStudentDetails
 * @apiGroup Student
 *
 * @apiDescription Allows an admin or super admin to edit the details of an existing student.
 *
 * @apiParam {String} id The unique identifier of the student (in URL parameters).
 *
 * @apiHeader {String} Authorization Bearer token for authorization.
 *
 * @apiBody {String} [firstName] First name of the student.
 * @apiBody {String} [lastName] Last name of the student.
 * @apiBody {String} [email] Email address of the student.
 * @apiBody {String} [gender] Gender of the student.
 * @apiBody {String} [phone] Phone number of the student.
 * @apiBody {Number} [admissionYear] Year the student was admitted.
 * @apiBody {Date} [dob] Date of birth of the student.
 * @apiBody {String} [rollNo] Roll number of the student.
 * @apiBody {String} [signature] Signature of the student.
 * @apiBody {String} [profileImage] URL of the student's profile image.
 * @apiBody {Object} [address] Address of the student.
 * @apiBody {String} [address.locality] Locality of the student's address.
 * @apiBody {String} [address.city] City of the student's address.
 * @apiBody {String} [address.state] State of the student's address.
 * @apiBody {String} [address.pin] Pin code of the student's address.
 * @apiBody {String} [address.country] Country of the student's address.
 * @apiBody {Object} [guardian] Guardian details of the student.
 * @apiBody {String} [guardian.fathersName] Father's name.
 * @apiBody {String} [guardian.fathersOccupation] Father's occupation.
 * @apiBody {String} [guardian.mothersName] Mother's name.
 * @apiBody {String} [guardian.mothersOccupation] Mother's occupation.
 *
 * @apiPermission admin, superAdmin
 *
 * @apiError (400) BadRequest Missing required parameters or invalid data.
 * @apiError (403) Forbidden You do not have permission to edit student details.
 * @apiError (404) NotFound Student not found.
 * @apiError (500) InternalServerError An error occurred while updating student details.
 *
 * @apiSuccess (200) {String} message Success message.
 * @apiSuccess (200) {Object} student Updated student object excluding password, forgotpassword, and bankAdded fields.
 *
 * @apiExample {curl} Example usage:
 *     curl -X PUT 'https://api.example.com/students/123456' \
 *     -H 'Authorization: Bearer <token>' \
 *     -d '{
 *         "firstName": "John",
 *         "lastName": "Doe",
 *         "email": "john.doe@example.com",
 *         "gender": "Male",
 *         "phone": "1234567890",
 *         "dob": "2000-01-01",
 *         "rollNo": "101",
 *         "signature": "http://example.com/signature.jpg",
 *         "profileImage": "http://example.com/profile.jpg",
 *         "address": {
 *           "locality": "Downtown",
 *           "city": "Cityville",
 *           "state": "Stateville",
 *           "pin": "12345",
 *           "country": "Countryland"
 *         },
 *         "guardian": {
 *           "fathersName": "Michael Doe",
 *           "fathersOccupation": "Engineer",
 *           "mothersName": "Jane Doe",
 *           "mothersOccupation": "Teacher"
 *         }
 *     }'
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "message": "Student details updated successfully",
 *     "student": {
 *       "_id": "123456",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "fullName": "John Doe",
 *       "email": "john.doe@example.com",
 *       "gender": "Male",
 *       "phone": "1234567890",
 *       "dob": "2000-01-01T00:00:00.000Z",
 *       "rollNo": "101",
 *       "signature": "http://example.com/signature.jpg",
 *       "profileImage": "http://example.com/profile.jpg",
 *       "address": {
 *         "locality": "Downtown",
 *         "city": "Cityville",
 *         "state": "Stateville",
 *         "pin": "12345",
 *         "country": "Countryland"
 *       },
 *       "guardian": {
 *         "fathersName": "Michael Doe",
 *         "fathersOccupation": "Engineer",
 *         "mothersName": "Jane Doe",
 *         "mothersOccupation": "Teacher"
 *       },
 *       "admissionYear": "2020",
 *       "createdAt": "2024-01-01T12:00:00.000Z",
 *       "updatedAt": "2024-01-02T12:00:00.000Z"
 *     }
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "message": "Student not found"
 *   }
 */

  async editStudentDetails(req, res) {
    try {
      // Get student ID from params
      const studentId = req.params.id;
      const { loginType, isSuperAdmin } = req.user;
  
      // Check if the user exists and has the 'admin' role
      if (!(loginType === "admin" || isSuperAdmin)) {
        return res
          .status(403)
          .json({ message: "You do not have permission to edit student details" });
      }
  
      // Get editable fields from the request body
      const {
        firstName,
        lastName,
        email,
        gender,
        phone,
        admissionYear,
        dob,
        signature,
        profileImage,
        address,
        guardian,
      } = req.body;
  
      // Fetch the existing student data
      const user = await users.findById(studentId);
      if (!user) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      // Update fields if they are provided and not empty
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (firstName || lastName) user.fullName = `${firstName || user.firstName} ${lastName || user.lastName}`;
      if (email) user.email = email;
      if (gender) user.gender = gender;
      if (phone) user.phone = phone;
      if (admissionYear) user.admissionYear = admissionYear;
      if (dob) user.dob = dob;
      if (signature) user.signature = signature;
      if (profileImage) user.profileImage = profileImage;
  
      // Update guardian details if provided and not empty
      if (guardian) {
        if (guardian.fathersName) user.guardian.fathersName = guardian.fathersName;
        if (guardian.fathersOccupation) user.guardian.fathersOccupation = guardian.fathersOccupation;
        if (guardian.mothersName) user.guardian.mothersName = guardian.mothersName;
        if (guardian.mothersOccupation) user.guardian.mothersOccupation = guardian.mothersOccupation;
      }
  
      // Update address if provided and not empty
      if (address) {
        if (address.locality) user.address.locality = address.locality;
        if (address.city) user.address.city = address.city;
        if (address.state) user.address.state = address.state;
        if (address.pin) user.address.pin = address.pin;
        if (address.country) user.address.country = address.country;
      }
  
      // Save the updated student record
      await user.save();
  
      const studentResponse = user.toObject();
      delete studentResponse.password;        // Remove password
      delete studentResponse.forgotpassword;  // Remove forgotPassword
      delete studentResponse.bankAdded;
  
      // Return the updated student
      res.status(200).json({
        message: "Student details updated successfully",
        student: studentResponse,
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
 * @api {post} /api/v1/admin/students/view-students View all students
 * @apiName ViewAllStudents
 * @apiGroup Admin
 * @apiDescription This endpoint allows admins, teachers, or super admins to view all students based on search filters and pagination.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiParam {String} [className] The name of the class to filter students.
 * @apiParam {String} [section] The section of the class to filter students.
 * @apiParam {String} [searchString] Optional search string to filter students. The search can be based on:
 *    - `rollNo` (numeric, typically shorter than phone numbers)
 *    - `phone` (numeric, matches exactly)
 *    - `gender` (e.g., "Male", "Female")
 *    - `email` (case-insensitive)
 *    - `firstName` (case-insensitive)
 *    - `lastName` (case-insensitive)
 *    - `fullName` (case-insensitive)
 * @apiParam {Number} [pageNo] Page number for pagination. Default is 1.
 * @apiParam {Number} [skipLimit] Number of students per page. Default is 10.
 * @apiParam {String} [sortBy="rollNo"] Field to sort students by(rollNo or class). Default is `rollNo`.
 *
 * @apiSuccess {Boolean} error Indicates whether an error occurred. Always `false` for successful responses.
 * @apiSuccess {Object[]} students List of students.
 * @apiSuccess {String} students._id Student ID.
 * @apiSuccess {String} students.firstName First name of the student.
 * @apiSuccess {String} students.lastName Last name of the student.
 * @apiSuccess {String} students.fullName Full name of the student.
 * @apiSuccess {String} students.rollNo Roll number of the student.
 * @apiSuccess {String} students.email Email number of the student(must be unique).
 * @apiSuccess {String} students.phone Phone number of the student(must be unique).
 * @apiSuccess {String} students.gender Gender of the student.
 * @apiSuccess {Object} students._class Class details of the student.
 * @apiSuccess {String} students._class.name Name of the class.
 * @apiSuccess {String} students._class.section Section of the class.
 * @apiSuccess {Number} totalStudents Total number of students matching the filters.
 * @apiSuccess {Number} totalPages Total number of pages for the current pagination.
 *
 * @apiError {Boolean} error Indicates whether an error occurred. Always `true` for error responses.
 * @apiError {String} message Error message describing the issue.
 *
 * @apiErrorExample {json} 403 Forbidden:
 * HTTP/1.1 403 Forbidden
 * {
 *   "error": true,
 *   "message": "You do not have permission to view student details"
 * }
 *
 * @apiErrorExample {json} 404 Not Found:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": true,
 *   "message": "10th Grade-A not available for 2024-2025"
 * }
 *
 * @apiErrorExample {json} 500 Internal Server Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "error": true,
 *   "message": "An unexpected error occurred"
 * }
 *
 * @apiExample {curl} Example usage:
 * curl -X POST \
 *   http://localhost:3000/api/v1/admin/students/view-students \
 *   -H 'Authorization: Bearer <your-token>' \
 *   -H 'Content-Type: application/json' \
 *   -d '{
 *         "className": "10th Grade",
 *         "section": "A",
 *         "searchString": "123",
 *         "pageNo": 1,
 *         "skipLimit": 20,
 *         "sortBy": "rollNo"
 *       }'
 */


 async viewAllStudents(req, res) {
  try {
    const { loginType, isSuperAdmin } = req.user;

    // Check permission
    if (!(loginType === "admin" || loginType === "teacher" || isSuperAdmin)) {
      return res.status(403).json({
        message: "You do not have permission to view student details",
      });
    }

    let { className, section, searchString, pageNo, skipLimit, sortBy = "rollNo" } = req.body;

    if(!pageNo ) pageNo=1
    if(!skipLimit) skipLimit=10
    

    // Calculate pagination
    const page = Number(pageNo);
    const limit = Number(skipLimit);
    const skip = (page - 1) * limit;

    // Automatically calculate the academic year using `moment`
    const moment = require("moment");
    const currentYear = moment().year();
    const nextYear = currentYear + 1;
    const academicYear = `${currentYear}-${nextYear}`;

    // Base query for students in the same school with loginType "student"
    let query = {
      _school: req.user._school,
      loginType: "student",
    };

    // Dynamically include class or section filters
    let classFilter = {};
    if (className) classFilter.name = className;
    if (section) classFilter.section = section;
    if (academicYear) classFilter.academicYear = academicYear;

    // Fetch class data if className or section is provided
    const classes = await Class.find({ ...classFilter, _school: req.user._school })
      .select("_id name section")
      .lean();

    if (classes.length) {
      // Include all matching classes in the query
      query._class = { $in: classes.map((cls) => cls._id) };
    } else if (!searchString) {
      const parts = [];
      if (className) parts.push(className);
      if (section) parts.push(section);
      const classSection = parts.join("-");
      return res.status(404).json({
        error: true,
        message: `${classSection} not available for ${academicYear}`,
      });
    }

    // Add searchString filters
    if (searchString) {
      const regex = new RegExp(searchString, "i"); // Case-insensitive search
      if (!isNaN(searchString) && searchString.length < 4) {
        query.rollNo = parseInt(searchString, 10); // Likely rollNo
      } else if (!isNaN(searchString)) {
        query.phone = searchString; // Exact match for phone
      } else if (
        searchString.toLowerCase() === "male" ||
        searchString.toLowerCase() === "female"
      ) {
        query.gender = { $regex: new RegExp(`^${searchString}$`, "i") }; // Ensure case-insensitive gender search
      } else {
        query.$or = [
          { email: regex },
          { firstName: regex },
          { lastName: regex },
          { fullName: regex },
        ];
      }
    }
    
    

    // Fetch students without sorting (initially)
    const [students, totalStudents] = await Promise.all([
      users
        .find(query)
        .select("-password -forgotpassword -bankDetails -bankAdded") // Exclude sensitive fields
        .skip(skip)
        .limit(limit)
        .populate("_class", "name section -_id") // Populate class details
        .lean()
        .exec(),
      users.countDocuments(query),
    ]);

    // Sort the `students` array based on the `rollNo` field within each student
    students.sort((a, b) => {
      const rollA = a.rollNo ? parseInt(a.rollNo, 10) : Infinity; // Default to Infinity if rollNo is missing
      const rollB = b.rollNo ? parseInt(b.rollNo, 10) : Infinity;
      return rollA - rollB;
    });

    const totalPages = Math.ceil(totalStudents / limit);

    return res.json({
      error: false,
      students,
      totalStudents,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: error.message });
  }
},



  

  /**
   * @api {get} /admin/student/:id View Student Details
   * @apiName ViewStudentDetails
   * @apiGroup Student
   *
   * @apiHeader {String} Authorization Bearer token of the admin|teacher|Super Admin.
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
   *       "name": "10",
   *       "section": "A"
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
      const { loginType, isSuperAdmin } = req.user; // Get adminId from the request body
      // Check if the user exists and has the 'admin' role
      if (!(loginType === "admin" || loginType === "teacher" || isSuperAdmin)) {
        return res
          .status(403)
          .json({ message: "You do not have permission to view student details" });
      }

      const student = await users
        .findOne({ _id: id, loginType: "student" })
        .select("-password")
        .populate("_school", "-_id")
        .populate("_class", "-_id name section academic year")
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
 * @api {put} /admin/student/change-status/:id Change Student Status
 * @apiName ChangeStudentStatus
 * @apiGroup Students
 * @apiVersion 1.0.0
 * @apiPermission Admin
 *
 * @apiDescription This endpoint allows an admin to activate or deactivate a student account. The status can either be explicitly provided or toggled automatically.
 *
 * @apiHeader {String} Authorization Admin's valid JWT token in the format `Bearer <token>`.
 *
 * @apiParam {String} id The unique ID of the student whose status is to be changed.
 *
 * @apiBody {Boolean} [isActive] Optional. If provided, the student's status will be set to the specified value (`true` for active, `false` for inactive).
 *
 * @apiExample {postman} Example Usage in Postman:
 * 1. **Explicitly Activate a Student:**
 *    - **Method**: PUT
 *    - **URL**: https://schoolmanagement-zn7n.onrender.com/admin/student/change-status/671b78eb95c2172188f84ac4
 *    - **Headers**:
 *      - `Authorization`: Bearer <token>
 *      - `Content-Type`: application/json
 *    - **Body (raw JSON)**:
 *      ```json
 *      {
 *        "isActive": true
 *      }
 *      ```
 *
 * 2. **Toggle the Student's Current Status:**
 *    - **Method**: PATCH
 *    - **URL**: https://schoolmanagement-zn7n.onrender.com/admin/student/change-status/671b78eb95c2172188f84ac4
 *    - **Headers**:
 *      - `Authorization`: Bearer <token>
 *      - `Content-Type`: application/json
 *    - **Body**: Leave empty.
 *
 * @apiSuccess {Boolean} error Indicates whether the request was successful (`false` for success).
 * @apiSuccess {String} message Describes the result of the operation.
 *
 * @apiSuccessExample {json} Success Response:
 * {
 *   "error": false,
 *   "message": "Student activated successfully"
 * }
 *
 * @apiError (403) Unauthorized The user is not an admin.
 * @apiError (404) NotFound The student with the specified ID does not exist.
 * @apiError (500) InternalServerError There was a server error while processing the request.
 *
 * @apiErrorExample {json} Unauthorized Response:
 * {
 *   "error": true,
 *   "message": "Only admins can edit student details"
 * }
 *
 * @apiErrorExample {json} Not Found Response:
 * {
 *   "error": true,
 *   "message": "Student not found"
 * }
 *
 * @apiErrorExample {json} Server Error Response:
 * {
 *   "error": true,
 *   "message": "Internal Server Error"
 * }
 */


  async changeStudentStatus(req, res) {
    try {
      // Check if the user exists and has the 'admin' role
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Only admins can edit student details" });
      }
  
      const student = await users.findOne({ _id: req.params.id, loginType: "student" }).exec();
  
      if (!student) {
        return res.status(404).json({ error: true, message: "Student not found" });
      }
  
      const { isActive } = req.body;
  
      // Check if isActive is provided; otherwise, toggle the current status
      if (typeof isActive === "boolean") {
        student.isActive = isActive;
      } else {
        student.isActive = !student.isActive;
      }
  
      await student.save();
  
      const statusMessage = student.isActive
        ? "Student activated successfully"
        : "Student deactivated successfully";
  
      return res.json({
        error: false,
        message: statusMessage,
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
            return res.status(403).json({
                error: "Unauthorized. Only admins can upload student data.",
            });
        }

        const { className, section, academicYear } = req.body;
        const studentsToCreate = [];
        const studentsWithoutEmail = [];
        const saveErrors = [];
        const createdStudentCredentials = [];
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
            .on("data", async (row) => {
                const username = `${row.Firstname.slice(0, 3).toLowerCase()}${school.name.slice(0, 3).toLowerCase()}${row.Phone.slice(-3)}`;
                const password = generateCustomPassword();

                // Check if phone or email already exists
                const existingStudent = await users.findOne({
                    $or: [{ phone: row.Phone }, { email: row.Email }],
                }).lean();

                if (existingStudent) {
                    saveErrors.push({
                        student: `${row.Firstname} ${row.Lastname}`,
                        error: existingStudent.phone === row.Phone
                            ? "Phone number already exists."
                            : "Email already exists.",
                    });
                    return;
                }

                // Prepare student data
                const studentData = {
                    username,
                    password,
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
                    _school: _school,
                    loginType: "student",
                    currentAcademicYear: row.Academicyear,
                };

                studentsToCreate.push(studentData);

                // Add credentials to the response data
                createdStudentCredentials.push({
                    fullName: studentData.fullName,
                    username: studentData.username,
                    password: password,
                });

                if (!studentData.email) {
                    studentsWithoutEmail.push({
                        fullName: studentData.fullName,
                        username: studentData.username,
                        password,
                    });
                }

                // Commenting out email-sending logic
                /*
                else {
                    const emailPromise = mail("adminNotification", {
                        to: studentData.email,
                        subject: `Welcome to the School`,
                        locals: {
                            studentEmail: studentData.email,
                            studentName: studentData.firstName,
                            username: studentData.username,
                            password: password,
                            adminName: req.user.firstName,
                        },
                    });
                    emailPromises.push(emailPromise);
                }
                */
            })
            .on("end", async () => {
                try {
                    // Wait for all email promises to resolve (disabled)
                    // await Promise.all(emailPromises);

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

                    /*
                    if (studentsWithoutEmail.length > 0) {
                        await mail("adminNotification", {
                            to: req.user.email,
                            subject: "New Students Created - Email Notification",
                            locals: {
                                adminName: req.user.firstName,
                                studentList: studentsWithoutEmail,
                            },
                        });
                    }
                    */

                    if (saveErrors.length > 0) {
                        return res.status(500).json({
                            message: "Some students failed to be created.",
                            totalCreated: studentsToCreate.length - saveErrors.length,
                            totalFailed: saveErrors.length,
                            failedRecords: saveErrors,
                            credentials: createdStudentCredentials, // Include credentials
                        });
                    }

                    res.status(200).json({
                        message: "All students created successfully!",
                        totalCreated: studentsToCreate.length,
                        credentials: createdStudentCredentials, // Include credentials
                    });
                } catch (error) {
                    console.error(`Error saving students: ${error.message}`);
                    res.status(500).json({
                        error: "Error processing the data",
                        details: error.message,
                    });
                }
            });
    } catch (error) {
        res.status(500).json({
            error: "Error processing the file",
            details: error.message,
        });
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
