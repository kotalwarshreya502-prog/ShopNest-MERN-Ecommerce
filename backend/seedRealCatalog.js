require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/product");
const Category = require("./models/Category");

const realProductsCatalog = [
  // ══════════════════════════════════════════════════════════════════════════════
  // 1. MOBILES (Smartphones)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    name: "Apple iPhone 15 Pro Max (256GB Natural Titanium)",
    slug: "apple-iphone-15-pro-max-256gb",
    description: "Apple iPhone 15 Pro Max forged in aerospace-grade titanium with the breakthrough A17 Pro chip, customizable Action button, 48MP main camera with 5x optical telephoto lens, and USB-C with USB 3 speeds.",
    price: 159900,
    discountPrice: 148900,
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "Apple",
    stock: 18,
    ratings: 4.9,
    numReviews: 840,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80"
    ],
    specifications: [
      { key: "Display", value: "6.7-inch Super Retina XDR OLED 120Hz ProMotion" },
      { key: "Processor", value: "A17 Pro Bionic (3nm, 6-core GPU with hardware ray tracing)" },
      { key: "Camera", value: "48MP Main + 12MP Ultra-Wide + 12MP 5x Optical Telephoto" },
      { key: "Build", value: "Grade 5 Titanium frame with Ceramic Shield front" }
    ],
    tags: ["iphone", "apple", "mobile", "smartphone", "5g", "titanium"]
  },
  {
    name: "Samsung Galaxy S24 Ultra 5G (Titanium Black, 12GB RAM, 256GB)",
    slug: "samsung-galaxy-s24-ultra-5g",
    description: "Samsung Galaxy S24 Ultra meets Galaxy AI with Circle to Search, Live Translate, and Note Assist. Features 200MP camera system, built-in S Pen, Snapdragon 8 Gen 3, and Corning Gorilla Armor glass.",
    price: 134999,
    discountPrice: 124999,
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "Samsung",
    stock: 22,
    ratings: 4.9,
    numReviews: 615,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"
    ],
    specifications: [
      { key: "Display", value: "6.8-inch Dynamic AMOLED 2X Quad HD+ 120Hz (2600 nits)" },
      { key: "Processor", value: "Snapdragon 8 Gen 3 for Galaxy" },
      { key: "Camera", value: "200MP Main + 50MP 5x Telephoto + 12MP Ultra Wide + 10MP 3x Telephoto" },
      { key: "Battery", value: "5000mAh with 45W Fast Charging" }
    ],
    tags: ["samsung", "galaxy", "s24 ultra", "smartphone", "mobile", "ai"]
  },
  {
    name: "OnePlus 12 5G (Silky Black, 16GB RAM, 512GB Storage)",
    slug: "oneplus-12-5g-silky-black",
    description: "OnePlus 12 powered by Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera for Mobile with 64MP periscope telephoto, 2K 120Hz ProXDR display, and 100W SUPERVOOC flash charging.",
    price: 69999,
    discountPrice: 64999,
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "OnePlus",
    stock: 25,
    ratings: 4.8,
    numReviews: 430,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "RAM & Storage", value: "16GB LPDDR5X + 512GB UFS 4.0" },
      { key: "Charging", value: "100W Wired SUPERVOOC + 50W AIRVOOC Wireless" },
      { key: "Display", value: "6.82-inch 2K 120Hz LTPO 4.0 ProXDR AMOLED (4500 nits peak)" }
    ],
    tags: ["oneplus", "oneplus 12", "hasselblad", "mobile", "smartphone"]
  },
  {
    name: "Google Pixel 8 Pro (Bay Blue, 128GB, Tensor G3)",
    slug: "google-pixel-8-pro-bay-blue",
    description: "The all-pro phone engineered by Google. Features Google Tensor G3, polished aluminum frame with matte back glass, fully upgraded cameras with Best Take, and 7 years of OS updates.",
    price: 106999,
    discountPrice: 93999,
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "Google",
    stock: 14,
    ratings: 4.7,
    numReviews: 320,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1598327105854-c8674faddf79?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1598327105854-c8674faddf79?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Processor", value: "Google Tensor G3 with Titan M2 security coprocessor" },
      { key: "Display", value: "6.7-inch Super Actua LTPO OLED 1-120Hz (2400 nits)" },
      { key: "Camera AI", value: "50MP Octa PD Main + 48MP Quad PD Ultrawide + 48MP 5x Telephoto" }
    ],
    tags: ["google", "pixel", "pixel 8 pro", "tensor", "android", "mobile"]
  },
  {
    name: "Redmi Note 13 Pro+ 5G (Fusion Purple, 12GB/256GB, 200MP OIS)",
    slug: "redmi-note-13-pro-plus-5g",
    description: "Redmi Note 13 Pro+ 5G with flagship 3D curved 1.5K 120Hz AMOLED display, groundbreaking 200MP camera with Optical Image Stabilization (OIS), MediaTek Dimensity 7200-Ultra, and 120W HyperCharge.",
    price: 33999,
    discountPrice: 29999,
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "Redmi",
    stock: 30,
    ratings: 4.6,
    numReviews: 510,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Camera", value: "200MP Samsung ISOCELL HP3 with OIS + EIS" },
      { key: "Charging", value: "120W HyperCharge (100% in 19 mins, 5000mAh)" },
      { key: "Protection", value: "IP68 Dust & Water Resistance + Gorilla Glass Victus" }
    ],
    tags: ["redmi", "xiaomi", "redmi note", "200mp", "budget smartphone"]
  },
  {
    name: "Motorola Edge 50 Pro 5G (Luxe Lavender, 12GB/256GB, Snapdragon 7 Gen 3)",
    slug: "motorola-edge-50-pro-5g",
    description: "Motorola Edge 50 Pro featuring world's first Pantone Validated camera and display. Symmetrical curved 144Hz 1.5K pOLED display, handcrafted vegan leather back, and 125W TurboPower charging.",
    price: 36999,
    discountPrice: 31999,
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "Motorola",
    stock: 20,
    ratings: 4.7,
    numReviews: 290,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Display", value: "6.7-inch 144Hz 1.5K True Color 10-bit pOLED" },
      { key: "Processor", value: "Qualcomm Snapdragon 7 Gen 3 (4nm)" },
      { key: "Charging", value: "125W TurboPower wired + 50W Wireless Charging" }
    ],
    tags: ["motorola", "moto edge", "5g", "smartphone", "mobile"]
  },
  {
    name: "Apple iPhone 14 (128GB Midnight Blue)",
    slug: "apple-iphone-14-128gb",
    description: "Apple iPhone 14 with 6.1-inch Super Retina XDR display, advanced dual-camera system with Photonic Engine for incredible detail and color, Action mode for smooth handheld videos, and Crash Detection.",
    price: 69900,
    discountPrice: 58900,
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "Apple",
    stock: 24,
    ratings: 4.8,
    numReviews: 920,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Display", value: "6.1-inch Super Retina XDR OLED" },
      { key: "Chip", value: "A15 Bionic with 5-core GPU" },
      { key: "Camera", value: "Dual 12MP Main + 12MP Ultra Wide with Photonic Engine" }
    ],
    tags: ["iphone", "apple", "iphone 14", "mobile", "smartphone"]
  },
  {
    name: "Samsung Galaxy Z Flip5 5G (Mint, 8GB/256GB)",
    slug: "samsung-galaxy-z-flip5-5g",
    description: "Samsung Galaxy Z Flip5 stylish pocketable foldable smartphone. Features a 3.4-inch Flex Window cover screen for widgets and replies without opening, FlexCam hands-free angles, and Armor Aluminum frame.",
    price: 99999,
    discountPrice: 84999,
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "Samsung",
    stock: 16,
    ratings: 4.7,
    numReviews: 210,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Main Screen", value: "6.7-inch FHD+ Dynamic AMOLED 2X 120Hz Flex Display" },
      { key: "Cover Screen", value: "3.4-inch Super AMOLED 60Hz Flex Window" },
      { key: "Hinge", value: "Zero-gap Flex Hinge with IPX8 water resistance" }
    ],
    tags: ["samsung", "galaxy z flip", "foldable", "mobile", "flip phone"]
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // 2. LAPTOPS
  // ══════════════════════════════════════════════════════════════════════════════
  {
    name: "Apple MacBook Pro 16\" (M3 Max, 36GB Unified Memory, 1TB SSD - Space Black)",
    slug: "apple-macbook-pro-16-m3-max",
    description: "Apple MacBook Pro 16-inch engineered with M3 Max 14-core CPU and 30-core GPU. Stunning Liquid Retina XDR display with 1600 nits peak brightness, studio-quality mics, 6-speaker sound system, and up to 22 hours battery.",
    price: 349900,
    discountPrice: 324900,
    category: "Laptops",
    subcategory: "Laptops",
    brand: "Apple",
    stock: 12,
    ratings: 4.9,
    numReviews: 380,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80"
    ],
    specifications: [
      { key: "Processor", value: "Apple M3 Max (14-core CPU, 30-core GPU, 16-core Neural Engine)" },
      { key: "Memory & Storage", value: "36GB Unified Memory + 1TB Fast PCIe NVMe SSD" },
      { key: "Display", value: "16.2-inch Liquid Retina XDR (3456x2234) 120Hz ProMotion" }
    ],
    tags: ["macbook", "apple", "laptop", "m3 max", "professional", "creator"]
  },
  {
    name: "HP Spectre x360 2-in-1 Laptop 14\" (Intel Core Ultra 7, 32GB/1TB OLED)",
    slug: "hp-spectre-x360-14-oled",
    description: "HP Spectre x360 2-in-1 convertible touchscreen laptop with Intel Core Ultra 7 155H AI processor, 2.8K 120Hz IMAX Enhanced OLED display, 9MP night-vision webcam, and included magnetic rechargeable tilt pen.",
    price: 179990,
    discountPrice: 159990,
    category: "Laptops",
    subcategory: "Laptops",
    brand: "HP",
    stock: 15,
    ratings: 4.8,
    numReviews: 240,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Processor", value: "Intel Core Ultra 7 155H (16 cores, Intel Arc GPU, NPU)" },
      { key: "Display", value: "14-inch 2.8K (2880 x 1800) OLED 120Hz Touchscreen 500 nits" },
      { key: "Memory & Storage", value: "32GB LPDDR5x 7467MHz + 1TB PCIe Gen4 NVMe" }
    ],
    tags: ["hp", "spectre", "laptop", "oled", "convertible", "touchscreen"]
  },
  {
    name: "Dell XPS 15 9530 (Intel Core i9 13th Gen, RTX 4060, 32GB/1TB, 3.5K OLED)",
    slug: "dell-xps-15-9530-oled",
    description: "Dell XPS 15 precision-crafted from CNC machined aluminum and aerospace carbon fiber. Featuring 13th Gen Intel Core i9-13900H, NVIDIA GeForce RTX 4060 graphics, and 3.5K OLED InfinityEdge touch display.",
    price: 269990,
    discountPrice: 244990,
    category: "Laptops",
    subcategory: "Laptops",
    brand: "Dell",
    stock: 10,
    ratings: 4.8,
    numReviews: 180,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Processor", value: "Intel Core i9-13900H (14 cores, up to 5.4GHz)" },
      { key: "Graphics", value: "NVIDIA GeForce RTX 4060 8GB GDDR6" },
      { key: "Display", value: "15.6-inch 3.5K (3456x2160) OLED InfinityEdge Touch 400 nits" }
    ],
    tags: ["dell", "xps", "dell xps 15", "laptop", "rtx 4060", "creator"]
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 11 (Intel Core i7 13th Gen, 16GB/512GB SSD)",
    slug: "lenovo-thinkpad-x1-carbon-gen-11",
    description: "Lenovo ThinkPad X1 Carbon Gen 11 ultra-portable business laptop. Ultra-light 1.12kg chassis reinforced with carbon fiber, MIL-SPEC 810H durability, legendary spill-resistant ThinkPad keyboard, and Dolby Atmos audio.",
    price: 189900,
    discountPrice: 169900,
    category: "Laptops",
    subcategory: "Laptops",
    brand: "Lenovo",
    stock: 16,
    ratings: 4.8,
    numReviews: 290,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Processor", value: "Intel Core i7-1365U vPro (10 cores, up to 5.2GHz)" },
      { key: "Weight", value: "1.12 kg featherweight carbon-fiber frame" },
      { key: "Display", value: "14-inch WUXGA (1920x1200) IPS Anti-glare 400 nits 100% sRGB" }
    ],
    tags: ["lenovo", "thinkpad", "x1 carbon", "laptop", "business"]
  },
  {
    name: "ASUS Zenbook 14 OLED (Intel Core Ultra 7, 16GB RAM, 1TB SSD - Ponder Blue)",
    slug: "asus-zenbook-14-oled-ultra-7",
    description: "ASUS Zenbook 14 OLED premium ultraportable laptop. 14-inch 3K 120Hz ASUS Lumina OLED display, Intel Core Ultra 7 processor with dedicated NPU for AI, Harman Kardon audio, and 75Wh battery.",
    price: 114990,
    discountPrice: 99990,
    category: "Laptops",
    subcategory: "Laptops",
    brand: "ASUS",
    stock: 20,
    ratings: 4.7,
    numReviews: 340,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Display", value: "14-inch 3K (2880 x 1800) OLED 120Hz 0.2ms 600 nits HDR" },
      { key: "Processor", value: "Intel Core Ultra 7 155H with Intel Arc Graphics" },
      { key: "Chassis", value: "14.9mm slim all-metal aluminum body, 1.2kg" }
    ],
    tags: ["asus", "zenbook", "oled", "laptop", "ultraportable"]
  },
  {
    name: "Acer Predator Helios 16 Gaming Laptop (Intel i7 14th Gen, RTX 4070, 240Hz)",
    slug: "acer-predator-helios-16-gaming-laptop",
    description: "Acer Predator Helios 16 gaming beast powered by 14th Gen Intel Core i7-14700HX, NVIDIA GeForce RTX 4070 8GB GPU with 140W max TGP, 16-inch 240Hz WQXGA display, and dual 5th Gen AeroBlade 3D metal fans.",
    price: 199999,
    discountPrice: 174999,
    category: "Laptops",
    subcategory: "Gaming Laptops",
    brand: "Acer",
    stock: 14,
    ratings: 4.8,
    numReviews: 215,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Processor", value: "14th Gen Intel Core i7-14700HX (20 cores, 28 threads)" },
      { key: "GPU", value: "NVIDIA GeForce RTX 4070 8GB GDDR6 (140W MGP)" },
      { key: "Display", value: "16-inch WQXGA (2560x1600) IPS 240Hz 3ms 500 nits 100% DCI-P3" }
    ],
    tags: ["acer", "predator", "gaming laptop", "rtx 4070", "laptop"]
  },
  {
    name: "Apple MacBook Air 13\" (M2 Chip, 8GB RAM, 256GB SSD - Starlight)",
    slug: "apple-macbook-air-13-m2-starlight",
    description: "Strikingly thin and fast Apple MacBook Air 13.6-inch with M2 chip, silent fanless aluminum unibody, Liquid Retina display supporting 1 billion colors, 1080p FaceTime HD camera, and MagSafe 3 charging port.",
    price: 114900,
    discountPrice: 94900,
    category: "Laptops",
    subcategory: "Laptops",
    brand: "Apple",
    stock: 22,
    ratings: 4.8,
    numReviews: 760,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Chip", value: "Apple M2 with 8-core CPU and 8-core GPU" },
      { key: "Battery Life", value: "Up to 18 hours Apple TV app movie playback" },
      { key: "Display", value: "13.6-inch Liquid Retina LED-backlit display with True Tone" }
    ],
    tags: ["macbook", "apple", "macbook air", "laptop", "m2"]
  },
  {
    name: "ASUS ROG Zephyrus G14 (AMD Ryzen 9, RTX 4060, 16GB/1TB, 120Hz OLED)",
    slug: "asus-rog-zephyrus-g14-oled",
    description: "ASUS ROG Zephyrus G14 ultra-slim gaming powerhouse with CNC aluminum unibody and Slash Lighting on the lid. AMD Ryzen 9 8945HS with AI, NVIDIA GeForce RTX 4060, and 3K 120Hz OLED ROG Nebula display.",
    price: 184990,
    discountPrice: 164990,
    category: "Laptops",
    subcategory: "Gaming Laptops",
    brand: "ASUS",
    stock: 12,
    ratings: 4.9,
    numReviews: 310,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Processor", value: "AMD Ryzen 9 8945HS (8 cores, 16 threads, 5.2GHz)" },
      { key: "Display", value: "14-inch 3K (2880 x 1800) OLED 120Hz 0.2ms 500 nits G-SYNC" },
      { key: "Weight", value: "1.50 kg ultralight gaming chassis" }
    ],
    tags: ["asus", "rog", "zephyrus", "gaming laptop", "laptop"]
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // 3. GAMING (Consoles, Peripherals, Accessories)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    name: "Sony PlayStation 5 Slim Console (Disc Edition with DualSense Wireless Controller)",
    slug: "sony-playstation-5-slim-disc-edition",
    description: "Sony PlayStation 5 Slim Disc Edition gaming console with 1TB ultra-high speed SSD, ray tracing, 4K-TV gaming at up to 120fps with 120Hz output, HDR technology, and Tempest 3D AudioTech.",
    price: 54990,
    discountPrice: 49990,
    category: "Gaming",
    subcategory: "Consoles",
    brand: "Sony",
    stock: 18,
    ratings: 4.9,
    numReviews: 950,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592840496073-e53ba215bf2b?w=800&auto=format&fit=crop&q=80"
    ],
    specifications: [
      { key: "Storage", value: "Custom 1TB NVMe PCIe 4.0 SSD (5.5 GB/s read)" },
      { key: "Output", value: "Supports 4K 120Hz TVs, 8K TVs, and VRR (HDMI 2.1)" },
      { key: "Audio", value: "Tempest 3D AudioTech engine" }
    ],
    tags: ["ps5", "playstation", "gaming console", "sony", "gaming"]
  },
  {
    name: "Microsoft Xbox Series X 1TB Gaming Console (True 4K Gaming, 120 FPS)",
    slug: "microsoft-xbox-series-x-1tb",
    description: "Microsoft Xbox Series X fastest, most powerful Xbox ever. Powered by Xbox Velocity Architecture, 12 teraflops of raw graphic processing power, DirectX ray tracing, and 4K gaming at up to 120 FPS.",
    price: 55990,
    discountPrice: 49990,
    category: "Gaming",
    subcategory: "Consoles",
    brand: "Microsoft",
    stock: 15,
    ratings: 4.8,
    numReviews: 420,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "GPU", value: "12 TFLOPS, 52 CUs @ 1.825 GHz Custom RDNA 2" },
      { key: "Memory", value: "16GB GDDR6 with 320-bit wide bus" },
      { key: "Backward Compatibility", value: "Thousands of games across 4 generations of Xbox" }
    ],
    tags: ["xbox", "xbox series x", "microsoft", "gaming console", "gaming"]
  },
  {
    name: "Sony DualSense Wireless Controller for PlayStation 5 (Midnight Black)",
    slug: "sony-dualsense-wireless-controller-midnight-black",
    description: "Sony DualSense wireless controller for PS5 offering immersive haptic feedback, dynamic adaptive triggers with varying force levels, built-in microphone, and integrated speaker.",
    price: 6390,
    discountPrice: 5490,
    category: "Gaming",
    subcategory: "Controllers",
    brand: "Sony",
    stock: 35,
    ratings: 4.8,
    numReviews: 870,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1592840496073-e53ba215bf2b?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1592840496073-e53ba215bf2b?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Feedback", value: "Haptic feedback with dual actuators" },
      { key: "Triggers", value: "Dynamic adaptive triggers with resistance" },
      { key: "Connectivity", value: "Bluetooth 5.1 & USB-C wired mode" }
    ],
    tags: ["controller", "dualsense", "playstation", "ps5", "gaming"]
  },
  {
    name: "Razer Huntsman V2 Optical Gaming Keyboard with RGB Chroma",
    slug: "razer-huntsman-v2-optical-gaming-keyboard",
    description: "Razer Huntsman V2 optical gaming keyboard with near-zero input latency, Razer Linear Optical Switches Gen-2, sound dampening foam, Doubleshot PBT keycaps, and plush ergonomic leatherette wrist rest.",
    price: 16999,
    discountPrice: 13499,
    category: "Gaming",
    subcategory: "Keyboards",
    brand: "Razer",
    stock: 22,
    ratings: 4.7,
    numReviews: 310,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Switch Type", value: "Razer Linear Optical Gen-2 (0.2ms response)" },
      { key: "Polling Rate", value: "True 8000Hz HyperPolling" },
      { key: "Keycaps", value: "Doubleshot PBT Anti-Fade keycaps" }
    ],
    tags: ["keyboard", "razer", "optical keyboard", "rgb", "gaming"]
  },
  {
    name: "Logitech G502 X PLUS LIGHTSPEED Wireless RGB Gaming Mouse",
    slug: "logitech-g502-x-plus-lightspeed-mouse",
    description: "Logitech G502 X PLUS wireless RGB gaming mouse with LIGHTFORCE hybrid optical-mechanical switches, HERO 25K sub-micron sensor, customizable LIGHTSYNC 8-zone RGB, and up to 120 hours battery life.",
    price: 15495,
    discountPrice: 12995,
    category: "Gaming",
    subcategory: "Mice",
    brand: "Logitech",
    stock: 28,
    ratings: 4.9,
    numReviews: 520,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Sensor", value: "HERO 25K Sensor (100 - 25,600 DPI, 400 IPS)" },
      { key: "Battery", value: "Up to 120 hours wireless (37 hours with RGB active)" },
      { key: "Weight", value: "106 grams lightweight honeycomb-free frame" }
    ],
    tags: ["mouse", "logitech", "g502", "gaming mouse", "lightspeed"]
  },
  {
    name: "SteelSeries Arctis Nova Pro Wireless Multi-System Gaming Headset",
    slug: "steelseries-arctis-nova-pro-wireless-headset",
    description: "SteelSeries Arctis Nova Pro Wireless gaming headset with Almighty Audio, Active Noise Cancellation, Infinity Power dual-battery swap system, and simultaneous 2.4GHz gaming audio + Bluetooth.",
    price: 37999,
    discountPrice: 31999,
    category: "Gaming",
    subcategory: "Headsets",
    brand: "SteelSeries",
    stock: 12,
    ratings: 4.8,
    numReviews: 165,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1599669454699-248893623440?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Drivers", value: "High Fidelity 40mm Neodymium Drivers (10-40,000 Hz)" },
      { key: "ANC", value: "4-mic hybrid active noise cancelling with transparency mode" },
      { key: "Battery", value: "Dual battery hot-swap system (44 hours total runtime)" }
    ],
    tags: ["headset", "steelseries", "arctis nova", "gaming audio", "wireless"]
  },
  {
    name: "Samsung Odyssey G7 32\" Curved 240Hz QLED Gaming Monitor",
    slug: "samsung-odyssey-g7-32-curved-monitor",
    description: "Samsung Odyssey G7 32-inch 1000R curved gaming monitor with WQHD (2560x1440) resolution, blazing 240Hz refresh rate, 1ms response time, Quantum Dot QLED technology, and NVIDIA G-Sync compatible.",
    price: 54999,
    discountPrice: 46999,
    category: "Gaming",
    subcategory: "Monitors",
    brand: "Samsung",
    stock: 10,
    ratings: 4.8,
    numReviews: 240,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Curvature", value: "1000R Deep Curve matching human eye field of view" },
      { key: "Panel & Speed", value: "WQHD VA Panel, 240Hz refresh rate, 1ms (GtG) response" },
      { key: "HDR", value: "VESA DisplayHDR 600 with Quantum Dot color" }
    ],
    tags: ["monitor", "samsung", "odyssey g7", "gaming monitor", "240hz"]
  },
  {
    name: "Secretlab TITAN Evo Ergonomic Gaming Chair (SoftWeave Plus - Stealth)",
    slug: "secretlab-titan-evo-gaming-chair",
    description: "Secretlab TITAN Evo ergonomic esports gaming chair featuring proprietary SoftWeave Plus fabric, 4-way L-ADAPT lumbar support system, magnetic memory foam head pillow, and full-metal 4D armrests.",
    price: 49999,
    discountPrice: 42999,
    category: "Gaming",
    subcategory: "Gaming Chairs",
    brand: "Secretlab",
    stock: 14,
    ratings: 4.9,
    numReviews: 480,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Upholstery", value: "Secretlab SoftWeave Plus Fabric (breathable, 3.5x stronger)" },
      { key: "Lumbar Support", value: "4-way L-ADAPT lumbar system flexing with your spine" },
      { key: "Recline", value: "165-degree full-length recline with multi-tilt mechanism" }
    ],
    tags: ["chair", "gaming chair", "secretlab", "ergonomic", "gaming"]
  },
  {
    name: "Elgato Stream Deck MK.2 Studio Controller (15 Customisable LCD Keys)",
    slug: "elgato-stream-deck-mk2-controller",
    description: "Elgato Stream Deck MK.2 broadcast and gaming interface featuring 15 customizable tactile LCD keys to trigger actions in OBS, Twitch, YouTube, Discord, Spotify, and launch custom gaming macros.",
    price: 15999,
    discountPrice: 13499,
    category: "Gaming",
    subcategory: "Accessories",
    brand: "Elgato",
    stock: 25,
    ratings: 4.8,
    numReviews: 360,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Keys", value: "15 customizable tactile color LCD keys" },
      { key: "Interchangeable Faceplate", value: "Detachable magnetic faceplate and 45-degree desktop stand" },
      { key: "Software", value: "Stream Deck store with hundreds of plugins and icons" }
    ],
    tags: ["stream deck", "elgato", "streaming", "gaming accessory", "gaming"]
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // 4. FASHION
  // ══════════════════════════════════════════════════════════════════════════════
  {
    name: "Levi's Classic Trucker Denim Jacket in Vintage Washed Indigo",
    slug: "levis-classic-trucker-denim-jacket",
    description: "Authentic Levi's Trucker Jacket crafted with 100% non-stretch cotton denim, button-flap chest pockets, welt hand pockets, side hem adjusters, and iconic red tab. A timeless wardrobe staple since 1967.",
    price: 6599,
    discountPrice: 4999,
    category: "Fashion",
    subcategory: "Jackets",
    brand: "Levi's",
    stock: 26,
    ratings: 4.8,
    numReviews: 440,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Material", value: "100% Premium Heavyweight Cotton Denim" },
      { key: "Fit", value: "Standard regular fit hitting at the hip" },
      { key: "Closure", value: "Branded metal shank buttons" }
    ],
    tags: ["jacket", "denim", "levis", "fashion", "mens fashion"]
  },
  {
    name: "Ralph Lauren Men's Classic Fit Oxford Cotton Button-Down Shirt",
    slug: "ralph-lauren-classic-oxford-shirt",
    description: "Polo Ralph Lauren timeless Oxford shirt woven from premium breathable yarn-dyed cotton with button-down point collar, box-pleated back yoke for comfort, and signature multicolored embroidered Pony logo on chest.",
    price: 9990,
    discountPrice: 7990,
    category: "Fashion",
    subcategory: "Shirts",
    brand: "Ralph Lauren",
    stock: 20,
    ratings: 4.9,
    numReviews: 290,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Fabric", value: "100% Long-staple Combed Oxford Cotton" },
      { key: "Collar", value: "Button-down point collar" },
      { key: "Care", value: "Machine washable, wrinkle-resistant finish" }
    ],
    tags: ["shirt", "oxford shirt", "ralph lauren", "formal", "casual shirt"]
  },
  {
    name: "Premium Organic Cotton Crewneck Heavyweight T-Shirt (Pack of 3)",
    slug: "premium-organic-cotton-crewneck-tshirt-pack3",
    description: "Set of 3 heavyweight 220 GSM 100% combed organic cotton crewneck t-shirts in classic Black, White, and Heather Charcoal. Pre-shrunk with ribbed neck collar and twin-needle stitched hems.",
    price: 2999,
    discountPrice: 1999,
    category: "Fashion",
    subcategory: "T-shirts",
    brand: "ShopNest Fashion",
    stock: 45,
    ratings: 4.7,
    numReviews: 680,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "GSM", value: "220 GSM Heavyweight bio-washed jersey" },
      { key: "Material", value: "100% GOTS-certified Organic Cotton" },
      { key: "Package", value: "3 T-Shirts (Black, White, Heather Charcoal)" }
    ],
    tags: ["t-shirt", "tshirt", "cotton", "pack of 3", "mens clothing"]
  },
  {
    name: "Zara Floral Print Tiered Maxi Dress with Belt Detail",
    slug: "zara-floral-print-tiered-maxi-dress",
    description: "Flowing bohemian maxi dress featuring botanical floral print, tiered ruffle hemline, flattering V-neckline with self-tie belt, long peasant sleeves with elastic cuffs, and soft inner lining.",
    price: 5990,
    discountPrice: 4490,
    category: "Fashion",
    subcategory: "Dresses",
    brand: "Zara",
    stock: 18,
    ratings: 4.8,
    numReviews: 215,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Fabric", value: "100% Flowing Viscose Chiffon with soft lining" },
      { key: "Length", value: "Full maxi length (ankle graze)" },
      { key: "Occasion", value: "Brunches, garden weddings, and resort wear" }
    ],
    tags: ["dress", "maxi dress", "floral dress", "womens wear", "zara"]
  },
  {
    name: "Levi's 511 Slim Fit Stretch Denim Jeans (Dark Indigo Rinse)",
    slug: "levis-511-slim-fit-stretch-jeans",
    description: "Modern slim jeans with room to move, cut from premium stretch denim with signature 5-pocket styling, zip fly with button closure, and iconic Arcuate stitching on back pockets.",
    price: 4599,
    discountPrice: 3499,
    category: "Fashion",
    subcategory: "Jeans",
    brand: "Levi's",
    stock: 35,
    ratings: 4.7,
    numReviews: 530,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Cut", value: "511 Slim Fit (slim from hip to ankle)" },
      { key: "Stretch", value: "99% Cotton, 1% Elastane with Levi's Flex" },
      { key: "Leg Opening", value: "14.5 inch slim leg opening" }
    ],
    tags: ["jeans", "denim", "levis 511", "pants", "fashion"]
  },
  {
    name: "Nike Club Fleece Heavyweight Pullover Hoodie (Heather Grey)",
    slug: "nike-club-fleece-pullover-hoodie",
    description: "Classic Nike Club Fleece hoodie made from brushed-back fleece for a smooth outside and cozy inside. Features kangaroo pocket, drawstring-adjustable hood, and embroidered Futura logo on chest.",
    price: 4295,
    discountPrice: 3495,
    category: "Fashion",
    subcategory: "Hoodies",
    brand: "Nike",
    stock: 28,
    ratings: 4.8,
    numReviews: 610,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Material", value: "80% Cotton, 20% Polyester Brushed Fleece" },
      { key: "Features", value: "Drawcord hood, ribbed cuffs and hem, kangaroo pocket" },
      { key: "Fit", value: "Standard relaxed comfort fit" }
    ],
    tags: ["hoodie", "nike", "sweatshirt", "fleece", "sportswear"]
  },
  {
    name: "Fabindia Handcrafted Silk Embroidered Kurta Set with Dupatta",
    slug: "fabindia-silk-embroidered-kurta-set",
    description: "Exquisite Chanderi silk straight kurta set featuring delicate Zari thread embroidery, Mandarin neck, matching cigarette trousers with elasticated waistband, and sheer organza dupatta.",
    price: 8990,
    discountPrice: 6990,
    category: "Fashion",
    subcategory: "Traditional wear",
    brand: "Fabindia",
    stock: 14,
    ratings: 4.9,
    numReviews: 180,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Weave", value: "Handwoven Chanderi Silk Blend" },
      { key: "Set Contains", value: "Kurta, Trousers, and Embroidered Organza Dupatta" },
      { key: "Work", value: "Artisanal Zari and Resham Thread Embroidery" }
    ],
    tags: ["kurta", "traditional wear", "ethnic", "fabindia", "womens ethnic"]
  },
  {
    name: "Manyavar Royal Jacquard Sherwani with Stole for Men",
    slug: "manyavar-royal-jacquard-sherwani-set",
    description: "Regal ivory and gold brocade woven silk sherwani adorned with embellished metallic buttons, paired with matching churidar trousers and contrast maroon tissue stole.",
    price: 18999,
    discountPrice: 15499,
    category: "Fashion",
    subcategory: "Traditional wear",
    brand: "Manyavar",
    stock: 10,
    ratings: 4.9,
    numReviews: 120,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Fabric", value: "Brocade Silk Jacquard with cotton inner lining" },
      { key: "Set Details", value: "Sherwani, matching churidar, and contrast royal stole" },
      { key: "Occasion", value: "Weddings, festive receptions, and groom wear" }
    ],
    tags: ["sherwani", "manyavar", "traditional wear", "wedding", "mens ethnic"]
  },
  {
    name: "H&M Double-Breasted Tailored Wool Blend Overcoat (Camel)",
    slug: "hm-double-breasted-wool-blend-overcoat",
    description: "Structured double-breasted calf-length overcoat in warm camel wool blend with notched lapels, front welt pockets, back vent for ease of motion, and silky satin interior lining.",
    price: 9999,
    discountPrice: 7999,
    category: "Fashion",
    subcategory: "Jackets",
    brand: "H&M",
    stock: 15,
    ratings: 4.7,
    numReviews: 240,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Composition", value: "60% Recycled Wool, 35% Polyester, 5% Polyamide" },
      { key: "Cut", value: "Tailored longline double-breasted silhouette" },
      { key: "Pockets", value: "Two flap front pockets, one interior chest pocket" }
    ],
    tags: ["overcoat", "coat", "wool coat", "winter fashion", "hm"]
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // 5. FOOTWEAR
  // ══════════════════════════════════════════════════════════════════════════════
  {
    name: "Nike Air Jordan 1 Retro High OG Sneaker (Chicago Colorway)",
    slug: "nike-air-jordan-1-retro-high-og-chicago",
    description: "The iconic Air Jordan 1 Retro High OG constructed with genuine leather upper in the coveted Chicago Varsity Red/White/Black color blocking, encapsulated Air-Sole unit in heel, and solid rubber traction outsole.",
    price: 17995,
    discountPrice: 15995,
    category: "Footwear",
    subcategory: "Casual sneakers",
    brand: "Nike",
    stock: 16,
    ratings: 4.9,
    numReviews: 920,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Upper", value: "Full-grain genuine leather with perforated toe box" },
      { key: "Cushioning", value: "Encapsulated Nike Air-Sole unit in heel" },
      { key: "Outsole", value: "Durable cupsole with deep flex grooves and pivot ring" }
    ],
    tags: ["sneakers", "jordan", "air jordan 1", "nike", "footwear"]
  },
  {
    name: "Nike Air Zoom Pegasus 40 Men's Road Running Shoes",
    slug: "nike-air-zoom-pegasus-40-running-shoes",
    description: "Nike Pegasus 40 responsive daily trainer featuring dual Zoom Air units in forefoot and heel, engineered single-layer mesh upper for optimal breathability, and durable waffle-inspired rubber outsole.",
    price: 10495,
    discountPrice: 8495,
    category: "Footwear",
    subcategory: "Running shoes",
    brand: "Nike",
    stock: 25,
    ratings: 4.8,
    numReviews: 680,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Cushioning", value: "Nike React technology foam with dual Zoom Air units" },
      { key: "Offset", value: "10mm heel-to-toe drop (neutral runner)" },
      { key: "Weight", value: "288g (Men's size 9)" }
    ],
    tags: ["running shoes", "nike pegasus", "nike", "sneakers", "sports shoes"]
  },
  {
    name: "Adidas Ultraboost Light Performance Running Shoes (Core Black)",
    slug: "adidas-ultraboost-light-running-shoes",
    description: "Experience epic energy return with the lightest Ultraboost ever made. Features 30% lighter Light BOOST midsole foam, PRIMEKNIT+ forged upper providing snug sock-like fit, and Continental Better Rubber outsole.",
    price: 18999,
    discountPrice: 14999,
    category: "Footwear",
    subcategory: "Running shoes",
    brand: "Adidas",
    stock: 20,
    ratings: 4.8,
    numReviews: 440,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Midsole", value: "Light BOOST foam (highest energy return)" },
      { key: "Upper", value: "Adidas PRIMEKNIT+ textile containing 50% Parley Ocean Plastic" },
      { key: "Traction", value: "Continental Better Rubber outsole" }
    ],
    tags: ["adidas", "ultraboost", "running shoes", "boost", "footwear"]
  },
  {
    name: "Puma RS-X Reinvention Chunky Casual Sneakers (White & Blue)",
    slug: "puma-rs-x-reinvention-chunky-sneakers",
    description: "Retro-futuristic RS-X silhouette rebooted with chunky 80s aesthetic, breathable mesh upper with suede and synthetic leather overlays, and signature Running System cushioning technology in the midsole.",
    price: 8999,
    discountPrice: 6299,
    category: "Footwear",
    subcategory: "Casual sneakers",
    brand: "Puma",
    stock: 22,
    ratings: 4.7,
    numReviews: 350,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Cushioning", value: "Puma Running System (RS) retro cushioning" },
      { key: "Upper", value: "Multi-layered mesh, suede, and leather" },
      { key: "Style", value: "Bold chunky retro dad shoe silhouette" }
    ],
    tags: ["puma", "rs-x", "sneakers", "chunky sneakers", "casual shoes"]
  },
  {
    name: "Clarks Handcrafted Leather Oxford Formal Derby Shoes (Dark Tan)",
    slug: "clarks-leather-formal-derby-shoes",
    description: "Handcrafted full-grain British calf leather Derby formal shoes with Goodyear welt construction, cushioned OrthoLite high-density foam footbed, leather lining, and stacked wooden dress heel.",
    price: 7999,
    discountPrice: 5999,
    category: "Footwear",
    subcategory: "Formal shoes",
    brand: "Clarks",
    stock: 18,
    ratings: 4.8,
    numReviews: 290,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1614253429340-98120bd6d753?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1614253429340-98120bd6d753?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Leather", value: "100% Full-grain burnished calf leather" },
      { key: "Footbed", value: "Cushioned OrthoLite dual-density comfort footbed" },
      { key: "Occasion", value: "Formal meetings, weddings, and business suits" }
    ],
    tags: ["formal shoes", "derby", "oxford shoes", "clarks", "leather shoes"]
  },
  {
    name: "Adidas Stan Smith Classic Leather Tennis Shoes (White/Green)",
    slug: "adidas-stan-smith-classic-leather-shoes",
    description: "Clean minimalist court style since 1971 with smooth leather upper, perforated 3-Stripes, Stan Smith tongue portrait, contrast green heel tab, and durable rubber cupsole.",
    price: 7999,
    discountPrice: 5999,
    category: "Footwear",
    subcategory: "Casual sneakers",
    brand: "Adidas",
    stock: 30,
    ratings: 4.7,
    numReviews: 810,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Upper", value: "Synthetic Primegreen leather with 50% recycled materials" },
      { key: "Closure", value: "Lace closure with reinforced eyelets" },
      { key: "Sole", value: "Timeless cupsole with herringbone grip pattern" }
    ],
    tags: ["stan smith", "adidas", "white sneakers", "casual shoes", "sneakers"]
  },
  {
    name: "Steve Madden Stecy Ankle-Strap Dress Heeled Sandals for Women",
    slug: "steve-madden-stecy-heeled-sandals",
    description: "Glamorous strappy stiletto evening sandals with delicate single toe band, buckle ankle strap, slender 3.9-inch heel, and cushioned footbed designed for cocktail nights and formal occasions.",
    price: 8999,
    discountPrice: 6999,
    category: "Footwear",
    subcategory: "Women's footwear",
    brand: "Steve Madden",
    stock: 14,
    ratings: 4.8,
    numReviews: 190,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Heel Height", value: "3.9 inch slender stiletto heel" },
      { key: "Closure", value: "Adjustable buckle strap around ankle" },
      { key: "Material", value: "Smooth vegan leather upper with synthetic sole" }
    ],
    tags: ["heels", "sandals", "steve madden", "womens footwear", "party wear"]
  },
  {
    name: "Birkenstock Arizona Two-Strap Leather Comfort Sandals (Mocha)",
    slug: "birkenstock-arizona-two-strap-sandals",
    description: "Legendary German orthopedic slide sandal with genuine oiled nubuck leather straps, dual adjustable metal pin buckles, and anatomical cork-latex footbed lined with breathable suede.",
    price: 8990,
    discountPrice: 7490,
    category: "Footwear",
    subcategory: "Sandals and slippers",
    brand: "Birkenstock",
    stock: 26,
    ratings: 4.9,
    numReviews: 540,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Footbed", value: "Anatomically shaped original cork-latex footbed" },
      { key: "Straps", value: "Oiled nubuck leather with individual buckle adjustment" },
      { key: "Sole", value: "Lightweight shock-absorbing EVA sole" }
    ],
    tags: ["birkenstock", "sandals", "slippers", "comfort footwear", "shoes"]
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // 6. WATCHES
  // ══════════════════════════════════════════════════════════════════════════════
  {
    name: "Apple Watch Series 9 GPS + Cellular 45mm (Midnight Aluminum Case)",
    slug: "apple-watch-series-9-gps-cellular-45mm",
    description: "Apple Watch Series 9 with powerful S9 SiP, magic Double Tap gesture control, brighter 2000-nit Always-On Retina display, advanced ECG app, Blood Oxygen sensor, sleep stages, and precision iPhone finding.",
    price: 44900,
    discountPrice: 41900,
    category: "Watches",
    subcategory: "Smartwatches",
    brand: "Apple",
    stock: 20,
    ratings: 4.9,
    numReviews: 780,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Display", value: "Always-On Retina OLED (up to 2000 nits, down to 1 nit)" },
      { key: "Processor", value: "S9 SiP 64-bit dual-core processor with 4-core Neural Engine" },
      { key: "Water Resistance", value: "50m swimproof (ISO standard 22810:2010)" }
    ],
    tags: ["apple watch", "smartwatch", "apple", "fitness tracker", "watches"]
  },
  {
    name: "Samsung Galaxy Watch6 Classic 47mm Bluetooth (Stainless Steel Silver)",
    slug: "samsung-galaxy-watch-6-classic-47mm",
    description: "Samsung Galaxy Watch6 Classic featuring iconic rotating physical bezel, scratch-resistant sapphire crystal glass, BioActive 3-in-1 sensor, body composition BIA analysis, advanced sleep coaching, and Wear OS.",
    price: 39999,
    discountPrice: 34999,
    category: "Watches",
    subcategory: "Smartwatches",
    brand: "Samsung",
    stock: 16,
    ratings: 4.8,
    numReviews: 430,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Bezel", value: "Physical rotating bezel with tactile click" },
      { key: "Display", value: "1.5-inch Super AMOLED (480x480) with Sapphire Crystal" },
      { key: "Sensors", value: "Optical Heart Rate + Electrical Heart (ECG) + BIA Body Composition" }
    ],
    tags: ["samsung", "galaxy watch", "smartwatch", "wear os", "watches"]
  },
  {
    name: "Fossil Grant Chronograph Leather Strap Men's Analog Watch",
    slug: "fossil-grant-chronograph-leather-watch",
    description: "Vintage-inspired Roman numeral chronograph timepiece featuring 44mm stainless steel case, blue sunray dial with luminous hands, stop-watch sub-dials, and genuine supple brown leather strap.",
    price: 12995,
    discountPrice: 8995,
    category: "Watches",
    subcategory: "Analog watches",
    brand: "Fossil",
    stock: 24,
    ratings: 4.7,
    numReviews: 610,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Movement", value: "Quartz Chronograph with 24-hour, 30-min, 60-sec sub-dials" },
      { key: "Case Size", value: "44mm stainless steel case (12mm thickness)" },
      { key: "Water Resistance", value: "5 ATM (50 meters)" }
    ],
    tags: ["fossil", "chronograph", "analog watch", "leather watch", "mens watch"]
  },
  {
    name: "Casio G-Shock GA-2100 Carbon Core Guard Tough Solar Digital-Analog Watch",
    slug: "casio-g-shock-ga-2100-casiOak",
    description: "The iconic 'CasiOak' octagonal bezel watch with carbon-reinforced resin core guard structure, dual digital-analog display, 200-meter water resistance, double LED light, and legendary G-Shock shock resistance.",
    price: 9995,
    discountPrice: 7995,
    category: "Watches",
    subcategory: "Digital watches",
    brand: "Casio",
    stock: 35,
    ratings: 4.9,
    numReviews: 890,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Structure", value: "Carbon Core Guard shock-resistant structure" },
      { key: "Water Resistance", value: "200-meter (20 bar) water resistance" },
      { key: "Functions", value: "World time (31 zones), 1/100s stopwatch, 5 daily alarms" }
    ],
    tags: ["g-shock", "casio", "casioak", "digital watch", "sports watch"]
  },
  {
    name: "Michael Kors Parker Rose Gold Stainless Steel Women's Chronograph Watch",
    slug: "michael-kors-parker-rose-gold-watch",
    description: "Opulent 39mm rose gold-tone stainless steel chronograph adorned with sparkling pavé crystal halo bezel, mother-of-pearl dial indices, date display, and polished triple-link bracelet with fold-over clasp.",
    price: 19995,
    discountPrice: 14995,
    category: "Watches",
    subcategory: "Women's watches",
    brand: "Michael Kors",
    stock: 15,
    ratings: 4.8,
    numReviews: 320,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Case", value: "39mm Rose Gold-tone stainless steel with crystal accents" },
      { key: "Dial", value: "Sunray dial with crystal hour markers and date window" },
      { key: "Movement", value: "Multi-function quartz chronograph movement" }
    ],
    tags: ["michael kors", "womens watch", "rose gold", "luxury watch", "watches"]
  },
  {
    name: "Garmin Fenix 7 Solar Multisport GPS Smartwatch with Heart Rate Monitor",
    slug: "garmin-fenix-7-solar-gps-watch",
    description: "Rugged outdoor sports GPS watch with Power Glass solar charging lens, built-in TopoActive maps, wrist-based heart rate, Pulse Ox, Real-Time Stamina tracking, multi-GNSS satellite positioning, and up to 22 days of battery life.",
    price: 74990,
    discountPrice: 64990,
    category: "Watches",
    subcategory: "Sports watches",
    brand: "Garmin",
    stock: 12,
    ratings: 4.9,
    numReviews: 240,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Solar Charging", value: "Power Glass solar charging extending battery up to 22 days" },
      { key: "Navigation", value: "Multi-band GNSS with TopoActive preloaded maps" },
      { key: "Durability", value: "Tested to U.S. military standards (MIL-STD-810)" }
    ],
    tags: ["garmin", "fenix 7", "sports watch", "gps watch", "fitness"]
  },
  {
    name: "Tissot PRX Powermatic 80 Automatic Stainless Steel Blue Dial Watch",
    slug: "tissot-prx-powermatic-80-blue-dial",
    description: "Swiss-made luxury integrated-bracelet sports timepiece with iconic 1978 retro case, embossed waffle-pattern deep blue dial, Nivachron balance spring, date display, and incredible 80-hour power reserve.",
    price: 68500,
    discountPrice: 61500,
    category: "Watches",
    subcategory: "Men's watches",
    brand: "Tissot",
    stock: 14,
    ratings: 4.9,
    numReviews: 380,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Movement", value: "Swiss Made Powermatic 80.111 (80-hour power reserve)" },
      { key: "Crystal", value: "Scratch-resistant sapphire crystal with anti-reflective coating" },
      { key: "Case", value: "316L stainless steel tonneau case (10.9mm thickness)" }
    ],
    tags: ["tissot", "prx", "automatic watch", "swiss made", "luxury watch"]
  },
  {
    name: "Seiko 5 Sports Automatic Mechanical Canvas Strap Watch (Desert Khaki)",
    slug: "seiko-5-sports-automatic-khaki-watch",
    description: "Legendary Japanese automatic field watch powered by Calibre 4R36 with 41-hour power reserve and manual winding capability. Hardlex crystal, Day-Date window, Lumibrite hands, and military canvas strap.",
    price: 25000,
    discountPrice: 21500,
    category: "Watches",
    subcategory: "Men's watches",
    brand: "Seiko",
    stock: 22,
    ratings: 4.8,
    numReviews: 460,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Calibre", value: "Automatic 4R36 with 24 jewels and hacking seconds" },
      { key: "Case Back", value: "See-through exhibition case back" },
      { key: "Lume", value: "Seiko Lumibrite on hands and indexes" }
    ],
    tags: ["seiko", "seiko 5", "automatic watch", "field watch", "watches"]
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // 7. ACCESSORIES
  // ══════════════════════════════════════════════════════════════════════════════
  {
    name: "Sony WH-1000XM5 Wireless Industry-Leading Noise Canceling Headphones",
    slug: "sony-wh-1000xm5-wireless-headphones",
    description: "Industry-leading noise canceling powered by two processors and 8 microphones. Specially designed 30mm carbon driver unit delivers LDAC Hi-Res Wireless audio, 4 beamforming mics for crystal calls, and 30-hour battery.",
    price: 34990,
    discountPrice: 28990,
    category: "Accessories",
    subcategory: "Headphones",
    brand: "Sony",
    stock: 22,
    ratings: 4.9,
    numReviews: 870,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Noise Cancelling", value: "HD Noise Cancelling Processor QN1 + Integrated Processor V1" },
      { key: "Battery Life", value: "30 hours with ANC on (3 mins charge = 3 hours playback)" },
      { key: "Audio Codecs", value: "LDAC, AAC, SBC with DSEE Extreme upscaling" }
    ],
    tags: ["headphones", "sony", "noise cancelling", "accessories", "audio"]
  },
  {
    name: "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)",
    slug: "apple-airpods-pro-2nd-gen-usb-c",
    description: "Apple AirPods Pro featuring the Apple H2 chip, up to 2x more Active Noise Cancellation, Adaptive Audio that seamlessly blends ANC and Transparency, Personalized Spatial Audio with dynamic head tracking, and USB-C MagSafe case.",
    price: 24900,
    discountPrice: 21900,
    category: "Accessories",
    subcategory: "Earbuds",
    brand: "Apple",
    stock: 30,
    ratings: 4.9,
    numReviews: 940,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Chip", value: "Apple H2 headphone chip in earbuds, U1 in MagSafe Case" },
      { key: "Battery", value: "Up to 6 hours listening time (up to 30 hours with case)" },
      { key: "Resistance", value: "IP54 dust, sweat, and water resistant" }
    ],
    tags: ["airpods", "earbuds", "apple", "accessories", "wireless earbuds"]
  },
  {
    name: "Ray-Ban Classic Aviator Polarized Sunglasses (Gold Frame / Green Lens)",
    slug: "ray-ban-classic-aviator-polarized-sunglasses",
    description: "Original 1937 aviator style featuring timeless teardrop gold metal frame, crystal green G-15 polarized lenses eliminating glare, 100% UV400 protection, and soft clear silicone nose pads.",
    price: 10590,
    discountPrice: 8490,
    category: "Accessories",
    subcategory: "Sunglasses",
    brand: "Ray-Ban",
    stock: 25,
    ratings: 4.8,
    numReviews: 530,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Frame", value: "High-grade polished gold steel frame (58mm lens width)" },
      { key: "Lenses", value: "G-15 Polarized crystal mineral glass (UV400)" },
      { key: "Included", value: "Original leatherette case and microfiber cleaning cloth" }
    ],
    tags: ["sunglasses", "ray-ban", "aviator", "polarized", "accessories"]
  },
  {
    name: "The North Face Borealis 28L Everyday Commuter Laptop Backpack (TNF Black)",
    slug: "the-north-face-borealis-laptop-backpack",
    description: "Versatile 28-liter pack featuring the FlexVent suspension system with custom injection-molded shoulder straps, padded mesh back panel, dedicated protective 15-inch fleece-lined laptop compartment, and external bungee cords.",
    price: 8990,
    discountPrice: 7190,
    category: "Accessories",
    subcategory: "Backpacks",
    brand: "The North Face",
    stock: 22,
    ratings: 4.8,
    numReviews: 410,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Capacity", value: "28 Liters (Dimensions: 30.5 cm x 16.5 cm x 49.5 cm)" },
      { key: "Laptop Sleeve", value: "Protective 15-inch compartment (34.9 cm x 28.6 cm)" },
      { key: "Fabric", value: "210D recycled nylon ripstop with non-PFC water-repellent finish" }
    ],
    tags: ["backpack", "the north face", "bag", "laptop bag", "accessories"]
  },
  {
    name: "Coach Pebble Leather Zip-Top Women's Shoulder Tote Handbag (Warm Tan)",
    slug: "coach-pebble-leather-zip-top-tote",
    description: "Signature luxury tote crafted in refined polished pebble leather with secure top-zip closure, inside multifunction cell phone pockets, sturdy 10-inch handle drop, and gold-tone Coach hardware emblem.",
    price: 29500,
    discountPrice: 22900,
    category: "Accessories",
    subcategory: "Handbags",
    brand: "Coach",
    stock: 14,
    ratings: 4.9,
    numReviews: 180,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Material", value: "100% Polished pebble leather with fabric lining" },
      { key: "Dimensions", value: "11.75\" (L) x 10.5\" (H) x 5.5\" (W)" },
      { key: "Handles", value: "Handles with 10\" drop for comfortable shoulder carry" }
    ],
    tags: ["handbag", "coach", "tote bag", "leather bag", "womens accessories"]
  },
  {
    name: "Bellroy Slim Sleeve Bifold Genuine Leather RFID Blocking Wallet (Cocoa)",
    slug: "bellroy-slim-sleeve-leather-wallet",
    description: "Super-slim bifold wallet designed in Australia using environmentally certified premium hides. Holds 4-11 cards, folded banknotes, with 2 quick-access primary card slots and pull-tab for infrequently used cards.",
    price: 5999,
    discountPrice: 4799,
    category: "Accessories",
    subcategory: "Wallets",
    brand: "Bellroy",
    stock: 35,
    ratings: 4.8,
    numReviews: 520,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Dimensions", value: "95mm x 80mm ultra-compact profile" },
      { key: "Protection", value: "RFID blocking lining protecting against card skimming" },
      { key: "Leather", value: "Premium top-grain eco-tanned leather" }
    ],
    tags: ["wallet", "bellroy", "slim wallet", "leather wallet", "mens accessories"]
  },
  {
    name: "Tommy Hilfiger Men's Reversible Genuine Leather Belt with Brushed Buckle",
    slug: "tommy-hilfiger-reversible-leather-belt",
    description: "Versatile 2-in-1 reversible leather belt transitioning effortlessly from rich dark brown to sleek classic black with brushed nickel swivel harness buckle and subtle engraved Tommy Hilfiger flag logo.",
    price: 3499,
    discountPrice: 2499,
    category: "Accessories",
    subcategory: "Belts",
    brand: "Tommy Hilfiger",
    stock: 40,
    ratings: 4.7,
    numReviews: 390,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Leather", value: "100% genuine split leather with smooth feathered edge" },
      { key: "Buckle", value: "Rotational twist buckle mechanism (Black / Dark Brown)" },
      { key: "Width", value: "35mm (1.38 inches standard dress belt)" }
    ],
    tags: ["belt", "leather belt", "tommy hilfiger", "mens accessories", "accessories"]
  },
  {
    name: "Anker Prime 20,000mAh Power Bank (200W Output, 3 Ports, Smart Digital Display)",
    slug: "anker-prime-20000mah-power-bank",
    description: "Ultra-fast 200W total output power bank equipped with two USB-C ports and one USB-A port capable of fast-charging a 16\" MacBook Pro and two phones simultaneously. Smart digital display shows real-time wattage and battery health.",
    price: 12999,
    discountPrice: 9999,
    category: "Accessories",
    subcategory: "Mobile accessories",
    brand: "Anker",
    stock: 25,
    ratings: 4.9,
    numReviews: 440,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Capacity", value: "20,000mAh (airline-approved 72Wh)" },
      { key: "Max Output", value: "200W Total (Up to 100W single port USB-C PD 3.0)" },
      { key: "Display", value: "Smart digital screen displaying real-time V/A/W and remaining time" }
    ],
    tags: ["power bank", "anker", "charger", "mobile accessories", "accessories"]
  },
  {
    name: "Spigen Ultra Hybrid MagFit Clear Case for iPhone 15 Pro",
    slug: "spigen-ultra-hybrid-magfit-case",
    description: "Crystal clear anti-yellowing polycarbonate back with shock-absorbing TPU bumper, Air Cushion Technology for military-grade drop defense, and integrated MagSafe magnet ring for seamless magnetic charging.",
    price: 2499,
    discountPrice: 1799,
    category: "Accessories",
    subcategory: "Mobile accessories",
    brand: "Spigen",
    stock: 50,
    ratings: 4.8,
    numReviews: 720,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80"],
    specifications: [
      { key: "Compatibility", value: "Apple iPhone 15 Pro (supports wireless and MagSafe)" },
      { key: "Protection", value: "Mil-grade certified drop protection with Air Cushion Technology" },
      { key: "Bezel", value: "Raised lips to protect camera lens and OLED screen" }
    ],
    tags: ["case", "iphone case", "spigen", "mobile accessories", "magsafe"]
  }
];

