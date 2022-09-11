import { Heading, IconButton, VStack } from '@chakra-ui/react';
import { Blog } from '@omewa/api-interfaces';
import React, { ReactElement, useCallback, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BlogForm from '../../components/BlogForm';
import BlogList from '../../components/BlogList';

const BlogView = (): ReactElement => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [token, setToken] = React.useState<string | null>(
    localStorage.getItem('token')
  );

  const [title, setTitle] = React.useState<string>('');
  const [content, setContent] = React.useState<string>('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = useCallback(async () => {
    if (token) {
      const response = await fetch('/api/blog', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      if(response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        setToken(null);
        return;
      }
      if(response.ok) {
        const blogs = await response.json();
        setBlogs(blogs);
      }
    }
  }, [token]);

  const addBlog = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const response = await fetch('/api/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });
    if (response.ok) {
      setTitle('');
      setContent('');
      fetchBlog();
    }
  };

  const deleteBlog = async (id: number) => {
    const response = await fetch(`/api/blog/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    if (response.ok) {
      fetchBlog();
    }
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const buttonProps = {
    size: 'lg',
    isRound: true,
    alignSelf: 'flex-end',
    icon: <FaSignOutAlt />,
    'aria-label': 'Switch DarkMode',
  };

  return (
    <VStack p={4}>
      <IconButton onClick={onLogout} {...buttonProps} />
      <Heading size="2xl">Blog</Heading>
      <BlogForm
        title={title}
        content={content}
        setTitle={setTitle}
        setContent={setContent}
        handleSubmit={addBlog}
      />
      <BlogList blogs={blogs} deleteBlog={deleteBlog} />
    </VStack>
  );
};

export default BlogView;
