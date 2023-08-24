import { Injectable } from '@nestjs/common';
import { firebaseDb } from '../config/firebase';
import { getDatabase, ref, get } from 'firebase/database';
import { Users } from './interface/auth.interface';
@Injectable()
export class AuthService {
  private readonly users: Users;
  private database = getDatabase(firebaseDb);

  fromSnapshot(snapshot) {
    const data = snapshot.val();
    return JSON.stringify({
      id: snapshot.key,
      email: data.email,
      name: data.username,
      avatar: data.profile_picture,
      phoneNumber: data.phoneNumber,
    });
  }

  async getById(id: string) {
    const getId = ref(this.database, 'users/' + id);
    const snapshot = await get(getId);
    return this.fromSnapshot(snapshot);
  }
}
