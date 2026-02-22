// * MUI
import { GridPaginationModel } from "@mui/x-data-grid-pro";
import { Grid } from "@mui/material";
import Pagination from "@mui/material/Pagination";

export default function DataGridPagination({
  data,
  paginationModel,
  changePagination,
}: {
  data: any;
  paginationModel: GridPaginationModel;
  changePagination: (arg0: GridPaginationModel) => void;
}) {
  return (
    <Grid display="flex" justifyContent="center">
      <Pagination
        variant="outlined"
        count={Math.ceil(data?.count / paginationModel?.pageSize)}
        page={Number(paginationModel?.page + 1)}
        onChange={(e, page) =>
          changePagination({
            pageSize: paginationModel?.pageSize,
            page: page - 1,
          })
        }
        color="primary"
        sx={{ mt: 1.5 }}
      />
    </Grid>
  );
}
