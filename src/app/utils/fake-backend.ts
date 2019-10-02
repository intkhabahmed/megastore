import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';
import { Product } from '../models/product';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let products: Product[] = JSON.parse(localStorage.getItem('products')) || JSON.parse(`
[
    {
       "productStatus":true,
       "_id":"5d739f7f6613391d9cdac9ef",
       "name":"Silk Fibre",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "weight":1,
       "price":100,
       "quantity":2,
       "createdAt":"2019-09-07T12:15:59.666Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d739f806613391d9cdac9f0",
       "name":"Wool",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":200,
       "quantity":3,
       "weight":2,
       "createdAt":"2019-09-07T12:16:00.489Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73a24d1d711425642638b3",
       "name":"Cotton",
       "productCode":"12347",
       "description":"Dummy description",
       "category":"Firbre",
       "price":150,
       "weight":0.5,
       "quantity":5,
       "createdAt":"2019-09-07T12:27:57.128Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73a24d1d711425642638b4",
       "name":"Nylon",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":100,
       "weight":1.5,
       "quantity":2,
       "createdAt":"2019-09-07T12:27:57.550Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73a24e1d711425642638b5",
       "name":"Silk Fibre",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":100,
       "quantity":2,
       "createdAt":"2019-09-07T12:27:58.277Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73a24f1d711425642638b6",
       "name":"Silk Fibre",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":100,
       "quantity":2,
       "createdAt":"2019-09-07T12:27:59.113Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73b3d883581e1ea023e4ab",
       "name":"Silk Fibre",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":100,
       "quantity":2,
       "createdAt":"2019-09-07T13:42:48.250Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73b3d883581e1ea023e4ac",
       "name":"Silk Fibre",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":100,
       "quantity":2,
       "createdAt":"2019-09-07T13:42:48.593Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73b3da83581e1ea023e4ad",
       "name":"Silk Fibre",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":100,
       "quantity":2,
       "createdAt":"2019-09-07T13:42:50.696Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73b3db83581e1ea023e4ae",
       "name":"Silk Fibre",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":100,
       "quantity":2,
       "createdAt":"2019-09-07T13:42:51.797Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73b3dc83581e1ea023e4af",
       "name":"Silk Fibre",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":100,
       "quantity":2,
       "createdAt":"2019-09-07T13:42:52.885Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73b3de83581e1ea023e4b0",
       "name":"Silk Fibre",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":100,
       "quantity":2,
       "createdAt":"2019-09-07T13:42:54.035Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73b3df83581e1ea023e4b1",
       "name":"Silk Fibre",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":100,
       "quantity":2,
       "createdAt":"2019-09-07T13:42:55.068Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73b3df83581e1ea023e4b2",
       "name":"Silk Fibre",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":100,
       "quantity":2,
       "createdAt":"2019-09-07T13:42:55.990Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73b3e083581e1ea023e4b3",
       "name":"Silk Fibre",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":100,
       "quantity":2,
       "createdAt":"2019-09-07T13:42:56.989Z",
       "__v":0
    },
    {
       "productStatus":true,
       "_id":"5d73b3e183581e1ea023e4b4",
       "name":"Silk Fibre",
       "productCode":"12345",
       "description":"Dummy description",
       "category":"Firbre",
       "price":100,
       "quantity":2,
       "createdAt":"2019-09-07T13:42:57.866Z",
       "__v":0
    }
 ]`);

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users/all') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                case url.endsWith('/api') && method === 'GET':
                    return getProducts();
                case url.endsWith('/api') && method === 'POST':
                    return addProduct();
                case url.match(/\/api\/[a-zA-z0-9]+$/) && method === 'PUT':
                    return updateProduct();
                case url.match(/\/api\/[a-zA-z0-9]+$/) && method === 'DELETE':
                    return deleteProduct();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { email, password } = body;
            const user = users.find(x => x.email === email && x.password === password);
            if (!user) return error('Email or password is incorrect');
            return ok({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            if (users.find(x => x.email === user.email)) {
                return error('"' + user.email + '" already exists')
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            return ok(
                user
            );
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function getProducts() {
            localStorage.setItem('products', JSON.stringify(products))
            return ok(
                products
            )
        }

        function addProduct() {
            const product = body
            product._id = Math.random().toString(36).substr(2, 5)
            products.push(product)
            localStorage.setItem('products', JSON.stringify(products))
            return ok(product)
        }

        function updateProduct() {
            const updatedProduct = body
            products.map(product => {
                if (product._id == idFromUrl().toString()) {
                    product = updatedProduct
                }
            })
            localStorage.setItem('products', JSON.stringify(products))
            return ok(updatedProduct)
        }

        function deleteProduct() {
            products = products.filter(item => item._id !== idFromUrl().toString())
            localStorage.setItem('products', JSON.stringify(products))
            return ok()
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return urlParts[urlParts.length - 1];
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};