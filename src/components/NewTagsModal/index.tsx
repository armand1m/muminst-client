import React, { useState } from 'react';
import { Sound } from 'features/api/useMuminstApi';
import Modal from 'react-modal';
import { useThemeUI } from 'theme-ui';
import ReactTagInput from '@pathofdev/react-tag-input';
import { Tags } from 'components/Tags';
import { Box, Heading, Text, Flex, Grid, Button } from 'theme-ui';

interface Props {
  isOpen: boolean;
  onSubmit: (sound: Sound, tags: string[]) => Promise<void>;
  onClose: () => void;
  onSuccess: () => void;
  sound?: Sound;
}

export const NewTagsModal = ({
  isOpen,
  onClose,
  sound,
  onSubmit,
  onSuccess,
}: Props) => {
  const { theme } = useThemeUI();
  const [newTags, setNewTags] = useState<string[]>([]);

  if (!sound) {
    return <></>;
  }

  const onSubmitClick = async () => {
    if (newTags.length > 0) {
      await onSubmit(sound, newTags);
      setNewTags([]);
      onSuccess();
    }
  };

  const onCancel = () => {
    setNewTags([]);
    onClose();
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
          <Button onClick={onSubmitClick}>Submit</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Grid>
      </Flex>
    </Modal>
  );
};
