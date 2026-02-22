const CATALOG_DATA = {
  siteName: "Sale91",
  baseUrl: "https://sale91.com/catalog",
  currency: "₹",
  categories: [
    {
      id: "mens-wear",
      name: "Men's Wear",
      description: "Shirts, trousers, jackets & kurtas",
      icon: "👔",
      color: "#2563eb",
      products: [
        {
          name: "Classic Cotton Shirt",
          rate: 599,
          colors: ["White", "Sky Blue", "Black"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          colorCodes: ["#ffffff", "#87ceeb", "#222222"]
        },
        {
          name: "Slim Fit Trousers",
          rate: 899,
          colors: ["Navy", "Beige", "Grey"],
          sizes: ["30", "32", "34", "36", "38"],
          colorCodes: ["#1e3a5f", "#d4c5a9", "#808080"]
        },
        {
          name: "Nehru Jacket",
          rate: 2499,
          colors: ["Black", "Maroon", "Navy"],
          sizes: ["M", "L", "XL", "XXL"],
          colorCodes: ["#222222", "#800020", "#1e3a5f"]
        },
        {
          name: "Cotton Kurta",
          rate: 749,
          colors: ["White", "Light Pink", "Mint Green"],
          sizes: ["S", "M", "L", "XL"],
          colorCodes: ["#ffffff", "#ffb6c1", "#98fb98"]
        }
      ]
    },
    {
      id: "womens-wear",
      name: "Women's Wear",
      description: "Kurtas, dresses, tops & sarees",
      icon: "👗",
      color: "#db2777",
      products: [
        {
          name: "Anarkali Kurta Set",
          rate: 1299,
          colors: ["Teal", "Maroon", "Mustard"],
          sizes: ["S", "M", "L", "XL"],
          colorCodes: ["#008080", "#800020", "#e6a817"]
        },
        {
          name: "Floral Maxi Dress",
          rate: 999,
          colors: ["Blue Floral", "Pink Floral", "Yellow Floral"],
          sizes: ["XS", "S", "M", "L", "XL"],
          colorCodes: ["#4169e1", "#ff69b4", "#ffd700"]
        },
        {
          name: "Banarasi Silk Saree",
          rate: 3499,
          colors: ["Red", "Green", "Purple"],
          sizes: ["Free Size"],
          colorCodes: ["#dc143c", "#228b22", "#800080"]
        },
        {
          name: "Casual Crop Top",
          rate: 599,
          colors: ["White", "Black", "Coral"],
          sizes: ["XS", "S", "M", "L"],
          colorCodes: ["#ffffff", "#222222", "#ff7f50"]
        }
      ]
    },
    {
      id: "kids-wear",
      name: "Kids' Wear",
      description: "T-shirts, frocks, shorts & sets",
      icon: "🧒",
      color: "#f59e0b",
      products: [
        {
          name: "Cartoon Print T-Shirt",
          rate: 349,
          colors: ["Red", "Blue", "Yellow"],
          sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
          colorCodes: ["#ef4444", "#3b82f6", "#eab308"]
        },
        {
          name: "Denim Shorts",
          rate: 499,
          colors: ["Light Blue", "Dark Blue"],
          sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
          colorCodes: ["#87ceeb", "#1e3a5f"]
        },
        {
          name: "Party Frock",
          rate: 899,
          colors: ["Pink", "Lavender", "Peach"],
          sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
          colorCodes: ["#ff69b4", "#e6e6fa", "#ffdab9"]
        },
        {
          name: "Kurta Pyjama Set",
          rate: 699,
          colors: ["White & Gold", "Blue & Silver", "Green & Gold"],
          sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
          colorCodes: ["#ffd700", "#c0c0c0", "#228b22"]
        }
      ]
    },
    {
      id: "footwear",
      name: "Footwear",
      description: "Sneakers, sandals, heels & juttis",
      icon: "👟",
      color: "#8b5cf6",
      products: [
        {
          name: "Canvas Sneakers",
          rate: 1299,
          colors: ["White", "Black", "Navy"],
          sizes: ["6", "7", "8", "9", "10"],
          colorCodes: ["#ffffff", "#222222", "#1e3a5f"]
        },
        {
          name: "Leather Sandals",
          rate: 799,
          colors: ["Tan", "Black", "Brown"],
          sizes: ["6", "7", "8", "9", "10"],
          colorCodes: ["#d2b48c", "#222222", "#8b4513"]
        },
        {
          name: "Block Heels",
          rate: 1499,
          colors: ["Black", "Nude", "Red"],
          sizes: ["5", "6", "7", "8"],
          colorCodes: ["#222222", "#e8cebf", "#dc143c"]
        },
        {
          name: "Embroidered Juttis",
          rate: 599,
          colors: ["Golden", "Multi-color", "Red"],
          sizes: ["5", "6", "7", "8", "9"],
          colorCodes: ["#daa520", "#ff6347", "#dc143c"]
        }
      ]
    },
    {
      id: "accessories",
      name: "Accessories",
      description: "Watches, bags, sunglasses & jewellery",
      icon: "⌚",
      color: "#059669",
      products: [
        {
          name: "Analog Wrist Watch",
          rate: 1499,
          colors: ["Silver", "Gold", "Rose Gold"],
          sizes: ["Free Size"],
          colorCodes: ["#c0c0c0", "#ffd700", "#b76e79"]
        },
        {
          name: "Leather Tote Bag",
          rate: 1299,
          colors: ["Black", "Tan", "Burgundy"],
          sizes: ["Free Size"],
          colorCodes: ["#222222", "#d2b48c", "#800020"]
        },
        {
          name: "Aviator Sunglasses",
          rate: 499,
          colors: ["Black", "Gold Frame", "Silver Frame"],
          sizes: ["Free Size"],
          colorCodes: ["#222222", "#daa520", "#c0c0c0"]
        },
        {
          name: "Pearl Necklace Set",
          rate: 399,
          colors: ["White Pearl", "Golden", "Rose"],
          sizes: ["Free Size"],
          colorCodes: ["#faf0e6", "#daa520", "#b76e79"]
        }
      ]
    }
  ]
};
