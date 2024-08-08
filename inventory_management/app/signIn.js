'use client';

import React, { useEffect } from 'react';
import { firebase, firebaseui } from '@/firebase'; // Adjust the path as necessary

const SignIn = () => {
  useEffect(() => {
    // FirebaseUI configuration
    const uiConfig = {
      signInSuccessUrl: '/signedIn', // URL to redirect to after a successful sign-in
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
    };

    // Initialize the FirebaseUI Widget using Firebase.
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  }, []); // Empty dependency array to run this effect only once on mount

  return (
    <div>
      <h1>Sign In</h1>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default SignIn;
