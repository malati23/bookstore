import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { createBook } from '../../api/bookApi';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import Checkbox from '../../components/ui/Checkbox';
import Button from '../../components/ui/Button';

const AddBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      author: '',
      category: '',
      price: '',
      language: 'English',
      stock: 10,
      image: '',
      description: '',
      isbn: '',
      publisher: '',
      publishedYear: '',
      pages: '',
      format: 'Paperback',
      featured: false,
      bestseller: false
    }
  });

  const watchImage = watch('image');

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Map title to name for backend if necessary and parse numbers
      const submissionData = {
        ...data,
        name: data.title,
        price: Number(data.price),
        stock: Number(data.stock),
        publishedYear: data.publishedYear ? Number(data.publishedYear) : undefined,
        pages: data.pages ? Number(data.pages) : undefined
      };

      await createBook(submissionData);
      
      toast.success('Book created successfully!');
      
      // Allow toast to show before redirecting
      setTimeout(() => {
        reset();
        navigate('/admin/books');
      }, 1500);
      
    } catch (err) {
      console.error(err);
      toast.error('Failed to create book. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center gap-4 mb-6 sticky top-0 bg-white/80 backdrop-blur-md py-4 z-10 border-b border-gray-100">
          <Link to="/admin/books" className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors">
            <FiArrowLeft size={24} />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">Add New Book</h2>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-10">
          <div className="p-8">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Book Title"
                  name="title"
                  register={register}
                  validation={{ required: 'Book Title is required' }}
                  errors={errors}
                  placeholder="e.g. The Great Gatsby"
                />
                
                <Input
                  label="Author"
                  name="author"
                  register={register}
                  validation={{ required: 'Author is required' }}
                  errors={errors}
                  placeholder="e.g. F. Scott Fitzgerald"
                />

                <Select
                  label="Category"
                  name="category"
                  placeholder="Select a category"
                  register={register}
                  validation={{ required: 'Category is required' }}
                  errors={errors}
                  options={[
                    { value: 'Fiction', label: 'Fiction' },
                    { value: 'Non-Fiction', label: 'Non-Fiction' },
                    { value: 'Science', label: 'Science' },
                    { value: 'History', label: 'History' },
                    { value: 'Fantasy', label: 'Fantasy' },
                    { value: 'Biography', label: 'Biography' },
                    { value: 'Children', label: 'Children' }
                  ]}
                />

                <Input
                  label="Price (₹)"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  register={register}
                  validation={{ 
                    required: 'Price is required',
                    min: { value: 0.01, message: 'Price must be greater than 0' }
                  }}
                  errors={errors}
                  placeholder="e.g. 19.99"
                />

                <Select
                  label="Language"
                  name="language"
                  register={register}
                  errors={errors}
                  options={[
                    { value: 'English', label: 'English' },
                    { value: 'Hindi', label: 'Hindi' },
                    { value: 'Odia', label: 'Odia' },
                    { value: 'Bengali', label: 'Bengali' }
                  ]}
                />

                <Input
                  label="Initial Stock"
                  name="stock"
                  type="number"
                  min="0"
                  register={register}
                  validation={{ 
                    min: { value: 0, message: 'Stock cannot be negative' }
                  }}
                  errors={errors}
                />

                <Input
                  label="ISBN"
                  name="isbn"
                  register={register}
                  errors={errors}
                  placeholder="e.g. 978-3-16-148410-0"
                />

                <Input
                  label="Publisher"
                  name="publisher"
                  register={register}
                  errors={errors}
                  placeholder="e.g. Penguin Random House"
                />

                <Input
                  label="Published Year"
                  name="publishedYear"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  register={register}
                  errors={errors}
                  placeholder="e.g. 2023"
                />

                <Input
                  label="Number of Pages"
                  name="pages"
                  type="number"
                  min="1"
                  register={register}
                  validation={{ 
                    min: { value: 1, message: 'Pages must be at least 1' }
                  }}
                  errors={errors}
                  placeholder="e.g. 350"
                />

                <Select
                  label="Book Format"
                  name="format"
                  register={register}
                  errors={errors}
                  options={[
                    { value: 'Paperback', label: 'Paperback' },
                    { value: 'Hardcover', label: 'Hardcover' },
                    { value: 'Ebook', label: 'Ebook' }
                  ]}
                />
              </div>

              <div>
                <Input
                  label="Cover Image URL"
                  name="image"
                  type="url"
                  register={register}
                  validation={{ 
                    required: 'Cover Image URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message: 'Must be a valid URL (http or https)'
                    }
                  }}
                  errors={errors}
                  placeholder="https://example.com/image.jpg"
                />
                
                <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center min-h-[12rem]">
                  {watchImage ? (
                    <img 
                      src={watchImage} 
                      alt="Cover Preview" 
                      className="h-40 object-contain rounded shadow-sm"
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                      }}
                    />
                  ) : (
                    <span className="text-gray-400">Image preview will appear here</span>
                  )}
                </div>
              </div>

              <div>
                <TextArea
                  label="Description"
                  name="description"
                  register={register}
                  errors={errors}
                  placeholder="Enter book description here..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <Checkbox
                  label="Featured Book"
                  name="featured"
                  register={register}
                  description="Display this book in the featured section on the home page."
                />
                <Checkbox
                  label="Bestseller"
                  name="bestseller"
                  register={register}
                  description="Mark this book with a bestseller badge."
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                <Link 
                  to="/admin/books"
                  className="px-6 py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </Link>
                <Button type="submit" loading={loading}>
                  <FiSave size={20} />
                  {loading ? 'Saving...' : 'Save Book'}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddBook;
