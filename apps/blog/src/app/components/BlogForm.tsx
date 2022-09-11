import { Button, HStack, Input } from '@chakra-ui/react';


type Props = {
  title: string
  content: string
  setTitle: (title: string) => void
  setContent: (content: string) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const BlogForm = ({title, content, setTitle, setContent, handleSubmit}: Props) => {
  return (
    <form onSubmit={
      (e) => {
        handleSubmit(e);
      }
    }>
      <HStack p="6">
        <Input variant="filled" placeholder="Title" value={title} onChange={
          (e) => setTitle(e.target.value)
        } />
        <Input variant="filled" placeholder="Content" value={content} onChange={
          (e) => setContent(e.target.value)
        } />
        <Button type="submit" colorScheme="green" px="8">
          Add
        </Button>
      </HStack>
    </form>
  );
};

export default BlogForm;
