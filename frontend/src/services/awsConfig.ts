import { Amplify } from 'aws-amplify';

// Configuration AWS Cognito
const awsConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
      identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID,
      signUpVerificationMethod: 'code' as 'code' | 'link',
      loginWith: {
        email: true,
        phone: false,
        username: false,
      },
      oauth: {
        domain: import.meta.env.VITE_AWS_OAUTH_DOMAIN,
        scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
        redirectSignIn: import.meta.env.VITE_AWS_OAUTH_REDIRECT_SIGNIN || 'http://localhost:3000/',
        redirectSignOut: import.meta.env.VITE_AWS_OAUTH_REDIRECT_SIGNOUT || 'http://localhost:3000/',
        responseType: 'code' as 'code' | 'token',
      },
      storage: {
        getItem: (key: string) => localStorage.getItem(key),
        setItem: (key: string, value: string) => localStorage.setItem(key, value),
        removeItem: (key: string) => localStorage.removeItem(key),
      },
      userAttributes: {
        email: { required: true },
        name: { required: true },
        'custom:role': { required: false },
      },
    },
  },
};

Amplify.configure(awsConfig);

export { awsConfig };
export default awsConfig;
