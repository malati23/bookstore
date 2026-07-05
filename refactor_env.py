import os
import re

directories = [
    'd:/mongodb-Bookstore/frontend/src/api',
    'd:/mongodb-Bookstore/frontend/src/pages',
    'd:/mongodb-Bookstore/frontend/src/pages/admin',
]

pattern = re.compile(r'http://localhost:5000/api')

for directory in directories:
    if not os.path.exists(directory):
        continue
    for filename in os.listdir(directory):
        if not filename.endswith(('.js', '.jsx')):
            continue
            
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if pattern.search(content):
            # Replace 'http://localhost:5000/api' with import.meta.env.VITE_API_URL
            
            # Case 1: Within backticks `http://localhost:5000/api/...`
            content = re.sub(r'`http://localhost:5000/api/([^`]+)`', r'`${import.meta.env.VITE_API_URL}/\1`', content)
            
            # Case 1b: Exact backticks `http://localhost:5000/api`
            content = content.replace('`http://localhost:5000/api`', '`${import.meta.env.VITE_API_URL}`')
            
            # Case 2: Within quotes 'http://localhost:5000/api/...' -> `${import.meta.env.VITE_API_URL}/...`
            # For simplicity, if it's 'http://localhost:5000/api/something', change to `${import.meta.env.VITE_API_URL}/something`
            content = re.sub(r"\'http://localhost:5000/api/([^']+)\'", r"`${import.meta.env.VITE_API_URL}/\1`", content)
            content = re.sub(r'"http://localhost:5000/api/([^"]+)"', r"`${import.meta.env.VITE_API_URL}/\1`", content)
            
            # Case 2b: Exact quotes 'http://localhost:5000/api'
            content = content.replace("'http://localhost:5000/api'", "import.meta.env.VITE_API_URL")
            content = content.replace('"http://localhost:5000/api"', "import.meta.env.VITE_API_URL")
            
            # Case 3: In template literals where there's already variables
            # E.g. `http://localhost:5000/api/orders/${orderId}` -> `${import.meta.env.VITE_API_URL}/orders/${orderId}`
            # The regex for Case 1 should catch this, let's verify.
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")

