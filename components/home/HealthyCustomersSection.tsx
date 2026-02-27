import Image from "next/image";

const healthyImages = [
  "/healthy/image-1.png",
  "/healthy/image-2.png",
  "/healthy/image-3.png",
  "/healthy/image-4.png",
  "/healthy/image-5.png",
  "/healthy/image-6.png",
  "/healthy/image-7.png",
  "/healthy/image-5.png",
  "/healthy/image-4.png",
  "/healthy/image-1.png",
  "/healthy/image-6.png",
  "/healthy/image-2.png",
];

export default function HealthyCustomersSection() {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#efefef] px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1800px]">
        <h2
          className="px-2 text-center text-3xl font-semibold tracking-tight text-zinc-800 sm:text-5xl lg:text-5xl"
          style={{ animation: "fadeUp 0.8s ease-out both" }}
        >
          6 Years Of Happy Healthy Customers And Counting...
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-2 sm:mt-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {healthyImages.map((src, index) => (
            <article
              key={`${src}-${index}`}
              className="group relative aspect-square overflow-hidden bg-zinc-200"
              style={{ animation: `fadeUp 0.7s ease-out ${index * 0.05}s both` }}
            >
              <Image
                src={src}
                alt={`Healthy customer ${index + 1}`}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
