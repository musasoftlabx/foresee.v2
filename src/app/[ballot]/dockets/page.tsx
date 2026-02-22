"use client";

// * MUI
import { AppBar, Grid, Toolbar, Typography } from "@mui/material";

// * NPM
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dockets() {
  const router = useRouter();

  // ? Queries
  const { data: dockets, isFetching } = useQuery({
    queryKey: ["dockets"],
    queryFn: ({ queryKey }) => axios.get(`${queryKey[0]}`),
    select: ({ data }) => data,
  });

  return (
    <>
      <AppBar position="static" color="transparent" sx={{ boxShadow: "unset" }}>
        <Toolbar variant="dense"></Toolbar>
      </AppBar>

      {isFetching ? (
        <></>
      ) : (
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          spacing={2}
          pt={10}
        >
          {dockets?.map(({ docket, description }: Docket, key: number) => (
            <Grid
              alignItems="center"
              border={0.1}
              borderRadius={3}
              container
              direction="column"
              height={150}
              justifyContent="center"
              key={key}
              width={300}
              sx={{
                bgcolor: "primary",
                ":hover": { background: "yellowgreen" },
              }}
              onClick={() => router.replace("candidates")}
            >
              <Typography variant="h5">{docket}</Typography>
              <Typography variant="body2">{description}</Typography>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
