import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Details } from './Components/details/details';
import { Form } from './Components/form/form';
import { Login } from './login/login';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [

    // { path: "Home", component: Home },
    { path: "Details", component: Details },
    { path: "Details/:empId", component: Details },
    { path: "Add", component: Form },
    { path: "Edit", component: Form },
    { path: "Edit/:empId", component: Form },
    { path: "", redirectTo: '/Home', pathMatch: 'full' },
    // { path: "**", redirectTo: '/Home' },
    { path: 'login', component: Login },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'Home', component: Home, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'login' }

];


