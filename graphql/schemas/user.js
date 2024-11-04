const { gql } = require("graphql-tag");

module.exports = gql`
  type User {
    id: ID!
    username: String
    password: String
    firstName: String
    lastName: String
    fullName: String
    profileImage: String
    email: String!
    accountType: String
    socialId: String
    phone: String
    gender: String
    forgotPassword: ForgotPassword
    admissionYear: String
    dob: String
    loginType: String
    rollNo: String
    _addedBy: String
    _class: String
    guardian: Guardian
    isActive: Boolean
    isAdmin: Boolean
    isSuperAdmin: Boolean
    joinDate: String
    leaveDate: String
    bankAdded: Boolean
    bankDetails: BankDetails
    _school: String
    customerStripeId: String
    signature: String
    isPaid: Boolean
    messagingEnabled: Boolean
    address: Address
    currentAcademicYear: String
    createdAt: String
    updatedAt: String
  }

  type ForgotPassword {
    requestedAt: String
    token: String
    expiresAt: String
  }

  type Guardian {
    fathersName: String
    mothersName: String
  }

  type BankDetails {
    bankName: String
    accountNumber: String
    ifscCode: String
  }

  type Address {
    locality: String
    city: String
    state: String
    pin: String
    country: String
  }

  type Query {
    getUser(id: ID): User
    getAllUsers: [User]
  }

  type Mutation {
    createUser(
      username: String!
      password: String!
      firstName: String
      lastName: String
      profileImage: String
      email: String!
      accountType: String
      socialId: String
      phone: String
      gender: String
      admissionYear: String
      dob: String
      loginType: String
      rollNo: String
      guardian: GuardianInput
      joinDate: String
      leaveDate: String
      bankDetails: BankDetailsInput
      _school: ID
      customerStripeId: String
      signature: String
      address: AddressInput
      currentAcademicYear: String
    ): User

    updateUser(
      id: ID!
      username: String
      firstName: String
      lastName: String
      profileImage: String
      email: String
      accountType: String
      socialId: String
      phone: String
      gender: String
      admissionYear: String
      dob: String
      loginType: String
      rollNo: String
      guardian: GuardianInput
      joinDate: String
      leaveDate: String
      bankDetails: BankDetailsInput
      _school: ID
      customerStripeId: String
      signature: String
      isActive: Boolean
      isAdmin: Boolean
      isSuperAdmin: Boolean
      isPaid: Boolean
      messagingEnabled: Boolean
      address: AddressInput
      currentAcademicYear: String
    ): User

    deleteUser(id: ID!): User
  }

  input GuardianInput {
    fathersName: String
    mothersName: String
  }

  input BankDetailsInput {
    bankName: String
    accountNumber: String
    ifscCode: String
  }

  input AddressInput {
    locality: String
    city: String
    state: String
    pin: String
    country: String
  }
`;
