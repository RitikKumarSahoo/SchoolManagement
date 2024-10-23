
const School = require("..\..\models\school.js")

module.exports = {

  /**
   * Fetch all the Schools
   * @api {get} /schools 1.0 Fetch all the Schools
   * @apiName fetchSchools
   * @apiGroup School
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     schools: [{}]
   * }
   */
  async find(req, res) {
    try {
      const schools = await School.find({}).exec()
      return res.json({ error: false, schools })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Find a School by _id
   * @api {get} /school/:id 2.0 Find a School by _id
   * @apiName getSchool
   * @apiGroup School
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the School to find
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     school: {}
   * }
   */
  async get(req, res) {
    try {
      const school = await School.findOne({ _id: req.params.id }).exec()
      return res.json({ error: false, school })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Create a new School
   * @api {post} /school 3.0 Create a new School
   * @apiName createSchool
   * @apiGroup School
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} [name] School name
   * @apiParam  {String} [registrationNumber] School registrationNumber
   * @apiParam  {Object} [address] School address
   * @apiParam  {String} [address.city] School address.city
   * @apiParam  {String} [address.state] School address.state
   * @apiParam  {String} [address.country] School address.country
   * @apiParam  {String} [address.pinCode] School address.pinCode
   * @apiParam  {Object} [contact] School contact
   * @apiParam  {String} [contact.phoneNo] School contact.phoneNo
   * @apiParam  {String} [contact.email] School contact.email
   * @apiParam  {String} [contact.website] School contact.website
   * @apiParam  {Object} [location=Point] School location `enum=["Point"]`
   * @apiParam  {String} [location.type=Point] School location.type `enum=["Point"]`
   * @apiParam  {Number[]} [location.coordinates] School location.coordinates
   * @apiParam  {String} [principalName] School principalName
   * @apiParam  {Number} [establishYear] School establishYear
   * @apiParam  {String} [schoolType] School schoolType `enum=["primary", "secondary", "highSchool"]`
   * @apiParam  {Number} [totalStudents] School totalStudents
   * @apiParam  {Number} [totalClasses] School totalClasses
   * @apiParam  {Boolean} [isActive=true] School isActive
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     school: {}
   * }
   */
  async post(req, res) {
    try {
      const {
        name, registrationNumber, address, contact, location, principalName, establishYear, schoolType, totalStudents, totalClasses, isActive
      } = req.body
      const school = await School.create({
        name, registrationNumber, address, contact, location, principalName, establishYear, schoolType, totalStudents, totalClasses, isActive
      })
      return res.json({ error: false, school })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Edit a School by _id
   * @api {put} /school/:id 4.0 Edit a School by _id
   * @apiName editSchool
   * @apiGroup School
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the School to edit

   * @apiParam  {String} [name] School name
   * @apiParam  {String} [registrationNumber] School registrationNumber
   * @apiParam  {Object} [address] School address
   * @apiParam  {String} [address.city] School address.city
   * @apiParam  {String} [address.state] School address.state
   * @apiParam  {String} [address.country] School address.country
   * @apiParam  {String} [address.pinCode] School address.pinCode
   * @apiParam  {Object} [contact] School contact
   * @apiParam  {String} [contact.phoneNo] School contact.phoneNo
   * @apiParam  {String} [contact.email] School contact.email
   * @apiParam  {String} [contact.website] School contact.website
   * @apiParam  {Object} [location=Point] School location `enum=["Point"]`
   * @apiParam  {String} [location.type=Point] School location.type `enum=["Point"]`
   * @apiParam  {Number[]} [location.coordinates] School location.coordinates
   * @apiParam  {String} [principalName] School principalName
   * @apiParam  {Number} [establishYear] School establishYear
   * @apiParam  {String} [schoolType] School schoolType `enum=["primary", "secondary", "highSchool"]`
   * @apiParam  {Number} [totalStudents] School totalStudents
   * @apiParam  {Number} [totalClasses] School totalClasses
   * @apiParam  {Boolean} [isActive=true] School isActive
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     school: {}
   * }
   */
  async put(req, res) {
    try {
      const {
        name, registrationNumber, address, contact, location, principalName, establishYear, schoolType, totalStudents, totalClasses, isActive
      } = req.body
      const school = await School.findOne({ _id: req.params.id }).exec()
      if (school === null) return res.status(400).json({ error: true, reason: "No such School!" })

      if (name !== undefined) school.name = name
      if (registrationNumber !== undefined) school.registrationNumber = registrationNumber
      if (address !== undefined && address.city !== undefined) school.address.city = address.city
      if (address !== undefined && address.state !== undefined) school.address.state = address.state
      if (address !== undefined && address.country !== undefined) school.address.country = address.country
      if (address !== undefined && address.pinCode !== undefined) school.address.pinCode = address.pinCode
      if (contact !== undefined && contact.phoneNo !== undefined) school.contact.phoneNo = contact.phoneNo
      if (contact !== undefined && contact.email !== undefined) school.contact.email = contact.email
      if (contact !== undefined && contact.website !== undefined) school.contact.website = contact.website
      if (location !== undefined && location.type !== undefined) school.location.type = location.type
      if (location !== undefined && location.coordinates !== undefined) school.location.coordinates = location.coordinates
      if (principalName !== undefined) school.principalName = principalName
      if (establishYear !== undefined) school.establishYear = establishYear
      if (schoolType !== undefined) school.schoolType = schoolType
      if (totalStudents !== undefined) school.totalStudents = totalStudents
      if (totalClasses !== undefined) school.totalClasses = totalClasses
      if (isActive !== undefined) school.isActive = isActive

      await school.save()
      return res.json({ error: false, school })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Delete a School by _id
   * @api {delete} /school/:id 4.0 Delete a School by _id
   * @apiName deleteSchool
   * @apiGroup School
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the School to delete
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
   */
  async delete(req, res) {
    try {
      await School.deleteOne({ _id: req.params.id })
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
