const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z\s]+$/.test(value);
        },
        message: (props) => `${props.value} is not a valid name.`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
        },
        message: (props) => `${props.value} is not a valid email address.`,
      },
    },
    mobile: {
      type: String,
      required: true,
      validate: {
        validator: function(value) {
          return /^[0-9]{10}$/.test(value);
        },
        message: props => `${props.value} is not a valid mobile number.`
      }
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    super: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    order: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    refreshToken: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Single user restriction - check if any user already exists before saving
userSchema.pre("save", async function (next) {
  // Only check for existing users if this is a new document
  if (this.isNew) {
    const userCount = await this.constructor.countDocuments();
    if (userCount > 0) {
      const error = new Error("Only one user is allowed in the system");
      error.code = "SINGLE_USER_LIMIT";
      return next(error);
    }
  }
  next();
});

//bcript password
userSchema.pre("save", async function (next) {
  //bcript the password if it modified
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
//comapare password
userSchema.methods.isPasswordMatched = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password);
};

//JWT TOKEN
userSchema.methods.getJwtToken = function () {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  const expiresIn = process.env.JWT_EXPIRE || "7d";
  
  return jwt.sign({ id: this._id }, secret, {
    expiresIn: expiresIn,
  });
};
//Reset Password Token
userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpire = Date.now() + 30 * 60 * 1000; //10 minute expire
  return resettoken;
};

module.exports = mongoose.model("User", userSchema);
