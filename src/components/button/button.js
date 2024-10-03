import React from "react";

const Button = (props) => {
  return (
    <div>
      <button
        type={props.type}
        className={props.className}
        id={props.id}
        onClick={props.onClick}
      >
        {props.icon} 
        {props.name}
      </button>
    </div>
  );
};

export default Button;
