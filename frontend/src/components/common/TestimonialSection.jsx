import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    image: "https://media.istockphoto.com/id/2148494746/photo/portrait-of-young-businesswoman-with-curly-hairstyle-wear-trendy-smart-casual-outfit-isolated.jpg?b=1&s=612x612&w=0&k=20&c=mT4FdkIpTiTgtghZyOidCEFzGzEt9zHa3RaEOkPQrBc=",
    name: "Riya Patel",
    profession: "Startup Founder",
    review: "FinZen helped me regain control over my spending — love the AI nudges!",
  },
  {
    image: "https://images.pexels.com/photos/845457/pexels-photo-845457.jpeg",
    name: "Aman Verma",
    profession: "Software Developer",
    review: "I can finally visualize where my money goes. Incredible UI!",
  },
  {
    image: "https://images.pexels.com/photos/415263/pexels-photo-415263.jpeg",
    name: "Sanya Reddy",
    profession: "College Student",
    review: "I never knew budgeting could be this intuitive. The insights are a game-changer!",
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-24 bg-[#0a0f1c] text-white overflow-hidden">
      <motion.h2
        className="text-4xl font-bold text-center mb-14 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        What Our Users Say
      </motion.h2>

      {/* Scroll Container */}
      <div className="overflow-x-auto px-4 scrollbar-hide">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="flex gap-6 w-fit mx-auto snap-x snap-mandatory">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="w-[300px] flex-shrink-0 snap-start"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="bg-white/10 border border-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center transition-all duration-300 group h-full">
                  <div className="flex justify-center mb-4">
                    <div>
                      <img src={t.image} alt="" className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d1a6ff] to-[#e6ccff] flex items-center justify-center font-bold text-[#4b0082] text-lg shadow-md object-cover"></img>                   
                    </div>
                  </div>
                  {/* <FaQuoteLeft className="text-[#d1a6ff] text-2xl mx-auto mb-3 group-hover:text-[#e6ccff] transition" /> */}
                  <p className="italic text-white/90 mb-4">“{t.review}”</p>
                  <h3 className="font-semibold text-lg text-white">{t.name}</h3>
                  <p className="text-sm text-purple-200">{t.profession}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
