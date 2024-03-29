"use client";
import { useEffect, useRef, useState } from "react";
import { Text, Title } from "@mantine/core";
import { MovieDetail } from "@/app/util";
import Image from "next/image";

const ListSearchMovie = ({
  title,
  dataList,
  hasNextPage,
  fetchNextPage,
  handleModal,
}: {
  title: string;
  dataList: MovieDetail[];
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
  handleModal: (item: MovieDetail) => void;
}) => {
  const [lastElement, setLastElement] = useState<HTMLDivElement | null>(null);
  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        if (hasNextPage) {
          fetchNextPage();
        }
      }
    })
  );

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);
  return (
    <div className="flex flex-col gap-4">
      <Title order={6} className="!text-white">
        {title}
      </Title>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {dataList.map((item, index) => (
          <div
            ref={dataList.length - 1 === index ? setLastElement : undefined}
            className="relative flex justify-center rounded-lg shadow-lg"
            key={`${item.title}-${item.id}-${title}`}
            onClick={() => handleModal(item)}
            onKeyDown={() => handleModal(item)}
            tabIndex={0}
            role="button"
          >
            <div className="!w-36 !h-56 relative">
              <Image
                src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                alt={`${item.title}-poster-${title}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="!rounded-lg"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="absolute rounded bg-[#ced4da] opacity-40 px-2 hover:opacity-100 right-3 bottom-3 left-3">
              <Text fz="sm" lh="sm" c={"dark"} className="!text-wrap">
                {item.title}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListSearchMovie;
