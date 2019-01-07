import {Injectable} from '@angular/core';

@Injectable()
export class UserIdService {
  userId = '';
  getUserId() {
    return this.userId;
  }
  setUserId(userId) {
    this.userId = userId;
  }
}
