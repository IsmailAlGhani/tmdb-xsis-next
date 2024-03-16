"use client";
import { MovieDetail } from "@/app/util";
import { Carousel } from "@mantine/carousel";
import { Text, Title } from "@mantine/core";
import Image from "next/image";

const ListNowPlaying = ({
  listData,
  handleModal,
}: {
  listData: MovieDetail[];
  handleModal: (item: MovieDetail) => void;
}) => {
  return (
    <Carousel
      dragFree
      slideSize="85%"
      slideGap="md"
      withIndicators
      loop
      align="center"
      height={400}
      classNames={{
        indicators: "!-mb-6",
        indicator: "!h-4 !w-4 !rounded-full !bg-white",
      }}
    >
      {listData.length > 0
        ? listData.map((item) => (
            <Carousel.Slide key={`now-${item.id}`} className="!mb-4">
              <div
                className="grid grid-cols-2 h-full w-full bg-[#ced4da] shadow-lg rounded-lg p-4"
                onClick={() => handleModal(item)}
                onKeyDown={() => handleModal(item)}
                tabIndex={0}
                role="button"
              >
                <div className="!flex !justify-center">
                  <div className="!w-56 relative">
                    <Image
                      src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                      alt={`${item.title}-poster-playing`}
                      fill
                      className="rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 px-4 w-full h-full">
                  <Title order={6}>{item.title}</Title>
                  <Text fz="md" lh="md" lineClamp={13}>
                    {item.overview}
                  </Text>
                </div>
              </div>
            </Carousel.Slide>
          ))
        : null}
    </Carousel>
  );
};

export default ListNowPlaying;
