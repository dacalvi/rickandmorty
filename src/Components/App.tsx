import * as React from "react";
import Typography from "@mui/material/Typography";
import { useQuery, gql } from "@apollo/client";
import {
  CircularProgress,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Container } from "@mui/system";

export default function App() {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const { data, loading, refetch } = useQuery(
    gql`
      query getCharacters($page: Int!) {
        characters(page: $page) {
          info {
            count
          }
          results {
            name
            image
            id
            status
          }
        }
      }
    `,
    {
      variables: { page },
    }
  );

  useEffect(() => {
    refetch({ page });
  }, [page]);

  useEffect(() => {
    if (data) {
      setCount(data.characters.info.count);
    }
  }, [data]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h2" gutterBottom>
        Rick and Morty - Daniel Calvi Challenge
      </Typography>

      <Pagination
        count={Math.floor(count / 20)}
        page={page}
        onChange={(e, page) => {
          setPage(page);
        }}
      />
      {!loading ? (
        <ImageList cols={6} sx={{ width: "100%" }}>
          {data.characters.results.map((character: any) => (
            <ImageListItem key={character.image}>
              <img
                src={`${character.image}?w=248&fit=crop&auto=format`}
                srcSet={`${character.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                alt={character.name}
                loading="lazy"
              />
              <ImageListItemBar
                title={character.name}
                subtitle={<span>status: {character.status}</span>}
                position="below"
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
}
