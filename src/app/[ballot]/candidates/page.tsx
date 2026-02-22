"use client";

// * Next
import Image from "next/image";

// * MUI
import { Box, Button, Grid, Stack, Typography } from "@mui/material";

// * NPM
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Dockets() {
  // ? Queries
  const { data: candidates, isFetching } = useQuery({
    queryKey: ["candidates"],
    queryFn: ({ queryKey }) => axios.get(`${queryKey[0]}`),
    select: ({ data }) => data,
  });

  // ? Mutations
  const { mutate: vote } = useMutation({
    mutationFn: ({ _ }: { _: string }) => axios.post(`${ballot}/vote`, { _ }),
  });

  return isFetching ? (
    <></>
  ) : (
    <Grid
      container
      direction="row"
      justifyContent="space-evenly"
      spacing={0}
      pt={10}
    >
      {candidates?.map(
        ({ _id, name, nickName, party, photo }: Candidate, key: number) => (
          <Grid
            border={0.1}
            borderRadius={3}
            container
            direction="column"
            key={key}
            width={250}
            sx={{
              background: "transparent",
              ":hover": { background: "transparent" },
              overflow: "hidden",
            }}
          >
            <Image src={photo} alt="Candidate Image" width={250} height={250} />
            <Stack p={2}>
              <Typography variant="h6">{name}</Typography>
              <Typography variant="subtitle1">({nickName})</Typography>
              <Typography variant="body2" ml={0.3} mt={1}>
                {party}
              </Typography>
            </Stack>
            <Button
              variant="outlined"
              onClick={() =>
                vote({ _: "6834becdfd404b61b54a136c" }, { onSuccess: () => {} })
              }
              sx={{ mb: 0 }}
            >
              VOTE
            </Button>
          </Grid>
        )
      )}
    </Grid>
  );
}
