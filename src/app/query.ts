import axios from "axios";
import { MovieList } from "./util";
import { SWRInfiniteKeyLoader } from "swr/infinite";

const HEADERS = {
  accept: "application/json",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOWNjMTU4NmE5ODMwN2VlZTk1ZWYxYWFjOTExNDU0NiIsInN1YiI6IjY0NmU5ODc3ZWEzOTQ5MDBhN2NmY2I1NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7X61NhwhmlAW54YCm34BeCfSvWHOu-cZDA0m6UO77cA",
};

const fetchMovie = async ({
  type,
  pageParam,
}: {
  pageParam: number;
  type: string;
}) => {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/movie/${type}?language=en-US&page=${pageParam}`,
    {
      headers: HEADERS,
    }
  );
  return data;
};

const fetcSearchMovie = async ({
  search,
  pageParam,
}: {
  pageParam: number;
  search: string;
}) => {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=${pageParam}`,
    {
      headers: HEADERS,
    }
  );
  return data;
};

const HEADER_URL = "https://api.themoviedb.org/3/movie";

export const fetcher = (url: string) =>
  axios
    .get(`${HEADER_URL + url}`, {
      headers: HEADERS,
    })
    .then((res) => res.data);

export const getKey = ({
  pageIndex,
  previousPageData,
  type,
  search,
}: {
  pageIndex: number;
  previousPageData: MovieList;
  type?: string;
  search?: string;
}) => {
  if (
    !previousPageData ||
    previousPageData.page === previousPageData.total_pages
  )
    return null; // reached the end
  return search
    ? `?query=${search}&include_adult=false&language=en-US&page=${pageIndex}`
    : `/${type}?language=en-US&page=${pageIndex}`; // SWR key
};
