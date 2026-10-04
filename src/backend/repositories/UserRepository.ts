import { db } from '../db/firebase';
import { User } from '../schemas';

export class UserRepository {
  async findAll(): Promise<User[]> {
    const snap = await db.collection('users').get();
    return snap.docs.map( (doc: any) => doc.data() as User);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const snap = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as User;
  }

  async create(user: Omit<User, 'createdAt'> & { passwordHash: string; createdAt: string }): Promise<User> {
    const { passwordHash, ...userData } = user;
    
    await db.collection('users').doc(user.id).set({
      ...userData,
      passwordHash
    });
    
    return { ...userData, passwordHash } as unknown as User;
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const updateData = { ...updates };
    delete (updateData as any).id;
    await db.collection('users').doc(id).update(updateData);
    return this.findById(id);
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await db.collection('users').doc(id).update({ passwordHash });
  }

  async getPasswordHash(id: string): Promise<string | null> {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return data?.passwordHash || null;
  }

  async delete(id: string): Promise<void> {
    await db.collection('users').doc(id).delete();
  }

  async deleteManaged(id: string, allowedRoles: User['role'][]): Promise<number> {
    const docRef = db.collection('users').doc(id);
    return db.runTransaction(async (t: any) => {
      const doc = await t.get(docRef);
      if (!doc.exists) return 0;
      const data = doc.data() as User;
      if (allowedRoles.includes(data.role)) {
        t.delete(docRef);
        return 1;
      }
      return 0;
    });
  }

  async updateManagedStatus(id: string, active: boolean, allowedRoles: User['role'][]): Promise<number> {
    const docRef = db.collection('users').doc(id);
    return db.runTransaction(async (t: any) => {
      const doc = await t.get(docRef);
      if (!doc.exists) return 0;
      const data = doc.data() as User;
      if (allowedRoles.includes(data.role)) {
        t.update(docRef, { active });
        return 1;
      }
      return 0;
    });
  }
}

export const userRepository = new UserRepository();
