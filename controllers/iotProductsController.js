const { IotProduct } = require("../Modals/iotProducts.Model");


// Create a new IoT product 
exports.createIotProduct = async (req, res) => {
  try {
    let { productName, specification, brandName, category, subcategory, description } = req.body;

    // Log uploaded file and body for debugging
    console.log("Body:", req.body);

    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required!" });
    }

    // Set image URL path
    const avatarUrl = `${process.env.IMG_BASE_URL}/images/${req.file.filename}`;

    // Check for required fields in the body
    if (!productName || !specification || !brandName || !category || !subcategory || !description) {
      return res.status(400).json({ message: "All fields except image are required" });
    }

    // Convert specification to array if it's a string
    if (!Array.isArray(specification)) {
      specification = specification.split("\n").map((spec) => spec.trim()); // Convert to array if it's a string
    }

    // Create new product
    const newProduct = new IotProduct({
      productName,
      specification,
      brandName,
      category,
      subcategory,
      description,
      image: avatarUrl, // Store the image URL in the database
    });
  console.log(newProduct)
    // Save the product
    await newProduct.save();

    // Send success response
    res.status(201).json({
      message: "IoT Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    // Handle errors and send the response
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

// Get all IoT products
exports.getAllIotProducts = async (req, res) => {
  try {
    const products = await IotProduct.find(); // Fetch all products
    res.status(200).json(products); // Send response
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get a single IoT product by ID
exports.getIotProductById = async (req, res) => {
  try {
    const product = await IotProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// Update an IoT product by ID
exports.updateIotProduct = async (req, res) => {
  try {
    const  IotProductId   = req.params.IotProductId;
    
    const updatedIotProduct = req.body;

// Create a new IoT product 
exports.createIotProduct = async (req, res) => {
  try {
    const { productName, specification, brandName, category, subcategory, description } = req.body;

    // Log uploaded file and body for debugging
    console.log("File Uploaded:", req.file);
    console.log("Body:", req.body);

    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required!" });
    }

    // Set image URL path
    const avatarUrl = `${process.env.IMG_BASE_URL}/images/${req.file.filename}`;

    // Check for required fields in the body
    if (!productName || !specification || !brandName || !category || !subcategory || !description) {
      return res.status(400).json({ message: "All fields except image are required" });
    }

    // Convert specification to array if it's a string
    if (!Array.isArray(specification)) {
      specification = specification.split("\n").map((spec) => spec.trim()); // Convert to array if it's a string
    }

    // Create new product
    const newProduct = new IotProduct({
      productName,
      specification,
      brandName,
      category,
      subcategory,
      description,
      image: avatarUrl, // Store the image URL in the database
    });

    // Save the product
    await newProduct.save();

    // Send success response
    res.status(201).json({
      message: "IoT Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    // Handle errors and send the response
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

// Get all IoT products
exports.getAllIotProducts = async (req, res) => {
  try {
    const products = await IotProduct.find().select("-__v"); // Fetch all products and exclude __v field
    res.status(200).json(products); // Send response
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get a single IoT product by ID
exports.getIotProductById = async (req, res) => {
  try {
    const product = await IotProduct.findById(req.params.id).select("-__v");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// Update an IoT product by ID
exports.updateIotProduct = async (req, res) => {
  try {
    const IotProductId = req.params.IotProductId;
    const updatedIotProduct = req.body;
    const updatedIot = await IotProduct.findOneAndUpdate(
      { _id: IotProductId },
      updatedIotProduct,
      { new: true }
    );
    if (!updatedIot) {
      return res.status(404).json({ error: "IoT product not found" });
    }
    res
      .status(200)
      .send({ message: "IoT product is Updated Successfully", updatedIot });
  } catch (error) {
    console.error("Error updating IoT product:", error);
    res.status(500).json({ error: "Failed to update IoT product" });
  }
};

// Delete an IoT product by ID
exports.deleteIotProduct = async (req, res) => {
  try {
    const IotProductId = req.params.id;
    const deletedProduct = await IotProduct.findByIdAndRemove(IotProductId);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "IoT product not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "IoT product deleted successfully" });
  } catch (error) {
    console.error("Error deleting IoT product:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete IoT product" });
  }
};const { IotProduct } = require("../Modals/iotProducts.Model");

// Create a new IoT product 
exports.createIotProduct = async (req, res) => {
  try {
    const { productName, specification, brandName, category, subcategory, description } = req.body;

    // Log uploaded file and body for debugging
    console.log("File Uploaded:", req.file);
    console.log("Body:", req.body);

    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required!" });
    }

    // Set image URL path
    const avatarUrl = `${process.env.IMG_BASE_URL}/images/${req.file.filename}`;

    // Check for required fields in the body
    if (!productName || !specification || !brandName || !category || !subcategory || !description) {
      return res.status(400).json({ message: "All fields except image are required" });
    }

    // Convert specification to array if it's a string
    if (!Array.isArray(specification)) {
      specification = specification.split("\n").map((spec) => spec.trim()); // Convert to array if it's a string
    }

    // Create new product
    const newProduct = new IotProduct({
      productName,
      specification,
      brandName,
      category,
      subcategory,
      description,
      image: avatarUrl, // Store the image URL in the database
    });

    // Save the product
    await newProduct.save();

    // Send success response
    res.status(201).json({
      message: "IoT Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    // Handle errors and send the response
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

// Get all IoT products
exports.getAllIotProducts = async (req, res) => {
  try {
    const products = await IotProduct.find().select("-__v"); // Fetch all products and exclude __v field
    res.status(200).json(products); // Send response
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get a single IoT product by ID
exports.getIotProductById = async (req, res) => {
  try {
    const product = await IotProduct.findById(req.params.id).select("-__v");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// Update an IoT product by ID
exports.updateIotProduct = async (req, res) => {
  try {
    const IotProductId = req.params.IotProductId;
    const updatedIotProduct = req.body;
    const updatedIot = await IotProduct.findOneAndUpdate(
      { _id: IotProductId },
      updatedIotProduct,
      { new: true }
    );
    if (!updatedIot) {
      return res.status(404).json({ error: "IoT product not found" });
    }
    res
      .status(200)
      .send({ message: "IoT product is Updated Successfully", updatedIot });
  } catch (error) {
    console.error("Error updating IoT product:", error);
    res.status(500).json({ error: "Failed to update IoT product" });
  }
};

// Delete an IoT product by ID
exports.deleteIotProduct = async (req, res) => {
  try {
    const IotProductId = req.params.id;
    const deletedProduct = await IotProduct.findByIdAndRemove(IotProductId);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "IoT product not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "IoT product deleted successfully" });
  } catch (error) {
    console.error("Error deleting IoT product:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete IoT product" });
  }
};
    const updatedIot = await IotProduct.findOneAndUpdate(
      {_id: IotProductId },
      updatedIotProduct,
      { new: true }
    );
    if (!updatedIot) {
      return res.status(404).json({ error: "iot products not found" });
    }
    res
      .status(200)
      .send({ message: "iot products is Updated Sucessfull", updatedIot});
  } catch (error) {
    console.error("Error updating iot products:", error);
    res.status(500).json({ error: "Failed to update iot products" });
  }
};

// Delete an IoT product by ID
exports.deleteIotProduct = async (req, res) => {
  try {
    const IotProductId = req.params.id;
    const deletedEmployee = await IotProduct.findByIdAndRemove(IotProductId);
    if (!deletedEmployee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete employee" });
  }
};
