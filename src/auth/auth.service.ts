import { Injectable } from '@nestjs/common';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseDb } from '../config/firebase';
import { getDatabase, ref, get } from 'firebase/database';
import { Users } from './interface/auth.interface';
@Injectable()
export class AuthService {
  private readonly users: Users;
  private database = getDatabase(firebaseDb);
  fromSnapshot(snapshot) {
    const data = snapshot.val();
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      phoneNumber: data.phoneNumber,
    };
  }
  async getById(id: string) {
    const getId = ref(this.database, 'users/' + id);
    const snapshot = await get(getId);
    return this.fromSnapshot(snapshot);
  }
  async userSignin(email: string, password: string) {
    const auth = getAuth();
    let resmes = null;
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCreadentaials) => {
        const user = userCreadentaials.user;
        const res = this.getById(user.uid);
        resmes = {
          ...res,
          accessToken: user['accessToken'],
          message: 'successful',
        };
      })
      .catch((error) => {
        console.log(error.message);
        resmes = {
          statusCode: 400,
          errorCode: error.code,
          errorMessage: error.message,
        };
      });
    console.log(resmes);
    return resmes;
  }
}
