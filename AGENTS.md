# AGENTS.md - Coding Guidelines for ComuniApp

## Project Overview

**Type:** Node.js/Express REST API  
**Database:** MySQL with connection pooling  
**Module System:** ES Modules (`"type": "module"`)  
**Architecture:** Layered MVC (Controllers → Services → Database)  
**Language:** JavaScript (no TypeScript)

---

## Build, Lint & Test Commands

### Development
```bash
npm run dev      # Start with nodemon (auto-reload on changes)
```

### Production
```bash
npm start        # Run index.js
```

### Linting
```bash
npm run lint     # Run ESLint on entire codebase
```

### Testing
**Status:** No test framework currently configured.

**Setup recommendation:** Jest + Supertest for integration tests
```bash
# Future: npm test
```

### Environment Setup
Create `.env` file in root with:
```
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=comuniapp
```

---

## Code Style Guidelines

### Architecture Pattern: Layered MVC

**Controllers** (`src/controllers/`) - HTTP layer
- Handle request/response, status codes, validation errors
- Extract and pass data to services
- Use `try-catch` with `next(err)` for error handling

**Services** (`src/services/`) - Business logic layer
- Contain all business logic and database operations
- Throw errors (caught by controllers)
- Return plain data (no Express objects)
- Examples: `createUser()`, `deleteUserService()`

**Routes** (`src/routes/`) - Endpoint mapping
- Mount routes on routers
- Connect controllers to HTTP methods
- Keep route handlers thin (delegate to controllers)

**Example Flow:**
```
Route: POST /api/users
  → Controller: createUserController()
    → Validate input (Joi schema)
    → Service: createUser()
      → Hash password (bcrypt)
      → Check duplicates
      → Insert to DB
    → Return 201 JSON response
  → Error middleware: handleError()
```

### Module System: ES Modules + Exports

**Pattern: Named exports + Barrel exports**

Controllers use both named and default exports:
```javascript
// src/controllers/usersControllers/createUserController.js
export const createUserController = async (req, res, next) => { /* ... */ };
export default createUserController;

// src/controllers/usersControllers/indexUsersController.js
import createUser from './createUserController.js';
import deleteUser from './deleteUserController.js';
export { createUser, deleteUser, /* ... */ };
```

Services use named functions:
```javascript
// src/services/usersServices/createUserService.js
export async function createUser({ nombre, email, password }) { /* ... */ }

// src/services/usersServices/indexUsersServices.js
export { createUser, deleteUser, updateUser, getUsers, getUserById };
```

**Import conventions:**
```javascript
import { createUserController } from '../controllers/usersControllers/indexUsersController.js';
import { createUser } from '../services/usersServices/indexUsersServices.js';
```

### Naming Conventions

**camelCase for all variables, functions, and parameters:**
- Functions: `createUserController`, `deleteUser`, `getUserById`
- Variables: `userId`, `userData`, `newUser`
- Parameters: Use English names consistently (`name`, `email`, not `nombre`)

**Note:** Codebase currently mixes Spanish/English (e.g., DB columns use `nombre`). Maintain consistency within new code using English parameter names in function signatures.

**File naming:**
- Feature folder: lowercase (`usersControllers/`, `usersServices/`)
- Files: descriptive camelCase with feature suffix (`createUserController.js`)
- Barrel files: `index{Feature}.js` (e.g., `indexUsersServices.js`)

### Error Handling

**Three-layer approach:**

1. **Controllers: Catch and pass to middleware**
```javascript
export const createUserController = async (req, res, next) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return next(createError(400, error.details[0].message));
        const newUser = await createUser({ name, email, password });
        res.status(201).json(newUser);
    } catch (err) {
        next(err);  // Pass to global error handler
    }
};
```

2. **Services: Throw descriptive errors**
```javascript
export async function deleteUser(userId) {
    const [existing] = await db.query('SELECT id FROM usuarios WHERE id = ?', [userId]);
    if (existing.length === 0) {
        throw new Error('Usuario no encontrado');  // Service doesn't set status
    }
    // ... deletion logic
}
```

3. **Global error middleware: Respond to client**
```javascript
export function handleError(err, req, res, next) {
    console.error(`[Error]: ${err.message}`);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
}

// Helper to create errors with custom status
export function createError(message, statusCode = 500) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}
```

### Validation: Joi Schemas

Store validation schemas in `src/schemas/`:
```javascript
// src/schemas/usersSchemas.js
import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});
```

Validate in controllers:
```javascript
const { error, value } = registerSchema.validate(req.body);
if (error) return next(createError(400, error.details[0].message));
```

### Type Hints: JSDoc

Add JSDoc comments to important functions:
```javascript
/**
 * Create a new user in the database
 * @param {Object} userData
 * @param {string} userData.nombre
 * @param {string} userData.email
 * @param {string} userData.password
 * @returns {Promise<Object>} User object without password
 * @throws {Error} If user already exists
 */
export async function createUser({ nombre, email, password }) { /* ... */ }
```

### Security Best Practices

**Passwords:**
- Always hash with bcrypt before storing: `bcrypt.hash(password, 10)`
- Never return passwords in responses
- Never log passwords

**Database:**
- Use prepared statements (parameterized queries) to prevent SQL injection:
```javascript
// ✓ Correct
await db.query('SELECT * FROM usuarios WHERE id = ?', [userId]);

// ✗ Avoid string concatenation
// db.query(`SELECT * FROM usuarios WHERE id = ${userId}`);
```

### Comments & Documentation

**Inline comments:** Explain "why", not "what"
```javascript
// ✓ Good - explains intention
// Hash password before storing for security
const hash = await bcrypt.hash(password, 10);

// ✗ Avoid - obvious what code does
const hash = await bcrypt.hash(password, 10);  // Hash the password
```

**Language:** Comments in Spanish are acceptable (codebase uses Spanish). Keep consistent within each file.

### Middleware Pattern

**Stack order in index.js:**
```javascript
app.use(express.json());           // 1. Parse JSON bodies
app.use('/api', apiRoutes);        // 2. Route handling
app.use((req, res) => { /* 404 */ });  // 3. 404 handler
app.use(handleError);              // 4. Error handler (MUST be last)
```

Error middleware signature: `(err, req, res, next) => {}`  
Must have 4 parameters (Express requirement).

---

## Key Patterns

### Service/Controller Separation

**Services:** Pure business logic, database operations, no Express knowledge
```javascript
export async function getUserById(userId) {
    const [users] = await db.query('SELECT * FROM usuarios WHERE id = ?', [userId]);
    if (users.length === 0) throw new Error('Usuario no encontrado');
    return users[0];
}
```

**Controllers:** HTTP concerns, validation, response formatting
```javascript
export const getUserByIdController = async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};
```

### Dependency Pattern

Database pool imported as `db` in services:
```javascript
import db from '../../db/indexDb.js';
// Use: await db.query(sql, [params])
```

Joi schemas imported in controllers:
```javascript
import { registerSchema } from '../schemas/usersSchemas.js';
```

---

## Common Tasks

**Add new endpoint:**
1. Create `src/c
