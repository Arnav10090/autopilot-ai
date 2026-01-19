# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of AutoPilot AI seriously. If you discover a security vulnerability, please follow these steps:

### 📧 Private Disclosure

**DO NOT** open a public issue for security vulnerabilities.

Instead, please report security vulnerabilities by emailing:
- **Email**: [Your contact email here]
- **Subject**: [SECURITY] Brief description

### What to Include

Please include the following information:
- Type of vulnerability
- Full paths of affected source files
- Location of the affected code (tag/branch/commit)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

### Disclosure Policy

- We will acknowledge your report within 48 hours
- We will provide a more detailed response within 7 days
- We will keep you informed of our progress
- We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

When using AutoPilot AI:

### API Keys
- Never commit API keys to version control
- Use environment variables for sensitive data
- Rotate keys regularly
- Limit API key permissions to minimum required

### Environment Variables
- Keep `.env` files out of version control
- Use different keys for development and production
- Never share API keys in public channels

### Dependencies
- Regularly update dependencies
- Monitor security advisories
- Use `npm audit` to check for vulnerabilities

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically (when possible)
npm audit fix
```

### HTTPS
- Always use HTTPS in production
- Implement proper CORS policies
- Use secure headers

## Known Security Considerations

### Client-Side Export
- Export functionality runs entirely client-side
- No data is sent to external servers during export
- Generated documents are created in your browser

### API Integration
- Google AI API keys should be secured server-side
- Use environment variables for credentials
- Implement rate limiting on API calls

### User Data
- Currently, this is a demo application
- For production use, implement proper authentication
- Use secure session management
- Encrypt sensitive data at rest and in transit

## Security Updates

Security updates will be released as patch versions. Subscribe to releases to stay informed:
- Watch this repository for security advisories
- Check CHANGELOG.md for security-related updates

---

**Last Updated**: January 19, 2026
