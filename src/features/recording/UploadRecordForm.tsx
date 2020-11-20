import React from 'react';
import * as yup from 'yup';
import { css, keyframes } from '@emotion/react';
import {
  Label,
  Input,
  Text,
  Button,
  Box,
  Grid,
  ButtonProps,
} from 'theme-ui';
import {
  Formik,
  Form,
  useField,
  UseFieldProps,
  FormikConfig,
} from 'formik';

const schema = yup.object({
  soundName: yup
    .string()
    .required('Define a sound name for your recording.'),
});

interface CustomInputProps {
  label: string;
}

const CustomInput = (props: UseFieldProps & CustomInputProps) => {
  const [field, meta] = useField(props);
  return (
    <Box>
      <Label htmlFor={props.name}>{props.label}</Label>
      <Input {...field} />
      {meta.touched && meta.error ? (
        <Text color="red">{meta.error}</Text>
      ) : null}
    </Box>
  );
};

const initialValues = {
  soundName: '',
};

interface FormProps {
  onSubmit: FormikConfig<typeof initialValues>['onSubmit'];
}

export const UploadRecordForm: React.FC<FormProps> = ({
  onSubmit,
}) => {
  return (
    <Formik
      onSubmit={onSubmit}
      validationSchema={schema}
      initialValues={initialValues}>
      <Form>
        <Grid gap={2}>
          <CustomInput name="soundName" label="Sound name" />
          <Button type="submit">Submit</Button>
        </Grid>
      </Form>
    </Formik>
  );
};

const pulseOrange = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 121, 63, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 121, 63, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 121, 63, 0);
  }
`;

export const RecordButton: React.FC<
  { recording: boolean } & ButtonProps
> = ({ recording, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        width: 84,
        height: 84,
        borderRadius: '50%',
        cursor: 'pointer',
        border: '12px solid',
        borderColor: 'background',
        padding: 0,
        outline: 'none !important',
        boxShadow: '0px 0px 0px 2px red',
        backgroundColor: 'red',
        color: 'text',
      }}
      css={css`
        animation: ${pulseOrange} ${recording ? '2s' : '0s'} infinite;
      `}
    />
  );
};
