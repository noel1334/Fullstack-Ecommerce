const categories = ["MEN", "WOMEN", "KIDS"];
const subcategories = ["Topwear", "Bottomwear", "Winterwear"];

const products = Array.from({ length: 52 }, (_, index) => {
  const i = index + 1; 

  const generateImages = () => Array(4).fill(`/assets/images/${i}.jpg`);

  const category = categories[index % categories.length];
  const subcategory = subcategories[index % subcategories.length];

  return {
    _id: `prod_${i}`,
    name: `Product ${i}`,
    description: `This is a detailed description for Product ${i}. It offers quality and value for customers.`,
    price: +(Math.random() * (200 - 20) + 20).toFixed(2),
    image: generateImages(), 
    category: category,
    subcategory: subcategory, 
    size: ["S", "M", "L", "XL", "XXL"].reduce(
      (acc, size) => (Math.random() > 0.5 ? [...acc, size] : acc),
      []
    ),
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    bestSeller: Math.random() > 0.8,
    color: ["Red", "Blue", "Green", "Black", "White", "Yellow"].reduce(
      (acc, color) => (Math.random() > 0.5 ? [...acc, color] : acc),
      []
    ),
  };
});

export default products;
