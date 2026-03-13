import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { WeeklyPlanResponse } from '../types';

export interface SavedPlan {
  id: string;
  userId: string;
  title: string;
  planData: string; // JSON stringified WeeklyPlanResponse
  createdAt: any;
}

export const savePlan = async (title: string, plan: WeeklyPlanResponse) => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  
  const planDataStr = JSON.stringify(plan);
  if (planDataStr.length >= 500000) {
    throw new Error("Plan data is too large to save.");
  }

  const docRef = await addDoc(collection(db, 'savedPlans'), {
    userId: auth.currentUser.uid,
    title,
    planData: planDataStr,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const getSavedPlans = async (): Promise<SavedPlan[]> => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  
  const q = query(
    collection(db, 'savedPlans'), 
    where('userId', '==', auth.currentUser.uid)
  );
  
  const querySnapshot = await getDocs(q);
  const plans = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as SavedPlan));
  
  // Sort descending by createdAt
  return plans.sort((a, b) => {
    const timeA = a.createdAt?.toMillis?.() || 0;
    const timeB = b.createdAt?.toMillis?.() || 0;
    return timeB - timeA;
  });
};

export const deleteSavedPlan = async (planId: string) => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  await deleteDoc(doc(db, 'savedPlans', planId));
};
