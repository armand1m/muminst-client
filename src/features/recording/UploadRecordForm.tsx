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
import ReactTagInput from '@pathofdev/react-tag-input';

const schema = yup.object({
  soundName: yup
    .string()
    .required('Define a sound name for your recording.'),
  tags: yup.array().of(yup.string()),
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
  tags: [],
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
    {({ values, setFieldValue }) => (
      <Form>
        <Grid gap={2}>
          <FormInput name="soundName" label="Sound name" />
          <ReactTagInput
            tags={values.tags}
            onChange={(newTags) => setFieldValue('tags', newTags)}
          />
          <Box>
            <Button mr={2} type="submit">
              Submit
            </Button>
            <Button type="reset">Cancel</Button>
          </Box>
        </Grid>
      </Form>
    )}
  </Formik>
);
