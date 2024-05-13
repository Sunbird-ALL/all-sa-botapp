import { useField } from 'formik';

interface MySelectInputProps {
  label: string;
  options: { value: string; label: string }[];
}

const MySelectInput: React.FC<any> = ({ label, options, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        className={`mt-1 block w-full p-2 border ${
          meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm`}
        {...field}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-xs mt-1">{meta.error}</div>
      ) : null}
    </>
  );
};

export default MySelectInput;
