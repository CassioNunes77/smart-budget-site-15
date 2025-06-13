
import { db } from './firebase';
import {
  collection, doc, setDoc, getDoc, updateDoc, deleteDoc,
  getDocs, query, where, serverTimestamp, orderBy, limit
} from 'firebase/firestore';

export interface FirestoreDocument {
  id: string;
  [key: string]: any;
}

export default {
  // Cria ou atualiza um documento
  async saveDocument(collectionName: string, data: any, customId?: string): Promise<string> {
    try {
      const docRef = customId 
        ? doc(db, collectionName, customId)
        : doc(collection(db, collectionName));
      
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
        ...(customId ? {} : { createdAt: serverTimestamp() })
      });
      
      console.log(`Documento salvo em ${collectionName}:`, docRef.id);
      return docRef.id;
    } catch (error) {
      console.error(`Erro ao salvar documento em ${collectionName}:`, error);
      throw error;
    }
  },

  // Busca documento por ID
  async getDocument(collectionName: string, docId: string): Promise<FirestoreDocument | null> {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
          id: docSnap.id, 
          ...data,
          // Converter timestamps para strings se necessário
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Erro ao buscar documento ${docId} em ${collectionName}:`, error);
      throw error;
    }
  },

  // Lista documentos com filtro
  async listDocuments(
    collectionName: string, 
    filters: [string, any, any][] = [],
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount?: number
  ): Promise<FirestoreDocument[]> {
    try {
      let q = query(collection(db, collectionName));
      
      // Aplicar filtros
      filters.forEach(([field, operator, value]) => {
        q = query(q, where(field, operator, value));
      });
      
      // Aplicar ordenação
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }
      
      // Aplicar limite
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Converter timestamps para strings se necessário
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
        };
      });
    } catch (error) {
      console.error(`Erro ao listar documentos de ${collectionName}:`, error);
      throw error;
    }
  },

  // Atualiza documento existente
  async updateDocument(collectionName: string, docId: string, updates: any): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      console.log(`Documento ${docId} atualizado em ${collectionName}`);
    } catch (error) {
      console.error(`Erro ao atualizar documento ${docId} em ${collectionName}:`, error);
      throw error;
    }
  },

  // Remove documento
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      console.log(`Documento ${docId} removido de ${collectionName}`);
    } catch (error) {
      console.error(`Erro ao remover documento ${docId} de ${collectionName}:`, error);
      throw error;
    }
  }
};
