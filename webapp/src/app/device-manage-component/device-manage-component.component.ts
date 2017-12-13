import { ParticleConfiguration } from '../models/ParticleConfiguration';
import { OnInit, Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { Device } from '../models/Device';
import 'rxjs/add/observable/fromPromise';

@Component({
  selector: 'app-device-manage-component',
  templateUrl: './device-manage-component.component.html',
  styleUrls: ['./device-manage-component.component.css']
})
export class DeviceManageComponentComponent implements OnInit {

  configuration: Device = new Device();

  id: string;

  playlist: String;
  room: String;
  apiHost: string;
  userToken: any;

  // Inject HttpClient into your component or service.
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    // subscribe to router event to get information about the particle
    this.authService.getToken().subscribe(token => {
      this.userToken = token;

      this.activatedRoute.params.subscribe(params => {
        console.log(params);
        const deviceId = params['deviceid'];
        this.id = deviceId;

        this.loadDevice(deviceId).subscribe((device) => {
          this.configuration = device;
          this.loadRoomName();
          this.loadApiHost();
        }
        );
      });
    });
  }

  public loadDevice(key: string): Observable<Device> {
    console.log('LOADING', key);
    const url = '/api/devices/' + key + '/';

    const headers = { 'Authorization': 'Bearer ' + this.userToken };

    const request$ = this.http.get<Device>(url, { headers: headers });
    return request$;


  }


  public requestTagWrite(playlistName: String): Observable<any> {
    /*
    const url = 'https://api.particle.io/v1/devices/' + this.configuration.deviceId + '/tag';
    const headers = { 'Authorization': 'Bearer ' + this.configuration.token };
    */
    const url = '/api/devices/' + this.id + '/function/tag';
    const headers = { 'Authorization': 'Bearer ' + this.userToken };
    const body = { arg: 'p:' + playlistName };

    const request$ = this.http.post(url, body, { headers: headers });
    return request$;
  }

  public writeTag(): void {
    console.log('Should write Tag', this.configuration);
    const request$ = this.requestTagWrite(this.playlist);
    request$.subscribe();
  }

  public loadRoomName(): void {
    this.authService.userDetails.getIdToken().then((token) => {
      /*
        const headers = { 'Authorization': 'Bearer ' + this.configuration.token };
        const url = 'https://api.particle.io/v1/devices/' + this.configuration.deviceId + '/room';
      */
      const url = '/api/devices/' + this.id + '/variable/room/';
      const headers = { 'Authorization': 'Bearer ' + this.userToken };

      const request$ = this.http.get(url, { headers: headers });
      request$.subscribe(
        data => {
          this.room = data['result'];
        },
        error => {
          console.log('ERROR gettin Variable', error);
        }
      );
    });
  }
  public writeRoomName(): void {
    /*
    const url = 'https://api.particle.io/v1/devices/' + this.configuration.deviceId + '/room';
    const headers = { 'Authorization': 'Bearer ' + this.configuration.token };
    */
    const url = '/api/devices/' + this.id + '/function/room';
    const headers = { 'Authorization': 'Bearer ' + this.userToken };
    const body = { arg: this.room };
    const request$ = this.http.post(url, body, { headers: headers });
    request$.subscribe(
      data => {
        console.log('Success writing Room', data);
        this.loadRoomName();
      },
      error => {
        console.log('ERROR writing Variable', error);
      }
    );
  }

  public loadApiHost(): void {
    this.authService.userDetails.getIdToken().then((token) => {
      /*
      const headers = { 'Authorization': 'Bearer ' + this.configuration.token };
      const url = 'https://api.particle.io/v1/devices/' + this.configuration.deviceId + '/apiHost';
      */
      const url = '/api/devices/' + this.id + '/variable/apiHost/';
      const headers = { 'Authorization': 'Bearer ' + this.userToken };

      const request$ = this.http.get(url, { headers: headers });
      request$.subscribe(
        data => {
          this.apiHost = data['result'];
        },
        error => {
          console.log('ERROR gettin Variable', error);
        }
      );
    });
  }
  public writeApiHost(): void {
    /*
    const url = 'https://api.particle.io/v1/devices/' + this.configuration.deviceId + '/apiHost';
    const headers = { 'Authorization': 'Bearer ' + this.configuration.token };
    */
    const url = '/api/devices/' + this.id + '/function/apiHost';
    const headers = { 'Authorization': 'Bearer ' + this.userToken };
    const body = { arg: this.apiHost };
    const request$ = this.http.post(url, body, { headers: headers });
    request$.subscribe(
      data => {
        console.log('Success writing API Host', data);
        this.loadApiHost();
      },
      error => {
        console.log('ERROR writing Variable', error);
      }
    );
  }
}
