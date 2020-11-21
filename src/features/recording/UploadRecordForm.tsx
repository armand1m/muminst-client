import React from 'react';
import * as yup from 'yup';
import { Label, Input, Text, Button, Box, Grid } from 'theme-ui';
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

const FormInput = (props: UseFieldProps & CustomInputProps) => {
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
          <FormInput name="soundName" label="Sound name" />
          <Box>
            <Button type="submit">Submit</Button>
          </Box>
        </Grid>
      </Form>
    </Formik>
  );
};
