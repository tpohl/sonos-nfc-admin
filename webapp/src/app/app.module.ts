import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { DeviceManageComponentComponent } from './device-manage-component/device-manage-component.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { AuthService } from './services/auth.service';

const appRoutes: Routes = [
  {
    path: 'select',
    component: DeviceListComponent
  },
  {
    path: 'manage/:deviceid',
    component: DeviceManageComponentComponent
  },
  { path: '',
    redirectTo: '/select',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DeviceManageComponentComponent,
    DeviceListComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- enable for debugging purposes only
    ),
    BrowserModule, HttpClientModule, FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    AngularFireAuthModule
  ],
  providers: [DeviceManageComponentComponent, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
