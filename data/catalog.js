// Each product can have optional fields:
//   images: ["url1.jpg", "url2.jpg"]  — one per color variant
//   video: "url.mp4"                  — product video shown first in carousel
// If images are not provided, colored placeholders are shown automatically.

const CATALOG_DATA = {
  siteName: "Sale91",
  baseUrl: "https://sale91.com/catalog",
  categories: [
    {
      id: "mens-wear",
      name: "Men's Wear",
      icon: "👔",
      color: "#2563eb",
      products: [
        {
          name: "Classic Cotton Shirt",
          description: "Premium 100% cotton formal shirt. Breathable fabric, perfect for office and casual wear. Regular fit with button-down collar.",
          rate: 599,
          colors: ["White", "Sky Blue", "Black"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          colorCodes: ["#ffffff", "#87ceeb", "#222222"]
        },
        {
          name: "Slim Fit Trousers",
          description: "Stretchable slim fit trousers with wrinkle-free fabric. Comfortable all-day wear with side pockets and belt loops.",
          rate: 899,
          colors: ["Navy", "Beige", "Grey"],
          sizes: ["30", "32", "34", "36", "38"],
          colorCodes: ["#1e3a5f", "#d4c5a9", "#808080"]
        },
        {
          name: "Nehru Jacket",
          description: "Stylish Nehru jacket with mandarin collar. Perfect for festive occasions and ethnic wear pairing. Silk blend fabric.",
          rate: 2499,
          colors: ["Black", "Maroon", "Navy"],
          sizes: ["M", "L", "XL", "XXL"],
          colorCodes: ["#222222", "#800020", "#1e3a5f"]
        },
        {
          name: "Cotton Kurta",
          description: "Lightweight cotton kurta for daily and festive wear. Comfortable straight cut with side slits. Hand-wash recommended.",
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
      icon: "👗",
      color: "#db2777",
      products: [
        {
          name: "Anarkali Kurta Set",
          description: "Beautiful flared Anarkali kurta with matching dupatta and pants. Rayon fabric with embroidery detailing.",
          rate: 1299,
          colors: ["Teal", "Maroon", "Mustard"],
          sizes: ["S", "M", "L", "XL"],
          colorCodes: ["#008080", "#800020", "#e6a817"]
        },
        {
          name: "Floral Maxi Dress",
          description: "Flowy maxi dress with all-over floral print. V-neck with adjustable waist tie. Light georgette fabric.",
          rate: 999,
          colors: ["Blue Floral", "Pink Floral", "Yellow Floral"],
          sizes: ["XS", "S", "M", "L", "XL"],
          colorCodes: ["#4169e1", "#ff69b4", "#ffd700"]
        },
        {
          name: "Banarasi Silk Saree",
          description: "Authentic Banarasi silk saree with golden zari work. Comes with unstitched blouse piece. Grand festive wear.",
          rate: 3499,
          colors: ["Red", "Green", "Purple"],
          sizes: ["Free Size"],
          colorCodes: ["#dc143c", "#228b22", "#800080"]
        },
        {
          name: "Casual Crop Top",
          description: "Trendy crop top with ribbed cotton fabric. Round neck, short sleeves. Great for pairing with jeans or skirts.",
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
      icon: "🧒",
      color: "#f59e0b",
      products: [
        {
          name: "Cartoon Print T-Shirt",
          description: "Fun cartoon printed t-shirt for kids. 100% cotton, soft on skin. Machine washable and color-fast fabric.",
          rate: 349,
          colors: ["Red", "Blue", "Yellow"],
          sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
          colorCodes: ["#ef4444", "#3b82f6", "#eab308"]
        },
        {
          name: "Denim Shorts",
          description: "Comfortable denim shorts with elastic waistband. Perfect for summer. Soft washed denim, easy to wear.",
          rate: 499,
          colors: ["Light Blue", "Dark Blue"],
          sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
          colorCodes: ["#87ceeb", "#1e3a5f"]
        },
        {
          name: "Party Frock",
          description: "Adorable party frock with net overlay and bow detailing. Back zip closure. Perfect for birthdays and celebrations.",
          rate: 899,
          colors: ["Pink", "Lavender", "Peach"],
          sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
          colorCodes: ["#ff69b4", "#e6e6fa", "#ffdab9"]
        },
        {
          name: "Kurta Pyjama Set",
          description: "Traditional kurta pyjama set for boys. Cotton silk blend with minimal embroidery. Perfect for festivals.",
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
      icon: "👟",
      color: "#8b5cf6",
      products: [
        {
          name: "Canvas Sneakers",
          description: "Lightweight canvas sneakers with rubber sole. Lace-up closure, cushioned insole. Perfect for daily wear.",
          rate: 1299,
          colors: ["White", "Black", "Navy"],
          sizes: ["6", "7", "8", "9", "10"],
          colorCodes: ["#ffffff", "#222222", "#1e3a5f"]
        },
        {
          name: "Leather Sandals",
          description: "Genuine leather sandals with comfortable footbed. Anti-skid sole. Great for casual outings.",
          rate: 799,
          colors: ["Tan", "Black", "Brown"],
          sizes: ["6", "7", "8", "9", "10"],
          colorCodes: ["#d2b48c", "#222222", "#8b4513"]
        },
        {
          name: "Block Heels",
          description: "Elegant block heels with ankle strap. 3-inch heel height. Comfortable for long hours. Party and office wear.",
          rate: 1499,
          colors: ["Black", "Nude", "Red"],
          sizes: ["5", "6", "7", "8"],
          colorCodes: ["#222222", "#e8cebf", "#dc143c"]
        },
        {
          name: "Embroidered Juttis",
          description: "Handcrafted embroidered juttis with cushioned sole. Traditional design, modern comfort. Ethnic wear essential.",
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
      icon: "⌚",
      color: "#059669",
      products: [
        {
          name: "Analog Wrist Watch",
          description: "Classic analog watch with stainless steel case. Water resistant up to 30m. Quartz movement, 1 year warranty.",
          rate: 1499,
          colors: ["Silver", "Gold", "Rose Gold"],
          sizes: ["Free Size"],
          colorCodes: ["#c0c0c0", "#ffd700", "#b76e79"]
        },
        {
          name: "Leather Tote Bag",
          description: "Spacious leather tote bag with inner zip pocket. Durable stitching, magnetic closure. Office and travel friendly.",
          rate: 1299,
          colors: ["Black", "Tan", "Burgundy"],
          sizes: ["Free Size"],
          colorCodes: ["#222222", "#d2b48c", "#800020"]
        },
        {
          name: "Aviator Sunglasses",
          description: "UV400 protected aviator sunglasses with metal frame. Lightweight, anti-glare coating. Comes with carry case.",
          rate: 499,
          colors: ["Black", "Gold Frame", "Silver Frame"],
          sizes: ["Free Size"],
          colorCodes: ["#222222", "#daa520", "#c0c0c0"]
        },
        {
          name: "Pearl Necklace Set",
          description: "Elegant pearl necklace with matching earrings. Faux pearl beads with gold-plated clasp. Gift box included.",
          rate: 399,
          colors: ["White Pearl", "Golden", "Rose"],
          sizes: ["Free Size"],
          colorCodes: ["#faf0e6", "#daa520", "#b76e79"]
        }
      ]
    }
  ]
};
