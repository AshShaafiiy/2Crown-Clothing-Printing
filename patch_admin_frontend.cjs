const fs = require('fs');
let code = fs.readFileSync('src/views/admin/Administrators.tsx', 'utf8');

code = code.replace(
  `        await services.rbac.createUser({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          active: true
        } as Omit<User, 'id'>, user);`,
  `        await services.rbac.createUser({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          active: true,
          password: formData.password
        } as any, user);`
);
fs.writeFileSync('src/views/admin/Administrators.tsx', code);
