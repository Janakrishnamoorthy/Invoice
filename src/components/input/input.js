import React from 'react';

const Input = (props) => {
  return (
    <div className="input-container">
       <label htmlFor={props.id}>{props.label}</label>
      <input
        type={props.type}
        name={props.name}
        id={props.id}
        className={props.className}
        placeholder={props.placeholder}
        value={props.value}       
        onChange={props.onChange} 
      />
    </div>
  );
};

export default Input;
