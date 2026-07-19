# Lab Analysis Dashboard

A bilingual Zoetis-styled dashboard for completed laboratory tests stored in a private Google Sheet.

## Privacy model

The repository contains no laboratory records. The public GitHub Pages shell asks each viewer to authorize Google Sheets read-only access. Google only returns workbook data when the signed-in account already has permission to open the configured Sheet.

Access tokens are held in browser memory and are not committed, logged, or sent anywhere except Google Sheets API requests.

## Google Cloud setup

1. Enable the Google Sheets API in a Google Cloud project.
2. Configure the OAuth consent screen and add the allowed users.
3. Create an OAuth 2.0 Client ID of type **Web application**.
4. Add the deployed GitHub Pages URL as an **Authorized JavaScript origin**.
5. Replace `YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com` in `config.js` with the client ID.

## Data contract

The dashboard reads these tabs:

- `ELISA Results`
- `HI Results`
- `PCR Results`
- `Antibiotic Results`
- `Bacteriology Results`

Repeated antibiotic or bacteriology rows with the same Test ID are treated as one test. Only records whose status is `Complete` appear in metrics and charts.

## Checks

```sh
npm test
npm run validate
```
