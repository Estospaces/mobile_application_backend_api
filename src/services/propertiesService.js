const supabase = require('../config/supabaseClient');

// Service function to create a property
async function createProperty(propertyData, country) {
  const { title, description, property_type, price, manager_id, area_numeric, area_unit = 'sqft' } = propertyData;

  const { data, error } = await supabase
    .from('properties')
    .insert([
      {
        title,
        description,
        property_type,
        price,
        manager_id,
        area_numeric,
        area_unit,
        status: 'active',  // default status
        country: country  // manager's country scope
      }
    ])
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Service function to get a property by ID
async function getProperty(id, country) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('country', country)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Service function to update a property
async function updateProperty(id, propertyData) {
  const { data, error } = await supabase
    .from('properties')
    .update(propertyData)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Service function to soft delete (archive) a property
async function deleteProperty(id) {
  const { data, error } = await supabase
    .from('properties')
    .update({ status: 'archived' })
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Service function to publish a property
async function publishProperty(id) {
  const { data, error } = await supabase
    .from('properties')
    .update({ is_published: true, published_at: new Date() })
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Service function to unpublish a property
async function unpublishProperty(id) {
  const { data, error } = await supabase
    .from('properties')
    .update({ is_published: false, published_at: null })
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Service function to update property status (e.g., sold, rented)
async function updateStatus(id, status, note) {
  const { data, error } = await supabase
    .from('properties')
    .update({ status, note })
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Export all service functions at the end
module.exports = {
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
  publishProperty,
  unpublishProperty,
  updateStatus
};
