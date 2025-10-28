const asyncHandler = require("express-async-handler");
const { generateToken, generateRefreshToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { sendEmail } = require("./emailCtrl");
const User = require("../Modals/userModal");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { mongooseError } = require("../middlewares/errorHandler");

const checkSignup = async (req, res) => {
  const { name, email, mobile } = req.body;
  const isNameValid = /^[a-zA-Z\s]+$/.test(name);
  const isMobileValid = /^[6-9]\d{9}$/.test(mobile);

  if (!isNameValid) {
    res.status(401).json({ message: `${name} is not a vailid name.` });
  } else if (!isMobileValid) {
    res
      .status(401)
      .json({ message: `${mobile} is not a vailid mobile number.` });
  } else {
    const findByEmail = await User.findOne({ email });
    const findByMobile = await User.findOne({ mobile });

    if (findByEmail) {
      res.status(401).json({ message: "This email is already in use!" });
    } else if (findByMobile) {
      res
        .status(401)
        .json({ message: "This mobile number is already in use!" });
    } else {
      res.json(req.body);
    }
  }
};

const verifyUser = asyncHandler(async (req, res) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        res.json(user);
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Not Authorized token expired, Please Login again" });
    }
  } else {
    res.status(500).json({ message: "There is no token attached to header" });
  }
});

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    try {
      const newUser = await User.create(req.body);
      const refreshToken = generateRefreshToken(newUser?._id);
      res.json({ ...newUser._doc, ...{ token: refreshToken } });
    } catch (error) {
      mongooseError(error, res);
    }
  } else {
    res.status(400).json("You are already registered with us !");
  }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  const user = await User.findOne({ email });
  if (user == null) {
    return res.status(404).send({
      error: "User Not Found",
      message: "Look's Like you are not Registered with us",
    });
  }
  if (!(await user.isPasswordMatched(password))) {
    return res.status(401).send({
      error: "Invalid Credentials",
      message: "Incorrect Password ! Please check your password",
    });
  }
  const refreshToken = generateRefreshToken(user?._id);
  const updateuser = await User.findByIdAndUpdate(
    user._id,
    {
      refreshToken: refreshToken,
    },
    { new: true }
  );
  res.json({ ...updateuser._doc, ...{ token: refreshToken } });
});

const forgetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    res.status(404).json({ message: "Email is not Registered with us !" });
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const sendData = `<h1 style=\"color: #333; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; margin-bottom: 16px;\">Password Reset<\/h1>\r\n<p style=\"color: #666; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; margin-bottom: 8px;\">Hi there,<\/p>\r\n<p style=\"color: #666; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; margin-bottom: 16px;\">We received a request to reset your password. Please click the link below to reset your password:<\/p>\r\n<p style=\"margin-bottom: 16px;\"><a href='http://localhost:5173/reset-password/${token}' style=\"background-color: #007bff; border-radius: 4px; color: #fff; display: inline-block; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; padding: 10px 16px; text-decoration: none;\">Reset Password<\/a><\/p>\r\n<p style=\"color: #666; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; margin-bottom: 16px;\">If you did not request a password reset, you can ignore this email and your password will not be changed.<\/p>\r\n<p style=\"color: #666; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;\">Thank you,<\/p>\r\n<p style=\"color: #666; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; margin-bottom: 0;\">The Deepnap Softech Team<\/p>\r\n`;
    const data = {
      to: email,
      subject: "Password Reset Link from Deepnap Softech",
      html: sendData,
    };
    sendEmail(data);
    res.json(token);
  } catch (err) {}
});

const checkresetPasswordUser = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpire: {
      $gt: Date.now(),
    },
  });

  if (user == null)
    return res.status(500).json({ message: "Token  Expired Please Try again" });
  res.json(user.email);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const token = req.params.token;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) res.json({ error: "Token  Expired Please Try again" });
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();
  res.json("Password was changed Sucessfully");
});

const isAdminuser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("You are not an admin");
  } else {
    res.json({ admin: true });
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
      super: findAdmin,
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// logout functionality

const logout = asyncHandler(async (req, res) => {
  if (!req.cookies?.refreshToken)
    throw new Error("No Refresh Token in Cookies");
  const refreshToken = req.cookies.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(200); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(200); // forbidden
});

// Update a user

const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});
const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  validateMongoDbId(id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        role: role,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// save user Address

// Get all users
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user

const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockusr);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User UnBlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

//Reset The Password

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndRemove(id);
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});
// getAllOrders()

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgetPasswordToken,
  resetPassword,
  loginAdmin,
  updateRole,
  isAdminuser,
  checkSignup,
  checkresetPasswordUser,
  verifyUser,
  deleteUser,
};
