// * MUI
import { Grid } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import type { GridPaginationModel } from "@mui/x-data-grid-pro";

export default function DataGridPagination({
  count,
  paginationModel,
  changePagination,
}: {
  count?: number;
  paginationModel?: GridPaginationModel;
  changePagination: (arg0: GridPaginationModel) => void;
}) {
  return (
    count &&
    paginationModel && (
      <Grid display="flex" justifyContent="center">
        <Pagination
          variant="outlined"
          count={Math.ceil(count / paginationModel.pageSize)}
          page={Number(paginationModel?.page + 1)}
          onChange={(_, page) =>
            changePagination({
              pageSize: paginationModel.pageSize,
              page: page - 1,
            })
          }
          color="primary"
          sx={{ mt: 1.5 }}
        />
      </Grid>
    )
  );
}
