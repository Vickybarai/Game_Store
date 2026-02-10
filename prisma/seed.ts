import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function main() {
  console.log('🎮 Seeding database...')

  // Create admin user
  const hashedPassword = await hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gamestore.com' },
    update: {},
    create: {
      email: 'admin@gamestore.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  })
  console.log('✅ Admin user created')

  // Create demo user
  const demoPassword = await hashPassword('user123')
  const user = await prisma.user.upsert({
    where: { email: 'user@gamestore.com' },
    update: {},
    create: {
      email: 'user@gamestore.com',
      password: demoPassword,
      name: 'Demo User',
      role: 'user',
    },
  })
  console.log('✅ Demo user created')

  // Create games
  const games = [
    {
      title: 'Grand Theft Auto VI',
      description: 'The next chapter in the legendary GTA series. Experience the ultimate open-world adventure in Vice City with stunning graphics and immersive gameplay.',
      genre: 'Action',
      platform: 'PC',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      stock: 100,
      releaseDate: new Date('2025-01-20'),
      isFeatured: true,
    },
    {
      title: 'PUBG: Battlegrounds',
      description: 'The original battle royale game. Drop in, gear up, and compete to be the last one standing. Massive maps and intense 100-player matches.',
      genre: 'Action',
      platform: 'PC',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      stock: 150,
      releaseDate: new Date('2023-03-23'),
      isFeatured: true,
    },
    {
      title: 'Fortnite',
      description: 'The free-to-play battle royale sensation. Build, fight, and survive in this constantly evolving world with cross-platform play.',
      genre: 'Action',
      platform: 'PC',
      price: 0,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      stock: 999,
      releaseDate: new Date('2017-07-21'),
      isFeatured: true,
    },
    {
      title: 'Call of Duty: Modern Warfare III',
      description: 'The ultimate modern warfare experience. Epic multiplayer battles, an immersive campaign, and the return of the iconic Zombies mode.',
      genre: 'Action',
      platform: 'PS5',
      price: 69.99,
      discountPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1614726365723-49cfae968604?w=800&q=80',
      stock: 80,
      releaseDate: new Date('2023-11-10'),
      isFeatured: true,
    },
    {
      title: 'FIFA 24 (EA Sports FC 24)',
      description: 'The world\'s game. Experience hyper-realistic gameplay with advanced physics, authentic teams, and ultimate football simulation.',
      genre: 'Sports',
      platform: 'PS5',
      price: 69.99,
      discountPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&q=80',
      stock: 90,
      releaseDate: new Date('2023-09-29'),
      isFeatured: true,
    },
    {
      title: 'Cyber Legends 2077',
      description: 'Explore a dystopian future in this action-packed RPG with stunning visuals and deep storytelling.',
      genre: 'RPG',
      platform: 'PC',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      stock: 50,
      releaseDate: new Date('2024-01-15'),
      isFeatured: true,
    },
    {
      title: 'Space Warfare: Galactic',
      description: 'Command your fleet in epic space battles across the galaxy.',
      genre: 'Action',
      platform: 'PS5',
      price: 69.99,
      discountPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1614726365723-49cfae968604?w=800&q=80',
      stock: 30,
      releaseDate: new Date('2024-02-20'),
      isFeatured: true,
    },
    {
      title: 'Dragon\'s Quest: Eternal',
      description: 'Embark on an epic journey through mystical lands filled with dragons and magic.',
      genre: 'RPG',
      platform: 'Nintendo',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
      stock: 45,
      releaseDate: new Date('2023-12-10'),
      isFeatured: false,
    },
    {
      title: 'Racing Masters Pro',
      description: 'Experience the thrill of professional racing with realistic physics and stunning tracks.',
      genre: 'Racing',
      platform: 'Xbox',
      price: 64.99,
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
      stock: 40,
      releaseDate: new Date('2024-03-01'),
      isFeatured: false,
    },
    {
      title: 'Sports Champions 2024',
      description: 'Compete in various sports with friends in this ultimate sports collection.',
      genre: 'Sports',
      platform: 'PC',
      price: 54.99,
      discountPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&q=80',
      stock: 60,
      releaseDate: new Date('2024-01-20'),
      isFeatured: false,
    },
    {
      title: 'Horror Nights: The Asylum',
      description: 'Survive the terror in this heart-pounding horror game.',
      genre: 'Horror',
      platform: 'PS5',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b9e?w=800&q=80',
      stock: 35,
      releaseDate: new Date('2024-02-15'),
      isFeatured: true,
    },
    {
      title: 'Puzzle Mastermind',
      description: 'Challenge your mind with hundreds of brain-teasing puzzles.',
      genre: 'Puzzle',
      platform: 'Nintendo',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
      stock: 70,
      releaseDate: new Date('2024-01-10'),
      isFeatured: false,
    },
    {
      title: 'Battle Royale Ultimate',
      description: 'Fight to be the last one standing in this intense battle royale.',
      genre: 'Action',
      platform: 'PC',
      price: 0,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      stock: 999,
      releaseDate: new Date('2023-11-01'),
      isFeatured: false,
    },
    {
      title: 'Minecraft',
      description: 'The sandbox game that started it all. Build, explore, and survive in an infinite world of blocks.',
      genre: 'Adventure',
      platform: 'PC',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
      stock: 200,
      releaseDate: new Date('2011-11-18'),
      isFeatured: true,
    },
    {
      title: 'Elden Ring',
      description: 'An expansive action RPG created by FromSoftware and George R.R. Martin. Explore the Lands Between.',
      genre: 'RPG',
      platform: 'PS5',
      price: 59.99,
      discountPrice: 47.99,
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
      stock: 55,
      releaseDate: new Date('2022-02-25'),
      isFeatured: true,
    },
    {
      title: 'Valorant',
      description: 'A 5v5 tactical shooter where creativity is your greatest weapon. Free to play with cross-platform support.',
      genre: 'Action',
      platform: 'PC',
      price: 0,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      stock: 999,
      releaseDate: new Date('2020-06-02'),
      isFeatured: true,
    },
  ]

  for (const game of games) {
    await prisma.game.upsert({
      where: { id: game.title.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        ...game,
        id: game.title.toLowerCase().replace(/\s+/g, '-'),
      },
    })
  }
  console.log(`✅ ${games.length} games created`)

  // Create consoles
  const consoles = [
    {
      name: 'PlayStation 5',
      description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback.',
      specs: 'Custom AMD Ryzen 9 Zen 2, 16GB RAM, 825GB SSD',
      price: 499.99,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c42e?w=800&q=80',
      stock: 20,
      releaseDate: new Date('2020-11-12'),
      isFeatured: true,
    },
    {
      name: 'Xbox Series X',
      description: 'The fastest, most powerful Xbox ever. Play thousands of games with Xbox Game Pass.',
      specs: 'Custom AMD Zen 2, 16GB RAM, 1TB SSD',
      price: 499.99,
      discountPrice: 449.99,
      image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
      stock: 25,
      releaseDate: new Date('2020-11-10'),
      isFeatured: true,
    },
    {
      name: 'Nintendo Switch OLED',
      description: 'Experience the vibrant colors and sharp contrast of the OLED screen.',
      specs: 'NVIDIA Custom Tegra, 4GB RAM, 64GB Storage',
      price: 349.99,
      image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80',
      stock: 30,
      releaseDate: new Date('2021-10-08'),
      isFeatured: true,
    },
    {
      name: 'PlayStation 5 Digital Edition',
      description: 'An all-digital version of the PS5. Ultra-high speed SSD with no disc drive.',
      specs: 'Custom AMD Ryzen 9 Zen 2, 16GB RAM, 825GB SSD',
      price: 449.99,
      discountPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c42e?w=800&q=80',
      stock: 15,
      releaseDate: new Date('2020-11-12'),
      isFeatured: true,
    },
    {
      name: 'Xbox Series S',
      description: 'The next-gen experience in the smallest Xbox ever. All-digital gaming.',
      specs: 'Custom AMD Zen 2, 10GB RAM, 512GB SSD',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
      stock: 35,
      releaseDate: new Date('2020-11-10'),
      isFeatured: true,
    },
    {
      name: 'Nintendo Switch Lite',
      description: 'A compact, lightweight Nintendo Switch dedicated to handheld play.',
      specs: 'NVIDIA Custom Tegra, 4GB RAM, 32GB Storage',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80',
      stock: 40,
      releaseDate: new Date('2019-09-20'),
      isFeatured: false,
    },
    {
      name: 'PlayStation 5 Slim',
      description: 'A leaner, meaner version of PS5. Same power, smaller design.',
      specs: 'Custom AMD Ryzen 9 Zen 2, 16GB RAM, 1TB SSD',
      price: 479.99,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c42e?w=800&q=80',
      stock: 18,
      releaseDate: new Date('2023-11-10'),
      isFeatured: true,
    },
    {
      name: 'Xbox Series X Carbon Black',
      description: 'The powerful Xbox Series X in a stunning carbon black design.',
      specs: 'Custom AMD Zen 2, 16GB RAM, 1TB SSD',
      price: 549.99,
      discountPrice: 499.99,
      image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
      stock: 22,
      releaseDate: new Date('2022-09-15'),
      isFeatured: true,
    },
    {
      name: 'Nintendo Switch Mario Red',
      description: 'Special edition Nintendo Switch in iconic Mario Red.',
      specs: 'NVIDIA Custom Tegra, 4GB RAM, 32GB Storage',
      price: 329.99,
      image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80',
      stock: 25,
      releaseDate: new Date('2021-03-05'),
      isFeatured: false,
    },
    {
      name: 'PlayStation VR2',
      description: 'Immersive virtual reality gaming on PlayStation 5.',
      specs: 'VR Display, 4K HDR, 120Hz',
      price: 549.99,
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd6?w=800&q=80',
      stock: 20,
      releaseDate: new Date('2023-02-22'),
      isFeatured: true,
    },
    {
      name: 'Gaming Controller Pro',
      description: 'Wireless pro controller with programmable buttons and haptic feedback.',
      specs: 'Bluetooth 5.0, 30hr battery, Mechanical switches',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1592840496026-30c844b772e5?w=800&q=80',
      stock: 50,
      releaseDate: new Date('2023-06-15'),
      isFeatured: false,
    },
    // VR Headsets
    {
      name: 'Meta Quest 3',
      description: 'The most advanced VR headset. Mixed reality, 4K+ Infinite Display, and breakthrough performance.',
      specs: 'Snapdragon XR2 Gen 2, 8GB RAM, 128GB Storage, 4K+ Display',
      price: 499.99,
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?w=800&q=80',
      stock: 35,
      releaseDate: new Date('2023-10-10'),
      isFeatured: true,
    },
    {
      name: 'Meta Quest 2',
      description: 'All-in-one VR headset with 128GB storage. Experience immersive gaming and entertainment.',
      specs: 'Snapdragon XR2, 6GB RAM, 128GB Storage, 1832x1920 per eye',
      price: 299.99,
      discountPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80',
      stock: 50,
      releaseDate: new Date('2021-10-13'),
      isFeatured: true,
    },
    {
      name: 'HTC Vive Pro 2',
      description: 'Professional-grade VR headset with stunning 5K resolution and 120Hz refresh rate.',
      specs: '5K Resolution, 120Hz, SteamVR Tracking, 120° FOV',
      price: 799.99,
      image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
      stock: 15,
      releaseDate: new Date('2022-04-05'),
      isFeatured: true,
    },
    {
      name: 'Pico 4 Enterprise',
      description: 'Business-focused VR headset with enterprise-grade features and comfort.',
      specs: 'Snapdragon XR2, 8GB RAM, 512GB Storage, 4K+ Display',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?w=800&q=80',
      stock: 20,
      releaseDate: new Date('2023-01-15'),
      isFeatured: false,
    },
    {
      name: 'Valve Index VR Kit',
      description: 'Premium VR system with high-fidelity tracking and comfortable design.',
      specs: 'Dual 1440x1600 LCD, 120Hz, SteamVR Tracking 2.0',
      price: 999.99,
      discountPrice: 899.99,
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80',
      stock: 18,
      releaseDate: new Date('2020-06-15'),
      isFeatured: true,
    },
    // Driving Simulation Equipment
    {
      name: 'Logitech G29 Driving Force Racing Wheel',
      description: 'Dual-motor force feedback racing wheel with responsive pedals for realistic racing simulation.',
      specs: 'Force Feedback, 900° Rotation, Stainless Steel Paddles, Floor Pedals',
      price: 299.99,
      discountPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      stock: 40,
      releaseDate: new Date('2023-05-01'),
      isFeatured: true,
    },
    {
      name: 'Thrustmaster T248 Racing Wheel',
      description: 'Official PS5 and PC racing wheel with hybrid force feedback and built-in display.',
      specs: 'Hybrid Force Feedback, 900° Rotation, 3 Pedal Set, Magnetic Paddles',
      price: 349.99,
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
      stock: 25,
      releaseDate: new Date('2022-10-15'),
      isFeatured: true,
    },
    {
      name: 'Fanatec CSL DD Direct Drive',
      description: 'Professional direct drive racing wheel system for the ultimate simulation experience.',
      specs: 'Direct Drive 5Nm, Quick Release, Carbon Fiber Wheel, ClubSport Pedals',
      price: 699.99,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      stock: 12,
      releaseDate: new Date('2023-08-20'),
      isFeatured: true,
    },
    {
      name: 'PlaySeat Evolution Gaming Seat',
      description: 'Racing simulation cockpit chair with adjustable frame for maximum comfort.',
      specs: 'Steel Frame, PVC Cover, Adjustable Wheel & Pedal Positions, Compatible with All Wheels',
      price: 449.99,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      stock: 15,
      releaseDate: new Date('2023-03-10'),
      isFeatured: false,
    },
    {
      name: 'Logitech G Pro Pedals',
      description: 'Load cell brake pedal with responsive gas and clutch for precise control.',
      specs: 'Load Cell Brake, Adjustable Gas & Clutch, Stainless Steel Construction',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
      stock: 30,
      releaseDate: new Date('2023-07-01'),
      isFeatured: false,
    },
    {
      name: 'Thrustmaster T-GT II Racing Wheel',
      description: 'Gran Turismo official racing wheel with advanced force feedback technology.',
      specs: '40W Brushless Motor, T-DFB Technology, 1080° Rotation, 3-Pedal Set',
      price: 799.99,
      discountPrice: 699.99,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      stock: 10,
      releaseDate: new Date('2023-11-20'),
      isFeatured: true,
    },
    {
      name: 'Simucube 2 Sport Direct Drive',
      description: 'High-end direct drive wheel base for professional sim racers.',
      specs: 'Direct Drive 8Nm, Industrial Grade Motors, USB Interface, 15Nm Peak',
      price: 1199.99,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      stock: 8,
      releaseDate: new Date('2023-09-01'),
      isFeatured: true,
    },
    // Gaming Accessories
    {
      name: 'SteelSeries Arctis Nova Pro Wireless',
      description: 'Premium wireless gaming headset with simultaneous dual-wireless and Hi-Fi audio.',
      specs: 'Simultaneous Dual-Wireless, Hi-Fi Audio Drivers, Active Noise Cancellation, 30hr Battery',
      price: 349.99,
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
      stock: 45,
      releaseDate: new Date('2022-08-15'),
      isFeatured: true,
    },
    {
      name: 'Razer BlackWidow V4 Pro',
      description: 'Flagship mechanical gaming keyboard with Razer Chroma RGB and wireless connectivity.',
      specs: 'Razer Green Switches, Wireless/Wired, 8,000Hz Polling, Chroma RGB',
      price: 229.99,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=800&q=80',
      stock: 60,
      releaseDate: new Date('2023-01-20'),
      isFeatured: true,
    },
    {
      name: 'Logitech G Pro X Superlight 2',
      description: 'Ultra-lightweight wireless gaming mouse with HERO 2 sensor and 25,600 DPI.',
      specs: 'HERO 2 Sensor, 25,600 DPI, 60g Weight, 120hr Battery',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
      stock: 75,
      releaseDate: new Date('2023-05-15'),
      isFeatured: true,
    },
    {
      name: 'Razer DeathAdder V3 Pro',
      description: 'Ergonomic wireless gaming mouse with Focus Pro 30K optical sensor.',
      specs: 'Focus Pro 30K Sensor, 30,000 DPI, Optical Switches, 90hr Battery',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
      stock: 55,
      releaseDate: new Date('2023-04-01'),
      isFeatured: true,
    },
    {
      name: 'ASUS ROG Swift PG27AQN',
      description: '27-inch 360Hz gaming monitor with NVIDIA G-SYNC and 1ms response time.',
      specs: '27" 360Hz, 2560x1440, 1ms GTG, G-SYNC Compatible, IPS',
      price: 799.99,
      discountPrice: 699.99,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
      stock: 20,
      releaseDate: new Date('2023-03-01'),
      isFeatured: true,
    },
    {
      name: 'Alienware 34 QD-OLED Gaming Monitor',
      description: '34-inch curved QD-OLED gaming monitor with 165Hz refresh rate.',
      specs: '34" QD-OLED, 165Hz, 0.1ms, 3440x1440, 1000R Curved',
      price: 1099.99,
      discountPrice: 999.99,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
      stock: 15,
      releaseDate: new Date('2023-06-20'),
      isFeatured: true,
    },
    {
      name: 'Elgato Stream Deck MK.2',
      description: '15 customizable LCD keys for instant control of streaming and content creation.',
      specs: '15 LCD Keys, Adjustable Stand, Fully Customizable, Plug & Play',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80',
      stock: 50,
      releaseDate: new Date('2023-02-15'),
      isFeatured: false,
    },
    {
      name: 'HyperX Cloud III Wireless',
      description: 'Premium wireless gaming headset with DTS Headphone:X spatial audio.',
      specs: 'DTS Headphone:X, 2.4GHz Wireless, 120hr Battery, 53mm Drivers',
      price: 169.99,
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
      stock: 65,
      releaseDate: new Date('2023-08-10'),
      isFeatured: false,
    },
    {
      name: 'Keychron Q1 Pro Keyboard',
      description: 'Premium wireless mechanical keyboard with aluminum frame and QMK/VIA support.',
      specs: 'Gasket Mount, Bluetooth/2.4G/USB-C, QMK/VIA, RGB Backlight',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=800&q=80',
      stock: 40,
      releaseDate: new Date('2023-09-25'),
      isFeatured: false,
    },
  ]

  for (const console of consoles) {
    await prisma.console.upsert({
      where: { id: console.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        ...console,
        id: console.name.toLowerCase().replace(/\s+/g, '-'),
      },
    })
  }
  console.log(`✅ ${consoles.length} consoles created`)

  // Create tournaments
  const tournaments = [
    {
      title: 'Cyber Legends Championship 2024',
      description: 'Join the ultimate Cyber Legends tournament with $10,000 prize pool!',
      date: new Date('2024-03-15'),
      prize: 10000,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      status: 'upcoming',
      maxParticipants: 64,
    },
    {
      title: 'Space Warfare League',
      description: 'Compete in the Space Warfare league and prove your skills!',
      date: new Date('2024-04-01'),
      prize: 5000,
      image: 'https://images.unsplash.com/photo-1614726365723-49cfae968604?w=800&q=80',
      status: 'upcoming',
      maxParticipants: 32,
    },
    {
      title: 'Racing Masters World Cup',
      description: 'The ultimate racing competition with professional drivers.',
      date: new Date('2024-02-20'),
      prize: 7500,
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
      status: 'ongoing',
      maxParticipants: 48,
    },
  ]

  for (const tournament of tournaments) {
    await prisma.tournament.upsert({
      where: { id: tournament.title.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        ...tournament,
        id: tournament.title.toLowerCase().replace(/\s+/g, '-'),
      },
    })
  }
  console.log(`✅ ${tournaments.length} tournaments created`)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
