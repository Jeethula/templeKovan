'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  isSeva: boolean;
}

export default function SevaCards({ services }: { services: Service[] }) {
  const router = useRouter();

  return (
    <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 w-full py-4">
      {services
        .filter(service => service.isSeva && service.id !== 'cm39vec3p0000ooi3pkdquuov')
        .map((service) => (
          <div
            key={service.id}
            onClick={() => router.push("/services")}
            className="flex-none w-64 md:w-full bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {service.image ? (
              <div className="relative h-32 w-full">
                <Image
                  src={service.image}
                  alt={service.name}
                  layout="fill"
                  objectFit="cover"
                  className="h-28"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1">
                  <h1 className="font-semibold text-lg text-white">
                    {service.name}
                  </h1>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <h3 className="font-semibold text-black text-lg mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 line-clamp-3">
                  {service.description}
                </p>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}