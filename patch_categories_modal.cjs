const fs = require('fs');
const file = 'src/pages/admin/Categories.tsx';
let content = fs.readFileSync(file, 'utf8');

const modalHtml = `
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Add Category</h2>
            {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
            <div className="space-y-4 mb-4">
              <div><label className="block text-sm font-medium">Name</label><input type="text" className="mt-1 block w-full border rounded p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div><label className="block text-sm font-medium">Description</label><textarea className="mt-1 block w-full border rounded p-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
              <div><label className="block text-sm font-medium">Order</label><input type="number" className="mt-1 block w-full border rounded p-2" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} /></div>
              <div><label className="flex items-center"><input type="checkbox" className="mr-2" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} /> Active</label></div>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
            </div>
          </div>
        </div>
      )}`;

content = content.replace(/<\/div>\s*\}\)\s*<\/div>\s*\);\s*};\s*export default Categories;/g, "");
// wait, the actual ending is:
//       )}
//     </div>
//   );
// };
// 
// export default Categories;

content = content.split('      )}\n    </div>\n  );\n};\n\nexport default Categories;');
if(content.length === 2) {
    fs.writeFileSync(file, content[0] + '      )}\n' + modalHtml + '\n    </div>\n  );\n};\n\nexport default Categories;');
} else {
    console.log("Failed to match ending!");
}

