import React, { useState } from 'react';
import { FiSearch, FiChevronDown, FiPhone, FiMail, FiMessageCircle } from 'react-icons/fi';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';
import { Link } from 'react-router-dom';

const faqData = [
  {
    category: 'Account',
    items: [
      { q: 'How do I create an account?', a: 'Click on the Login button in the top right corner and select "Sign Up". Fill in your details and you are good to go!' },
      { q: 'How do I reset my password?', a: 'Go to the Login page and click on "Forgot Password". Enter your email and follow the instructions sent to your inbox.' },
      { q: 'How do I update my profile?', a: 'Log in to your account, navigate to the Profile section, and click on "Edit Profile" to update your information.' },
    ]
  },
  {
    category: 'Orders',
    items: [
      { q: 'How do I place an order?', a: 'Browse our shop, click "Add to Cart" on the books you want, proceed to checkout, and follow the steps to complete your purchase.' },
      { q: 'How can I track my order?', a: 'You can track your order by logging into your account and going to "My Orders". Click on the specific order to view its status.' },
      { q: 'Can I cancel my order?', a: 'Orders can only be canceled if they are in "Pending" status. Contact our support team immediately if you need to cancel.' },
    ]
  },
  {
    category: 'Payments',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept major credit cards (Visa, MasterCard), PayPal, and Cash on Delivery.' },
      { q: 'Is Cash on Delivery available?', a: 'Yes, Cash on Delivery is available for most locations. You can select this option during checkout.' },
      { q: 'Is online payment secure?', a: 'Absolutely. All online payments are processed through secure, encrypted gateways to ensure your data is safe.' },
    ]
  },
  {
    category: 'Shipping',
    items: [
      { q: 'How long does delivery take?', a: 'Standard delivery usually takes 3-5 business days depending on your location.' },
      { q: 'Do you deliver nationwide?', a: 'Yes, we deliver to all major cities and towns across the country.' },
      { q: 'How are shipping charges calculated?', a: 'Shipping charges are calculated based on your location and the total weight of your order. You will see the final shipping cost at checkout before payment.' },
    ]
  },
  {
    category: 'Returns & Refunds',
    items: [
      { q: 'How do I return a book?', a: 'If you received a damaged or incorrect book, you can initiate a return within 7 days of delivery from the "My Orders" page.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item.' },
    ]
  }
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null); // Stores "categoryIndex-itemIndex" to ensure only one is open

  const toggleAccordion = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  // Filter FAQs based on search
  const filteredData = faqData.map(category => {
    return {
      ...category,
      items: category.items.filter(item => 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
    };
  }).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navebar />

      {/* Hero Section */}
      <section className="bg-pink-500 text-white py-16 px-4 pt-32">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-down">Frequently Asked Questions</h1>
          <p className="text-xl md:text-2xl opacity-90">Find answers to the most common questions.</p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        {/* Search Bar */}
        <div className="relative mb-12 shadow-sm rounded-2xl overflow-hidden max-w-2xl mx-auto border border-gray-200 bg-white flex items-center transition-shadow focus-within:ring-2 focus-within:ring-pink-500">
          <FiSearch className="absolute left-4 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for an answer..." 
            className="w-full py-4 pl-12 pr-4 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FAQs */}
        <div className="space-y-8 min-h-[400px]">
          {filteredData.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
              <FiMessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No FAQs found.</h3>
              <p>Please contact support if you can't find what you're looking for.</p>
            </div>
          ) : (
            filteredData.map((category, catIdx) => (
              <div key={catIdx} className="mb-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-pink-500 inline-block pb-1">{category.category}</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                  {category.items.map((item, itemIdx) => {
                    const currentIndex = `${catIdx}-${itemIdx}`;
                    const isOpen = openIndex === currentIndex;
                    return (
                      <div key={itemIdx} className="overflow-hidden">
                        <button 
                          className={`w-full flex justify-between items-center text-left p-5 transition-colors ${isOpen ? 'bg-pink-50/50' : 'hover:bg-gray-50'}`}
                          onClick={() => toggleAccordion(currentIndex)}
                        >
                          <span className={`font-semibold ${isOpen ? 'text-pink-600' : 'text-gray-800'}`}>{item.q}</span>
                          <FiChevronDown className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-pink-500' : 'text-gray-400'}`} size={20} />
                        </button>
                        <div 
                          className={`transition-all duration-300 ease-in-out px-5 overflow-hidden ${isOpen ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                        >
                          <p className="text-gray-600">{item.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Still Need Help Section */}
      <section className="bg-white border-t border-gray-200 py-16 px-4 text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-8">Our support team is always ready to answer your questions.</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-3 text-gray-700 bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                <FiMail size={20} />
              </div>
              <span className="font-semibold">support@bookstore.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <FiPhone size={20} />
              </div>
              <span className="font-semibold">+1 (555) 123-4567</span>
            </div>
          </div>
          
          <Link to="/contact" className="inline-block px-8 py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-colors shadow-md hover:shadow-lg">
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
