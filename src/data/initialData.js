export const INITIAL_PRODUCTS = [
  {
    id: 'prod-101',
    name: 'Sony WH-1000XM5 Casque Sans Fil',
    category: 'Audio',
    price: 349.99,
    rating: 4.8,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    description: 'Réduction de bruit active de référence avec processeur V1, 30h d\'autonomie et appels ultra clairs.'
  },
  {
    id: 'prod-102',
    name: 'Logitech MX Master 3S',
    category: 'Périphériques',
    price: 119.00,
    rating: 4.9,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80',
    description: 'Capteur 8000 DPI sur toutes surfaces, clics silencieux et molette MagSpeed ultra-rapide.'
  },
  {
    id: 'prod-103',
    name: 'Keychron K2 V2 Clavier Mécanique',
    category: 'Périphériques',
    price: 99.50,
    rating: 4.7,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
    description: 'Format 75% compact, switches Gateron G Pro Brown, rétroéclairage RGB et connexion Bluetooth 5.1.'
  },
  {
    id: 'prod-104',
    name: 'Dell UltraSharp 27" 4K (U2723QE)',
    category: 'Écrans',
    price: 589.00,
    rating: 4.8,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80',
    description: 'Dalle IPS Black contraste 2000:1, hub USB-C 90W PD, RJ45 et couverture 100% sRGB / 98% DCI-P3.'
  },
  {
    id: 'prod-105',
    name: 'Anker Hub USB-C 7-en-1 PowerExpand',
    category: 'Accessoires',
    price: 49.99,
    rating: 4.6,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=500&auto=format&fit=crop&q=80',
    description: 'Port HDMI 4K@60Hz, alimentation Pass-Through 100W, lecteurs cartes SD/microSD et 2 ports USB-A 5Gbps.'
  },
  {
    id: 'prod-106',
    name: 'Samsung T7 Shield 1 To SSD Portable',
    category: 'Stockage',
    price: 109.90,
    rating: 4.9,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=80',
    description: 'Débits séquentiels jusqu\'à 1050 Mo/s via USB 3.2 Gen 2. Boîtier robuste résistant aux chocs et certifié IP65.'
  }
];

export const INITIAL_USER = {
  id: 'usr-charf-01',
  name: 'Charf Eddine',
  email: 'charf.eddine@gmail.com',
  membership: 'Client Privilège',
  loyaltyPoints: 480,
  initials: 'CE',
  address: {
    street: 'Cité 18 février',
    city: 'Mila',
    zipCode: '4300',
    country: 'Algérie'
  }
};

export const DISCOUNT_CODES = {
  DEV10: 0.10,
  GMC20: 0.20,
  CHARF30: 0.30
};
