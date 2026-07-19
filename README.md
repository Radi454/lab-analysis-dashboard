# Lab Analysis Dashboard

A bilingual Zoetis-styled dashboard for completed laboratory tests, published
on GitHub Pages with private email/password access.

## Security model

- Supabase Auth handles user passwords and sessions.
- The public site contains only a Supabase publishable key; it contains no
  secret or service-role credential.
- `authorized_users` is the server-side access list. A signed-in user can read
  only their own active access record.
- `lab_result_rows` is protected by Row Level Security. Results are returned
  only when the signed-in email has an active approved-user record.
- The Google Sheet and Supabase mirror are updated together through the managed
  MCP data-entry workflow.

## User workflow

1. Add the user’s email, display name, role, and active status to the
   `Authorized Users` Sheet tab.
2. Synchronize the approved user through the managed MCP workflow.
3. The user selects **First time? Create password** on the dashboard and
   confirms their email.
4. Admin and User roles both see all laboratory data. The role is shown in the
   dashboard header.

Passwords never belong in the Google Sheet.

## Data model

The core Sheet tabs are:

- `ELISA Results`
- `HI Results`
- `PCR Results`
- `Antibiotic Results`
- `Bacteriology Results`
- `Authorized Users`

Repeated antibiotic or bacteriology rows with the same Test ID are treated as
one test. Only records whose status is `Complete` appear in metrics and charts.
`Added At` and `Added By` provide the audit trail used by the recent-results
history.

## Checks

```sh
npm test
npm run build
```
