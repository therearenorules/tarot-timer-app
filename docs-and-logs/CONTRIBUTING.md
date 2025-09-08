# Contributing to Tarot Timer App

Thank you for considering contributing to the Tarot Timer App! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/tarot-timer-app.git
   cd tarot-timer-app
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start development server**:
   ```bash
   npm start
   ```

## 🌿 Branching Strategy

We follow a **Feature Branch Workflow**:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - Individual features
- `fix/bug-name` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes

### Branch Naming Convention
```
feature/user-authentication
fix/timer-memory-leak  
hotfix/critical-crash
docs/update-readme
refactor/component-structure
```

## 📝 Commit Message Convention

We use **Conventional Commits** for clear commit history:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Build process or auxiliary tool changes
- `perf` - Performance improvements
- `ci` - CI/CD changes

### Examples
```bash
feat(auth): add user login functionality
fix(timer): resolve memory leak in timer component
docs(readme): update installation instructions
refactor(ui): extract common button component
```

## 🔍 Code Quality Standards

### TypeScript
- All code must pass TypeScript compilation
- Use proper typing, avoid `any`
- Follow existing interface patterns

### Code Style
- Use existing project patterns and conventions
- Write self-documenting code with clear variable names
- Add comments for complex logic
- Follow React Native and Expo best practices

### Performance
- Optimize for mobile devices
- Use React.memo() for expensive components
- Implement proper loading states
- Consider bundle size impact

## 🧪 Testing

Before submitting a PR, ensure:

- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] Manual testing completed
- [ ] No console errors or warnings
- [ ] Assets validated (`npm run assets:validate`)

### Platform Testing Checklist
- [ ] Web (Chrome, Safari, Firefox)
- [ ] iOS Simulator
- [ ] Android Emulator
- [ ] Physical devices (if possible)

## 📋 Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following code quality standards

3. **Test thoroughly** across platforms

4. **Commit using conventional format**:
   ```bash
   git commit -m "feat(scope): add new feature"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request** with:
   - Clear description of changes
   - Screenshots/GIFs for UI changes
   - Checklist completion
   - Reference related issues

7. **Address review feedback** promptly

## 🏗️ Project Structure

```
src/
├── app/              # Expo Router pages
├── components/       # Reusable components
├── assets/          # Images, decks, spreads
├── lib/             # Utilities and services
├── stores/          # Zustand state management
├── types/           # TypeScript definitions
└── constants/       # App constants
```

## 📱 Platform Considerations

### iOS Specific
- Test on various iPhone sizes
- Consider safe area constraints
- Validate gesture interactions

### Android Specific  
- Test on different Android versions
- Verify back button behavior
- Check notification handling

### Web Specific
- Ensure responsive design
- Test keyboard navigation
- Validate accessibility

## 🔒 Security Guidelines

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Follow secure coding practices
- Report security vulnerabilities privately

## 🐛 Bug Reports

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) with:
- Clear reproduction steps
- Expected vs actual behavior
- Screenshots/logs
- Platform and version info

## 💡 Feature Requests

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) with:
- Problem statement
- Proposed solution
- User stories
- Acceptance criteria

## 📞 Getting Help

- Check existing issues and PRs
- Review project documentation
- Ask questions in issue discussions
- Follow conventional patterns in codebase

## 🏆 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes for significant contributions
- Special thanks in major milestone announcements

Thank you for contributing to the Tarot Timer App! 🔮✨