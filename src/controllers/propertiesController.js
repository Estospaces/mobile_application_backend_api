const propertiesService = require('../services/propertiesService');

// Controller function to create a property
async function createProperty(req, res) {
  try {
    const { title, description, property_type, price, manager_id, country } = req.body;
    if (!title || !description || !property_type || !price || !manager_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const property = await propertiesService.createProperty(req.body, country);
    res.status(201).json({ message: 'Property created successfully', property });
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({ error: err.message });
  }
}

// Controller function to get a property by ID
async function getProperty(req, res) {
  try {
    const property = await propertiesService.getProperty(req.params.id, req.user.country);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (err) {
    console.error('Error fetching property:', err);
    res.status(500).json({ error: err.message });
  }
}

// Controller function to update a property
async function updateProperty(req, res) {
  try {
    const property = await propertiesService.updateProperty(req.params.id, req.body);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.status(200).json({ message: 'Property updated successfully', property });
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(500).json({ error: err.message });
  }
}

// Controller function to soft delete (archive) a property
async function deleteProperty(req, res) {
  try {
    const property = await propertiesService.deleteProperty(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.status(200).json({ message: 'Property archived successfully', property });
  } catch (err) {
    console.error('Error archiving property:', err);
    res.status(500).json({ error: err.message });
  }
}

// Controller function to publish a property
async function publishProperty(req, res) {
  try {
    const property = await propertiesService.publishProperty(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.status(200).json({ message: 'Property published successfully', property });
  } catch (err) {
    console.error('Error publishing property:', err);
    res.status(500).json({ error: err.message });
  }
}

// Controller function to unpublish a property
async function unpublishProperty(req, res) {
  try {
    const property = await propertiesService.unpublishProperty(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.status(200).json({ message: 'Property unpublished successfully', property });
  } catch (err) {
    console.error('Error unpublishing property:', err);
    res.status(500).json({ error: err.message });
  }
}

// Controller function to update property status (e.g., sold, rented)
async function updateStatus(req, res) {
  try {
    const { status, note } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Missing status field' });
    }

    const property = await propertiesService.updateStatus(req.params.id, status, note);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json({ message: 'Property status updated successfully', property });
  } catch (err) {
    console.error('Error updating property status:', err);
    res.status(500).json({ error: err.message });
  }
}

// Export all controller functions at the end
module.exports = {
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
  publishProperty,
  unpublishProperty,
  updateStatus
};
