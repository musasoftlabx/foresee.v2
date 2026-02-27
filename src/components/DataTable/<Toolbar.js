<Toolbar
        sx={{
          //bgcolor: "action.selected",
          //minHeight: rowSelection?.length > 0 ? "47px" : "20px !important",
          //maxHeight: rowSelection?.length > 0 ? "47px" : "42px !important",
          //minHeight: 100,
          overflowX: "scroll",
          overflowY: "hidden",
          py: 3,
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": { height: 3 },
          "&::-webkit-scrollbar-thumb:focus": { bgcolor: "#50cc7f" },
        }}
      >
   
  
        {/* // ? Toggle stats */}
        {!exclude?.includes("toggleStats") && (
          <Button
            size="small"
            startIcon={stats ? <FaToggleOn /> : <FaToggleOff />}
            onClick={() => changeStats && changeStats(!stats)}
            sx={sx}
          >
            Toggle stats
          </Button>
        )}
        {extraActions}
        {/* <Grid flexGrow={1} /> */}
        {!exclude?.includes("resetDefaults") && exportURL && (
          <Tooltip title="This will reset page components such as pagination, sorting, filters, row selections.">
            <Button
              size="small"
              startIcon={<BiReset />}
              loading={isExporting}
              disabled={isExporting}
              sx={sx}
              onClick={() => {
                localStorage.removeItem(`_${apiUrl}_filtered_columns`);
                localStorage.removeItem(`_${apiUrl}_pagination`);
                localStorage.removeItem(`_${apiUrl}_pinned_columns`);
                localStorage.removeItem(`_${apiUrl}_selected_rows`);
                localStorage.removeItem(`_${apiUrl}_sorted_columns`);
                localStorage.removeItem(`_${apiUrl}_state`);
                localStorage.removeItem(`_${apiUrl}_visible_columns`);
                localStorage.removeItem(`_${apiUrl}_stats`);
                location.reload();
              }}
            >
              Reset Defaults
            </Button>
          </Tooltip>
        )}
        

        {/* {!exclude?.includes("search") && (
          <QuickFilter
            debounceMs={2000}
            variant="filled"
            size="small"
            hiddenLabel
            slotProps={{
              input: {
                disableUnderline: true,
                startAdornment: <MdSearch size={25} opacity={0.7} />,
                placeholder: search?.fields
                  ? `Search by (${search?.fields})`
                  : "Search...",
              },
            }}
            sx={(theme: { palette: { mode: string } }) => ({
              background: "transparent",
              borderRadius: 3,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor:
                theme.palette.mode === "light" ? "divider" : "action.disabled",
              fontSize: 10,
              height: 40,
              mt: 0,
              overflow: "hidden",
              width: search?.width ?? 260,
              ".MuiInputBase-root": { background: "transparent" },
            })}
          />
        )} */}
      </Toolbar>