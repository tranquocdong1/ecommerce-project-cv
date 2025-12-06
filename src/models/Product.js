import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true
    },

    description: {
      type: String,
      default: ""
    },

    price: {
      type: Number,
      required: true
    },

    discountPercent: {
      type: Number,
      default: 0
    },

    finalPrice: {
      type: Number,
      default: 0
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    images: [
      {
        url: String,
        publicId: String
      }
    ],

    stock: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Auto calculate final price before save
ProductSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * this.discountPercent) / 100;
  next();
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
