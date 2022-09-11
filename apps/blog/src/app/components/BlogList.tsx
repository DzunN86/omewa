import {
  Badge,
  Heading,
  HStack,
  IconButton,
  Spacer,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { Blog } from '@omewa/api-interfaces';


type Props = {
  blogs: Blog[]
  deleteBlog: (id: number) => void
}

const BlogList = ({blogs, deleteBlog }: Props) => {
  const vStackProps = {
    p: '4',
    w: '100%',
    maxW: { base: '90vw', sm: '80vw', lg: '50vw', xl: '40vw' },
    borderColor: 'gray.100',
    borderWidth: '2px',
    borderRadius: 'lg',
    alignItems: 'stretch',
    divider: <StackDivider />,
  };

  const buttonProps = {
    icon: <FaTrash />,
    isRound: true,
    'aria-label': 'delete',
  };

  if (blogs.length === 0)
    return (
      <Badge colorScheme='green' p='4' m='4' borderRadius='lg'>
        No blogs yet
      </Badge>
    )

  return (
    <VStack {...vStackProps}>
      {blogs.map((blog) => (
      <HStack key={blog.id}>
        <VStack alignItems="flex-start">
          <Heading>{blog.title}</Heading>
          <Text>{blog.content}</Text>
        </VStack>
        <Spacer />
        <IconButton onClick={() => deleteBlog(blog.id) } {...buttonProps} />
      </HStack>
      ))}
    </VStack>
  );
};

export default BlogList;
