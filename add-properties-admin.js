const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin (uses your existing Firebase config)
const serviceAccountPath = path.join(__dirname, 'firebase-admin-key.json');

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (e) {
  console.error('❌ firebase-admin-key.json not found.');
  console.error('Pour ajouter des propriétés, tu dois downloader ta clé d\'admin depuis Firebase Console:');
  console.error('1. Va sur https://console.firebase.google.com');
  console.error('2. Clique Settings ⚙️ → Service Accounts');
  console.error('3. Clique "Generate new private key"');
  console.error('4. Place le JSON dans ce dossier et renomme-le: firebase-admin-key.json');
  process.exit(1);
}

const db = admin.firestore();

const properties = [
  {
    title: "Cocody – Appartement 3 Pièces Meublé",
    type: "LOCATION",
    price: "450.000 FCFA",
    ville: "Abidjan",
    quartier: "Cocody",
    pays: "Côte d'Ivoire",
    chambres: 2,
    salles: 1,
    category: "Appartement 3 Pièces",
    description: "Bel appartement moderne et meublé situé à Cocody. Bien lumineux avec accès à tous les commerces et services.",
    features: "Meublé, Climatisé, WiFi",
    images: ["/images/location-agent.jpg"],
    loyer: "450.000 FCFA"
  },
  {
    title: "Riviera Palmeraie – Villa Duplex 5 Pièces",
    type: "LOCATION",
    price: "1.200.000 FCFA",
    ville: "Abidjan",
    quartier: "Riviera Palmeraie",
    pays: "Côte d'Ivoire",
    chambres: 4,
    salles: 3,
    category: "Villa Duplex 5 Pièces",
    description: "Magnifique villa duplex avec piscine privée. Sécurité 24/24, jardin arborisé et parking spacieux.",
    features: "Piscine, Jardin, Parking, Gardiennage",
    images: ["/images/vente-couple.jpg"],
    loyer: "1.200.000 FCFA"
  },
  {
    title: "Marcory Zone 4 – Villa Basse 4 Pièces",
    type: "LOCATION",
    price: "800.000 FCFA",
    ville: "Abidjan",
    quartier: "Marcory Zone 4",
    pays: "Côte d'Ivoire",
    chambres: 3,
    salles: 2,
    category: "Villa Basse 4 Pièces",
    description: "Villa moderne en zone résidentielle sécurisée. Cadre calme et verdoyant, parfait pour les familles.",
    features: "Jardin, Parking, Sécurité",
    images: ["/images/gestion-hero.jpg"],
    loyer: "800.000 FCFA"
  },
  {
    title: "Grand Bassam Plage – Villa 4 Pièces Vue Mer",
    type: "VENTE",
    price: "125.000.000 FCFA",
    ville: "Grand-Bassam",
    quartier: "Plage",
    pays: "Côte d'Ivoire",
    chambres: 3,
    salles: 2,
    category: "Villa Basse 4 Pièces",
    description: "Villa exclusive à proximité de la plage. Investissement immobilier de prestige avec vue panoramique sur l'océan.",
    features: "Vue mer, Parking, Terrasse",
    images: ["/images/location-hero.jpg"]
  },
  {
    title: "Angré 8e Tranche – Appartement 4 Pièces",
    type: "LOCATION",
    price: "600.000 FCFA",
    ville: "Abidjan",
    quartier: "Angré 8e Tranche",
    pays: "Côte d'Ivoire",
    chambres: 3,
    salles: 2,
    category: "Appartement 4 Pièces",
    description: "Spacieux appartement neuf dans quartier haut de gamme. Équipements modernes et proximité commerces.",
    features: "Ascenseur, Parking, Gardiennage",
    images: ["/images/syndic-hero.jpg"],
    loyer: "600.000 FCFA"
  },
  {
    title: "Plateau – Bureau Commercial 200m²",
    type: "LOCATION",
    price: "1.500.000 FCFA",
    ville: "Abidjan",
    quartier: "Plateau",
    pays: "Côte d'Ivoire",
    chambres: 0,
    salles: 3,
    category: "Bureau",
    description: "Grand bureau aménagé au cœur du district financier. Idéal pour agence bancaire ou cabinet professionnel.",
    features: "Clim, Ascenseur, Parking",
    images: ["/images/conciergerie-hero.jpg"],
    loyer: "1.500.000 FCFA"
  },
  {
    title: "Bingerville – Terrain de 1000m²",
    type: "VENTE",
    price: "45.000.000 FCFA",
    ville: "Bingerville",
    quartier: "Centre",
    pays: "Côte d'Ivoire",
    chambres: 0,
    salles: 0,
    category: "Terrain",
    description: "Grand terrain viabilisé. Idéal pour construction immeuble ou maison unifamiliale.",
    features: "Viabilisé, Accès route"
  },
  {
    title: "Yopougon – Studio Meublé",
    type: "LOCATION",
    price: "150.000 FCFA",
    ville: "Abidjan",
    quartier: "Yopougon",
    pays: "Côte d'Ivoire",
    chambres: 1,
    salles: 1,
    category: "Studio Meublé",
    description: "Petit studio bien entretenu, idéal pour étudiant ou jeune actif.",
    features: "Meublé, Climatisé",
    images: ["/images/location-agent.jpg"],
    loyer: "150.000 FCFA"
  },
  {
    title: "Treichville – Appartement 2 Pièces",
    type: "LOCATION",
    price: "320.000 FCFA",
    ville: "Abidjan",
    quartier: "Treichville",
    pays: "Côte d'Ivoire",
    chambres: 1,
    salles: 1,
    category: "Appartement 2 Pièces",
    description: "Petit appartement fonctionnel dans quartier dynamique. Proche transports et commerces.",
    features: "Meublé optionnel",
    images: ["/images/vente-couple.jpg"],
    loyer: "320.000 FCFA"
  },
  {
    title: "2 Plateaux Vallons – Villa Duplex 6 Pièces",
    type: "VENTE",
    price: "280.000.000 FCFA",
    ville: "Abidjan",
    quartier: "2 Plateaux",
    pays: "Côte d'Ivoire",
    chambres: 5,
    salles: 4,
    category: "Villa Duplex 6 Pièces",
    description: "Imposante villa duplex design dans quartier prestigieux. Piscine, home cinema, suite parentale.",
    features: "Piscine, Home cinéma, Sauna, Parking double",
    images: ["/images/gestion-hero.jpg"]
  }
];

async function addProperties() {
  console.log('📝 Ajout de propriétés à Firestore...\n');
  
  try {
    let count = 0;
    for (const prop of properties) {
      const docRef = await db.collection('properties').add({
        ...prop,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      count++;
      console.log(`✅ (${count}/${properties.length}) ${prop.title} → ${docRef.id}`);
    }
    
    console.log(`\n🎉 Succès ! ${count} propriétés ajoutées.`);
    console.log('Retourne sur http://localhost:3000/admin/properties pour les voir');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

addProperties();
