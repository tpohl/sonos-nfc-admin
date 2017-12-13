
import { Observable } from 'rxjs/Observable';
import { auth } from 'firebase/app';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import 'rxjs/add/operator/map';
import { Device } from '../models/Device';


@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {

  constructor(private http: HttpClient, private authService: AuthService) { }

  newDevice: Device = new Device();
  devices: Observable<any>;
  userToken: any;

  claimOpen = false;

  ngOnInit() {
    this.authService.getToken().subscribe(token => {
      this.userToken = token;
      this.loadUserDevices();
    });
  }

  public claimDevice() {
    const url = '/api/devices/';
    const headers = { 'Authorization': 'Bearer ' + this.userToken };

    const request$ = this.http.post(url, this.newDevice, { headers: headers });
    request$.subscribe((result) => { this.loadUserDevices(); this.claimOpen = false; });

  }

  public loadUserDevices(): void {
    const url = '/api/devices/';
    const headers = { 'Authorization': 'Bearer ' + this.userToken };

    const request$ = this.http.get(url, { headers: headers });
    this.devices = request$;
  }
}
