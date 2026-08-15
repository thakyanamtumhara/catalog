// Sale91 Product Catalog Data
// Each product has: name, nickname, description, moq, sizes, sizeChart
// and EITHER a flat price block (colors, colorCodes, imageFiles, bulkPrices, samplePrice)
// OR a `tiers` array when the same garment sells at two rates depending on colour.
//
// tiers: [{ label, colors, colorCodes, imageFiles, imageDir, bulkPrices, samplePrice }]
//   bulkPrices is per-size and lines up 1:1 with `sizes`.
//   imageDir defaults to the product slug; a merged tier points at its old folder.
// `id` is explicit so a product can be moved or merged without breaking #product= links.
// `aliases` keeps retired ids resolving to the product that absorbed them.

const CATALOG_DATA = {
  siteName: "Sale91",
  baseUrl: "https://www.bulkplaintshirt.com/catalog",
  categories: [
    {
      id: "oversized-tees",
      name: "Oversized Tees",
      icon: "👕",
      color: "#2563eb",
      products: [
        {
          name: "Oversize 210gsm",
          mainImage: "m2",
          id: "oversized-tees-0",
          nickname: "OS210",
          description: "Oversized Drop Shoulder 210gsm, Terry Cotton Loopknit Heavy Gauge, 100% Cotton Supercombed Red Lable Premium Fabric",
          sizeChart: "oversized",
          rate: 185,
          samplePrice: 222,
          moq: 10,
          colors: ["Black", "White", "Lavender", "Beige", "Red", "Sage Green", "Brown", "Off-white", "Orange", "Navy"],
          colorCodes: ["#222222", "#FFFFFF", "#C4B7D5", "#D4C5A9", "#DC143C", "#9CAF88", "#8B4513", "#FAF5E4", "#FF6B35", "#1E3A5F"],
          imageFiles: [1,2,3,4,6,7,8,9,10,11,12],
          sizes: ["S", "M", "L", "XL", "XXL"],
          bulkPrices: [185, 185, 185, 185, 185],
          catalogUrl: "https://docs.google.com/presentation/d/1-GEQ5CGKgngbeximSerhnkD_2xyOj-FuvyQZhlPG3Dk/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Oversize 180gsm",
          mainImage: "m2",
          id: "oversized-tees-2",
          nickname: "OS180",
          description: "Oversized Drop-shoulder 180gsm, 100% Cotton Supercombed Premium Quality Red Lable Fabric",
          sizeChart: "oversized",
          rate: 173,
          samplePrice: 208,
          moq: 10,
          colors: ["Black", "White"],
          colorCodes: ["#222222", "#FFFFFF"],
          imageFiles: [1],
          sizes: ["S", "M", "L", "XL", "XXL"],
          bulkPrices: [173, 173, 173, 173, 173],
          catalogUrl: "https://docs.google.com/presentation/d/1ZSWvKG4ZbGk2KtTKdunLvVfCDB3l_EwYXDVAZcKKIXs/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Oversize 240gsm",
          videos: [
            { src: "/ph/vid/oversize-240gsm-royalblue-navy.mp4", poster: "/ph/vid/oversize-240gsm-royalblue-navy.jpg", color: "Royal Blue" }
          ],
          mainImage: "m2",
          id: "oversized-tees-1",
          nickname: "OS240",
          description: "Oversized Drop-shoulder, 240gsm, Terry cotton/Loopknit Heavy Gauge, 100% Cotton Premium Quality Biowash Fabric",
          sizeChart: "oversized",
          rate: 190,
          samplePrice: 228,
          moq: 10,
          colors: ["Black", "White", "Navy", "Red", "Maroon", "Off-white", "Beige", "Lavender", "Brown", "Rose Pink", "Charcoal", "Army Green", "Powder Blue", "Royal Blue"],
          colorCodes: ["#222222", "#FFFFFF", "#1E3A5F", "#DC143C", "#800020", "#FAF5E4", "#D4C5A9", "#C4B7D5", "#8B4513", "#FF8FAB", "#36454F", "#4B5320", "#B0D4F1", "#4169E1"],
          imageFiles: [1,2,3,4,5,6,7,8,9,10,11,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          bulkPrices: [190, 190, 190, 190, 190, 190],
          catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vTwoQtM14uhd4-3HM7q6lmbFGDD8IJrbxfMSGHAdcT3yR8Yv3XZBBgedc0TKMLaFpQot9kUt8u2KYFB/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Oversize 260gsm",
          id: "oversized-tees-5",
          nickname: "OS260",
          description: "Oversized Drop-shoulder 260gsm with MOON PATCH, Terry Loopknit 100% Cotton Premium Biowash",
          sizeChart: "oversized260",
          rate: 190,
          samplePrice: 275,
          moq: 10,
          colors: ["Black", "White"],
          colorCodes: ["#222222", "#FFFFFF"],
          imageFiles: ["1b","2b","3b","4b","5b","6b","7b","8b","9b"],
          mainImage: "m2",
          sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"],
          bulkPrices: [190, 195, 205, 220, 225, 230, 240, 255]
        },
        {
          name: "AcidWash Oversize",
          videos: [
            { src: "/ph/vid/acidwash-os-multi-v2.mp4", poster: "/ph/vid/acidwash-os-multi-v2.jpg" },
            { src: "/ph/vid/acidwash-os.mp4", poster: "/ph/vid/acidwash-os.jpg", color: "Black" },
            { src: "/ph/vid/acidwash-os-brown.mp4", poster: "/ph/vid/acidwash-os-brown.jpg", color: "Brown" },
            { src: "/ph/vid/acidwash-os-navy.mp4", poster: "/ph/vid/acidwash-os-navy.jpg", color: "Navy" },
            { src: "/ph/vid/acidwash-os-maroon.mp4", poster: "/ph/vid/acidwash-os-maroon.jpg", color: "Maroon" },
            { src: "/ph/vid/acidwash-os-armygreen-v2.mp4", poster: "/ph/vid/acidwash-os-armygreen-v2.jpg", color: "Army Green" },
            { src: "/ph/vid/acidwash-os-red-v2.mp4", poster: "/ph/vid/acidwash-os-red-v2.jpg", color: "Red" }
          ],
          mainImage: "m2",
          id: "oversized-tees-4",
          nickname: "Acid-OS",
          description: "AcidWash OS (Oversize Fit), 240gsm, 100% cotton Biowash French Terry Loopknit",
          sizeChart: "oversized",
          rate: 233,
          samplePrice: 280,
          moq: 10,
          colors: ["Black", "Brown", "Navy", "Maroon", "Charcoal", "Red", "Army Green"],
          colorCodes: ["#222222", "#8B4513", "#1E3A5F", "#800020", "#36454F", "#DC143C", "#4B5320"],
          imageFiles: [1,2,3],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          bulkPrices: [233, 233, 233, 233, 233, 233],
          catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vTkrBu6AtzfU5w-qu84ySWFrIOaVQNGR7-laG9PQfUV0P6Y9ate-SU7s6QSz7Qy9lJbos2S0a8ffn4L/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Boxy Fit",
          id: "oversized-tees-3",
          hidden: true,
          nickname: "Boxy",
          description: "Boxy Fit Drop-shoulder Tshirt, 180gsm, 100% Cotton Supercombed Premium Quality Red Lable Fabric",
          sizeChart: "boxy",
          rate: 175,
          samplePrice: 204,
          moq: 10,
          colors: ["Black", "White"],
          colorCodes: ["#222222", "#FFFFFF"],
          imageFiles: [1,2,4,5,6],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          bulkPrices: [175, 175, 175, 175, 175, 175],
          catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vTiAKoubYbfn-ByHz3ttHo_XuOiy4rcIeCzSyBNVTh2wAuvic1erLuvE-ry6d3taBYx8q7x8PzbwX8b/pub?start=false&loop=false&delayms=3000"
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
          videos: [
            { src: "/ph/vid/true-bio-rneck-mustardyellow.mp4", poster: "/ph/vid/true-bio-rneck-mustardyellow.jpg", color: "Mustard Yellow" }
          ],
          mainImage: "m2",
          id: "roundneck-tees-0",
          nickname: "True Bio",
          description: "Regular Fit, True Biowash Round neck, 180gsm, 100% Cotton Supercombed Premium Quality Red Lable Fabric",
          sizeChart: "roundneck",
          rate: 146,
          samplePrice: 181,
          moq: 10,
          colors: ["Black", "White", "Maroon", "Navy", "Mustard Yellow", "Red", "Bottle Green", "Beige", "Royal Blue", "Lavender", "Sky", "Grey", "Bhagwa", "Army Green"],
          colorCodes: ["#222222", "#FFFFFF", "#800020", "#1E3A5F", "#E6A817", "#DC143C", "#006A4E", "#D4C5A9", "#4169E1", "#C4B7D5", "#87CEEB", "#808080", "#FF6600", "#4B5320"],
          imageFiles: [1,2,3,4,5,6,8,9,10,11,12,13,14],
          sizes: ["36", "38", "40", "42", "44", "46"],
          bulkPrices: [146, 146, 146, 146, 151, 151],
          catalogUrl: "https://docs.google.com/presentation/d/1MCJxT2_EhphgNGgXjygNS9n58P3tJgavzDzmKfUNQB0/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Biowash Round Neck",
          mainImage: "m2",
          id: "roundneck-tees-1",
          nickname: "YL Bio",
          description: "Regular Fit, Biowash Round neck, 180gsm, 100% Cotton Premium Quality Fabric",
          sizeChart: "roundneck",
          rate: 136,
          samplePrice: 170,
          moq: 10,
          colors: ["Black", "White", "Navy", "Red", "Brown", "Maroon", "Charcoal", "Off-white", "Rose Pink"],
          colorCodes: ["#222222", "#FFFFFF", "#1E3A5F", "#DC143C", "#8B4513", "#800020", "#36454F", "#FAF5E4", "#FF8FAB"],
          imageFiles: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,26,27],
          sizes: ["36", "38", "40", "42", "44", "46"],
          bulkPrices: [136, 136, 136, 136, 141, 141],
          catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vS-IYqDUp9Xtyls2ks1pLkE4JT9LgS2SX8IgomwpkK-xK23XoKC7lykAK1yRnJ7orjQ_Lw0laWU0d5M/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Sublimation T-Shirt",
          videos: [
            { src: "/ph/vid/sublimation.mp4", poster: "/ph/vid/sublimation.jpg" }
          ],
          mainImage: "m2",
          id: "roundneck-tees-3",
          nickname: "Sublimation",
          description: "Regular Fit Round neck, 200gsm, Cotton Feel Polyester Sublimation tshirt, Premium Quality Sarina Knitting Type",
          sizeChart: "roundneck",
          rate: 118,
          samplePrice: 144,
          moq: 10,
          colors: ["White"],
          colorCodes: ["#FFFFFF"],
          imageFiles: [1,2,3,4,5,6],
          sizes: ["36", "38", "40", "42", "44", "46"],
          bulkPrices: [118, 118, 118, 118, 123, 123],
          catalogUrl: "https://docs.google.com/presentation/d/1flL8p0VuI5twjdg7qM54wlJqAJkJzPlNKu1PERSbOtE/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Non Bio Round Neck",
          id: "roundneck-tees-2",
          nickname: "NBio",
          description: "Non Bio Round neck, 180gsm, 88% Cotton, 12% Polyester",
          sizeChart: "roundneck",
          rate: 105,
          samplePrice: 129,
          moq: 10,
          colors: ["Black"],
          colorCodes: ["#222222"],
          imageFiles: [1,2,3,4,5,6],
          sizes: ["36", "38", "40", "42", "44", "46"],
          bulkPrices: [105, 105, 105, 105, 110, 110],
          catalogUrl: "https://docs.google.com/presentation/d/1ru4nIzCmrIIZInYCBpBasU9wxbF4gPYb89OF_zc89jw/pub?start=false&loop=false&delayms=3000"
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
          mainImage: "m2",
          id: "polo-tees-0",
          nickname: "Bio Polo",
          description: "Most Premium Honeycomb Polo, 220gsm, 100% Cotton Supercombed Red Lable Fabric",
          sizeChart: "roundneck",
          rate: 232,
          samplePrice: 285,
          moq: 10,
          colors: ["Black", "White", "Navy", "Maroon"],
          colorCodes: ["#222222", "#FFFFFF", "#1E3A5F", "#800020"],
          imageFiles: [1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19],
          sizes: ["36", "38", "40", "42", "44", "46"],
          bulkPrices: [232, 232, 232, 232, 232, 237],
          catalogUrl: "https://docs.google.com/presentation/d/1iTL0Hh77Eo_XlrKsIkPOcM2VpBegXbLpextEKLQhVs4/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Cotton Polo",
          videos: [
            { src: "/ph/vid/cotton-polo.mp4", poster: "/ph/vid/cotton-polo.jpg" }
          ],
          mainImage: "m2",
          id: "polo-tees-1",
          nickname: "Polo",
          description: "Cotton Matty Polo neck, 220gsm, 88% Cotton, 12% Polyester",
          sizeChart: "roundneck",
          rate: 185,
          samplePrice: 222,
          moq: 10,
          colors: ["Black", "White", "Navy", "Grey", "Maroon", "Charcoal", "Red"],
          colorCodes: ["#222222", "#FFFFFF", "#1E3A5F", "#808080", "#800020", "#36454F", "#DC143C"],
          imageFiles: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
          sizes: ["36", "38", "40", "42", "44", "46"],
          bulkPrices: [185, 185, 185, 185, 185, 190],
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
          mainImage: "m2",
          id: "hoodies-0",
          nickname: "Zipper",
          description: "Zipper Hoodie, 320gsm, Cotton Brushed Loopknit, 88% cotton, 12% polyester",
          sizeChart: "hoodie320",
          rate: 325,
          samplePrice: 390,
          moq: 10,
          colors: ["Black"],
          colorCodes: ["#222222"],
          imageFiles: [1,2,3,4,5],
          sizes: ["S", "M", "L", "XL", "XXL"],
          bulkPrices: [325, 325, 325, 325, 335],
          catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vT1IROWs8tfoWyefLuIjrmoG_tY37dG5o37w0M93qVtwT0-3izDpbG-hmJTdFXDvs0Aqa0rWedLeNUo/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Hoodie 320gsm",
          videos: [
            { src: "/ph/vid/hoodie-320gsm-black-v2.mp4", poster: "/ph/vid/hoodie-320gsm-black-v2.jpg", color: "Black" },
            { src: "/ph/vid/hoodie-320gsm-white.mp4", poster: "/ph/vid/hoodie-320gsm-white.jpg", color: "White" },
            { src: "/ph/vid/hoodie-320gsm-navy.mp4", poster: "/ph/vid/hoodie-320gsm-navy.jpg", color: "Navy" }
          ],
          id: "hoodies-1",
          aliases: ["hoodies-2"],
          nickname: "Hood320",
          description: "Non-zipper Hoodie, 320gsm, Cotton Brushed Loopknit, 88% cotton, 12% polyester",
          sizeChart: "hoodie320",
          moq: 10,
          sizes: ["S", "M", "L", "XL", "XXL"],
          mainImage: "m2",
          tiers: [
            {
              label: "Black",
              imageDir: "hoodie-320gsm-black",
              colors: ["Black"],
              colorCodes: ["#222222"],
              imageFiles: [1,7,8],
              bulkPrices: [295, 295, 295, 295, 305],
              samplePrice: 366,
              catalogUrl: "https://docs.google.com/presentation/d/1S7a3FESEvHue-f9xHGDPMws6fE_JF9e15PtVrMSmG9s/pub?start=false&loop=false&delayms=3000"
            },
            {
              label: "Other colours",
              colors: ["White", "Navy", "Army Green", "Off-white", "Maroon", "Grey", "Red"],
              colorCodes: ["#FFFFFF", "#1E3A5F", "#4B5320", "#FAF5E4", "#800020", "#808080", "#DC143C"],
              imageFiles: [1,2,3,4,5,9,10,12,13,14,15,16,17,18,19,20,21,22,23,24],
              bulkPrices: [325, 325, 325, 325, 335],
              samplePrice: 402,
              catalogUrl: "https://docs.google.com/presentation/d/1bZdvS00WpvB-10oAhea451upFGabmEB_n-dZnzENRXI/pub?start=false&loop=false&delayms=3000"
            }
          ]
        },
        {
          // Slug pinned to hoodie-430gsm: Search Console shows that URL ranks
          // position 2.0 for "430 gsm hoodie" while dropshoulder-hoodie-430gsm
          // ranks 49.5 for nothing. The display name is free to change; the URL
          // is not.
          name: "Dropshoulder Hoodie 430gsm",
          videos: [
            { src: "/ph/vid/hoodie-430gsm-black-v2.mp4", poster: "/ph/vid/hoodie-430gsm-black-v2.jpg", color: "Black" }
          ],
          slug: "hoodie-430gsm",
          id: "hoodies-3",
          aliases: ["hoodies-4"],
          nickname: "Hood430",
          description: "Most Heavy Non-zipper Dropshoulder Hoodie, 430gsm, Cotton Brushed Loopknit, 88% cotton, 12% polyester",
          sizeChart: "hoodie430",
          moq: 10,
          sizes: ["S", "M", "L", "XL", "XXL"],
          mainImage: "m2",
          tiers: [
            {
              label: "Black",
              imageDir: "dropshoulder-hoodie-430gsm",
              colors: ["Black"],
              colorCodes: ["#222222"],
              imageFiles: [1,10,11],
              bulkPrices: [380, 380, 380, 380, 390],
              samplePrice: 468,
              catalogUrl: "https://docs.google.com/presentation/d/119FQyCCKCqc2Si878vU_poGgxukTEFFUAXz1xU1Jsyo/pub?start=false&loop=false&delayms=3000"
            },
            {
              label: "Other colours",
              colors: ["Navy", "White", "Off-white"],
              colorCodes: ["#1E3A5F", "#FFFFFF", "#FAF5E4"],
              imageFiles: [1,2,3,7,8,12,13,14],
              bulkPrices: [418, 418, 418, 418, 428],
              samplePrice: 502,
              catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vTydxbnJ0832GdVgDfVvgQhq8rOH9kVYJzBLrTRm2gsronXoAy2R_nIl3G0o4DgrR-oZrb3D1GjXVNv/pub?start=false&loop=false&delayms=3000"
            }
          ]
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
          videos: [
            { src: "/ph/vid/sweatshirt-grey.mp4", poster: "/ph/vid/sweatshirt-grey.jpg", color: "Grey" },
            { src: "/ph/vid/sweatshirt-offwhite.mp4", poster: "/ph/vid/sweatshirt-offwhite.jpg", color: "Off-white" },
            { src: "/ph/vid/sweatshirt-maroon.mp4", poster: "/ph/vid/sweatshirt-maroon.jpg", color: "Maroon" }
          ],
          id: "sweatshirts-0",
          aliases: ["sweatshirts-1"],
          nickname: "Sweatshirt",
          description: "Sweatshirt, 320gsm, Cotton Brushed Loopknit, 88% cotton, 12% polyester",
          sizeChart: "hoodie320",
          moq: 10,
          sizes: ["S", "M", "L", "XL", "XXL"],
          mainImage: "m2",
          tiers: [
            {
              label: "Black, Navy, Grey, Army Green",
              colors: ["Black", "Navy", "Grey", "Army Green"],
              colorCodes: ["#222222", "#1E3A5F", "#808080", "#4B5320"],
              // 1.webp is the watermarked twin of m.webp and 19.webp is byte-identical
              // to 7.webp — both were showing as duplicate slides.
              imageFiles: [2,3,4,5,6,7,8,9],
              bulkPrices: [225, 225, 225, 225, 235],
              samplePrice: 276,
              catalogUrl: "https://docs.google.com/presentation/d/1UbsXeU0ykL8SVWzfuMT2-84ZFrizxoUTElEkoZ-g4A4/pub?start=false&loop=false&delayms=3000"
            },
            {
              label: "Maroon, White, Off-white",
              imageDir: "sweatshirt-2",
              colors: ["Maroon", "White", "Off-white"],
              colorCodes: ["#800020", "#FFFFFF", "#FAF5E4"],
              imageFiles: [1,2,3,13,14,15,16,18],
              bulkPrices: [240, 240, 240, 240, 250],
              samplePrice: 288,
              catalogUrl: "https://docs.google.com/presentation/d/e/2PACX-1vQ-U20uFkZqVUmNUAWItRkBZUYKA_RQ2nVvohMze4SxmBWHW5itG0M_tKqVkkvuCh_BTZxOVi_QTw4B/pub?start=false&loop=false&delayms=3000"
            }
          ]
        },
        {
          name: "Varsity Jacket",
          id: "sweatshirts-2",
          hidden: true,
          nickname: "Varsity",
          description: "Varsity Jacket, 320gsm, Cotton Brushed Loopknit, White Sleeve/Black Body, 88% cotton, 12% polyester",
          sizeChart: "hoodie320",
          rate: 335,
          samplePrice: 402,
          moq: 10,
          colors: ["Black"],
          colorCodes: ["#222222"],
          imageFiles: [1,2],
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
          id: "kids-and-more-0",
          nickname: "Kids",
          description: "True Biowash Kids Round neck, 180gsm, 100% Cotton Supercombed Premium Quality Red Lable Fabric",
          sizeChart: "kids",
          rate: 114,
          samplePrice: 144,
          moq: 10,
          colors: ["Black", "White", "Red", "Baby Pink", "Mustard Yellow"],
          colorCodes: ["#222222", "#FFFFFF", "#DC143C", "#FFB6C1", "#E6A817"],
          imageFiles: [1,2,4,5],
          sizes: ["20", "22", "24", "26", "28", "30", "32", "34"],
          bulkPrices: [114, 114, 114, 114, 124, 124, 124, 124],
          catalogUrl: "https://docs.google.com/presentation/d/1fHmAJuC1mUIVDlJUGfsJATUYrtFFRsZSHuj3qynupmc/pub?start=false&loop=false&delayms=3000"
        },
        {
          name: "Shorts",
          mainImage: "m2",
          id: "kids-and-more-1",
          nickname: "Shorts",
          description: "240gsm, Terry cotton/Loopknit Heavy Gauge, 100% Cotton Supercombed Premium Quality Red Lable Fabric, (Zipper Left and Right pocket, 1 back pocket)",
          sizeChart: "shorts",
          rate: 217,
          samplePrice: 261,
          moq: 10,
          colors: ["Black", "Off-white", "Lavender", "Beige"],
          colorCodes: ["#222222", "#FAF5E4", "#C4B7D5", "#D4C5A9"],
          imageFiles: [1,2,3,4,5,6,7,8],
          sizes: ["XS", "S", "M", "L", "XL"],
          bulkPrices: [217, 217, 217, 217, 217],
          catalogUrl: "https://docs.google.com/presentation/d/1afUhzGUsjkTeVSoNkWbN4YJIUaoIPNXns18VGp2Lpig/pub?start=false&loop=false&delayms=3000"
        }
      ]
    }
  ]
};
