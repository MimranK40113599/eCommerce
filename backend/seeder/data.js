// Sample product data for seeding
// Note: Cloudinary URLs are dynamically generated using environment variables
// For local development, you can use placeholder images

const getImageUrl = (publicId) => {
  // Use environment variable for Cloudinary base URL
  const cloudinaryBase =
    process.env.CLOUDINARY_URL ||
    "https://res.cloudinary.com/demo/image/upload";
  return `${cloudinaryBase}/${publicId}`;
};

// Sample user ID - should be replaced with actual user ID after initial seed
// This will be dynamically set during seeding
const ADMIN_USER_ID = "000000000000000000000000"; // Replace with actual admin user ID

export default [
  {
    name: "SanDisk Ultra 128GB SDXC UHS-I Memory Card up to 80MB/s",
    slug: "sandisk-ultra-128gb-sdxc-uhs-i-memory-card",
    price: 45.89,
    description:
      "Ultra-fast cards (2) to take better pictures and Full HD videos (1) with your compact to mid-range point-and-shoot cameras and camcorders. With SanDisk Ultra SDXC UHS-I cards you'll benefit from faster downloads, high capacity, and better performance to capture and store 128GB (5) of high quality pictures and Full HD video (1). Take advantage of ultra-fast read speeds of up to 80MB/s (3) to save time moving photos and videos from the card to your computer. From a leader in flash memory storage, SanDisk Ultra SDXC UHS-I cards are compatible with SDHC and SDXC digital devices, and come with a 10-year limited warranty (6).",
    images: [
      {
        public_id: "shopit/demo/nkkjkta63uiazppzkmjf",
        url: getImageUrl("shopit/demo/nkkjkta63uiazppzkmjf"),
      },
      {
        public_id: "shopit/demo/hz1iwdqzrvxtfxincvju",
        url: getImageUrl("shopit/demo/hz1iwdqzrvxtfxincvju"),
      },
      {
        public_id: "shopit/demo/oc2dvvkxyxukc13y9pjv",
        url: getImageUrl("shopit/demo/oc2dvvkxyxukc13y9pjv"),
      },
    ],
    category: "Electronics",
    seller: "Ebay",
    stock: 50,
    user: ADMIN_USER_ID, // Will be replaced during seeding
    isActive: true,
    discount: 0,
    tags: ["memory card", "storage", "sd card", "camera accessory"],
  },
  {
    name: "CAN USB FD Adapter (GC-CAN-USB-FD)",
    slug: "can-usb-fd-adapter-gc-can-usb-fd",
    price: 315.0,
    description:
      "Monitor a CAN network, write a CAN program and communicate with industrial, medical, automotive or other CAN based device. Connect CAN FD and CAN networks to a computer via USB with the CAN USB FD adapter.",
    images: [
      {
        public_id: "shopit/demo/e3hweb3tbp5zacfi564c",
        url: getImageUrl("shopit/demo/e3hweb3tbp5zacfi564c"),
      },
      {
        public_id: "shopit/demo/mjcc0kg0lzxegrauh8qc",
        url: getImageUrl("shopit/demo/mjcc0kg0lzxegrauh8qc"),
      },
      {
        public_id: "shopit/demo/iruzmpgrhb6xyqheppxg",
        url: getImageUrl("shopit/demo/iruzmpgrhb6xyqheppxg"),
      },
      {
        public_id: "shopit/demo/bj3auijqcxxvkwdohznb",
        url: getImageUrl("shopit/demo/bj3auijqcxxvkwdohznb"),
      },
    ],
    category: "Electronics",
    seller: "Amazon",
    stock: 0, // Out of stock
    user: ADMIN_USER_ID,
    isActive: true,
    discount: 0,
    tags: ["can bus", "adapter", "automotive", "industrial"],
  },
  {
    name: "CHARMOUNT Full Motion TV Wall Mount Swivel",
    slug: "charmount-full-motion-tv-wall-mount-swivel",
    price: 26.99,
    description:
      "CHARMOUNT TV MOUNT UNIVERSAL DESIGN - Has your TV been received? Tilted TV wall mount is for 26 - 55 TVs weight up to 88lbs 40 kg. Our tilt TV mount has a compatible faceplate that fits VESA 75X75mm (3x3). CHARMOUNT TV MOUNT UNIVERSAL DESIGN - Has your TV been received? Tilted TV wall mount is for 26 - 55 TVs weight up to 88lbs 40 kg. Our tilt TV mount has a compatible faceplate that fits VESA 75X75mm (3x3) CHARMOUNT TV MOUNT UNIVERSAL DESIGN - Has your TV been received? Tilted TV wall mount is for 26 - 55 TVs weight up to 88lbs 40 kg. Our tilt TV mount has a compatible faceplate that fits VESA 75X75mm (3x3).",
    images: [
      {
        public_id: "shopit/demo/yqqwxrgst2pi3frtngaw",
        url: getImageUrl("shopit/demo/yqqwxrgst2pi3frtngaw"),
      },
      {
        public_id: "shopit/demo/pgcwny8xyshsnwaiikbm",
        url: getImageUrl("shopit/demo/pgcwny8xyshsnwaiikbm"),
      },
    ],
    category: "Electronics",
    seller: "Amazon",
    stock: 1,
    user: ADMIN_USER_ID,
    isActive: true,
    discount: 0,
    tags: ["tv mount", "wall mount", "swivel mount", "home theater"],
  },
  {
    name: "Bose QuietComfort 35 II Wireless Bluetooth Headphones",
    slug: "bose-quietcomfort-35-ii-wireless-bluetooth-headphones",
    price: 299.0,
    description:
      "What happens when you clear away the noisy distractions of the world? Concentration goes to the next level. You get deeper into your music, your work, or whatever you want to focus on. That's the power of Bose QuietComfort 35 wireless headphones II. Put them on and get closer to what you're most passionate about. And that's just the beginning. QuietComfort 35 wireless headphones II are now enabled with Bose AR",
    images: [
      {
        public_id: "shopit/demo/yxbrklp7snr7dgxfrxu9",
        url: getImageUrl("shopit/demo/yxbrklp7snr7dgxfrxu9"),
      },
      {
        public_id: "shopit/demo/i8ge1ilin2fz9tk2okni",
        url: getImageUrl("shopit/demo/i8ge1ilin2fz9tk2okni"),
      },
    ],
    category: "Headphones",
    seller: "Amazon",
    stock: 11,
    user: ADMIN_USER_ID,
    isActive: true,
    discount: 10, // 10% discount
    tags: ["headphones", "wireless", "bluetooth", "noise cancelling", "bose"],
  },
  {
    name: "Apple AirPods with Charging Case (Wired)",
    slug: "apple-airpods-with-charging-case-wired",
    price: 126.99,
    description:
      "AirPods with Charging Case: More than 24 hours listening time, up to 18 hours talk time; AirPods (single charge): Up to 5 hours listening time, up to 3 hours talk time or 15 minutes in the case equals up to 3 hours listening time or up to 2 hours talk time.",
    images: [
      {
        public_id: "shopit/demo/yj00oalanbzmbzctsbln",
        url: getImageUrl("shopit/demo/yj00oalanbzmbzctsbln"),
      },
      {
        public_id: "shopit/demo/mijzcdd5sle8a2any1i8",
        url: getImageUrl("shopit/demo/mijzcdd5sle8a2any1i8"),
      },
      {
        public_id: "shopit/demo/kxckb0o7fbdwqgmugoct",
        url: getImageUrl("shopit/demo/kxckb0o7fbdwqgmugoct"),
      },
    ],
    category: "Electronics",
    seller: "Amazon",
    stock: 122,
    user: ADMIN_USER_ID,
    isActive: true,
    discount: 0,
    tags: ["airpods", "apple", "wireless", "earbuds", "bluetooth"],
  },
  {
    name: "Cable Boom Microphone - Volume Control for Playstation PS4 or Xbox",
    slug: "cable-boom-microphone-volume-control-playstation-ps4-xbox",
    price: 27.99,
    description:
      "DESIGN INFO - 3.5mm male to 2.5mm male audio cable adapter with Upgraded Flexible, Detachable Boom Mic which also enables rotary Volume Control and Mute Switch. SteelFlex Arm for perfect microphone positioning. INPUT COMPATIBILITY - Devices supporting 3.5mm audio output such as gaming PS4 / Xbox One controller, PC, Laptop, iPhone and Android Phone.",
    images: [
      {
        public_id: "shopit/demo/xmndneguqtrcutpf9wcz",
        url: getImageUrl("shopit/demo/xmndneguqtrcutpf9wcz"),
      },
    ],
    category: "Accessories",
    seller: "Amazon",
    stock: 1123,
    user: ADMIN_USER_ID,
    isActive: true,
    discount: 0,
    tags: ["microphone", "gaming", "ps4", "xbox", "accessory"],
  },
  {
    name: "Nikon D3500 W/ AF-P DX NIKKOR 18-55mm f/3.5-5.6G VR Black",
    slug: "nikon-d3500-af-p-dx-nikkor-18-55mm-vr-black",
    price: 496.95,
    description:
      "You don't need to be a photographer to know a great photo when you see one. And you don't need to be a photographer to take a great photo—you just need the D3500. It's as easy to use as a point-and-shoot, but it takes beautiful DSLR photos and videos that get noticed. It feels outstanding in your hands, sturdy and balanced with controls where you want them. It's compact, durable and versatile, ideal for travel. And it works seamlessly with compatible smartphones, making it easier than ever to share your great photos. Even if you've never picked up a DSLR camera, you can take beautiful pictures with D3500.",
    images: [
      {
        public_id: "shopit/demo/q6ybe84qlkzwet9qwptz",
        url: getImageUrl("shopit/demo/q6ybe84qlkzwet9qwptz"),
      },
      {
        public_id: "shopit/demo/niqqio1faynnscubkkmd",
        url: getImageUrl("shopit/demo/niqqio1faynnscubkkmd"),
      },
      {
        public_id: "shopit/demo/dy3nhjgsdgqcnrwf8u2h",
        url: getImageUrl("shopit/demo/dy3nhjgsdgqcnrwf8u2h"),
      },
    ],
    category: "Cameras",
    seller: "Amazon",
    stock: 131,
    user: ADMIN_USER_ID,
    isActive: true,
    discount: 15, // 15% discount
    tags: ["camera", "dslr", "nikon", "photography", "lens"],
  },
  {
    name: "Apple MacBook Air (13-inch, 8GB RAM, 256GB SSD Storage) - Space Gray",
    slug: "apple-macbook-air-13-inch-8gb-ram-256gb-ssd-space-gray",
    price: 949.99,
    description:
      "Stunning 13.3-inch Retina display with True Tone technology, Backlit Magic Keyboard and Touch ID, Tenth-generation, Intel Core i3 processor, Intel Iris Plus Graphics, Fast SSD storage, 8GB of memory, Stereo speakers with wider stereo sound",
    images: [
      {
        public_id: "shopit/demo/jzqaj98nnhy0hcsilx9y",
        url: getImageUrl("shopit/demo/jzqaj98nnhy0hcsilx9y"),
      },
      {
        public_id: "shopit/demo/welkq4dgfi5267usmj0n",
        url: getImageUrl("shopit/demo/welkq4dgfi5267usmj0n"),
      },
      {
        public_id: "shopit/demo/pabtjloyzenmr6z8klcr",
        url: getImageUrl("shopit/demo/pabtjloyzenmr6z8klcr"),
      },
    ],
    category: "Laptops",
    seller: "Amazon",
    stock: 0, // Out of stock
    user: ADMIN_USER_ID,
    isActive: true,
    discount: 0,
    tags: ["laptop", "apple", "macbook", "retina", "ssd"],
  },
  {
    name: "Kauffman Orchards Homegrown McIntosh Apples",
    slug: "kauffman-orchards-homegrown-mcintosh-apples",
    price: 2.75,
    description:
      "McIntosh is a pretty red/green apple with white flesh Homegrown in Kauffman's orchard in healthy Lancaster County soil McIntosh apples are famous for snacking, pies, salads, and applesauce Protected with soft, high-density foam for safe shipping to your door Not for sale to California, Oregon, or Washington due to state laws governing fresh produce",
    images: [
      {
        public_id: "shopit/demo/mq0zpyzmzqokphs9m9we",
        url: getImageUrl("shopit/demo/mq0zpyzmzqokphs9m9we"),
      },
      {
        public_id: "shopit/demo/pkyy8rifxpesiwpy23kk",
        url: getImageUrl("shopit/demo/pkyy8rifxpesiwpy23kk"),
      },
    ],
    category: "Food",
    seller: "Kauffman's Fruit Farm & Market",
    stock: 500,
    user: ADMIN_USER_ID,
    isActive: true,
    discount: 0,
    tags: ["apples", "fruit", "organic", "farm fresh"],
  },
];
