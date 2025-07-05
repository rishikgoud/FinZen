# Contributing to FinZen

Thank you for your interest in contributing to FinZen! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- MongoDB (for local development)

### Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/finzen.git`
3. Install dependencies:
   ```bash
   cd finzen
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```
4. Set up environment variables (see `.env.example` files)
5. Start development servers:
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend (in another terminal)
   cd frontend && npm run dev
   ```

## Development Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Follow existing naming conventions
- Write meaningful commit messages
- Add comments for complex logic
- Use TypeScript for new components (if applicable)

### File Structure
```
finzen/
├── backend/          # Node.js/Express API
├── frontend/         # React application
├── docs/            # Documentation
└── README.md        # Project overview
```

### Testing
- Write tests for new features
- Ensure all tests pass before submitting
- Test both frontend and backend changes

## Pull Request Process

1. **Create a feature branch**: `git checkout -b feature/your-feature-name`
2. **Make your changes**: Follow the coding guidelines
3. **Test your changes**: Ensure everything works locally
4. **Commit your changes**: Use descriptive commit messages
5. **Push to your fork**: `git push origin feature/your-feature-name`
6. **Create a Pull Request**: Provide a clear description of changes

### Pull Request Guidelines
- Use a clear and descriptive title
- Describe the problem and solution
- Include screenshots for UI changes
- Reference any related issues
- Ensure the PR passes all checks

## Issue Reporting

### Bug Reports
- Use the bug report template
- Provide steps to reproduce
- Include expected vs actual behavior
- Add screenshots if applicable
- Specify your environment (OS, browser, etc.)

### Feature Requests
- Use the feature request template
- Explain the problem you're solving
- Describe the proposed solution
- Consider implementation complexity

## Code Review

### Review Process
- All PRs require at least one review
- Address review comments promptly
- Be respectful and constructive in feedback
- Focus on code quality and functionality

### Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed

## Security

### Security Guidelines
- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security guidelines
- Report security issues privately

### Reporting Security Issues
- Email: security@finzen.com
- Subject: [SECURITY] Issue Description
- Include detailed information about the vulnerability
- Do not disclose publicly until fixed

## Documentation

### Documentation Standards
- Keep documentation up to date
- Use clear and concise language
- Include code examples where helpful
- Update README files for new features

### Required Documentation
- API documentation for new endpoints
- Component documentation for new UI elements
- Setup instructions for new features
- Migration guides for breaking changes

## Release Process

### Versioning
We use [Semantic Versioning](https://semver.org/):
- MAJOR.MINOR.PATCH
- Breaking changes: MAJOR version
- New features: MINOR version
- Bug fixes: PATCH version

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version numbers updated
- [ ] Security review completed

## Community Guidelines

### Communication
- Be respectful and inclusive
- Use inclusive language
- Help newcomers
- Share knowledge and experience

### Recognition
- Contributors will be recognized in the project
- Significant contributions may be highlighted
- All contributors are valued and appreciated

## Getting Help

### Resources
- [Project Documentation](link-to-docs)
- [Issue Tracker](link-to-issues)
- [Discussion Forum](link-to-discussions)

### Contact
- General questions: support@finzen.com
- Technical issues: GitHub issues
- Security issues: security@finzen.com

## License

By contributing to FinZen, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to FinZen! 🚀 