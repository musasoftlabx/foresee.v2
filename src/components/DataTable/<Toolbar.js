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
        {/* Multi-approve */}
        {!exclude?.includes("multiApprove") && rowSelection?.length > 0 && (
          <SelectionsTooltip>
            <Badge
              badgeContent={rowSelection?.length}
              sx={(theme) => ({
                ".MuiBadge-badge": {
                  color: "white !important",
                  fontWeight: "bold",
                  background: green[400],
                  border: `2px solid ${theme.palette.background.paper}`,
                  top: 6,
                },
              })}
            >
              <Button
                key={7}
                startIcon={<BiCheckDouble />}
                sx={[
                  sx,
                  {
                    background: green[400],
                    color: "#fff",
                    ":hover": { background: green[600] },
                  },
                ]}
                onClick={() =>
                  showConfirm({
                    operation: "multi-approve",
                    status: "info",
                    subject: `Confirm approval`,
                    body: `Are you sure you intend to multi-approve the selected rows?`,
                  })
                }
              >
                Multi-Approve
              </Button>
            </Badge>
          </SelectionsTooltip>
        )}
        {/* // ? Multi-reject */}
        {!exclude?.includes("multiReject") && rowSelection?.length > 0 && (
          <>
            <Popover
              open={Boolean(multiRejectAnchorEl)}
              anchorEl={multiRejectAnchorEl}
              onClose={() => setMultiRejectAnchorEl(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Stack justifyContent="end">
                <TextFieldX
                  label="Reason for rejection *"
                  columnspan={{ xs: 12 }}
                  inputProps={{ maxLength: 100 }}
                  multiline
                  rows={2}
                  value={multiRejectionReason}
                  onChange={(e: any) => setMultiRejectionReason(e.target.value)}
                />

                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    multiAction(
                      {
                        action: "multi-reject",
                        ids: rowSelection,
                        feedback: multiRejectionReason,
                      },
                      {
                        onSuccess: () => {
                          setSnackBar({
                            status: "success",
                            duration: 3000,
                            message: "Rejected!",
                          });
                          changeRowSelection([]);
                          handleGetData();
                        },
                        onError: () =>
                          setSnackBar({
                            status: "error",
                            duration: 3000,
                            message: "Failed to reject!",
                          }),
                      },
                    );
                    setMultiRejectAnchorEl(null);
                  }}
                  sx={{ alignSelf: "end", mt: -1 }}
                >
                  SUBMIT
                </Button>
              </Stack>
            </Popover>

            <SelectionsTooltip>
              <Badge
                badgeContent={rowSelection.length}
                sx={(theme) => ({
                  ".MuiBadge-badge": {
                    color: "white !important",
                    fontWeight: "bold",
                    background: red[400],
                    border: `2px solid ${theme.palette.background.paper}`,
                    top: 6,
                  },
                })}
              >
                <Button
                  key={7}
                  startIcon={<BiCheckDouble />}
                  sx={[
                    sx,
                    {
                      background: red[400],
                      color: "#fff",
                      ":hover": { background: red[600] },
                    },
                  ]}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    setMultiRejectAnchorEl(e.currentTarget)
                  }
                >
                  Multi-Reject
                </Button>
              </Badge>
            </SelectionsTooltip>
          </>
        )}
        {!exclude?.includes("multiDelete") && rowSelection?.length > 0 && (
          <SelectionsTooltip>
            <Badge
              badgeContent={rowSelection?.length}
              sx={(theme) => ({
                ".MuiBadge-badge": {
                  color: "white !important",
                  fontWeight: "bold",
                  background: red[400],
                  border: `2px solid ${theme.palette.background.paper}`,
                  top: 6,
                },
              })}
            >
              <Button
                key={7}
                startIcon={<RiDeleteBinLine />}
                sx={[
                  sx,
                  {
                    background: red[400],
                    color: "#fff",
                    ml: 1.5,
                    py: 0,
                    ":hover": { background: red[600] },
                  },
                ]}
                onClick={() =>
                  showConfirm({
                    operation: "delete",
                    status: "info",
                    subject: `Confirm deletion`,
                    body: `Are you sure you intend to delete the selected rows?`,
                  })
                }
              >
                Multi-Delete
              </Button>
            </Badge>
          </SelectionsTooltip>
        )}
        {/* // ? Deselect all */}
        {!exclude?.includes("deselectAll") && rowSelection?.length > 0 && (
          <Button
            startIcon={<MdDeselect />}
            sx={[
              sx,
              {
                background: grey[400],
                color: "#fff",
                ":hover": { background: grey[700] },
              },
            ]}
            onClick={() => changeRowSelection([])}
          >
            De-select all
          </Button>
        )}
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