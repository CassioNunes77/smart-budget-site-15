

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
      console.log(`=== FIRESTORE SAVE - ${collectionName} ===`);
      console.log('Dados a serem salvos:', data);
      
      const docRef = customId 
        ? doc(db, collectionName, customId)
        : doc(collection(db, collectionName));
      
      const documentData = {
        ...data,
        updatedAt: serverTimestamp(),
        ...(customId ? {} : { createdAt: serverTimestamp() })
      };
      
      console.log('Dados finais para salvar:', documentData);
      console.log('Referência do documento:', docRef.path);
      
      await setDoc(docRef, documentData);
      
      console.log(`Documento salvo com sucesso em ${collectionName}:`, docRef.id);
      return docRef.id;
    } catch (error) {
      console.error(`Erro ao salvar documento em ${collectionName}:`, error);
      throw error;
    }
  },

  // Busca documento por ID
  async getDocument(collectionName: string, docId: string): Promise<FirestoreDocument | null> {
    try {
      console.log(`=== FIRESTORE GET - ${collectionName}/${docId} ===`);
      
      const docRef = doc(db, collectionName, docId);
      console.log('Referência do documento:', docRef.path);
      
      const docSnap = await getDoc(docRef);
      console.log('Documento existe?', docSnap.exists());
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Dados do documento:', data);
        
        const result = { 
          id: docSnap.id, 
          ...data,
          // Converter timestamps para strings se necessário
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
        };
        
        console.log('Documento formatado:', result);
        return result;
      }
      
      console.log('Documento não encontrado');
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
      console.log(`=== FIRESTORE LIST - ${collectionName} ===`);
      console.log('Filtros aplicados:', filters);
      console.log('Ordenação:', orderByField, orderDirection);
      console.log('Limite:', limitCount);
      
      let q = query(collection(db, collectionName));
      
      // Aplicar filtros
      filters.forEach(([field, operator, value]) => {
        console.log(`Aplicando filtro: ${field} ${operator} ${value}`);
        q = query(q, where(field, operator, value));
      });
      
      // Aplicar ordenação
      if (orderByField) {
        console.log(`Aplicando ordenação: ${orderByField} ${orderDirection}`);
        q = query(q, orderBy(orderByField, orderDirection));
      }
      
      // Aplicar limite
      if (limitCount) {
        console.log(`Aplicando limite: ${limitCount}`);
        q = query(q, limit(limitCount));
      }
      
      console.log('Executando query...');
      const snapshot = await getDocs(q);
      console.log(`Query executada. ${snapshot.size} documentos encontrados`);
      
      const results = snapshot.docs.map(doc => {
        const data = doc.data();
        const result = {
          id: doc.id,
          ...data,
          // Converter timestamps para strings se necessário
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
        };
        return result;
      });
      
      console.log('Primeiros 3 resultados:', results.slice(0, 3));
      console.log('IDs dos documentos:', results.map(r => r.id));
      
      return results;
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
