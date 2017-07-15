import Auth0Lock from 'react-native-lock';
import jwtDecode from 'jwt-decode';
import AsyncStorage from 'AsyncStorage';

export default class AuthService {
  constructor(clientId, domain) {
    // Configure Auth0
    this.lock = new Auth0Lock({ clientId, domain });
    this.clientId = clientId;
    this.login = this.login.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.getToken = this.getToken.bind(this);
    this.setToken = this.setToken.bind(this);
    this.logout = this.logout.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  setToken(auth){
    return Promise.all([
      AsyncStorage.setItem(`auth`, JSON.stringify(auth)),
      AsyncStorage.setItem(`touchID`, "true"),
    ]);
  }

  onLogin(err, profile, token, resolve, reject) {
    if(err || !(token && profile)) {
      reject(err);
      this.logout();
      return;
    }
    this.setToken({ profile, token }).then(
      () => resolve({ profile, token })).catch(e => reject(e));
  }

  login(options = {}) {
    const standardOptions = {
      closable: true,
      scopes: ['offline_access'],
      defaultADUsernameFromEmailPrefix: true,
      cleanOnError: true,
      authParams: {
        connection: 'Username-Password-Authentication',
      },
    };
    const touchOpt = { connections: ["touchid"] };
    return new Promise(
      (resolve, reject) => AsyncStorage.getItem(`touchID`).then(
        (touchid) => {
          const opt = Object.assign({}, standardOptions, options);
          if(touchid) {
            Object.assign(opt, touchOpt);
          }
          this.lock.show(opt, (err, profile, token) =>  {
            this.onLogin(err, profile, token, resolve, reject)
          });
        }).catch(e => {
          reject(e)
          console.error(e);
        }));
  }

  isTokenGood(token) {
    const now =  Math.floor(Date.now() / 1000);
    return !!(token && (jwtDecode(token.idToken).exp >= now));
  }

  isLoggedIn() {
    return new Promise(
      resolve => this.getToken().then(auth => {
        if (!auth) {
          return resolve(false);
        }
        if (!this.isTokenGood(auth.token)) {
          return resolve(false);
        }
        resolve(auth);
      }));
  }

  getToken() {
    return new Promise(
      resolve => AsyncStorage.getItem(`auth`).then(
        (result) => resolve(result && JSON.parse(result))));
  }

  logout(options={}) {
    const prom = options.removeTouch ? AsyncStorage.removeItem(`touchID`) : () => Promise.resolve();
    return Promise.all([
      AsyncStorage.removeItem(`auth`),
      prom,
    ]);
  }
}
