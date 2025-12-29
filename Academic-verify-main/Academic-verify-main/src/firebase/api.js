import { db } from './firebase';
import { collection, addDoc, getDocs } from "firebase/firestore";

export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error fetching documents: ", e);
    throw e;
  }
};

// Endorsement functions (if needed)
export const reqEducationEndorsementFunc = async (education) => {
  try {
    const data = {
      type: "education",
      institute: education.institute,
      description: education.description,
      startdate: education.startdate,
      enddate: education.enddate,
      endorsed: false,
      timestamp: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, "endorsementRequests"), data);
    console.log("Education endorsement requested with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error requesting education endorsement: ", e);
    throw e;
  }
};

export const reqCertiEndorsementFunc = async (certification) => {
  try {
    const data = {
      type: "certification",
      name: certification.name,
      organization: certification.organization,
      score: certification.score,
      endorsed: false,
      timestamp: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, "endorsementRequests"), data);
    console.log("Certification endorsement requested with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error requesting certification endorsement: ", e);
    throw e;
  }
};

export const reqWorkexpEndorsementFunc = async (workExp) => {
  try {
    const data = {
      type: "workExperience",
      role: workExp.role,
      organization: workExp.organization,
      startdate: workExp.startdate,
      enddate: workExp.enddate,
      description: workExp.description,
      endorsed: false,
      timestamp: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, "endorsementRequests"), data);
    console.log("Work experience endorsement requested with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error requesting work experience endorsement: ", e);
    throw e;
  }
};

// Message admin function (if needed)
export const messageAdmin = async (info, message) => {
  try {
    const data = {
      name: info.name,
      location: info.location,
      description: info.description,
      role: info.role,
      message: message,
      timestamp: new Date().toISOString(),
      status: "pending",
    };
    const docRef = await addDoc(collection(db, "adminMessages"), data);
    console.log("Message sent with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error sending message to admin: ", e);
    throw e;
  }
};