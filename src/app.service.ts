import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { IUser } from './interfaces';

@Injectable()
export class AppService {
  
  constructor(
    @Inject('USERS_CONTROL') private readonly user:ClientProxy,
    @Inject('PRODUCT_CONTROL') private readonly product:ClientProxy){
  }

  
  async getAllUsers(limit:string, page:string, search:string) {
    const data = {
      limit,
      page,
      search
    }
    
    const record = new RmqRecordBuilder()
      .setData(data)
      .setOptions({
        headers: {
          'authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYyNmZhYWRkYTE2NTVlOWI5ZmU1MzBlMiIsImZ1bGxOYW1lIjoic2FsYXdtIiwibWVyY2hhbnRUeXBlIjoiYnV5ZXIiLCJlbWFpbCI6InRlc3d0QGNvZGUuZWR1LmF6IiwicGhvbmUiOiI5OTQ3NzYwOTc5MzkiLCJwYXNzd29yZCI6IiQyYSQxMCRZLlJ1QWtsc09TR0ZNYUNUVHVxSzUuZWZoU3FhQ2h0ajVJLmZCazRCVHdFRFVJMC5SYkdWLiIsImFkZHJlc3MiOiJzYWxzbGEiLCJvd25lck5hbWUiOiJUZWxNb2JpbGUiLCJjcmVhdGVkQXQiOiIyMDIyLTA1LTAyVDA5OjUzOjA4LjQyN1oiLCJ1cGRhdGVkQXQiOiIyMDIyLTA1LTAyVDA5OjUzOjA4LjQyN1oiLCJpc0RlbGV0ZWQiOmZhbHNlLCJiYWxhbmNlIjowLCJfX3YiOjB9LCJpYXQiOjE2NTE0OTM5MDcsImV4cCI6MTY1MTUzNzEwN30.B1SqYyQknlMYMpcZaVhvx6qsEBEsRLEAHpo44v8WKr8'
        },
        priority: 1,
      })
      .build();
    const result = this.user.send({cmd:'get_users'},record).toPromise().then(data => data);
    return result;
  }

  
  async signUpUser(user:IUser) {
    const result = this.user.send({ cmd: 'signup_user' }, user).toPromise().then(data => data);
    return result;
  }

  async signInUser(user:IUser) {
    const result = this.user.send({ cmd: 'signin_user' }, user).toPromise().then(data => data);
    return result;
  }


  async createProduct (product:any){
    return this.product.send({ cmd: 'add_product' }, product).toPromise().then(data => data);
  }


  async validateUser (token:string){
    return this.user.send({ cmd: 'validate_user' }, token).toPromise().then(data => data);
  }
}
