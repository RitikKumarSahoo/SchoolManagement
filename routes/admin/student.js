const users = require("../../models/user")
const School = require("../../models/school")
const Class = require('../../models/class')
const mail = require("../../lib/mail")

module.exports = {
  async createStudent(req,res){
    
    try {
      const { firstName, lastName, email, gender, guardian, phone, admissionYear, _schoolId, dob, rollNo, _classId, _adminId, joinDate, signature  } = req.body;

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
        password
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
  }
}