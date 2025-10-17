// services/authService.js
const utils = require("../utils/commonUtils");
const supabase = require("../config/supabaseClient");

async function handleForgotPassword(email) {
  const otp = {
    code: utils.generateOtp(),
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes expiry
  };

  const { error } = await supabase
    .from("users")
    .update({ otp })
    .eq("email", email);

  if (error) throw new Error("Failed to store OTP. Please try again.");

  // Return what's needed for email sending
  return {
    message: "OTP sent to your email.",
    email,
    otp,
  };
}

async function verifyOtp(email, otp) {
  if (!email || !otp) throw new Error("Email and OTP are required.");

  const { data, error } = await supabase
    .from("users")
    .select("otp")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    console.error("Supabase error:", error);
    throw new Error("Invalid request or user not found.");
  }

  if (!data?.otp.code || !data?.otp.expires_at) {
    throw new Error("OTP data is missing or malformed.");
  }

  // Check if the OTP matches
  if (data?.otp.code !== String(otp)) {
    throw new Error("Incorrect OTP.");
  }

  // Check expiration
  const now = new Date();
  const expiryTime = new Date(data?.otp.expires_at);

  if (expiryTime < now) {
    throw new Error("OTP has expired. Please request a new one.");
  }

  // Optional: Clear OTP after successful verification
  await supabase
    .from("users")
    .update({ otp: null, expires_at: null })
    .eq("email", email);

  return "OTP verified successfully.";
}

async function resetPassword(email, password, confirmPassword, id) {
  if (!email || !password || !confirmPassword) {
    throw new Error("All fields are required.");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  const hashed = await utils.hashPassword(password);

  const { error } = await supabase
    .from("users")
    .update({ password: hashed, updated_at: new Date().toISOString() })
    .eq("_id", id);

  if (error) throw new Error("Failed to update password.");

  return "Password reset successful.";
}

module.exports = {
  handleForgotPassword,
  verifyOtp,
  resetPassword,
};
