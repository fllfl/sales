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
    this.token = null;
    this.logout = this.logout.bind(this);
  }

  setToken(auth){
    return AsyncStorage.setItem(`auth-${this.clientId}`, JSON.stringify(auth));
  }

  login(options = {}) {
    const onLogin = (err, profile, token, resolve, reject) => {
      if(err) {
        this.setToken(null)
        reject(err);
      }
      this.setToken({ profile, token }).then(() => resolve({ profile, token }));
    };

    const standardOptions =  {
      closable: true,
      scopes: 'offiline_access',
      authParams: {
        connection: 'Username-Password-Authentication',
      },
    }
    return new Promise((resolve, reject) => {
      this.lock.show(Object.assign({}, standardOptions, options),
        (err, profile, token) => onLogin(err, profile, token, resolve, reject));
    });
  }

  isTokenGood({ token }) {
    const now =  Math.floor(Date.now() / 1000);
    return !!(token && (jwtDecode(token.idToken).exp >= now));
  }

  isLoggedIn() {
    if(this.auth && this.auth.token) {
      return Promise.resolve(this.isTokenGood(this.auth.token));
    }
    return new Promise(resolve => {
      this.getToken().then(auth => {
        if (!auth) {
          return resolve(false);
        }
        if (!this.isTokenGood(auth)) {
          return resolve(false);
        }
        this.auth = auth;
        resolve(true);
      });
    });
  }


  getToken() {
    return new Promise(
      resolve => AsyncStorage.getItem(`auth-${this.clientId}`).then(
        (result) => resolve(JSON.parse(result))));
  }

  logout() {
    // Clear user token and profile data from local storage
    AsyncStorage.removeItem(`auth-${this.clientId}`);
  }
}
