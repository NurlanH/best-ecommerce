import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { IUser } from './interfaces';

@Injectable()
export class AppService {
  constructor(
    @Inject('USERS_CONTROL') private readonly user: ClientProxy,
    @Inject('PRODUCT_CONTROL') private readonly product: ClientProxy,
  ) {}

  async getAllUsers(limit: string, page: string, search: string) {
    const data = {
      limit,
      page,
      search,
    };

    const record = new RmqRecordBuilder()
      .setData(data)
      .setOptions({
        headers: {
          authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYyNmZhYWRkYTE2NTVlOWI5ZmU1MzBlMiIsImZ1bGxOYW1lIjoic2FsYXdtIiwibWVyY2hhbnRUeXBlIjoiYnV5ZXIiLCJlbWFpbCI6InRlc3d0QGNvZGUuZWR1LmF6IiwicGhvbmUiOiI5OTQ3NzYwOTc5MzkiLCJwYXNzd29yZCI6IiQyYSQxMCRZLlJ1QWtsc09TR0ZNYUNUVHVxSzUuZWZoU3FhQ2h0ajVJLmZCazRCVHdFRFVJMC5SYkdWLiIsImFkZHJlc3MiOiJzYWxzbGEiLCJvd25lck5hbWUiOiJUZWxNb2JpbGUiLCJjcmVhdGVkQXQiOiIyMDIyLTA1LTAyVDA5OjUzOjA4LjQyN1oiLCJ1cGRhdGVkQXQiOiIyMDIyLTA1LTAyVDA5OjUzOjA4LjQyN1oiLCJpc0RlbGV0ZWQiOmZhbHNlLCJiYWxhbmNlIjowLCJfX3YiOjB9LCJpYXQiOjE2NTE0OTM5MDcsImV4cCI6MTY1MTUzNzEwN30.B1SqYyQknlMYMpcZaVhvx6qsEBEsRLEAHpo44v8WKr8',
        },
        priority: 1,
      })
      .build();
    const result = this.user
      .send({ cmd: 'get_users' }, record)
      .toPromise()
      .then((data) => data);
    return result;
  }

  async signUpUser(user: IUser) {
    const result = this.user
      .send({ cmd: 'signup_user' }, user)
      .toPromise()
      .then((data) => data);
    return result;
  }

  async signInUser(user: IUser) {
    const result = this.user
      .send({ cmd: 'signin_user' }, user)
      .toPromise()
      .then((data) => data);
    return result;
  }

  async createCategory(category: any) {
    return this.product
      .send({ cmd: 'create_category' }, category)
      .toPromise()
      .then((data) => data);
  }

  async createProduct(product: any, token: string) {
    // Getting user info with token from auth microservice
    const user = await this.validateUser(token);

    // pass product merchant user id
    product.merchant = user._id;

    return this.product
      .send({ cmd: 'create_product' }, product)
      .toPromise()
      .then((data) => data);
  }

  async buyProduct(body: any, token: string) {
    // Getting user info with token from auth microservice
    const user = await this.validateUser(token);


    const product = await this.product
      .send({ cmd: 'get_product_by_id' }, body.productId)
      .toPromise()
      .then((data) => data);


    const canBuy = await this._canBuy(user, product);

    if (!canBuy) {
      return {
        status: false,
        message:
          'You cant buy this order. Please check your balance or product is out of stock',
      };
    }

    const orderData = {
      user,
      product,
      order:body
    }



    this.product
      .send({ cmd: 'create_order' }, orderData)
      .toPromise()
      .then((data) => data);

    return {status:true, message:'Your order is preparing you can watch from /orders'};
  }

  private async _canBuy(user: IUser, product: any): Promise<boolean> {
    let canBuy: boolean = false;

    if (user.balance >= product.price && product.inventory > 0) {
      canBuy = true;
    }

    return canBuy;
  }

  async validateUser(token: string) {
    return await this.user
      .send({ cmd: 'validate_user' }, token)
      .toPromise()
      .then((data) => data);
  }
}
