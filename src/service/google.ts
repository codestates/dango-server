import { OAuth2Client } from 'google-auth-library';
import config from '../config/key';

export default class GoogleAuth {
  static async getGoogleProfile(IdToken: string) {
    const client = new OAuth2Client(config.googleClientKey);
    const ticket = await client.verifyIdToken({
      idToken: IdToken,
    });
    const result = ticket.getPayload();
    return result;
  }
}
