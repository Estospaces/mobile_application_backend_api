// services/userService.js
const supabase = require("../config/supabaseClient");

async function checkUserByEmail(email, attributes) {
  const select = attributes ? attributes : "_id, email, email_verified";

  try {
    const { data, error } = await supabase
      .from("users")
      .select(select)
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error checking user by email:", error.message);
      return null;
    }

    if (!data) {
      console.error("No user found for email:", email);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during checkUserByEmail:", err.message);
    return null;
  }
}

async function checkUserByPhone(phone_no) {
  try {
    const { data } = await supabase
      .from("users")
      .select("_id")
      .eq("phone_no", phone_no)
      .single();
    return !!data;
  } catch {
    return false;
  }
}

async function createUser(userData) {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    throw error;
  }
}

async function activateUserById(userId) {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        active_user: true,
        email_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq("_id", userId);

    if (error) throw new Error(error.message);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  checkUserByEmail,
  checkUserByPhone,
  createUser,
  activateUserById,
};
