# @rt/test-unit

This package contains shared Jest configuration and test utilities for unit testing across the RT Widget Demo project.

## Usage

1. Add this package as a dependency in your package.json:
```json
{
  "dependencies": {
    "@rt/test-unit": "1.0.0"
  }
}
```

2. Create a jest.config.js in your package that extends this configuration:
```javascript
const baseConfig = require('@rt/test-unit/jest.config');

module.exports = {
  ...baseConfig,
  // Add any package-specific overrides here
};
```

3. Import test utilities as needed:
```typescript
import '@testing-library/jest-dom';
``` 