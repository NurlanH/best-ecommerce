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

    const result = await this.user
      .send({ cmd: 'get_users' }, { limit, page, search })
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
      order: body,
    };

    this.product
      .send({ cmd: 'create_order' }, orderData)
      .toPromise()
      .then((data) => data);

    return {
      status: true,
      message: 'Your order is preparing you can watch from /orders',
    };
  }

  private async _canBuy(user: IUser, product: any): Promise<boolean> {
    let canBuy: boolean = false;

    if (user.balance >= product.price && product.inventory > 0) {
      canBuy = true;
    }

    return canBuy;
  }

  async getAllOrders() {
    const result = await this.product
      .send({ cmd: 'get_all_orders' }, {})
      .toPromise()
      .then((data) => data);
    return result;
  }

  async getAllLoans() {
    const result = await this.product
      .send({ cmd: 'get_all_loans' }, {})
      .toPromise()
      .then((data) => data);
    return result;
  }

  async getAllProducts(limit: string, page: string, search: string, sortBy:string, sortType:string) {
    const data = {
      limit,
      page,
      search,
      sortType,
      sortBy
    };

    const result = await this.product
      .send({ cmd: 'get_all_products' }, data)
      .toPromise()
      .then((data) => data);
    return result;
  }

  async getAllInvoices() {
    const result = await this.product
      .send({ cmd: 'get_all_invoices' }, {})
      .toPromise()
      .then((data) => data);
    return result;
  }

  async validateUser(token: string) {
    return await this.user
      .send({ cmd: 'validate_user' }, token)
      .toPromise()
      .then((data) => data);
  }
}