const categoryMetaToSeed = [
  {
    name: "Mobiles",
    slug: "mobiles",
    description: "Flagship 5G smartphones, iPhones, Samsung Galaxy, and mobile devices",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "High-performance MacBooks, ultrabooks, creator laptops, and gaming rigs",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Gaming",
    slug: "gaming",
    description: "Next-gen PS5, Xbox, pro controllers, keyboards, mice, and gaming setups",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Trending apparel, denim jackets, shirts, maxi dresses, hoodies, and ethnic wear",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Footwear",
    slug: "footwear",
    description: "Nike Air Jordans, Pegasus, Ultraboosts, formal Oxfords, and comfort sandals",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Watches",
    slug: "watches",
    description: "Apple Watch, Galaxy Watch, luxury chronographs, G-Shocks, and Swiss timepieces",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Noise-cancelling headphones, AirPods Pro, Ray-Bans, backpacks, and leather wallets",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
  }
];

async function seedCatalog() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await connectDB();
    console.log("Connected to MongoDB Atlas.");

    console.log(`Starting idempotent seed of ${realProductsCatalog.length} real products...`);
    let updatedCount = 0;
    let insertedCount = 0;

    for (const prod of realProductsCatalog) {
      const existing = await Product.findOne({ slug: prod.slug });
      if (existing) {
        await Product.updateOne({ slug: prod.slug }, { $set: prod });
        updatedCount++;
      } else {
        await Product.create(prod);
        insertedCount++;
      }
    }

    console.log(`Products seeded: ${insertedCount} inserted, ${updatedCount} updated.`);

    // Upsert Category entries
    for (const cat of categoryMetaToSeed) {
      const count = await Product.countDocuments({
        category: new RegExp(`^${cat.name}$`, "i")
      });
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        {
          $set: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            image: cat.image,
            itemCount: count,
            isActive: true
          }
        },
        { upsert: true, new: true }
      );
    }
    console.log("Categories catalog metadata updated.");

    // Print breakdown
    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    console.log("=== Atlas Products by Category ===");
    console.log(JSON.stringify(categoryBreakdown, null, 2));

    const total = await Product.countDocuments();
    console.log(`Total Products in Atlas: ${total}`);

    await mongoose.disconnect();
    console.log("MongoDB connection closed cleanly. Seed completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error during catalog seed:", err);
    process.exit(1);
  }
}

seedCatalog();

