import { ForwardedRef, cloneElement, forwardRef, useEffect, useImperativeHandle } from 'react';
import {
  Controller,
  ControllerProps,
  FieldName,
  FieldPath,
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseControllerReturn,
  UseFormProps,
  UseFormReturn,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { View } from 'tamagui';

import { Button, Text } from 'components';
import { verticalScale } from 'utils';

export interface FormProps<T extends FieldValues>
  extends
    Omit<React.ComponentProps<typeof View>, 'children'>,
    Pick<UseFormProps<T>, 'mode' | 'defaultValues'> {
  onSubmit: SubmitHandler<T>;
  children?: React.ReactNode;
}

export type FormRef<T extends FieldValues> = UseFormReturn<T> & {
  submit: () => void;
};

const Form = <T extends FieldValues>(
  { onSubmit, children, ...rest }: FormProps<T>,
  ref: ForwardedRef<UseFormReturn<T>>,
) => {
  const form = useForm(rest);
  const submit = form.handleSubmit(onSubmit);
  useImperativeHandle(ref, () => Object.assign(form, { submit }));

  return (
    <FormProvider {...form}>
      <View f={1} {...rest}>
        {children}
      </View>
    </FormProvider>
  );
};

type FormLabelProps<T extends FieldValues> = {
  deps?: FieldPath<T> | FieldPath<T>[];
  children: React.ReactNode;
};

const FormLabel = <T extends FieldValues>({ deps, children }: FormLabelProps<T>) => {
  useWatch({ name: deps as any, disabled: !deps?.length });

  return <>{children}</>;
};

type FormItemProps<T extends FieldValues, K extends FieldPath<T>> = Pick<
  ControllerProps<T, K>,
  'name' | 'rules' | 'disabled' | 'defaultValue'
> & {
  label?: string | React.ReactElement;
  floatingLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: ViewStyle;
  onChange?: (v: ControllerProps<T, K>['defaultValue']) => void;
  deps?: FieldName<T>[];
  noErrorMessage?: boolean;
  noRef?: boolean;
} & ({ children: React.ReactElement } | { render: ControllerProps<T, K>['render'] });

const FormItem = <T extends FieldValues, K extends FieldPath<T>>({
  name,
  label,
  floatingLabel,
  onChange,
  style,
  contentStyle,
  deps,
  noErrorMessage,
  noRef,
  ...rest
}: FormItemProps<T, K>) => {
  const value = useWatch({ name, disabled: !onChange });
  useWatch({ name: deps || [], disabled: !deps?.length });

  useEffect(() => {
    onChange?.(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const render =
    'render' in rest
      ? rest.render
      : ({
          field: { onChange: onChangeValue, ref, ...props },
          fieldState,
        }: UseControllerReturn<T, K>) =>
          cloneElement(rest.children, {
            ...props,
            ref: noRef ? undefined : ref,
            onChangeValue,
            label: floatingLabel ? label : undefined,
            floatingLabel,
            state: fieldState.invalid ? 'error' : undefined,
            errorMessage: fieldState.error?.message,
          });

  return (
    <View style={[style]}>
      {!floatingLabel && !!label && typeof label === 'string' ? (
        <View flexDirection="row" alignItems="center" marginBottom={verticalScale(8)}>
          <Text color="$black" fontSize={16} fontWeight="500">
            {label}
          </Text>
          {rest.rules?.required && <Text color="$m_red"> *</Text>}
        </View>
      ) : (
        !floatingLabel && !!label && <FormLabel deps={rest.rules?.deps}>{label}</FormLabel>
      )}
      <View style={[!floatingLabel && styles.marginTop8, contentStyle]}>
        <Controller name={name} control={control} {...rest} render={render} />
      </View>
      {!noErrorMessage && !!errors[name] && (
        <Text marginTop={verticalScale(8)} fontSize={12} color="$m_red">
          {`${errors[name]?.message}` || 'Invalid data'}
        </Text>
      )}
    </View>
  );
};

interface FormSubmitProps {
  children?: React.ReactElement;
  label?: string;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary';
}

const FormSubmit = ({ label, children, style, variant }: FormSubmitProps) => {
  const { formState, ...ctx } = useFormContext();
  const submit = (ctx as any).submit;
  if (children) {
    return cloneElement(children, { onPress: submit, disabled: !formState.isValid });
  }

  const buttonStyle = style
    ? [{ marginTop: verticalScale(16) }, style]
    : { marginTop: verticalScale(16) };

  return (
    <Button
      style={buttonStyle}
      variant={variant || 'primary'}
      disabled={!formState.isValid}
      onPress={submit}
    >
      <Button.Text>{label || 'Submit'}</Button.Text>
    </Button>
  );
};

const FormStatic = {
  Item: FormItem,
  Submit: FormSubmit,
};

type ForwardedForm = <T extends FieldValues>(
  props: FormProps<T> & { ref?: ForwardedRef<UseFormReturn<T>> },
) => React.ReactElement;

export default Object.assign(forwardRef(Form) as ForwardedForm, FormStatic);

const styles = StyleSheet.create({
  marginTop8: {
    marginTop: verticalScale(8),
  },
});
