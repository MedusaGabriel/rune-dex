'use client';

import { useCallback } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useFirestore() {
  // Criar documento
  const createDocument = async (collectionName: string, data: DocumentData) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      throw error;
    }
  };

  // Ler documento por ID
  const getDocument = async (collectionName: string, docId: string) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      throw error;
    }
  };

  // Ler documentos com filtros
  const getDocuments = async (
    collectionName: string, 
    constraints: QueryConstraint[] = []
  ) => {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      throw error;
    }
  };

  // Atualizar documento
  const updateDocument = async (
    collectionName: string, 
    docId: string, 
    data: Partial<DocumentData>
  ) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      throw error;
    }
  };

  // Deletar documento
  const deleteDocument = async (collectionName: string, docId: string) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      throw error;
    }
  };

  // Buscar documentos de um usuário específico
  const getUserDocuments = useCallback(async (collectionName: string, userId: string) => {
    console.log('📊 useFirestore: getUserDocuments chamado', { collectionName, userId });
    try {
      const result = await getDocuments(collectionName, [
        where('userId', '==', userId)
      ]);
      console.log('📊 useFirestore: getUserDocuments resultado:', result);
      return result;
    } catch (error) {
      console.error('📊 useFirestore: Erro ao buscar documentos do usuário:', error);
      throw error;
    }
  }, []);

  return {
    createDocument,
    getDocument,
    getDocuments,
    updateDocument,
    deleteDocument,
    getUserDocuments
  };
}
