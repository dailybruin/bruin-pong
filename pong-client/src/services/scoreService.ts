// Score service for managing user scores in Firestore

import { 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getDeviceId } from '../utils/deviceId';

const SCORES_COLLECTION = 'scores';

export interface UserScore {
  deviceId: string;
  topScore: number;
  lastUpdated: number; // timestamp
}

/*
 Saves a score for the current device
 Only updates if the new score is higher than the existing top score
 */
export async function saveScore(score: number): Promise<void> {
  try {
    const deviceId = getDeviceId();
    const userRef = doc(db, SCORES_COLLECTION, deviceId);
    
    // Get current top score
    const userDoc = await getDoc(userRef);
    const currentTopScore = userDoc.exists() ? userDoc.data().topScore : 0;
    
    // Only update if new score is higher
    if (score > currentTopScore) {
      await setDoc(userRef, {
        deviceId,
        topScore: score,
        lastUpdated: Date.now()
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error saving score:', error);
    // Don't throw - allow game to continue even if save fails
  }
}

// Gets the top score for the current device
export async function getTopScore(): Promise<number> {
  try {
    const deviceId = getDeviceId();
    const userRef = doc(db, SCORES_COLLECTION, deviceId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data().topScore || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting top score:', error);
    return 0;
  }
}

 // Gets the top scores across all users (for leaderboard, optional)
export async function getTopScores(limitCount: number = 10): Promise<UserScore[]> {
  try {
    const scoresRef = collection(db, SCORES_COLLECTION);
    const q = query(scoresRef, orderBy('topScore', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as UserScore);
  } catch (error) {
    console.error('Error getting top scores:', error);
    return [];
  }
}

