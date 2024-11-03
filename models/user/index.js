const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");

const mailer = require("../../lib/mail");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  firstName: String,

  lastName: String,

  fullName: String,
  address: {
    locality: { type: String },
    city: { type: String },
    state: { type: String },
    pin: { type: String },
    country: { type: String },
  },
  profileImage: String,
  email: {
    type: String,
    lowercase: true,
    unique: true,
  },

  accountType: {
    type: String,
    enum: ["google", "email", "fb"],
    default: "email",
  },

  socialId: String,

  phone: {
    type: String,
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },

  forgotpassword: {
    requestedAt: { type: Date, default: null },
    token: { type: String, default: null },
    expiresAt: { type: Date, default: null },
  },

  admissionYear: {
    type: String,
  },

  dob: {
    type: String,
  },

  loginType: {
    type: String,
    enum: ["student", "admin", "teacher"],
  },

  rollNo: {
    type: String,
  },

  _addedBy: {
    type: mongoose.Schema.Types.ObjectId, // admin will add student and
    ref: "User",
  },

  _class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },

  guardian: {
    fathersName: { type: String },
    fathersOccupation: { type: String },
    mothersName: { type: String },
    mothersOccupation: { type: String },
  },

  isActive: { type: Boolean, default: true },

  isAdmin: { type: Boolean, defaul: false },

  isSuperAdmin: { type: Boolean, default: false },

  joinDate: { type: String },

  leaveDate: { type: String },

  bankAdded: {
    type: Boolean,
    default: false,
  },

  bankDetails: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
  },

  _school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },

  customerStripeId: {
    type: String,
  },

  signature: {
    type: String,
  },

  isPaid: {
    type: Boolean,
    default: false,
  },
  messagingEnabled: {
    type: Boolean,
    default: false,
  },
  address: {
    locality: { type: String },
    city: { type: String },
    state: { type: String },
    pin: { type: String },
    country: { type: String },
  },
  currentAcademicYear: {
    type: String,
  },
});

// UserSchema.pre("validate", function (next) {
//   if (this.isNew) {
//     if (this.password === undefined || this.password === null) {
//       this.generatedPassword = randomstring.generate(8); // for usage in post save hook to send welcome email
//       this.password = this.generatedPassword;
//     }
//   }
//   return next();
// });

// Hash & save user's password:
UserSchema.pre("save", async function (next) {
  const user = this;
  if (this.isModified("password") || this.isNew) {
    try {
      user.password = await bcrypt.hash(
        user.password,
        +process.env.SALT_ROUNDS || 10
      );
    } catch (error) {
      return next(error);
    }
  }

  if (
    this.isNew ||
    this.isModified("firstName") ||
    this.isModified("lastName")
  ) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  return next();
});

// compare two passwords:
UserSchema.methods.comparePassword = async function (pw) {
  try {
    const isMatch = await bcrypt.compare(pw, this.password);
    if (isMatch === false)
      throw new Error("Please check your credentials and try again");
  } catch (error) {
    throw error; // rethrow
  }
};
// eslint-disable-next-line prefer-arrow-callback
UserSchema.post("save", function (doc) {
  if (doc.generatedPassword !== undefined) {
    // Send welcome email, but NO WAITING!
    mailer("welcome", {
      to: doc.email,
      subject: "Welcome!!!",
      locals: {
        email: doc.email,
        password: doc.generatedPassword,
        name: doc.name,
      },
    });
  }
});

// UserSchema.virtual("fullname").get(function () {
//   return `${this.firstName} ${this.lastName}`
// })

// UserSchema.virtual("name.full").set(function (v) {
//   this.name.first = v.substr(0, v.indexOf(" "));
//   this.name.last = v.substr(v.indexOf(" ") + 1);
// });

UserSchema.set("timestamps", true);
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

// UserSchema.set("discriminatorKey", "userType")

module.exports = mongoose.model("User", UserSchema);
