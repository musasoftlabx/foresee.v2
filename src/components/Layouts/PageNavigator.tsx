"use client";

// * Next
import { useRouter } from "next/navigation";

// * MUI
import Fab from "@mui/material/Fab";
import { Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

// * NPM
import { useQueryClient } from "@tanstack/react-query";
import { MdArrowBack, MdClose, MdRefresh } from "react-icons/md";
import startCase from "lodash/startCase";
//import CountUp from "react-countup";

// * Components
import { TextFieldX } from "../InputFields/TextFieldX";

// * Icons
import { BsSearch } from "react-icons/bs";

export interface iNavigator {
  dataset?: any;
  filtered?: any;
  heading: string;
  subheading?: string;
  count: number;
  hasSearch?: boolean | false;
  canRefresh?: boolean | false;
  queryKey?: string[];
  searchThreshold?: number;
  searchQuery?: any;
  setSearchQuery?: any;
  //setSearchQuery: (searchQuery: string) => void;
  //setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function PageNavigator({
  heading,
  subheading,
  dataset,
  count,
  filtered,
  hasSearch,
  canRefresh,
  queryKey,
  searchQuery,
  setSearchQuery,
  searchThreshold,
}: iNavigator) {
  // ? Hooks
  const queryClient = useQueryClient();
  const router = useRouter();
  const lengthToSearch = !searchThreshold ? 4 : searchThreshold;

  return (
    <Grid container alignItems="center" mb={1.2}>
      <Fab
        size="medium"
        sx={(theme) => ({
          border:
            theme.palette.mode === "light"
              ? "1px solid #f5f5f5"
              : "1px solid #fff",
          background:
            theme.palette.mode === "light"
              ? "transparent"
              : //theme.palette.primary
                "transparent",
          // boxShadow:
          //   theme.palette.mode === "light"
          //     ? `6px 6px 12px #a8a8a8, -6px -6px 12px #ffffff`
          //     : "unset",
          //color: theme.palette.mode === "light" ? "#000" : "#fff",
          ml: 0.5,
          mr: 2,
        })}
      >
        <MdArrowBack
          color="inherit"
          style={{ height: 25, width: 25 }}
          onClick={() => router.back()}
        />
      </Fab>

      {canRefresh && (
        <Fab size="medium" color="primary" sx={{ mr: 2 }}>
          <MdRefresh
            style={{ height: 25, width: 25 }}
            onClick={() => queryClient.refetchQueries({ queryKey })}
          />
        </Fab>
      )}

      <Grid>
        <Typography variant="h6" fontFamily="Rubik" fontSize={20}>
          {`${startCase(heading)}`}
        </Typography>

        {count > 0 && (
          <Typography variant="body2" mt={-1} ml={0.3}>
            {" "}
            {/* <CountUp
              start={0}
              end={count}
              duration={2}
              style={{ fontFamily: "Rubik", fontSize: 20, marginTop: -3 }}
            /> */}
            {` ${subheading ? subheading : heading}`}
          </Typography>
        )}
      </Grid>

      {hasSearch && dataset?.length >= lengthToSearch && (
        <Grid size={12}>
          <TextFieldX
            label={`Search for ${heading}`}
            placeholder={`Search for ${heading}`}
            prefixcon={<BsSearch size={20} />}
            suffixcon={
              searchQuery &&
              searchQuery.length > 0 && (
                <IconButton
                  onClick={() => setSearchQuery("")}
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <MdClose />
                </IconButton>
              )
            }
            circularedge={10}
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </Grid>
      )}
    </Grid>
  );
}
