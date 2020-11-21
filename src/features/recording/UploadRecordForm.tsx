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

interface FormInputProps {
  label: string;
}

const FormInput = (props: UseFieldProps & FormInputProps) => {
  const [field, meta] = useField(props);
  return (
    <Box>
      <Label htmlFor={props.name}>{props.label}</Label>
      <Input {...field} />
      {Boolean(meta.touched && meta.error) && (
        <Text color="red">{meta.error}</Text>
      )}
    </Box>
  );
};

const initialValues = {
  soundName: '',
};

type FormConfig = FormikConfig<typeof initialValues>;
type FormProps = Pick<FormConfig, 'onReset' | 'onSubmit'>;

export const UploadRecordForm: React.FC<FormProps> = ({
  onReset,
  onSubmit,
}) => (
  <Formik
    onReset={onReset}
    onSubmit={onSubmit}
    validationSchema={schema}
    initialValues={initialValues}>
    <Form>
      <Grid gap={2}>
        <FormInput name="soundName" label="Sound name" />
        <Box>
          <Button mr={2} type="submit">
            Submit
          </Button>
          <Button type="reset">Cancel</Button>
        </Box>
      </Grid>
    </Form>
  </Formik>
);
