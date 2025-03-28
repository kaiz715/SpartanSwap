import { useState } from "react";

function PostItem() {
  const [formData, setFormData] = useState({
    name: "",
    item_type: "",
    price: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí luego subiremos la imagen a un servicio y mandaremos los datos
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Item name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="item_type"
        placeholder="Item type"
        value={formData.item_type}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
      />
      <input type="file" onChange={handleImageChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PostItem;
