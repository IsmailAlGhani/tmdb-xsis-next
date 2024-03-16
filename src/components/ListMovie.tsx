"use client";
import { MovieDetail } from "@/app/util";
import { Text, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const ListMovie = ({
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
      <div className="flex gap-4 pb-2 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500">
        {dataList.map((item, index) => (
          <div
            ref={dataList.length - 1 === index ? setLastElement : undefined}
            className="flex justify-center shadow-lg rounded-lg relative min-w-fit"
            key={`${item.title}-${item.id}-${title}`}
            onClick={() => handleModal(item)}
            onKeyDown={() => handleModal(item)}
            tabIndex={0}
            role="button"
          >
            <div className="!w-fit !h-56 relative">
              <Image
                src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                alt={`${item.title}-poster-${title}`}
                layout="fill" // required
                objectFit="cover" // change to suit your needs
              />
            </div>
            <div className="absolute rounded bg-[#ced4da] opacity-40 px-2 hover:opacity-100 bottom-3 right-3 left-3">
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

export default ListMovie;
