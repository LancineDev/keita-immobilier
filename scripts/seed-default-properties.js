require('dotenv').config();
const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const defaultProperties = [
  {
    title: "Koumassi – Appartement 4 pièces",
    type: "LOCATION",
    price: "250.000 FCFA",
    ville: "Abidjan",
    quartier: "Koumassi",
    pays: "Côte d'Ivoire",
    chambres: 3,
    salles: 2,
    category: "Appartement 4 Pièces",
    description: "Bel appartement de 4 pièces idéalement situé à Koumassi. Bien entretenu, lumineux et fonctionnel, parfait pour une famille.",
    features: "Meublé, Parking",
    images: ["/images/location-agent.jpg"],
    loyer: "250.000 FCFA"
  },
  {
    title: "Riviera Palmeraie – Villa Duplex 5 pièces",
    type: "LOCATION",
    price: "750.000 FCFA",
    ville: "Abidjan",
    quartier: "Riviera Palmeraie",
    pays: "Côte d'Ivoire",
    chambres: 4,
    salles: 4,
    category: "Villa Duplex 5 Pièces",
    description: "Magnifique villa duplex de 5 pièces à la Riviera Palmeraie. Résidence sécurisée avec piscine, parking et espaces verts.",
    features: "Piscine, Parking, Gardiennage",
    images: ["/images/vente-couple.jpg"],
    loyer: "750.000 FCFA"
  },
  {
    title: "Marcory Zone 4 – Villa basse 4 pièces",
    type: "LOCATION",
    price: "1.500.000 FCFA",
    ville: "Abidjan",
    quartier: "Marcory Zone 4",
    pays: "Côte d'Ivoire",
    chambres: 3,
    salles: 3,
    category: "Villa Basse 4 Pièces",
    description: "Villa basse de 4 pièces en zone résidentielle de Marcory. Cadre calme et sécurisé, avec jardin privatif et parking.",
    features: "Jardin, Parking",
    images: ["/images/gestion-hero.jpg"],
    loyer: "1.500.000 FCFA"
  },
  {
    title: "Grand Bassam – Villas basses 4 pièces",
    type: "LOCATION",
    price: "1.000.000 FCFA",
    ville: "Grand - Bassam",
    quartier: "Grand Bassam",
    pays: "Côte d'Ivoire",
    chambres: 3,
    salles: 2,
    category: "Villa Basse 4 Pièces",
    description: "Villas basses de 4 pièces situées à Grand Bassam, à proximité de la plage. Idéales pour une résidence secondaire.",
    features: "Vue mer, Parking",
    images: ["/images/location-hero.jpg"],
    loyer: "1.000.000 FCFA"
  },
  {
    title: "Cocody – Appartement 2 Pièces",
    type: "LOCATION",
    price: "700.000 FCFA",
    ville: "Abidjan",
    quartier: "Cocody",
    pays: "Côte d'Ivoire",
    chambres: 1,
    salles: 1,
    category: "Appartement 2 Pièces",
    description: "Appartement 2 pièces moderne et lumineux situé à Cocody. Proche de toutes commodités, transports et commerces.",
    features: "Meublé, Climatisé",
    images: ["/images/syndic-hero.jpg"],
    loyer: "700.000 FCFA"
  },
  {
    title: "Marcory résidentiel – Appartement 4 pièces",
    type: "LOCATION",
    price: "500.000 FCFA",
    ville: "Abidjan",
    quartier: "Marcory Résidentiel",
    pays: "Côte d'Ivoire",
    chambres: 3,
    salles: 2,
    category: "Appartement 4 Pièces",
    description: "Appartement 4 pièces dans la zone résidentielle de Marcory. Environnement calme et sécurisé, idéal pour une famille.",
    features: "Parking",
    images: ["/images/conciergerie-hero.jpg"],
    loyer: "500.000 FCFA"
  }
];

async function seed() {
  for (const p of defaultProperties) {
    await addDoc(collection(db, "properties"), { ...p, createdAt: serverTimestamp() });
    console.log('added', p.title);
  }
  console.log('done');
}

seed().catch(console.error);
