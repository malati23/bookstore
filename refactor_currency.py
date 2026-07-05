import os
import re

files_to_process = [
    'frontend/src/components/BookCard.jsx',
    'frontend/src/components/BookInfo.jsx',
    'frontend/src/component/Freebook.jsx',
    'frontend/src/components/CartItem.jsx',
    'frontend/src/components/CartSummary.jsx',
    'frontend/src/components/WishlistCard.jsx',
    'frontend/src/pages/Checkout.jsx',
    'frontend/src/pages/Payment.jsx',
    'frontend/src/pages/PaymentSuccess.jsx',
    'frontend/src/pages/OrderSuccess.jsx',
    'frontend/src/pages/Orders.jsx',
    'frontend/src/pages/OrderDetails.jsx',
    'frontend/src/pages/admin/AdminDashboard.jsx',
    'frontend/src/pages/admin/ManageBooks.jsx',
    'frontend/src/pages/admin/ManageOrders.jsx',
    'frontend/src/pages/admin/Analytics.jsx',
    'frontend/src/pages/admin/AddBook.jsx',
    'frontend/src/pages/admin/EditBook.jsx'
]

for file_path in files_to_process:
    full_path = os.path.join('d:/mongodb-Bookstore', file_path)
    if not os.path.exists(full_path):
        print(f"Skipping {file_path}")
        continue
        
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original_content = content
    
    import_path = '../../utils/currency' if 'pages/admin' in file_path else '../utils/currency'
    import_statement = f"import {{ formatCurrency }} from '{import_path}';\n"
    
    # 1. Replace template literal cases: `Pay $$...` -> `Pay ${formatCurrency(...)}`
    # e.g. `Pay $${state.totalAmount.toFixed(2)}` -> `Pay ${formatCurrency(state.totalAmount)}`
    content = re.sub(r'\$\$\{\s*\(([^}]+?)\)\s*\.toFixed\(\d+\)\s*\}', r'${formatCurrency(\1)}', content)
    content = re.sub(r'\$\$\{\s*([^}]+?)\?\.\s*toFixed\(\d+\)\s*\}', r'${formatCurrency(\1)}', content)
    content = re.sub(r'\$\$\{\s*([^}]+?)\s*\.toFixed\(\d+\)\s*\}', r'${formatCurrency(\1)}', content)
    
    # 2. Replace standard JSX cases: ${price.toFixed(2)} -> {formatCurrency(price)}
    # e.g. ${(order.totalAmount || 0).toFixed(2)} -> {formatCurrency(order.totalAmount || 0)}
    content = re.sub(r'\$\s*\{\s*\(([^}]+?)\)\s*\.toFixed\(\d+\)\s*\}', r'{formatCurrency(\1)}', content)
    content = re.sub(r'\$\s*\{\s*([^}]+?)\?\.\s*toFixed\(\d+\)\s*\}', r'{formatCurrency(\1)}', content)
    content = re.sub(r'\$\s*\{\s*([^}]+?)\s*\.toFixed\(\d+\)\s*\}', r'{formatCurrency(\1)}', content)

    # 3. Replace labels
    content = content.replace('Price ($)', 'Price (₹)')
    content = content.replace("'$'", "'₹'")
    content = content.replace('"$"', '"₹"')
    
    if content != original_content:
        # Add import
        if 'formatCurrency' in content and 'import { formatCurrency }' not in content:
            lines = content.split('\n')
            # insert after first line
            lines.insert(1, import_statement)
            content = '\n'.join(lines)
            
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")
