import './inputField.css';

const InputField = ({ label, type, name, value, onChange }) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange} 
      />
    </div>
  );
};

export default InputField;
