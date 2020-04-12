const firebase = require('firebase');
require('firebase/firestore');

export default class Firebase
{
    constructor()
    {
        this._firebaseConfig = {
            apiKey: "AIzaSyCmBXDqBeo1H_uTf9M6qiQGiHX5rHEjoVY",
            authDomain: "whatsapp-clone-644dd.firebaseapp.com",
            databaseURL: "https://whatsapp-clone-644dd.firebaseio.com",
            projectId: "whatsapp-clone-644dd",
            storageBucket: "whatsapp-clone-644dd.appspot.com",
            messagingSenderId: "247942810564",
            appId: "1:247942810564:web:9ac3746348eeb902ea7291"
          };
        this.init();
    }

    init()
    {
        if(!window.initializedFirebase)
        {
            firebase.initializeApp(this.firebaseConfig);
            firebase.firestore();
            window.initializedFirebase = true;
        }
    }

    initAuth()
    {
        return new Promise((resolve, reject)=>{
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(response=>{
                const token = response.credential.accessToken;
                const user = response.user;
                
                resolve({user, token});

            }).catch(err=>{ reject(err); })
        });
    }

    static db() { return firebase.firestore(); }

    static hd() { return firebase.storage(); }

    /* ---- Getters ---- */
    get firebaseConfig() { return this._firebaseConfig; }
}