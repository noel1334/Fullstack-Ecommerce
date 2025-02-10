import User from "../models/User.js";

export const addCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId, selectedColor, selectedSize, selectedImage, price, quantity } = req.body;

    // Ensure all fields are provided
    if (!productId || !selectedColor || !selectedSize || !selectedImage || !price || !quantity) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the product is already in the cart
    const existingItemIndex = user.cart.findIndex(
      (item) =>
        item._id.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize &&
        item.selectedImage === selectedImage
    );

    if (existingItemIndex !== -1) {
      // If the item exists, update the quantity
      user.cart[existingItemIndex].quantity += quantity;
      await user.save();
      return res
        .status(200)
        .json({ message: "Product quantity updated in cart.", cart: user.cart });
    }

    // If the product doesn't exist, add it to the cart
    user.cart.push({
      _id: productId,
      selectedColor,
      selectedSize,
      selectedImage,
      price,
      quantity,
    });

    await user.save();
    res
      .status(201)
      .json({ message: "Product added to cart successfully.", cart: user.cart });
  } catch (error) {
    console.error("Error in addCart:", error.message);
    res.status(500).json({ message: "Failed to add product to cart.", error: error.message });
  }
};
// Get Cart
export const getCart = async (req, res) => {
  try {
    console.log("Authenticated user ID:", req.user.id);
    const user = await User.findById(req.user.id).select("cart");

    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json({ message: "User not found." });
    }

    console.log("User's cart:", user.cart);
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart.", error: error.message });
  }
};

// Update Cart Quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Authenticated user ID:", userId);
    console.log("Request Body:", req.body); // Log the entire request body

    const { productId, selectedColor, selectedSize, selectedImage, operation } = req.body;
    console.log("Operation received:", operation); // Log operation received

    // Validate the operation value
    if (!["increase", "decrease"].includes(operation)) {
      return res.status(400).json({ message: "Invalid operation specified." });
    }

    const user = await User.findById(userId).select("cart");
    console.log("User's cart:", user.cart); // Log user's cart to ensure we have the data

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const item = user.cart.find(
      (item) =>
        item._id.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize &&
        item.selectedImage === selectedImage
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in the cart." });
    }

    // Handle quantity changes based on the operation
    if (operation === "decrease" && item.quantity <= 1) {
      return res.status(400).json({ message: "Quantity cannot be less than 1." });
    }

    item.quantity += operation === "increase" ? 1 : -1;

    await user.save();
    res.status(200).json({ message: "Cart quantity updated.", cart: user.cart });
  } catch (error) {
    console.error("Error updating cart quantity:", error); // Log any error
    res.status(500).json({ message: "Failed to update cart quantity.", error: error.message });
  }
};




// Remove Item from Cart
export const removeCartItem = async (req, res) => {
  try {
    const { productId, selectedColor, selectedSize, selectedImage } = req.body;

    // Find the user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Filter out the item to be removed based on all specified attributes
    const updatedCart = user.cart.filter(
      (item) =>
        !(
          item._id.toString() === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize &&
          item.selectedImage === selectedImage
        )
    );

    // Update the cart and save the user
    user.cart = updatedCart;
    await user.save();

    res.status(200).json({ message: "Product removed from cart successfully.", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove product from cart.", error: error.message });
  }
};
