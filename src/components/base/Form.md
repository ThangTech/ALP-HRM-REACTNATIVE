# Form Component

Form component được xây dựng dựa trên React Hook Form để tạo ra một component có thể tái sử dụng với các tính năng:

## Tính năng chính

- ✅ Form validation tự động
- ✅ Error handling
- ✅ TypeScript support
- ✅ Tích hợp với các component base khác (Input, Button, Text)
- ✅ Form submission handling
- ✅ Field dependencies
- ✅ Custom validation rules

## Cách sử dụng

### 1. Import Form component

```typescript
import { Form, Input, Button } from 'components';
```

### 2. Định nghĩa type cho form data

```typescript
interface LoginFormData {
  email: string;
  password: string;
  confirmPassword: string;
}
```

### 3. Sử dụng Form component

```typescript
const MyForm = () => {
  const handleSubmit = (data: LoginFormData) => {
    console.log('Form data:', data);
  };

  return (
    <Form<LoginFormData>
      defaultValues={{
        email: '',
        password: '',
        confirmPassword: '',
      }}
      onSubmit={handleSubmit}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        }}
      >
        <Input
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        }}
      >
        <Input
          placeholder="Enter your password"
          isPassword
          secureTextEntry
        />
      </Form.Item>

      <Form.Submit label="Login" />
    </Form>
  );
};
```

## API Reference

### Form Props

| Prop            | Type                                   | Description                       |
| --------------- | -------------------------------------- | --------------------------------- |
| `defaultValues` | `T`                                    | Giá trị mặc định cho form         |
| `onSubmit`      | `SubmitHandler<T>`                     | Function được gọi khi submit form |
| `mode`          | `'onChange' \| 'onBlur' \| 'onSubmit'` | Mode validation của form          |

### Form.Item Props

| Prop             | Type                           | Description                       |
| ---------------- | ------------------------------ | --------------------------------- |
| `name`           | `FieldPath<T>`                 | Tên field trong form              |
| `label`          | `string \| React.ReactElement` | Label hiển thị cho field          |
| `rules`          | `RegisterOptions`              | Validation rules cho field        |
| `disabled`       | `boolean`                      | Vô hiệu hóa field                 |
| `defaultValue`   | `any`                          | Giá trị mặc định cho field        |
| `onChange`       | `(value: any) => void`         | Callback khi value thay đổi       |
| `noErrorMessage` | `boolean`                      | Ẩn error message                  |
| `deps`           | `FieldName<T>[]`               | Dependencies để trigger re-render |

### Form.Submit Props

| Prop       | Type                       | Description               |
| ---------- | -------------------------- | ------------------------- |
| `label`    | `string`                   | Text hiển thị trên button |
| `variant`  | `'primary' \| 'secondary'` | Style variant của button  |
| `children` | `React.ReactElement`       | Custom button element     |

## Validation Rules

Form component hỗ trợ tất cả validation rules của React Hook Form:

```typescript
rules={{
  required: 'Field is required',
  minLength: { value: 6, message: 'Minimum 6 characters' },
  maxLength: { value: 20, message: 'Maximum 20 characters' },
  pattern: { value: /^[A-Z]/, message: 'Must start with uppercase' },
  validate: (value) => value === 'expected' || 'Invalid value',
}}
```

## Form Ref

Bạn có thể sử dụng ref để control form từ bên ngoài:

```typescript
const formRef = useRef<FormRef<FormData>>(null);

// Reset form
formRef.current?.reset();

// Submit form programmatically
formRef.current?.submit();

// Get form state
const { isValid, errors } = formRef.current?.formState || {};
```

## Ví dụ hoàn chỉnh

Xem file `FormExample.tsx` để có ví dụ hoàn chỉnh về cách sử dụng Form component.
