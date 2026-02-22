// Sale91 Product Catalog Data
// Each product has: name, nickname, description, rate (min bulk price),
// samplePrice, weight (kg), colors, colorCodes, sizes, bulkPrices, catalogUrl

const CATALOG_DATA = {
  siteName: "Sale91",
  baseUrl: "https://thakyanamtumhara.github.io/catalog",
  categories: [
    {
      id: "oversized-tees",
      name: "Oversized Tees",
      icon: "👕",
      color: "#2563eb",
      products: [
        {
          name: "Oversize 210gsm",
          nickname: "OS210",
          description: "Oversized Drop Shoulder 210gsm, Terry Cotton Loopknit Heavy Gauge, 100% Cotton Supercombed Red Lable Premium Fabric",
          rate: 175,
          samplePrice: 210,
          weight: 0.27,
          colors: ["Black", "White", "Lavender", "Beige", "Red", "Sage Green", "Brown", "Off-white", "Orange", "Navy"],
          colorCodes: ["#222222", "#FFFFFF", "#C4B7D5", "#D4C5A9", "#DC143C", "#9CAF88", "#8B4513", "#FAF5E4", "#FF6B35", "#1E3A5F"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          bulkPrices: [175, 175, 175, 175, 175],
          catalogUrl: "https://docs.google.com/presentation/d/1-GEQ5CGKgngbeximSerhnkD_2xyOj-FuvyQZhlPG3Dk/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Oversize 240gsm",
          nickname: "OS240",
          description: "Oversized Drop-shoulder, 240gsm, Terry cotton/Loopknit Heavy Gauge, 100% Cotton Premium Quality Biowash Fabric",
          rate: 180,
          samplePrice: 222,
          weight: 0.32,
          colors: ["Black", "White", "Red", "Maroon", "Off-white", "Beige", "Lavender", "Brown", "Rose Pink", "Charcoal", "Army Green", "Powder Blue"],
          colorCodes: ["#222222", "#FFFFFF", "#DC143C", "#800020", "#FAF5E4", "#D4C5A9", "#C4B7D5", "#8B4513", "#FF8FAB", "#36454F", "#4B5320", "#B0D4F1"],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          bulkPrices: [180, 180, 180, 180, 180, 180],
          catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vTwoQtM14uhd4-3HM7q6lmbFGDD8IJrbxfMSGHAdcT3yR8Yv3XZBBgedc0TKMLaFpQot9kUt8u2KYFB/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Oversize 180gsm",
          nickname: "OS180",
          description: "Oversized Drop-shoulder 180gsm, 100% Cotton Supercombed Premium Quality Red Lable Fabric",
          rate: 165,
          samplePrice: 198,
          weight: 0.26,
          colors: ["Black", "White"],
          colorCodes: ["#222222", "#FFFFFF"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          bulkPrices: [165, 165, 165, 165, 165],
          catalogUrl: "https://docs.google.com/presentation/d/1ZSWvKG4ZbGk2KtTKdunLvVfCDB3l_EwYXDVAZcKKIXs/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Boxy Fit",
          nickname: "Boxy",
          description: "Boxy Fit Drop-shoulder Tshirt, 180gsm, 100% Cotton Supercombed Premium Quality Red Lable Fabric",
          rate: 175,
          samplePrice: 204,
          weight: 0.26,
          colors: ["Black", "White"],
          colorCodes: ["#222222", "#FFFFFF"],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          bulkPrices: [175, 175, 175, 175, 175, 175],
          catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vTiAKoubYbfn-ByHz3ttHo_XuOiy4rcIeCzSyBNVTh2wAuvic1erLuvE-ry6d3taBYx8q7x8PzbwX8b/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "AcidWash Oversize",
          nickname: "Acid-OS",
          description: "AcidWash OS (Oversize Fit), 240gsm, 100% cotton Biowash French Terry Loopknit",
          rate: 220,
          samplePrice: 264,
          weight: 0.27,
          colors: ["Black"],
          colorCodes: ["#222222"],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          bulkPrices: [220, 220, 220, 220, 220, 220],
          catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vTkrBu6AtzfU5w-qu84ySWFrIOaVQNGR7-laG9PQfUV0P6Y9ate-SU7s6QSz7Qy9lJbos2S0a8ffn4L/pub?start=false&loop=false&delayms=3000"
        }
      ]
    },
    {
      id: "roundneck-tees",
      name: "Round Neck Tees",
      icon: "👕",
      color: "#16a34a",
      products: [
        {
          name: "True Biowash Round Neck",
          nickname: "True Bio",
          description: "Regular Fit, True Biowash Round neck, 180gsm, 100% Cotton Supercombed Premium Quality Red Lable Fabric",
          rate: 140,
          samplePrice: 174,
          weight: 0.21,
          colors: ["Black", "White", "Maroon", "Navy", "Mustard Yellow", "Red", "Bottle Green", "Beige", "Royal Blue", "Lavender", "Sky", "Grey", "Bhagwa"],
          colorCodes: ["#222222", "#FFFFFF", "#800020", "#1E3A5F", "#E6A817", "#DC143C", "#006A4E", "#D4C5A9", "#4169E1", "#C4B7D5", "#87CEEB", "#808080", "#FF6600"],
          sizes: ["36", "38", "40", "42", "44", "46"],
          bulkPrices: [140, 140, 140, 140, 145, 145],
          catalogUrl: "https://docs.google.com/presentation/d/1MCJxT2_EhphgNGgXjygNS9n58P3tJgavzDzmKfUNQB0/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Biowash Round Neck",
          nickname: "YL Bio",
          description: "Regular Fit, Biowash Round neck, 180gsm, 100% Cotton Premium Quality Fabric",
          rate: 130,
          samplePrice: 162,
          weight: 0.21,
          colors: ["Black", "White", "Navy", "Red", "Brown", "Maroon", "Charcoal", "Off-white", "Rose Pink"],
          colorCodes: ["#222222", "#FFFFFF", "#1E3A5F", "#DC143C", "#8B4513", "#800020", "#36454F", "#FAF5E4", "#FF8FAB"],
          sizes: ["36", "38", "40", "42", "44", "46"],
          bulkPrices: [130, 130, 130, 130, 135, 135],
          catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vS-IYqDUp9Xtyls2ks1pLkE4JT9LgS2SX8IgomwpkK-xK23XoKC7lykAK1yRnJ7orjQ_Lw0laWU0d5M/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Non Bio Round Neck",
          nickname: "NBio",
          description: "Non Bio Round neck, 180gsm, 88% Cotton, 12% Polyester",
          rate: 102,
          samplePrice: 129,
          weight: 0.21,
          colors: ["Black"],
          colorCodes: ["#222222"],
          sizes: ["36", "38", "40", "42", "44", "46"],
          bulkPrices: [102, 102, 102, 102, 107, 107],
          catalogUrl: "https://docs.google.com/presentation/d/1ru4nIzCmrIIZInYCBpBasU9wxbF4gPYb89OF_zc89jw/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Sublimation T-Shirt",
          nickname: "Sublimation",
          description: "Regular Fit Round neck, 200gsm, Cotton Feel Polyester Sublimation tshirt, Premium Quality Sarina Knitting Type",
          rate: 115,
          samplePrice: 144,
          weight: 0.21,
          colors: ["White"],
          colorCodes: ["#FFFFFF"],
          sizes: ["36", "38", "40", "42", "44", "46"],
          bulkPrices: [115, 115, 115, 115, 120, 120],
          catalogUrl: "https://docs.google.com/presentation/d/1flL8p0VuI5twjdg7qM54wlJqAJkJzPlNKu1PERSbOtE/pub?start=false&loop=false&delayms=3000"
        }
      ]
    },
    {
      id: "polo-tees",
      name: "Polo T-Shirts",
      icon: "👔",
      color: "#7c3aed",
      products: [
        {
          name: "Premium Polo",
          nickname: "Bio Polo",
          description: "Most Premium Honeycomb Polo, 220gsm, 100% Cotton Supercombed Red Lable Fabric",
          rate: 220,
          samplePrice: 270,
          weight: 0.26,
          colors: ["Black", "White", "Navy", "Maroon"],
          colorCodes: ["#222222", "#FFFFFF", "#1E3A5F", "#800020"],
          sizes: ["36", "38", "40", "42", "44", "46"],
          bulkPrices: [220, 220, 220, 220, 220, 225],
          catalogUrl: "https://docs.google.com/presentation/d/1iTL0Hh77Eo_XlrKsIkPOcM2VpBegXbLpextEKLQhVs4/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Cotton Polo",
          nickname: "Polo",
          description: "Cotton Matty Polo neck, 220gsm, 88% Cotton, 12% Polyester",
          rate: 180,
          samplePrice: 222,
          weight: 0.26,
          colors: ["Black", "White", "Navy", "Grey", "Maroon", "Charcoal"],
          colorCodes: ["#222222", "#FFFFFF", "#1E3A5F", "#808080", "#800020", "#36454F"],
          sizes: ["36", "38", "40", "42", "44", "46"],
          bulkPrices: [180, 180, 180, 180, 180, 185],
          catalogUrl: "https://docs.google.com/presentation/d/1D0FRyvgSLbBOmQLYzQfFxru1ggHtJJnUt6LL9LiTJy0/pub?start=false&loop=false&delayms=3000"
        }
      ]
    },
    {
      id: "hoodies",
      name: "Hoodies",
      icon: "🧥",
      color: "#dc2626",
      products: [
        {
          name: "Zip Hoodie",
          nickname: "Zipper",
          description: "Zipper Hoodie, 320gsm, Cotton Brushed Loopknit, 88% cotton, 12% polyester",
          rate: 325,
          samplePrice: 390,
          weight: 0.56,
          colors: ["Black"],
          colorCodes: ["#222222"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          bulkPrices: [325, 325, 325, 325, 335],
          catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vT1IROWs8tfoWyefLuIjrmoG_tY37dG5o37w0M93qVtwT0-3izDpbG-hmJTdFXDvs0Aqa0rWedLeNUo/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Hoodie 320gsm (Black)",
          nickname: "Hood320-1",
          description: "Non-zipper Hoodie, 320gsm, Cotton Brushed Loopknit, 88% cotton, 12% polyester",
          rate: 295,
          samplePrice: 366,
          weight: 0.56,
          colors: ["Black"],
          colorCodes: ["#222222"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          bulkPrices: [295, 295, 295, 295, 305],
          catalogUrl: "https://docs.google.com/presentation/d/1S7a3FESEvHue-f9xHGDPMws6fE_JF9e15PtVrMSmG9s/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Hoodie 320gsm",
          nickname: "Hood320-2",
          description: "Non-zipper Hoodie, 320gsm, Cotton Brushed Loopknit, 88% cotton, 12% polyester",
          rate: 325,
          samplePrice: 402,
          weight: 0.56,
          colors: ["White", "Navy", "Army Green", "Off-white", "Maroon", "Grey", "Red"],
          colorCodes: ["#FFFFFF", "#1E3A5F", "#4B5320", "#FAF5E4", "#800020", "#808080", "#DC143C"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          bulkPrices: [325, 325, 325, 325, 335],
          catalogUrl: "https://docs.google.com/presentation/d/1bZdvS00WpvB-10oAhea451upFGabmEB_n-dZnzENRXI/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Dropshoulder Hoodie 430gsm",
          nickname: "Hood430",
          description: "Most Heavy Non-zipper Dropshoulder Hoodie, 430gsm, Cotton Brushed Loopknit, 88% cotton, 12% polyester",
          rate: 380,
          samplePrice: 468,
          weight: 0.75,
          colors: ["Black"],
          colorCodes: ["#222222"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          bulkPrices: [380, 380, 380, 380, 390],
          catalogUrl: "https://docs.google.com/presentation/d/119FQyCCKCqc2Si878vU_poGgxukTEFFUAXz1xU1Jsyo/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Hoodie 430gsm",
          nickname: "Hood430-2",
          description: "Most Heavy Non-zipper Dropshoulder Hoodie, 430gsm, Cotton Brushed Loopknit, 88% cotton, 12% polyester",
          rate: 418,
          samplePrice: 502,
          weight: 0.75,
          colors: ["Navy", "White", "Off-white"],
          colorCodes: ["#1E3A5F", "#FFFFFF", "#FAF5E4"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          bulkPrices: [418, 418, 418, 418, 428],
          catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vTydxbnJ0832GdVgDfVvgQhq8rOH9kVYJzBLrTRm2gsronXoAy2R_nIl3G0o4DgrR-oZrb3D1GjXVNv/pub?start=false&loop=false&delayms=3000"
        }
      ]
    },
    {
      id: "sweatshirts",
      name: "Sweatshirts & Jackets",
      icon: "🧥",
      color: "#ea580c",
      products: [
        {
          name: "Sweatshirt",
          nickname: "Sweatshirt",
          description: "Sweatshirt, 320gsm, Cotton Brushed Loopknit, 88% cotton, 12% polyester",
          rate: 225,
          samplePrice: 276,
          weight: 0.46,
          colors: ["Black", "Navy", "Grey", "Army Green"],
          colorCodes: ["#222222", "#1E3A5F", "#808080", "#4B5320"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          bulkPrices: [225, 225, 225, 225, 235],
          catalogUrl: "https://docs.google.com/presentation/d/1UbsXeU0ykL8SVWzfuMT2-84ZFrizxoUTElEkoZ-g4A4/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Sweatshirt 2",
          nickname: "Sweatshirt-2",
          description: "Sweatshirt, 320gsm, Cotton Brushed Loopknit, 88% cotton, 12% polyester",
          rate: 240,
          samplePrice: 288,
          weight: 0.46,
          colors: ["Maroon", "White", "Off-white"],
          colorCodes: ["#800020", "#FFFFFF", "#FAF5E4"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          bulkPrices: [240, 240, 240, 240, 250],
          catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vQ-U20uFkZqVUmNUAWItRkBZUYKA_RQ2nVvohMze4SxmBWHW5itG0M_tKqVkkvuCh_BTZxOVi_QTw4B/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Varsity Jacket",
          nickname: "Varsity",
          description: "Varsity Jacket, 320gsm, Cotton Brushed Loopknit, White Sleeve/Black Body, 88% cotton, 12% polyester",
          rate: 335,
          samplePrice: 402,
          weight: 0.56,
          colors: ["Black"],
          colorCodes: ["#222222"],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          bulkPrices: [335, 335, 335, 335, 335, 335],
          catalogUrl: "https://docs.google.com/presentation/d/1Xn3Eqq1MsfvohHHhzyeGbSDx02WeVh5f0VVk3EXCzW0/pub?start=false&loop=false&delayms=3000"
        }
      ]
    },
    {
      id: "kids-and-more",
      name: "Kids & Bottomwear",
      icon: "👶",
      color: "#f59e0b",
      products: [
        {
          name: "Kids Round Neck",
          nickname: "Kids",
          description: "True Biowash Kids Round neck, 180gsm, 100% Cotton Supercombed Premium Quality Red Lable Fabric",
          rate: 110,
          samplePrice: 144,
          weight: 0.16,
          colors: ["Black", "White", "Red", "Baby Pink", "Mustard Yellow"],
          colorCodes: ["#222222", "#FFFFFF", "#DC143C", "#FFB6C1", "#E6A817"],
          sizes: ["20", "22", "24", "26", "28", "30", "32", "34"],
          bulkPrices: [110, 110, 110, 110, 120, 120, 120, 120],
          catalogUrl: "https://docs.google.com/presentation/d/1fHmAJuC1mUIVDlJUGfsJATUYrtFFRsZSHuj3qynupmc/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Shorts",
          nickname: "Shorts",
          description: "240gsm, Terry cotton/Loopknit Heavy Gauge, 100% Cotton Supercombed Premium Quality Red Lable Fabric, (Zipper Left and Right pocket, 1 back pocket)",
          rate: 205,
          samplePrice: 246,
          weight: 0.25,
          colors: ["Black", "Off-white", "Lavender", "Beige"],
          colorCodes: ["#222222", "#FAF5E4", "#C4B7D5", "#D4C5A9"],
          sizes: ["XS", "S", "M", "L", "XL"],
          bulkPrices: [205, 205, 205, 205, 205],
          catalogUrl: "https://docs.google.com/presentation/d/1afUhzGUsjkTeVSoNkWbN4YJIUaoIPNXns18VGp2Lpig/pub?start=false&loop=false&delayms=3000"
        }
      ]
    }
  ]
};
