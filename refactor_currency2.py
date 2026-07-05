import os
import re

files_to_process = [
    'frontend/src/component/Freebook.jsx',
    'frontend/src/pages/admin/AdminDashboard.jsx',
    'frontend/src/components/Cards.jsx', # just in case
    'frontend/src/pages/Cart.jsx', # The grep showed Cart.jsx wasn't fully fixed? Let's check.
]

for file_path in files_to_process:
    full_path = os.path.join('d:/mongodb-Bookstore', file_path)
    if not os.path.exists(full_path):
        continue
        
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original_content = content
    
    # 1. Catch ${item.price}
    content = re.sub(r'\$\s*\{\s*([^}]+?)\s*\}', r'{formatCurrency(\1)}', content)
    
    # 2. Catch literal $45.99 or $124.5k
    content = re.sub(r'\$(\d+(?:\.\d+)?[kK]?)', r'₹\1', content)
    
    if content != original_content:
        import_path = '../../utils/currency' if 'pages/admin' in file_path else '../utils/currency'
        if 'formatCurrency' in content and 'import { formatCurrency }' not in content:
            lines = content.split('\n')
            lines.insert(1, f"import {{ formatCurrency }} from '{import_path}';\n")
            content = '\n'.join(lines)
            
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")
