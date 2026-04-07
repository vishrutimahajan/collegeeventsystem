import React from "react";

const Form = () => {
  return (
    <form>
      <div className="formGroup">
        <label>Name</label>
        <input type="text" placeholder="Enter your name" />
      </div>
      
      <div className="formGroup">
        <label>Email</label>
        <input type="email" placeholder="Enter your email" />
      </div>

      <button type="submit">Save Changes</button>
    </form>
  );
};

export default Form;