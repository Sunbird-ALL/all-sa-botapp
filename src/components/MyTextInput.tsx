import { useField } from 'formik';

interface MyTextInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}

const MyTextInput: React.FC<any> = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);

  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        className={`block w-full p-2 border ${
          meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm`}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-xs mt-1">{meta.error}</div>
      ) : null}
    </>
  );
};

export default MyTextInput;
