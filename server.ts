import { PaymentsRoute } from './routes/payment-routes';
/**
 * *** NOTE ON IMPORTING FROM ANGULAR AND NGUNIVERSAL IN THIS FILE ***
 *
 * If your application uses third-party dependencies, you'll need to
 * either use Webpack or the Angular CLI's `bundleDependencies` feature
 * in order to adequately package them for use on the server without a
 * node_modules directory.
 *
 * However, due to the nature of the CLI's `bundleDependencies`, importing
 * Angular in this file will create a different instance of Angular than
 * the version in the compiled application code. This leads to unavoidable
 * conflicts. Therefore, please do not explicitly import from @angular or
 * @nguniversal in this file. You can export any needed resources
 * from your application's main.server.ts file, as seen below with the
 * import for `ngExpressEngine`.
 */
import bodyParser from "body-parser";
import * as express from 'express';
import 'localstorage-polyfill';
import * as mongoose from 'mongoose';
import { join } from 'path';
import 'zone.js/dist/zone-node';
import { dbUrl } from './helpers/config';
import { AddressesRoute } from './routes/address-routes';
import { BannersRoute } from './routes/banner-routes';
import { CategoriesRoute } from './routes/category-routes';
import { GrossWeightsRoute } from './routes/gross-weight-routes';
import { MessagesRoute } from './routes/message-routes';
import { NewArrivalsRoute } from './routes/new-arrival-routes';
import { OrdersRoute } from './routes/order-routes';
import { ProductsRoute } from './routes/products-routes';
import { ShippingRatesRoute } from './routes/shipping-rate-routes';
import { UsersRoute } from './routes/users-routes';

// Express server
const app = express();

//Global Local Storage
global['localStorage'] = localStorage

// api Routes
const productsRoute: ProductsRoute = new ProductsRoute();
const usersRoute: UsersRoute = new UsersRoute();
const shippingRoute: ShippingRatesRoute = new ShippingRatesRoute();
const ordersRoute: OrdersRoute = new OrdersRoute();
const grossWeightsRoute: GrossWeightsRoute = new GrossWeightsRoute();
const messagesRoute: MessagesRoute = new MessagesRoute();
const addressesRoute: AddressesRoute = new AddressesRoute()
const categoriesRoute: CategoriesRoute = new CategoriesRoute()
const bannersRoute: BannersRoute = new BannersRoute();
const newArrivalRoute: NewArrivalsRoute = new NewArrivalsRoute();
const paymentsRoute: PaymentsRoute = new PaymentsRoute();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP, ngExpressEngine, provideModuleMap } = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//adding api routes
productsRoute.productRoute(app);
usersRoute.userRoute(app);
shippingRoute.shippingRoute(app);
ordersRoute.orderRoute(app);
grossWeightsRoute.grossWeightRoute(app);
messagesRoute.orderRoute(app);
addressesRoute.addressRoute(app);
categoriesRoute.categoryRoute(app);
bannersRoute.bannerRoute(app);
newArrivalRoute.newArrivalRoute(app);
paymentsRoute.paymentRoute(app);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});

mongoose.connect(dbUrl, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));
