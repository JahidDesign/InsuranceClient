import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const VisitorDetailsPage = () => {
  const { id } = useParams();
  const [visitor, setVisitor] = useState(null);

  useEffect(() => {
    const fetchVisitor = async () => {
      try {
        const res = await fetch(`https://insurances-lmy8.onrender.com/visitors/${id}`);
        const data = await res.json();
        setVisitor(data);
      } catch (error) {
        console.error("Error loading visitor details:", error);
      }
    };

    fetchVisitor();
  }, [id]);

  if (!visitor) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-6 mt-10 shadow-xl rounded-lg">
      <img
        src={visitor.image}
        alt={visitor.title}
        className="w-full h-96 object-cover rounded-lg"
      />
      <h2 className="text-3xl font-bold mt-6 mb-4">{visitor.title}</h2>
      <p className="text-gray-700 text-base mb-4">{visitor.description}</p>
      <a
        href={visitor.link}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        Visit Source ↗
      </a>
      <p className="mt-4 text-sm text-gray-500">Date: {visitor.createdAt}</p>
    </div>
  );
};

export default VisitorDetailsPage;
