import React from 'react';
import { FiBookOpen, FiTruck, FiShield, FiCornerUpLeft, FiHeadphones, FiAward, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';
import Navebar from '../component/Navebar';
import Footer from '../component/Footer';

const About = () => {
  const stats = [
    { label: 'Books Available', value: '10,000+' },
    { label: 'Happy Customers', value: '5,000+' },
    { label: 'Orders Delivered', value: '2,000+' },
    { label: 'Average Rating', value: '4.9/5' }
  ];

  const features = [
    { icon: <FiBookOpen size={24} />, title: 'Huge Book Collection', desc: 'Find books across all genres and languages.' },
    { icon: <FiTruck size={24} />, title: 'Fast Delivery', desc: 'Get your books delivered safely and quickly.' },
    { icon: <FiShield size={24} />, title: 'Secure Payments', desc: '100% secure payment gateways.' },
    { icon: <FiCornerUpLeft size={24} />, title: 'Easy Returns', desc: 'Hassle-free 7-day return policy.' },
    { icon: <FiHeadphones size={24} />, title: '24/7 Customer Support', desc: 'We are here to help you anytime.' },
    { icon: <FiAward size={24} />, title: 'Trusted by Thousands', desc: 'Over 5000+ satisfied readers.' }
  ];

  const team = [
    { name: 'John Doe', role: 'Founder & CEO', bio: 'A passionate reader who wanted to make books accessible to everyone.', photo: 'https://ui-avatars.com/api/?name=John+Doe&background=ec4899&color=fff' },
    { name: 'Jane Smith', role: 'Head of Curation', bio: 'Curates the best books from around the globe for our community.', photo: 'https://ui-avatars.com/api/?name=Jane+Smith&background=3b82f6&color=fff' },
    { name: 'Mike Johnson', role: 'Customer Success', bio: 'Ensures every reader gets exactly what they are looking for.', photo: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=10b981&color=fff' }
  ];

  const testimonials = [
    { text: "This is the best online bookstore I've ever used. The delivery was lightning fast!", author: "Sarah W." },
    { text: "Amazing collection of rare books. The customer service team is incredibly helpful.", author: "James T." },
    { text: "I love the UI and how easy it is to find what I'm looking for. Highly recommend!", author: "Emily R." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navebar />

      {/* Hero Section */}
      <section className="bg-pink-500 text-white py-20 px-4 pt-32">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 animate-fade-in-down">About Our BookStore</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Your premier destination for finding the best books, connecting with fellow readers, and discovering new worlds.
          </p>
        </div>
      </section>

      {/* Our Story, Mission, Vision */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-pink-500 inline-block pb-2">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              It started with a simple idea and a deep passion for books. We noticed how hard it was to find a diverse range of quality literature at affordable prices. So, we decided to build a platform that puts readers first, making every story accessible to everyone, everywhere.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-pink-500 inline-block pb-2">Our Mission</h2>
            <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
              <li>Deliver quality books at affordable prices.</li>
              <li>Provide excellent customer service.</li>
              <li>Ensure fast and secure delivery worldwide.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-pink-500 inline-block pb-2">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become one of the world's best online bookstores by building a global, interconnected reading community where every voice is heard and every story is valued.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-gray-900 py-16 px-4 text-white">
        <div className="container mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-4">
              <h3 className="text-4xl font-bold text-pink-500 mb-2">{stat.value}</h3>
              <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Why Choose Us</h2>
            <p className="text-gray-500 mt-4">We go the extra mile to provide you with the best experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Meet Our Team</h2>
            <p className="text-gray-500 mt-4">The passionate people behind our bookstore.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-6 text-center hover:-translate-y-2 transition-transform duration-300">
                <img src={member.photo} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-pink-500 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-6">{member.bio}</p>
                <div className="flex justify-center gap-4 text-gray-400">
                  <a href="#" className="hover:text-pink-500 transition-colors"><FiTwitter size={18} /></a>
                  <a href="#" className="hover:text-pink-500 transition-colors"><FiLinkedin size={18} /></a>
                  <a href="#" className="hover:text-pink-500 transition-colors"><FiGithub size={18} /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                <div className="text-4xl text-pink-200 absolute top-4 left-4 font-serif">"</div>
                <p className="text-gray-600 relative z-10 italic mb-6">"{test.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                    {test.author.charAt(0)}
                  </div>
                  <p className="font-bold text-gray-800">{test.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-pink-600 text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Next Great Read?</h2>
          <p className="text-xl mb-10 opacity-90">Join our community and explore thousands of titles today.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/Course" className="px-8 py-3 bg-white text-pink-600 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
              Shop Now
            </a>
            <a href="/contact" className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-pink-600 transition-colors shadow-lg">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
