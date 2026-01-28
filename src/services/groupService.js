import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, collection, addDoc, writeBatch } from "firebase/firestore";
import { initialDepotData } from "../data/initialData";

const db = getFirestore();

// Helper to sanitize group name for ID
const generateGroupId = (name) => {
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

export const createGroup = async (groupName, password, user) => {
  const groupId = generateGroupId(groupName);
  const groupRef = doc(db, "groups", groupId);

  const groupSnap = await getDoc(groupRef);
  if (groupSnap.exists()) {
    throw new Error("Bu isimde bir depo grubu zaten var. Lütfen başka bir isim seçin veya bu gruba katılın.");
  }

  // Create the group
  await setDoc(groupRef, {
    name: groupName,
    password: password, // In a real app, hash this! keeping it simple as requested.
    adminId: user.uid,
    createdAt: new Date(),
    members: [user.uid] // Optional: keep list of member IDs here for easy counting
  });

  // Update user profile
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, {
    groupId: groupId,
    role: 'admin' // Creator becomes admin
  });

  // SEED INITIAL DATA IF EXISTS
  if (initialDepotData[groupId]) {
    const codes = initialDepotData[groupId];
    const batch = writeBatch(db);

    codes.forEach(code => {
        const newDocRef = doc(collection(db, "codes"));
        batch.set(newDocRef, {
            ...code,
            groupId: groupId,
            createdAt: new Date(),
            createdBy: user.uid
        });
    });

    try {
        await batch.commit();
        console.log(`Seeded ${codes.length} initial codes for ${groupId}`);
    } catch (e) {
        console.error("Error seeding data:", e);
    }
  }

  return groupId;
};

export const joinGroup = async (groupName, password, user) => {
  const groupId = generateGroupId(groupName);
  const groupRef = doc(db, "groups", groupId);

  const groupSnap = await getDoc(groupRef);
  if (!groupSnap.exists()) {
    throw new Error("Bu isimde bir depo grubu bulunamadı.");
  }

  const groupData = groupSnap.data();
  if (groupData.password !== password) {
    throw new Error("Grup şifresi yanlış.");
  }

  // Add user to group members list (optional, but good for counting)
  await updateDoc(groupRef, {
    members: arrayUnion(user.uid)
  });

  // Update user profile
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, {
    groupId: groupId,
    role: 'member' // Default role when joining
  });

  return groupId;
};
