import Image from "next/image";

import { FEATURES } from "@/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type FeatureProps = {
  index: number;
  title: string;
  description: string;
  image: string;
};

const Feature = ({ index, title, description, image }: FeatureProps) => (
  <div className="md:flex md:items-center gap-x-6">
    {/* Image */}
    <div className="max-w-xl mx-auto mb-8 md:mb-0">
      <Image
        className="max-w-full h-auto md:max-w-md rounded-sm"
        src={image}
        width={540}
        height={405}
        alt={title}
      />
    </div>
    {/* Content */}
    <div
      className={cn("max-w-xl mx-auto", index % 2 === 0 && "md:order-first")}
    >
      <div className="md:pl-4 lg:pl-12 xl:pl-16">
        <h1 className="text-2xl text-yellow-500 mb-2">{title}</h1>
        <p className="text-md dark:text-gray-400 mb-4">{description}</p>
      </div>
    </div>
  </div>
);

export const Features = () => {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div>
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <Badge variant="success" className="py-1 px-3 mb-2">
              Reach goals that matter
            </Badge>
            <p className="text-xl dark:text-gray-400">
              Improve your organization as a student with advanced features,
              ensuring everything is perfectly arranged for academic success.
            </p>
          </div>

          {/* Items */}
          <div className="grid gap-20">
            {FEATURES.map(({ title, description, image }, i) => (
              <Feature
                key={`feature-${i}`}
                index={i}
                title={title}
                description={description}
                image={image}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};