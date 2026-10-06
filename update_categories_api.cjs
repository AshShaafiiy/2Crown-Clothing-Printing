const fs = require('fs');

const slugifyStr = `
function generateSlug(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
`;

function updatePost() {
  const path = 'app/api/categories/route.ts';
  let content = fs.readFileSync(path, 'utf8');
  
  if (!content.includes('generateSlug')) {
    content = content.replace('export async function GET', slugifyStr + '\nexport async function GET');
  }

  // Update POST to use slug
  content = content.replace(
    /const newCategory = await categoryRepository\.create\(\{ id: uuid\(\), \.\.\.data, createdAt: new Date\(\)\.toISOString\(\) \}\);/g,
    `data.slug = generateSlug(data.name);
  const existingBySlug = await categoryRepository.findBySlug(data.slug);
  if (existingBySlug) {
    return NextResponse.json({ error: 'A category with a similar name already exists.' }, { status: 409 });
  }
  const newCategory = await categoryRepository.create({ id: uuid(), ...data, createdAt: new Date().toISOString() });`
  );
  
  fs.writeFileSync(path, content);
}

function updatePut() {
  const path = 'app/api/categories/[id]/route.ts';
  let content = fs.readFileSync(path, 'utf8');
  
  if (!content.includes('generateSlug')) {
    content = content.replace('export async function GET', slugifyStr + '\nexport async function GET');
  }

  // Update PUT
  content = content.replace(
    /const updated = await categoryRepository\.update\(id, data!\);/g,
    `data.slug = generateSlug(data.name);
  const existingBySlug = await categoryRepository.findBySlug(data.slug);
  if (existingBySlug && existingBySlug.id !== id) {
    return NextResponse.json({ error: 'A category with a similar name already exists.' }, { status: 409 });
  }
  const updated = await categoryRepository.update(id, data!);`
  );
  
  fs.writeFileSync(path, content);
}

updatePost();
updatePut();
