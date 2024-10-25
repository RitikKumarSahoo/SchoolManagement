const mongoose = require("mongoose");
const users = require("../../models/user")
const School = require("../../models/school")
const Class = require('../../models/class')
const mail = require("../../lib/mail")


function generateCustomPassword() {
  const upperCaseLetter = randomstring.generate({
    length: 1,
    charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  });

  const lowerCaseLetters = randomstring.generate({
    length: 5, // Adjust the number of lowercase letters as needed
    charset: 'abcdefghijklmnopqrstuvwxyz'
  });

  const specialChar = randomstring.generate({
    length: 1,
    charset: '!@#$%^&*()_+[]{}|;:,.<>?/' // Define special characters
  });

  const numbers = randomstring.generate({
    length: 3, // Adjust the number of digits as needed
    charset: '0123456789'
  });

  // Combine all parts
  const password = upperCaseLetter + lowerCaseLetters + specialChar + numbers;
  return password; // Return the generated password
}




module.exports = {
  /**
 * @api {post} /admin/student/createstudent Create Student
 * @apiName CreateStudent
 * @apiGroup Student
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} Authorization Admin's access token.
 * 
 * @apiParam {String} firstName Student's first name (required).
 * @apiParam {String} lastName Student's last name (required).
 * @apiParam {String} [email] Student's email address.
 * @apiParam {String} gender Student's gender (required).
 * @apiParam {Object} guardian Guardian's information (required).
 * @apiParam {String} guardian.fathersName Guardian's father's name.
 * @apiParam {String} guardian.mothersName Guardian's mother's name.
 * @apiParam {String} phone Student's phone number (required).
 * @apiParam {Number} admissionYear Year of admission (required).
 * @apiParam {String} dob Student's date of birth (required).
 * @apiParam {String} classname Class name (required).
 * @apiParam {String} section Class section (required).
 * @apiParam {String} joinDate Date of joining (required).
 * @apiParam {String} signature Base64 encoded signature.
 * @apiParam {String} profileImage Path to the profile image.
 * @apiParam {String} [rollNo] Student's roll number. Required if autoAssignRoll is false.
 * @apiParam {Boolean} [autoAssignRoll=false] Whether to auto-assign the roll number.
 * 
 * @apiDescription Creates a new student record in the database. The roll number can be auto-assigned or manually entered by the admin. If manually entered, it must be sequential based on the last roll number in the class and section.
 * 
 * @apiExample Example usage (Manual Roll Number):
 * '{
 *     "firstName": "June",
 *     "lastName": "David",
 *     "gender": "Female",
 *     "guardian": {
 *       "fathersName": "Ryan David",
 *       "mothersName": "Milli David"
 *     },
 *     "phone": "9080264385",
 *     "admissionYear": 2024,
 *     "dob": "1990-07-02",
 *     "rollNo": "R004",  // Manually assigned roll number
 *     "classname": "10",
 *     "section": "A",
 *     "joinDate": "2024-10-10",
 *     "signature": "base64EncodedString",
 *     "profileImage": "public/docsimg/ProfilePic.jpeg",
 *     "autoAssignRoll": false
 *   }'
 * 
 * @apiExample Example usage (Auto-Assigned Roll Number):
 * '{
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "gender": "Male",
 *     "guardian": {
 *       "fathersName": "Michael Doe",
 *       "mothersName": "Sarah Doe"
 *     },
 *     "phone": "9123456789",
 *     "admissionYear": 2024,
 *     "dob": "1990-08-15",
 *     "classname": "10",
 *     "section": "B",
 *     "joinDate": "2024-10-10",
 *     "signature": "base64EncodedString",
 *     "profileImage": "public/docsimg/ProfilePic2.jpeg",
 *     "autoAssignRoll": true  // Roll number will be auto-assigned
 *   }'
 */

  async createStudent(req, res) {
    try {
      const { firstName, lastName, email, gender, guardian, phone, admissionYear, dob, classname, section, joinDate, signature, profileImage, autoAssignRoll = false } = req.body;
      let {
        rollNo
      } = req.body

      const { loginType, id } = req.user;

      // Check if the user is an admin
      if (loginType !== 'admin' ) {
        return res.status(403).json({ error: true, message: "Unauthorized" });
      }

       // Validate required fields
       if (!firstName || !lastName || !gender || !guardian || !phone || !admissionYear || !classname || !section || !dob || !joinDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
      }

       // Admin manually inputs the roll number
       if (!rollNo && !autoAssignRoll) {
        return res.status(400).json({ error: true, message: "Roll number is required when autoAssignRoll is false" });
       }
  
      // Find admin and ensure they have access
      const admin = await users.findOne({ _id: id, loginType: "admin" })
        .select("_school")
        .populate({
          path: "_school",
          select: "name"
        })
        .lean().exec();
      if (admin === null) {
        return res.status(403).json({ error: true, message: "Admin not found" });
      }
  
      // Fetch the class details (assuming _classId is derived based on classname and section)
    const classDetails = await Class.findOne({ name: classname, section: section.toUpperCase(), _school:admin._school }).select("_id id").lean()
      if (!classDetails) {
        return res.status(404).json({ error: true, message: "Class not found!" });
      }
  
      // Fetch students in the given class and section
      const studentCount = await users.countDocuments({ loginType: "student", _class: classDetails._id,_school:admin._school }).exec();
      // const lastStudent = await users.findOne({ _class: classDetails._id, classname, section, _school:admin._school }).sort({ rollNo: -1 }).lean().exec();
  
      if (autoAssignRoll) {
        rollNo = studentCount + 1
      } else {
        if (String(rollNo) !== String(studentCount + 1)) {
          return res.status(400).json({
            error: true,
            message: `Roll number must be sequential. The last roll number is ${studentCount}, so the next roll should be ${studentCount + 1}.`
          })
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
      
      const username = firstName.slice(0, 3) + admin._school.name.slice(0, 3) + phone.slice(-3);
      const password = generateRandomPassword();
  
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
        _addedBy: admin._id,  // Using admin name instead of id
        joinDate,
        signature,
        username,
        password,
        profileImage,
        loginType: "student"
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
        StudentPassword: student.password
      });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  }
  ,

  /**
   * Admin edit student details using student id
   * {put} /admin/student/edit/:id
   * This endpoint is restricted to admins only.
   * 
   * @param {string} studentId - The ID of the student to be edited
   * 
   * @returns {object} - The updated student object
   * 
   * @throws {Error} - If the student is not found
   * @throws {Error} - If the request is not authorized (not an admin)
   */
  async  editStudentDetails(req, res) {
    try {
      // Get student ID from params
      const  studentId  = req.params.id;
      const { isAdmin } = req.user; // Get adminId from the request body
      console.log(studentId);
      
    // Check if the user exists and has the 'admin' role
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can edit student details' });
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
        {_id: studentId},
        { $set: updateData },
        { new: true } // Return the updated document
      );
  
      // If the student is not found
      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Return the updated student
      res.status(200).json({ message: 'Student details updated successfully', student: updatedStudent });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating student details', error });
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
      const {loginType } = req.user; // Check if the user is an admin
      if (loginType!=="admin") {
        return res.status(403).jpageNoson({ message: 'Only admins can view student details' });
      }

      const {
        name, rollNo, _class
      } = req.body;

      let {
        pageNo = 1,
        skipLimit = 20
      } = req.body;

      pageNo = Number(pageNo);
      skipLimit = Number(skipLimit);

      const query = {
        _school: req.user._school,
        loginType: "student"
      };

      if (rollNo) {
        query.rollNo = rollNo
       }

       if (_class) {
        query._class = _class
       }

       if (name) {
        query.$and = [
          { firstName: { $regex: name, $options: 'i' } }, // case-insensitive search for firstName
          { lastName: { $regex: name, $options: 'i' } } , // case-insensitive search for lastName
          { fullName: { $regex: name, $options: 'i' } }  // case-insensitive search for lastName
        ];
      }
  
      // Get pagination values, with default values if not provided by frontend
      const skip = (pageNo - 1) * skipLimit;
  
      // Fetch students with pagination, while excluding sensitive fields
      const [students, totalStudents] = await Promise.all([
        users.find(query)
          .select('-password -forgotpassword -bankDetails')  // Exclude sensitive fields
          .skip(skip)
          .limit(skipLimit)
          .populate('_class', 'name section -_id')  // Populate class details and exclude the _id field
          .lean()
          .exec(),
        users.countDocuments(query).lean()
      ]);
  
      // Calculate total pages
      const totalPages = Math.ceil(totalStudents / skipLimit);
  
      // Send response with students and pagination data
      return res.json({
        error: false,
        students: students,
        totalStudents: totalStudents
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },
  

  /**
   * View a student's details
   * 
   * This endpoint is restricted to admins only.
   * 
   * @param {string} studentId - The ID of the student
   * @returns {object} - The student's details
   * 
   * @throws {Error} - If the student is not found
   * @throws {Error} - If the request is not authorized (not an admin)
   */
  async viewStudentDetails(req, res) {
    try {
      // Get student ID from params
      const { studentId } = req.params;

      //This may be changed as in this route only admin have access to enter this route
      const { isAdmin } = req.user; // Get adminId from the request body 
      // Check if the user exists and has the 'admin' role
      if (!isAdmin) return res.status(403).json({ message: 'Only admins can edit student details' });
      console.log(isAdmin);

      const student = await users.findOne({ _id: studentId, isActive: true, loginType: "student" }).select('-password').populate('_school', '-_id name')
      .populate('_class', '-_id name').exec();
       
      if(!student) return res.status(404).json({ error: true, message: "Student not found" });
      

      return res.json({ error: false, student });   
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  /**
   * Deactivate a student
   * @api {put} /students/deactivate/:studentId 5.0 Deactivate a student
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
        if (!req.user.isAdmin) return res.status(403).json({ message: 'Only admins can edit student details' });
        console.log(isAdmin);
        const student = await users.findOne({ _id: req.params.id, loginType: "student" }).exec();
        if(!student) return res.status(404).json({ error: true, message: "Student not found" });
        student.isActive = !student.isActive
        await student.save()
        return res.json({ error: false, message: "Student status changed successfully" });

    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  
  /**
   * Search students based on name, roll number, or class
   * @api {get} /students/search 5.0 Search students
   * @apiName searchStudents
   * @apiGroup Student
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} name `Query Param` The name of the student
   * @apiParam {String} rollNo `Query Param` The roll number of the student
   * @apiParam {ObjectId} classId `Query Param` The _id of the class
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * { students: [{}] }
   */
  async searchStudents(req, res) {
    try {
      const { isAdmin } = req.user; // Get adminId from the request body
      
      // Check if the user exists and has the 'admin' role
      if (!isAdmin) {
        return res.status(403).json({ message: 'Only admins can search for student details' });
      }
    
      // Extracting search criteria from the query
      const { name, rollNo, classId } = req.query;
    
      // Validations and search criteria setup
      const searchCriteria = {};
    
      // Search by name (firstname or lastname)
      if (name) {
        if (typeof name !== 'string' || name.trim().length === 0) {
          return res.status(400).json({ message: 'Invalid name provided.' });
        }
        // Search for students where either firstname or lastname matches
        searchCriteria.$or = [
          { firstName: { $regex: name, $options: 'i' } }, // case-insensitive search for firstName
          { lastName: { $regex: name, $options: 'i' } }  // case-insensitive search for lastName
        ];
      }
    
      // Search by roll number
      if (rollNo) {
        if (typeof rollNo !== 'string' || rollNo.trim().length === 0) {
          return res.status(400).json({ message: 'Invalid roll number provided.' });
        }
        searchCriteria.rollNo = rollNo;
      }
    
      // Search by class ID
      if (classId) {
        // Assuming classId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(classId)) {
          return res.status(400).json({ message: 'Invalid class ID provided.' });
        }
        searchCriteria._class = classId; // Assuming _class is the field holding the class reference
      }
    
      // Searching for students based on the criteria
      const student = await users.find(searchCriteria)
        .populate('_class', '-_id name section') // Populate class details
        .populate('_school', '-_idname') // Populate school details
        .select('firstName lastName rollNo'); // Only return the relevant fields
    
      // Returning the search results
      res.status(200).json({ error: false, student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Error searching students', details: error.message });
    }
  },

  async fetchAllClassList(req, res) {
    try {
        // This route is for creating the class and section in this format and sent to FE during searching a student 10 - A
        const classes = await Class.find({ _school: req.params.id })
            .select('name section _id')
            .lean()

        const classList = classes.map((cls) => ({
          _id: cls._id,
          id: cls._id,
          nameWiseSection: `${cls.name} - ${cls.section}`
        }))
        
        return res.json({ error: false, classList });

    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },

  
  
}
