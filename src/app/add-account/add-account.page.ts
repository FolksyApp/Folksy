import { Component, OnInit } from '@angular/core';
import { WindowService } from '../window.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.page.html',
  styleUrls: ['./add-account.page.scss'],
})
export class AddAccountPage implements OnInit {

  countries : any[] = [
    {
      name: 'India',
      value: '+91'
    },
    {
      name: 'USA',
      value: '+1'
    },
    {
      name: 'UK',
      value: '+44'
    },
    {
      name: 'China',
      value: '+86'
    },
  ]

  windowRef: any;
  phoneNumber: string;
  verificationCode: string;
  countryCode: string;
  user: any;

  constructor( private win: WindowService, private router: Router, private toast: ToastController ) { }

  ngOnInit() {
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVarifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
    this.windowRef.recaptchaVarifier.render()
  }

  sendCode(){
    const appVerifire = this.windowRef.recaptchaVarifier;
    const num = this.countryCode+this.phoneNumber;
    firebase.auth().signInWithPhoneNumber(num, appVerifire)
    .then(async result =>{
      this.windowRef.confirmationResult = result;
      const toast = await this.toast.create({
        message: 'One Time Password has been send',
        duration: 5000,
        closeButtonText: 'close',
        showCloseButton: true
      });
      toast.present();
    })
    .catch(async (error) => {
      if(error){
        const toast = await this.toast.create({
          message: error.message,
          duration: 5000,
          closeButtonText: 'close',
          showCloseButton: true
        });
        toast.present();
      };
    });
  }

  verifyCode(){
    this.windowRef.confirmationResult.confirm(this.verificationCode)
    .then(async result => {
      this.user = result.user;
      if(!this.user){
        console.log("Invalid code");
      }else{
        const toast = await this.toast.create({
          message: "You are now logged in",
          duration: 5000,
          closeButtonText: 'Close',
          showCloseButton: true
        });
        toast.present();
        this.router.navigate(['/home']);
      }
    })
    .catch(async (error) => {
      if(error){
        const toast = await this.toast.create({
          message: "The code you given is ivalid",
          duration: 5000,
          closeButtonText: 'Close',
          showCloseButton: true
        });
        toast.present();
      }
    })
  }

}
