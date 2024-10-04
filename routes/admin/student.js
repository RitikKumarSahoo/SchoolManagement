const users = require("../../models/user")
const School = require("../../models/school")
const Class = require('../../models/class')
const mail = require("../../lib/mail")

module.exports = {
  /**
   * Create a new student   * @api {post} /student 3.0 Create a new student
   * @apiName createStudent
   * @apiGroup Student
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} firstName
   * @apiParam  {String} lastName
   * @apiParam  {String} email
   * @apiParam  {String} gender
   * @apiParam  {Object} guardian
   * @apiParam  {String} guardian.fathersName
   * @apiParam  {String} guardian.mothersName
   * @apiParam  {String} phone
   * @apiParam  {Number} admissionYear
   * @apiParam  {ObjectID} _schoolId
   * @apiParam  {Date} dob
   * @apiParam  {Number} rollNo
   * @apiParam  {ObjectID} _classId
   * @apiParam  {ObjectID} _adminId
   * @apiParam  {Date} joinDate
   * @apiParam  {String} signature
   * @apiParam  {String} profileImage
   *
   * @apiSuccess (201) {json} Student
   *
   * @apiParamExample  {json} Request-Example:
   * {
   *   "firstName": "John",
   *   "lastName": "Doe",
   *   "email": "john@example.com",
   *   "gender": "Male",
   *   "guardian": {
   *     "fathersName": "John Doe Sr.",
   *     "mothersName": "Jane Doe"
   *   },
   *   "phone": "0000000000",
   *   "admissionYear": 2019,
   *   "schoolId": "123456789012",
   *   "dob": "2000-01-01",
   *   "rollNo": 1,
   *   "classId": "123456789012",
   *   "addedBy": "123456789012",
   *   "joinDate": "2019-01-01",
   *   "signature": "John Doe",
   *   "profileImage": "https://example.com/johndoe.jpg"
   * }
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "error": false,
   *   "Student": {
   *     "firstName": "John",
   *     "lastName": "Doe",
   *     "email": "john@example.com",
   *     "gender": "Male",
   *     "guardian": {
   *       "fathersName": "John Doe Sr.",
   *       "mothersName": "Jane Doe"
   *     },
   *     "phone": "0000000000",
   *     "admissionYear": 2019,
   *     "schoolId": "123456789012",
   *     "dob": "2000-01-01",
   *     "rollNo": 1,
   *     "classId": "123456789012",
   *     "addedBy": "123456789012",
   *     "joinDate": "2019-01-01",
   *     "signature": "John Doe",
   *     "profileImage": "https://example.com/johndoe.jpg"
   *   }
   * }
   *
   * @apiError (400) {json} MissingFields Student creation failed due to missing required fields
   * @apiError (400) {json} StudentExists Student already exists
   * @apiError (500) {json} ServerError Server error occurred while creating student
   */
  async createStudent(req,res){
    
    try {
      const { firstName, lastName, email, gender, guardian, phone, admissionYear, _schoolId, dob, rollNo, _classId, _adminId, joinDate, signature,profileImage  } = req.body;

      // if(!firstName || !lastName || !gender || !guardian || !phone || !admissionYear || !schoolId || !dob || !rollNo || !classId || !addedBy || !joinDate || !signature){
      //   return res.status(400).json({error: true, message: "All fields are required"})
      // }
      

      if (!firstName) {
        return res.status(400).json({ error: true, message: "First name is required" });
      }
      if (!lastName) {
        return res.status(400).json({ error: true, message: "Last name is required" });
      }
      if (!gender) {
        return res.status(400).json({ error: true, message: "Gender is required" });
      }
      if (!guardian || !guardian.fathersName || !guardian.mothersName) {
        return res.status(400).json({ error: true, message: "Guardian information (father's and mother's name) is required" });
      }
      if (!phone) {
        return res.status(400).json({ error: true, message: "Phone number is required" });
      }
      if (!admissionYear) {
        return res.status(400).json({ error: true, message: "Admission year is required" });
      }
      if (!_schoolId) {
        return res.status(400).json({ error: true, message: "School ID is required" });
      }
      if (!dob) {
        return res.status(400).json({ error: true, message: "Date of birth is required" });
      }
      if (!rollNo) {
        return res.status(400).json({ error: true, message: "Roll number is required" });
      }
      if (!_classId) {
        return res.status(400).json({ error: true, message: "Class ID is required" });
      }
      if (!_adminId) {
        return res.status(400).json({ error: true, message: "AddedBy (Admin/User ID) is required" });
      }
      if (!joinDate) {
        return res.status(400).json({ error: true, message: "Join date is required" });
      }
      if (!signature) {
        return res.status(400).json({ error: true, message: "Student Signature is required" });
      }
      
      
      const query = {phone,rollNo}
      const studentExists = await users.findOne(query).lean().exec()

      if(studentExists)  return res.status(400).json({error: true, message: "Student already exists"})
       

      const schoolName = await School.findOne({_id:_schoolId}).select("name").exec()
      
  console.log("School Name:",schoolName);
  
      const username  = firstName.slice(0,3)+schoolName.name.slice(0,3)+phone.slice(-3)
      const password = schoolName.name.slice(0,3)+admissionYear+phone.slice(-3)

      const student =await users.create({
        firstName,
        lastName,
        email,
        gender,
        guardian,
        phone,
        admissionYear,
        _school:_schoolId,
        dob,
        rollNo,
        _class:_classId,
        _addedBy:_adminId,
        joinDate,
        signature,
        username,
        password,
        profileImage,
        loginType:"student"
        
      })
      
      const adminDetails = await users.findById(_adminId).exec()
      const adminName = adminDetails.firstName
      const adminEmail = adminDetails.email
      // Determine the recipient email
      const recipientEmail = student.email || adminEmail;

      

       //This should be change to admin(_addedBy) email. Before that verify that mail in mailgun
      await mail("adminNotification", {
        to: recipientEmail,
        subject: "New Student Created",
        locals: {
          studentEmail: student.email,
          studentName: student.firstName,
          username: student.username,
          password: password,
          adminName: adminName
        }
      });

      return res.status(201).json({error: false, StudentUserName: student.username, StudentPassword: student.password})
    } catch (error) {
      console.log(error);
      
      return res.status(500).json({error: true, message: error.message})
    }
  },

  /**
   * Edit student details
   * 
   * This endpoint is restricted to admins only.
   * 
   * @param {string} studentId - The ID of the student to be edited
   * @param {object} req.body - The request body containing the fields to be updated
   * @param {string} req.body.adminId - The ID of the admin making the request
   * @param {string} [req.body.firstName] - The new first name of the student
   * @param {string} [req.body.lastName] - The new last name of the student
   * @param {string} [req.body.email] - The new email of the student
   * @param {string} [req.body.gender] - The new gender of the student
   * @param {string} [req.body.guardian] - The new guardian of the student
   * @param {string} [req.body.phone] - The new phone number of the student
   * @param {string} [req.body.admissionYear] - The new admission year of the student
   * @param {string} [req.body._schoolId] - The new school ID of the student
   * @param {string} [req.body.dob] - The new date of birth of the student
   * @param {string} [req.body.rollNo] - The new roll number of the student
   * @param {string} [req.body._classId] - The new class ID of the student
   * @param {string} [req.body.signature] - The new signature of the student
   * @param {string} [req.body.profileImage] - The new profile image of the student
   * 
   * @returns {object} - The updated student object
   * 
   * @throws {Error} - If the student is not found
   * @throws {Error} - If the request is not authorized (not an admin)
   */
  async  editStudentDetails(req, res) {
    try {
      // Get student ID from params
      const { studentId } = req.params;
      const { adminId } = req.body; // Get adminId from the request body

    // Verify if the user is an admin by checking the database
    const adminUser = await users.findOne({_id:adminId}).lean().exec();

    // Check if the user exists and has the 'admin' role
    if (!adminUser || adminUser.loginType !== 'admin') {
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
        _schoolId,
        dob,
        rollNo,
        _classId,
        signature,
        profileImage
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
      if (_schoolId) updateData._schoolId = _schoolId;
      if (dob) updateData.dob = dob;
      if (rollNo) updateData.rollNo = rollNo;
      if (_classId) updateData._classId = _classId;
      if (signature) updateData.signature = signature;
      if (profileImage) updateData.profileImage = profileImage;
  
      // Update the student record in the database
      const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
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
   * View all students in a school
   * 
   * This endpoint is restricted to admins only.
   * 
   * @param {string} schoolId - The ID of the school
   * @returns {object} - The list of students in the school
   * 
   * @throws {Error} - If the school is not found
   * @throws {Error} - If the request is not authorized (not an admin)
   */
  async viewAllStudents(req,res){
    try {
        const {schoolId} = req.params
        const students = await Student.find({_school:schoolId}).exec()
        return res.json({error: false, students})
    } catch (error) {
      log.error(error)
      return res.status(500).json({error: true, message: error.message})
    }
  },


  async viewStudentDetails(req, res) {
    try {
      // Get student ID from params
      const { studentId } = req.params;
      const {adminId} = req.body

      //This may be changed as in this route only admin have access to enter this route
      const admin = await users.findOne({ _id: adminId, loginType: "admin" }).lean().exec();
      if(!adminId) return res.status(403).json({ error: true, message: "Unauthorized" });

      const student = await users.findOne({ _id: studentId, isActive: true, loginType: "student" }).populate('_schoolId', 'schoolName')
      .populate('_classId', 'className').exec();
       
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
  async deactivateStudent(req, res) {
    try {
        const {studentId} = req.params
        const {adminId} = req.body

        const admin = await users.findOne({ _id: adminId, loginType: "admin" }).lean().exec();
        if(!adminId) return res.status(403).json({ error: true, message: "Unauthorized" }); 

        const student = await users.findOne({ _id: studentId, isActive: true, loginType: "student" }).exec();

        if(!student) return res.status(404).json({ error: true, message: "Student not found" });

        student.isActive = false
        await student.save()
        return res.json({ error: false, message: "Student deactivated successfully" });

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
      // Assuming adminId is part of the request, verify if the user is an admin
      const adminId = req.body.adminId; // You might want to pass this in the headers or token
  
      // Check if the adminId corresponds to an admin in your database
      const admin = await users.findOne({_id:adminId, loginType: "admin"}); 
      if (!admin) return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
      
  
      // Extracting search criteria from the query
      const { name, rollNo, classId } = req.query;
  
      // Validations
      const searchCriteria = {};
      if (name) {
        if (typeof name !== 'string' || name.trim().length === 0) {
          return res.status(400).json({ message: 'Invalid name provided.' });
        }
        searchCriteria.name = { $regex: name, $options: 'i' };
      }
      if (rollNo) {
        if (typeof rollNo !== 'string' || rollNo.trim().length === 0) {
          return res.status(400).json({ message: 'Invalid roll number provided.' });
        }
        searchCriteria.rollNo = rollNo;
      }
      if (classId) {
        // Assuming classId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(classId)) {
          return res.status(400).json({ message: 'Invalid class ID provided.' });
        }
        searchCriteria._classId = classId;
      }
  
      // Searching for students based on criteria
      const students = await users.find(searchCriteria);
      
      // Returning the search results
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: 'Error searching students', error });
    }
  },

  
  
  
}
