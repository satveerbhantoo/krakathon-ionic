import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { auth } from 'firebase';

import { User } from '../../providers';
import { MainPage } from '../';
import { hostElement } from '@angular/core/src/render3/instructions';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { 
    email: string,  
    password: string,
    firstname: string,
    lastname: string 
  } = {
    email: '',
    password: '',
    firstname: '',
    lastname: ''
  };

  // Our translated text strings
  private signupErrorString: string;
  private AngularFireTest: any;
  constructor(public navCtrl: NavController, 
    public NgFire: AngularFireDatabase,
    public NgFireAuth: AngularFireAuth,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })

  }

  doSignup() {

    console.log('Sign up start');
    console.log('Sign up accountdetails: ', this.account);

    this.NgFireAuth.auth.createUserWithEmailAndPassword(this.account.email, this.account.password)
      .then((response) => {
        console.log('e', response);
        this.createUserInFirebase(response);
      })
      .catch((error) => {
        console.log('auth error', error);

        //display error message with toast
        let toast = this.toastCtrl.create({
          message: error.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }); 

    // Attempt to login in through our User service
    // this.user.signup(this.account).subscribe((resp) => {
    // }, (err) => {
    //   // Unable to sign up
    //   let toast = this.toastCtrl.create({
    //     message: this.signupErrorString,
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    // });
  }

  createUserInFirebase (userDetails){//create signed up user in DB
    console.log('initialising user in firebase');
    console.log(userDetails);
    const userRef = this.NgFire.object('users/' + userDetails.user.uid);
    userRef.set(this.account);

    let toast = this.toastCtrl.create({
      message: 'Account created successfully!',
      duration: 3000,
      position: 'top'
    });
    toast.present();

    this.navCtrl.push(MainPage);
  }
}
