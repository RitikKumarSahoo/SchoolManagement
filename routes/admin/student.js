const users = require("../../models/user")
const School = require("../../models/school")
const Class = require('../../models/class')
const mail = require("../../lib/mail")

module.exports = {
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
  }
  
}