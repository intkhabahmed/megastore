import { AboutComponent } from './components/about/about.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { ProductdetailComponent } from './components/productdetail/productdetail.component';
import { ProductsComponent } from './components/products/products.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './components/search/search.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './utils/auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { CreateNewPasswordComponent } from './components/create-new-password/create-new-password.component';


const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "products",
    component: ProductsComponent
  },
  {
    path: "products/:id",
    component: ProductdetailComponent,
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
  {
    path: "cart",
    component: CartComponent
  },
  {
    path: "checkout",
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "profile",
    component: ProfileComponent,
    pathMatch: "full",
    canActivate: [AuthGuard]
  },
  {
    path: "admin-panel-cms",
    component: AdminComponent,
    pathMatch: "full",
    canActivate: [AuthGuard]
  },
  {
    path: "order-status",
    component: OrderSuccessComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "search",
    component: SearchComponent
  },
  {
    path: "about",
    component: AboutComponent
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent
  },
  {
    path: "passwordReset",
    component: CreateNewPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
