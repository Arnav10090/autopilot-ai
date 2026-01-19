# Contributing to AutoPilot AI

First off, thank you for considering contributing to AutoPilot AI! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Note your environment** (OS, browser, Node version)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would be used**

### 🔧 Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Commit** with clear, descriptive messages
6. **Push** to your fork
7. **Submit a pull request**

#### Pull Request Guidelines

- Follow the existing code style
- Write clear commit messages
- Update documentation for any changed functionality
- Add tests for new features
- Ensure all tests pass
- Keep PRs focused on a single concern

## Development Setup

### Prerequisites
- Node.js 20.x or higher
- npm 9.x or higher

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/autopilot-ai.git
cd autopilot-ai

# Install dependencies
npm install

# Create a new branch
git checkout -b feature/my-new-feature

# Start development server
npm run dev

# Run linting
npm run lint
```

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types, avoid `any`
- Use interfaces for object shapes
- Prefer functional components

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Add proper accessibility attributes

### Styling
- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design
- Test in both light and dark modes

### Accessibility
- All interactive elements must be keyboard accessible
- Maintain WCAG AA compliance
- Add proper ARIA labels
- Test with screen readers

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests

Example:
```
feat: Add export to Excel functionality

- Implement Excel export service
- Add export button to analytics page
- Update documentation

Closes #123
```

### Commit Message Prefixes

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Project Structure

```
autopilot-ai/
├── app/                    # Next.js app directory
│   ├── (main)/            # Main app routes
│   ├── auth/              # Authentication pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── global/           # Global components (Header, Footer)
│   ├── ui/               # UI primitives (Button, Card)
│   └── ProjectDetail/    # Project-specific components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── services/             # Business logic and utilities
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── backend/              # Backend API
```

## Testing

Before submitting a PR, ensure:

- [ ] Code follows the style guidelines
- [ ] No console errors or warnings
- [ ] All existing tests pass
- [ ] New tests added for new features
- [ ] Accessibility requirements met
- [ ] Responsive design tested
- [ ] Dark mode tested

## Questions?

Feel free to open an issue with the `question` label or join our discussions.

## Recognition

Contributors will be recognized in our README and release notes.

---

Thank you for contributing to AutoPilot AI! 🚀
