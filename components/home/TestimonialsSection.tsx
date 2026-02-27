"use client";

type Testimonial = {
  id: string;
  title: string;
  quote: string;
  author: string;
};

const testimonials: Testimonial[] = [
  {
    id: "review-1",
    title: "Perfect place. Love the concept.",
    quote:
      "Perfect place. Love the concept. Love the food. Friendly employees also.",
    author: "Jememar",
  },
  {
    id: "review-2",
    title: "Great experience I loved it there..",
    quote:
      "Great experience I loved it there.. The menu comes with different dishes and calories count.. perfect for athletes.. it also says that it is made from athletes to athletes.. The cheesecake there is a real piece of art .. so delicious and perfectly baked..",
    author: "Chaimaa Boutjim",
  },
  {
    id: "review-3",
    title: "Amazing quality and super clean place.",
    quote:
      "I always find fresh options and the staff are very friendly. The portions are good and the service is fast.",
    author: "Salma R.",
  },
  {
    id: "review-4",
    title: "Best healthy food spot in town.",
    quote:
      "Great atmosphere and delicious meals. It is one of my favorite places after workouts.",
    author: "Karim N.",
  },
];

function StarRow() {
  return <p className="text-base tracking-[0.14em] text-amber-500">*****</p>;
}

export default function TestimonialsSection() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#efefef] px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl overflow-hidden">
        <div className="reviews-marquee-track flex w-max gap-5">
          {[...testimonials, ...testimonials].map((item, index) => (
            <article
              key={`${item.id}-${index}`}
              className="testimonial-marquee-card flex-none bg-[#f3f3f3] p-8 sm:p-10"
            >
                <StarRow />
                <h3 className="mt-2 text-2xl font-semibold text-zinc-900 sm:text-[20px]">
                  {item.title}
                </h3>
                <p className="mt-5 text-xl leading-relaxed text-zinc-600 sm:text-[18px]">
                  &ldquo; {item.quote} &rdquo;
                </p>
                <p className="mt-6 text-xl font-semibold text-zinc-900 sm:text-[20px]">
                  - {item.author}
                </p>
            </article>
          ))}
        </div>

        <div
          className="mt-12 text-center"
          style={{ animation: "fadeUp 0.7s ease-out 0.1s both" }}
        >
          <p className="text-6xl font-semibold leading-none">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#DB4437]">o</span>
            <span className="text-[#F4B400]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#0F9D58]">l</span>
            <span className="text-[#DB4437]">e</span>
          </p>
          <p className="text-3xl font-medium text-zinc-500">
            Reviews <span className="text-amber-500">*****</span>
          </p>
        </div>
      </div>
    </section>
  );
}
