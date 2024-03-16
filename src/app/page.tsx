"use client";
import {
  AppShell,
  Burger,
  Drawer,
  Flex,
  Group,
  Input,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";
import { MovieDetail, MovieList, debounce, filterDuplicate } from "./util";
import { modals } from "@mantine/modals";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { fetcher, fetcherSearch, getKey } from "./query";
import LoadingSpinner from "@/components/LoadingSpinner";
import ListSearchMovie from "@/components/ListSearchMovie";
import ListNowPlaying from "@/components/ListNowPlaying";
import ListMovie from "@/components/ListMovie";

export default function Home() {
  const [opened, { close, open }] = useDisclosure();
  const [search, setSearch] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | undefined>();
  const idMovie = useMemo(() => selectedMovie?.id ?? 0, [selectedMovie]);
  const handleModal = (item: MovieDetail) => setSelectedMovie(item);

  const { data: movieVideoData, isLoading: isFetchingMovieVideo } = useSWR(
    idMovie ? `/${idMovie}/videos` : null,
    fetcher
  );
  const { data: nowPlayingData, isLoading: isFetchingNowPlaying } = useSWR(
    "/now_playing?language=en-US&page=1",
    fetcher
  );

  useEffect(() => {
    if (movieVideoData?.id && selectedMovie?.id) {
      const dataVideo = movieVideoData.results[0] || {};
      const embedId =
        (dataVideo?.site ?? "").toLowerCase() === "youtube"
          ? `https://www.youtube.com/embed/${dataVideo.key}`
          : `https://vimeo.com/${dataVideo.key}`;
      modals.open({
        size: "xl",
        radius: "md",
        children: (
          <div className="flex flex-col w-full gap-4">
            <div className="overflow-hidden pb-[56.25%] relative h-0">
              <iframe
                width="853"
                height="480"
                src={embedId}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded Trailer"
                className="top-0 left-0 h-full w-full absolute"
              />
            </div>
            <div className="flex flex-col gap-4 px-4 w-full h-full">
              <Title order={6}>{selectedMovie.title}</Title>
              <Text fz="md" lh="md">
                {selectedMovie.overview}
              </Text>
            </div>
          </div>
        ),
        onClose: () => {
          setSelectedMovie(undefined);
        },
      });
    }
  }, [movieVideoData, modals, selectedMovie]);

  const {
    data: popularMovies,
    setSize: setSizePopular,
    size: sizePopular,
    isLoading: isFetchingPopularMovie,
  } = useSWRInfinite<MovieList>(
    (index, previousPageData) =>
      getKey({ pageIndex: index, previousPageData, type: "popular" }),
    fetcher,
    { suspense: true }
  );

  const dataPopularMovie = useMemo(
    () =>
      (popularMovies ?? []).reduce(
        (prev, next) => filterDuplicate([...prev, ...next.results]),
        [] as MovieDetail[]
      ),
    [popularMovies]
  );

  const fetchNextPagePopularMovie = () => {
    setSizePopular((prev) => prev + 1);
  };

  const {
    data: topMovies,
    setSize: setSizeTop,
    size: sizeTop,
    isLoading: isFetchingTopMovie,
  } = useSWRInfinite<MovieList>(
    (index, previousPageData) =>
      getKey({ pageIndex: index, previousPageData, type: "top_rated" }),
    fetcher,
    { suspense: true }
  );

  const dataTopMovie = useMemo(
    () =>
      (topMovies ?? []).reduce(
        (prev, next) => filterDuplicate([...prev, ...next.results]),
        [] as MovieDetail[]
      ),
    [topMovies]
  );

  const fetchNextPageTopMovie = () => {
    setSizeTop((prev) => prev + 1);
  };

  const {
    data: searchMovies,
    setSize: setSizeSearch,
    size: sizeSearch,
    isLoading: isFetchingSearchMovie,
  } = useSWRInfinite<MovieList>(
    (index, previousPageData) =>
      getKey({
        pageIndex: index,
        previousPageData,
        search: search,
        type: "search",
      }),
    fetcherSearch,
    { suspense: true }
  );

  const dataSearchMovie = useMemo(
    () =>
      (searchMovies ?? []).reduce(
        (prev, next) => filterDuplicate([...prev, ...next.results]),
        [] as MovieDetail[]
      ),
    [searchMovies]
  );

  const fetchNextPageSearchMovie = () => {
    setSizeSearch((prev) => prev + 1);
  };

  const isLoading = useMemo(
    () =>
      isFetchingPopularMovie ||
      isFetchingTopMovie ||
      isFetchingSearchMovie ||
      isFetchingNowPlaying ||
      isFetchingMovieVideo,
    [
      isFetchingPopularMovie,
      isFetchingTopMovie,
      isFetchingSearchMovie,
      isFetchingNowPlaying,
      isFetchingMovieVideo,
    ]
  );

  const handleSearch = debounce((tempSearch: string) => {
    setSizeSearch(1);
    setSearch(tempSearch);
  }, 500);

  return (
    <AppShell header={{ height: 60 }} padding="md" className="!bg-[#495057]">
      <AppShell.Header className="!sticky !top-0 !p-4 !z-10 !bg-[#212529]">
        <Group h="100%">
          <Group justify="space-between" style={{ flex: 1 }}>
            <Burger
              opened={opened}
              onClick={open}
              hiddenFrom="sm"
              size="sm"
              className="!bg-white !rounded"
            />
            <Group gap={"sm"} visibleFrom="sm">
              <UnstyledButton>
                <Title order={3} className="!text-white">
                  Netplix
                </Title>
              </UnstyledButton>
              <UnstyledButton className="!text-white">Home</UnstyledButton>
              <UnstyledButton className="!text-white">Blog</UnstyledButton>
              <UnstyledButton className="!text-white">Contacts</UnstyledButton>
              <UnstyledButton className="!text-white">Support</UnstyledButton>
            </Group>
            <Input
              radius="md"
              placeholder={"Search"}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main className="!container !mx-auto">
        <Drawer
          opened={opened}
          onClose={close}
          size={"xs"}
          title={
            <Title order={3} c={"dark"}>
              Netplix
            </Title>
          }
        >
          <Flex
            gap="md"
            justify="flex-start"
            align="flex-start"
            direction="column"
            wrap="wrap"
          >
            <Text size="md" lh={"md"} c={"dark"}>
              Movie
            </Text>
            <Text size="md" lh={"md"} c={"dark"}>
              Search
            </Text>
            <Text size="md" lh={"md"} c={"dark"}>
              Genre
            </Text>
          </Flex>
        </Drawer>
        <Flex gap="md" direction="column" py={"sm"} w={"100%"}>
          {search && dataSearchMovie.length > 0 ? (
            <ListSearchMovie
              dataList={dataSearchMovie}
              title="Search"
              fetchNextPage={fetchNextPageSearchMovie}
              hasNextPage={!!sizeSearch}
              handleModal={handleModal}
            />
          ) : null}
          {!search ? (
            <ListNowPlaying
              listData={nowPlayingData?.results ?? []}
              handleModal={handleModal}
            />
          ) : null}
          {!search && dataPopularMovie.length > 0 ? (
            <ListMovie
              key={"popular"}
              dataList={dataPopularMovie}
              title="Popular"
              fetchNextPage={fetchNextPagePopularMovie}
              hasNextPage={!!sizePopular}
              handleModal={handleModal}
            />
          ) : null}
          {!search && dataTopMovie.length > 0 ? (
            <ListMovie
              key={"top-rated"}
              dataList={dataTopMovie}
              title="Top Rated"
              fetchNextPage={fetchNextPageTopMovie}
              hasNextPage={!!sizeTop}
              handleModal={handleModal}
            />
          ) : null}
        </Flex>
      </AppShell.Main>
      {isLoading ? <LoadingSpinner /> : null}
    </AppShell>
  );
}
