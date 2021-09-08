import React, { FC, useState } from 'react';
import { addTags, Sound } from 'features/api/useMuminstApi';
import Modal from 'react-modal';
import { useThemeUI } from 'theme-ui';
import ReactTagInput from '@pathofdev/react-tag-input';
import { Tags } from 'components/Tags';
import { Box, Heading, Text, Flex, Grid, Button } from 'theme-ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sound?: Sound;
}
export const NewTagsModal: FC<Props> = ({
  isOpen,
  onClose,
  sound,
  onSuccess,
}) => {
  const { theme } = useThemeUI();
  const [newTags, setNewTags] = useState<string[]>([]);

  if (!sound) {
    return <></>;
  }

  const onSubmit = async () => {
    if (newTags.length > 0) {
      await addTags(sound, newTags);
      setNewTags([]);
      onSuccess();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          zIndex: 99,
        },
        content: {
          background: theme.colors?.background,
          maxHeight: 300,
          maxWidth: 420,
          left: '50%',
          transform: 'translateX(-150px)',
        },
      }}>
      <Box marginBottom={24}>
        <Heading>{sound?.name}</Heading>
        <Tags tags={sound?.tags} />
      </Box>
      <Box marginBottom={24}>
        <Text marginBottom={12}>Add new tags</Text>
        <ReactTagInput tags={newTags} onChange={setNewTags} />
      </Box>
      <Flex sx={{ justifyContent: 'flex-end' }}>
        <Grid gap={2} columns={2}>
          <Button onClick={onSubmit}>Submit</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Grid>
      </Flex>
    </Modal>
  );
};
